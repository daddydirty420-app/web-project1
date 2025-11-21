import { Res } from './profileTypes';
import EditButton from './editButton';
import { FollowButton } from '@/components';
import styles from './profile.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCampground, faStore } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Session } from 'next-auth';
import Introduction from './introduction';

type Props = {
    data: Res;
    userId: string;
    session: Session | null;
    accessToken: string | null;
    adminPage?: boolean;
};

export default function ProfileMain({ data, userId, session, accessToken, adminPage }: Props) {
    const loggedIn = !!session?.user;
    const currentUserId = session?.user?.id;
    const sameId = userId === currentUserId?.toString();

    return (
        <>
        <section className={styles.profileBlock}>
            <div className={styles.userDiv}>
                <Image
                src={data.user.profile_image || '/default-profile.png'}
                alt='プロフィール画像'
                width={60}
                height={60}
                priority
                quality={75}
                className={styles.profileImage}
                />
                <h1 className={styles.userName}>{data.user.user_name}</h1>
                {data.user.honnin_verified && (
                    <FontAwesomeIcon icon={faCircleCheck} className={styles.honninIcon} />
                )}
                {data.user.early_seller && (
                    <FontAwesomeIcon icon={faCampground} className={styles.earlyIcon} />
                )}
                {data.hasShop && (
                    <FontAwesomeIcon icon={faStore} className={styles.shopIcon} />
                )}
            </div>
            {loggedIn && !sameId && !adminPage && <FollowButton targetUserId={userId} session={session} accessToken={accessToken} />}
            {loggedIn && sameId && !adminPage && <EditButton />}
        </section>

        <Introduction data={data} />
        </>
    )
}
