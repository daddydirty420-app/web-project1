import { User } from './profileTypes';
import { Star } from '@/components';
import styles from './profile.module.css';
import clsx from 'clsx';

type Props = {
    user: User;
    userId: string;
};

export default function StarSection({ user, userId }: Props) {
    return (
        <div className='flex items-center ml-4'>
            {user.star_amount > 0 && (
                <small className={clsx('text-[var(--gray-50)] mr-1', styles.small)}>{Number(user.star_average).toFixed(1)}</small>
            )}
            <Star userId={userId} />
            <small className={clsx('text-blue-500 ml-1', styles.small)}>{user.star_amount.toLocaleString()}</small>
        </div>
    )
}