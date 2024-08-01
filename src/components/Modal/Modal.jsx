import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import styles from './Modal.module.sass';

const Modal = ({
    setRejectedBulletins,
    setApprovedBulletins,
    setEscalatedBulletins,
    selectedBriefId,
}) => {
    const [reason, setReason] = useState('');

    const handleButtonClick = () => {
        setRejectedBulletins(
            (previous) => new Set(previous.add({ id: selectedBriefId - 1, reason: reason }))
        );
        setReason('');
    };

    return (
        <Dialog.Portal>
            <Dialog.Overlay className={styles.dialogOverlay} />
            <Dialog.Content className={styles.dialogContent}>
                <Dialog.Title className={styles.dialogTitle}>Причина отклонения</Dialog.Title>

                <textarea
                    cols="29"
                    rows="5"
                    minLength="10"
                    maxLength="500"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                ></textarea>

                <div>
                    <Dialog.Close asChild>
                        <button className={styles.button} onClick={() => handleButtonClick()}>
                            Сохранить
                        </button>
                    </Dialog.Close>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    );
};

export default Modal;
