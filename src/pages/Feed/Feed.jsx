import React, { useEffect, useRef, useState } from 'react';
import styles from './Feed.module.sass';
import { apiGetBriefList, apiSendViewedBulletinList } from '../../api';
import notify from '../../utils/notify';
import Bulletin from '../../components/Brief/Brief';
import ActionPanel from '../../components/ActionPanel/ActionPanel';
import { findElemetHigherParent } from '../../utils/element';
import { useHotkeys } from 'react-hotkeys-hook';
import { isAllBriefsViewed, setBriefState } from '../../utils/brief';

const availableKeys = ['space', 'delete', 'shift+enter, f7'];

const Feed = () => {
    const [unviewedBriefList, setunviewedBriefList] = useState([]);
    const [selectedBriefId, setSelectedBriefId] = useState(null);
    const [approvedBulletins, setApprovedBulletins] = useState(new Set());
    const [rejectedBulletins, setRejectedBulletins] = useState(new Set());
    const [escalatedBulletins, setEscalatedBulletins] = useState(new Set());

    const selectedBrief = useRef(null);

    useEffect(() => {
        try {
            apiGetBriefList().then(({ data }) => {
                setunviewedBriefList(data);
            });
        } catch (error) {
            notify('Ошибка при получении списка объявлений');
        }
    }, []);

    useHotkeys(
        availableKeys,
        (event) => {
            if (event.key === 'F7') {
                handleSendViewedBriefList();
                return;
            }
            if (selectedBrief.current === null) return;

            if (event.code === 'Space')
                setBriefState(
                    setApprovedBulletins,
                    [setRejectedBulletins, setEscalatedBulletins],
                    selectedBriefId
                );
            if (event.key === 'Delete')
                setBriefState(
                    setRejectedBulletins,
                    [setApprovedBulletins, setEscalatedBulletins],
                    selectedBriefId
                );
            if (event.key === 'Enter')
                setBriefState(
                    setEscalatedBulletins,
                    [setApprovedBulletins, setRejectedBulletins],
                    selectedBriefId
                );

            const { offsetTop, clientHeight, nextElementSibling } = selectedBrief.current;

            window.scroll({
                top: offsetTop + clientHeight,
                behavior: 'smooth',
            });

            selectedBrief.current = nextElementSibling;

            setSelectedBriefId((prev) => prev + 1);
        },
        { preventDefault: true }
    );

    const getBriefStatus = (index) => {
        return approvedBulletins.has(index)
            ? 'approved'
            : rejectedBulletins.has(index)
              ? 'rejected'
              : escalatedBulletins.has(index)
                ? 'escalated'
                : 'unviewed';
    };

    const handleSendViewedBriefList = () => {
        if (!isAllBriefsViewed([approvedBulletins, rejectedBulletins, escalatedBulletins])) {
            notify('Не все объявления просмотрены');
            return;
        }
        try {
            const payload = {
                approved: [...approvedBulletins],
                rejected: [...rejectedBulletins],
                escalated: [...escalatedBulletins],
            };
            apiSendViewedBulletinList(payload);
            notify('Успешно отправлено');
            return;
        } catch (error) {
            notify('При отправке возникла ошибка');
        }
    };

    const handleBulletinClick = (event) => {
        const { outmost } = findElemetHigherParent(event);

        selectedBrief.current = outmost;

        const parent = outmost.parentNode;
        const index = Array.prototype.indexOf.call(parent.children, outmost);

        setSelectedBriefId(index);

        window.scroll({
            top: outmost.offsetTop - 20,
            behavior: 'smooth',
        });
    };

    return (
        <div className={styles.root}>
            <ul className={styles.briefGroup}>
                {unviewedBriefList.map((brief, index) => (
                    <Bulletin
                        onClick={handleBulletinClick}
                        isSelected={index === selectedBriefId}
                        key={brief.id}
                        brief={brief}
                        state={getBriefStatus(index)}
                    />
                ))}
            </ul>
            <ActionPanel />
        </div>
    );
};

export default Feed;
