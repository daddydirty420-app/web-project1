import styles from './comment.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';

export const Pin = () => {
    return (
        <div className={styles.pinDiv}>
            <FontAwesomeIcon icon={faThumbtack} className={styles.pin} />
            <p className={styles.pinText}>出品者のコメント</p>
        </div>
    );
};
