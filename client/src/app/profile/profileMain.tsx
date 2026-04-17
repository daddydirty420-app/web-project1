import { Res } from './profileTypes';
import { EditButton } from './editButton';
import { FollowButton } from '@/components';
import styles from './profile.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faTag } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Introduction } from './introduction';

type Props = {
    data: Res;
    userId: string;
    currentUserId: string | null;
    adminPage?: boolean;
    loggedIn: boolean;
};

export const ProfileMain = ({ data, userId, currentUserId, adminPage, loggedIn }: Props) => {
    const sameId = userId === currentUserId?.toString();

    return (
        <>
            <section className={styles.profileBlock}>
                <div className={styles.userDiv}>
                    <Image
                        src={data.user.profile_image ? encodeURI(data.user.profile_image) : '/default-profile.png'}
                        alt="プロフィール画像"
                        width={60}
                        height={60}
                        priority
                        quality={75}
                        className={styles.profileImage}
                    />

                    <div className={styles.nameBlock}>
                        <h1 className={styles.userName}>{data.user.user_name}</h1>

                        <div className={styles.iconRow}>
                            {data.user.honnin_verified && (
                                <FontAwesomeIcon icon={faCircleCheck} className={styles.honninIcon} />
                            )}
                            {data.user.early_seller && <FontAwesomeIcon icon={faTag} className={styles.earlyIcon} />}
                            {data.hasShop && <FontAwesomeIcon icon={faStore} className={styles.shopIcon} />}
                        </div>
                    </div>
                </div>

                {loggedIn && !sameId && !adminPage && (
                    <FollowButton targetUserId={userId} currentUserId={currentUserId} />
                )}
                {loggedIn && sameId && !adminPage && <EditButton />}
            </section>

            <Introduction data={data} />
        </>
    );
};
