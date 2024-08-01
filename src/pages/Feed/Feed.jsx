import React, { useEffect, useRef, useState } from 'react';
import styles from './Feed.module.sass';
import { apiGetBriefList, apiSendViewedBulletinList } from '../../api';
import notify from '../../utils/notify';
import Bulletin from '../../components/Bulletin/Bulletin';
import ActionPanel from '../../components/ActionPanel/ActionPanel';
import { findElemetHigherParent } from '../../utils/element';
import { useHotkeys } from 'react-hotkeys-hook';
import { isAllBriefsViewed } from '../../utils/brief';
import * as Dialog from '@radix-ui/react-dialog';
import Modal from '../../components/Modal/Modal';

const availableKeys = ['space', 'delete', 'shift+enter', 'f7'];

const Feed = () => {
    const [unviewedBriefList, setunviewedBriefList] = useState([]);
    const [selectedBriefId, setSelectedBriefId] = useState(null);
    const [approvedBulletins, setApprovedBulletins] = useState(new Set());
    const [rejectedBulletins, setRejectedBulletins] = useState(new Set());
    const [escalatedBulletins, setEscalatedBulletins] = useState(new Set());
    const [open, setOpen] = useState(false);

    const selectedBrief = useRef(null);
    const briefGroup = useRef(null);

    useEffect(() => {
        setSelectedBriefId(0);
        selectedBrief.current = briefGroup.current.firstElementChild;
    }, [unviewedBriefList]);

    useHotkeys('enter', () => {
        if (unviewedBriefList.length === 0) getUnviewedBriefList();
    });

    useHotkeys(
        availableKeys,
        (event) => {
            if (event.key === 'F7') {
                handleSendViewedBriefList();
                return;
            }
            if (selectedBrief.current === null) return;

            if (event.code === 'Space') {
                setApprovedBulletins((previous) => new Set(previous.add(selectedBriefId)));
                setRejectedBulletins(
                    (previous) =>
                        new Set([...previous].filter((brief) => brief.id !== selectedBriefId))
                );
                setEscalatedBulletins((previous) => {
                    previous.delete(selectedBriefId);
                    return new Set(previous);
                });
            }
            if (event.key === 'Delete') {
                setOpen(true);
                setApprovedBulletins((previous) => {
                    previous.delete(selectedBriefId);
                    return new Set(previous);
                });
                setEscalatedBulletins((previous) => {
                    previous.delete(selectedBriefId);
                    return new Set(previous);
                });
            }
            if (event.key === 'Enter') {
                setEscalatedBulletins((previous) => new Set(previous.add(selectedBriefId)));
                setRejectedBulletins(
                    (previous) =>
                        new Set([...previous].filter((brief) => brief.id !== selectedBriefId))
                );
                setApprovedBulletins((previous) => {
                    previous.delete(selectedBriefId);
                    return new Set(previous);
                });
            }

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

    const clearStates = () => {
        selectedBrief.current = null;
        setApprovedBulletins(new Set());
        setEscalatedBulletins(new Set());
        setRejectedBulletins(new Set());
        setSelectedBriefId([]);
        setunviewedBriefList([]);
    };

    const getBriefStatus = (index) => {
        return approvedBulletins.has(index)
            ? 'approved'
            : [...rejectedBulletins].find((bulletin) => bulletin.id === index)
              ? 'rejected'
              : escalatedBulletins.has(index)
                ? 'escalated'
                : 'unviewed';
    };

    const getUnviewedBriefList = () => {
        try {
            apiGetBriefList().then(({ data }) => setunviewedBriefList(data));
        } catch (error) {
            notify('Ошибка при получении списка объявлений');
        }
    };

    const handleSendViewedBriefList = () => {
        if (!isAllBriefsViewed([approvedBulletins, rejectedBulletins, escalatedBulletins])) {
            notify('Не все объявления просмотрены');
            return;
        }
        try {
            const payload = {
                approved: [...approvedBulletins].map(
                    (value) => unviewedBriefList.find((_, index) => index === value).id
                ),
                rejected: [...rejectedBulletins].map((value) => {
                    const bulletin = unviewedBriefList.find((_, index) => index === value.id);
                    return {
                        reason: value.reason,
                        id: bulletin.id,
                    };
                }),
                escalated: [...escalatedBulletins].map(
                    (value) => unviewedBriefList.find((_, index) => index === value).id
                ),
            };
            apiSendViewedBulletinList(payload);
            notify('Успешно отправлено');
            clearStates();
            getUnviewedBriefList();
            return;
        } catch (error) {
            notify('При отправке возникла ошибка');
        }
    };

    const handleBulletinClick = (event) => {
        console.log(approvedBulletins);
        console.log(rejectedBulletins);
        console.log(escalatedBulletins);

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
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <div className={styles.root}>
                <ul className={styles.briefGroup} ref={briefGroup}>
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
            <Modal
                setRejectedBulletins={setRejectedBulletins}
                setApprovedBulletins={setApprovedBulletins}
                setEscalatedBulletins={setEscalatedBulletins}
                selectedBriefId={selectedBriefId}
            />
        </Dialog.Root>
    );
};

export default Feed;
