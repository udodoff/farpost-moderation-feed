import React from 'react';
import styles from './ToastNotification.module.sass';

const ToastNotification = ({ text }) => {
    return (
        <div className={styles.toastRoot}>
            <div className={styles.content}>
                <h1>{text}</h1>
            </div>
        </div>
    );
};

export default ToastNotification;
