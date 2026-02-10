import { User } from './profileTypes';
import { Star } from '@/components';
import styles from './profile.module.css';
import clsx from 'clsx';

type Props = {
    user: User;
    userId: string;
};

export const StarSection = ({ user, userId }: Props) => {
    return (
        <div className={styles.starSection}>
            {user.star_amount > 0 && (
                <small className={clsx('mr-1', styles.small)}>{Number(user.star_average).toFixed(1)}</small>
            )}
            <Star userId={userId} />
            <small className={clsx('ml-1', styles.small)}>{user.star_amount.toLocaleString()}</small>
        </div>
    );
}