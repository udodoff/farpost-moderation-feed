import React from 'react';
import { actionList } from '../../constants/actions';
import styles from './ActionPanel.module.sass';

const ActionPanel = () => {
    return (
        <ul className={styles.actions}>
            {actionList.map((action) => (
                <React.Fragment key={action.hotkey}>
                    <p className={styles.actionText}>{action.text}</p>
                    <p className={styles.actionHotkey} style={{ '--circleColor': action.color }}>
                        {action.hotkey}
                    </p>
                </React.Fragment>
            ))}
        </ul>
    );
};

export default ActionPanel;
