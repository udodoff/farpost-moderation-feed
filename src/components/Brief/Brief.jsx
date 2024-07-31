import React from 'react';
import styles from './Brief.module.sass';
import profileLogo from '../../assets/profile.svg';
import clsx from 'clsx';

const Bulletin = ({
    brief: {
        id,
        publishDateString,
        ownerLink,
        ownerLogin,
        bulletinImages,
        bulletinSubject,
        bulletinText,
        advertLink,
    },
    onClick,
    isSelected,
    state,
}) => {
    return (
        <div
            className={clsx(styles.briefRoot, isSelected && styles.selectedBrief)}
            onClick={(event) => onClick(event)}
        >
            <div className={styles.heading}>
                <p className={styles.publishInfo}>
                    <a
                        href={advertLink}
                        className={styles.advertLink}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {id}
                    </a>{' '}
                    — {publishDateString}
                </p>
                <div className={styles.subheading}>
                    <p className={styles[state]}>
                        {state === 'approved'
                            ? 'Одобрено'
                            : state === 'rejected'
                              ? 'Отклонено'
                              : state === 'escalated'
                                ? 'Передано другому модератору'
                                : ''}
                    </p>
                    <div className={styles.publisherInfo}>
                        <img src={profileLogo} alt="profile" />
                        <a href={ownerLink} target="_blank" rel="noreferrer">
                            {ownerLogin}
                        </a>
                    </div>
                </div>
            </div>
            <div className={styles.content}>
                <h2 className={styles.bulletinSubject}>{bulletinSubject}</h2>
                <div className={styles.description}>
                    <p className={styles.bulletinText}>{bulletinText}</p>
                    <div className={styles.images}>
                        {bulletinImages.map((image, index) => (
                            <img
                                src={image}
                                alt="bulletin"
                                key={index}
                                width={191}
                                className={styles.bulletinImage}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bulletin;
