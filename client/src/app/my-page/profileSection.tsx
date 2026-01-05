import Link from "next/link";
import styles from "./mypage.module.css";
import { Res, User } from "./types";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore, faTag } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

type Props = {
    user: User;
    data: Res;
    profileLink: string;
};

export default function ProfileSection({ user, data, profileLink }: Props) {
    return (
        <section className={styles.block}>
            <Link href={profileLink} className={styles.profileBlock}>
                <Image
                src={user.profile_image || '/default-profile.png'}
                alt='プロフィール画像'
                width={50}
                height={50}
                priority
                quality={75}
                className={styles.profileImage}
                />

                <div className={styles.nameBlock}>
                    <p className={styles.userName}>{user.user_name}</p>

                    {user.honnin_verified && (
                        <FontAwesomeIcon icon={faCircleCheck} className={styles.honninIcon} />
                    )}
                    {user.early_seller && (
                        <FontAwesomeIcon icon={faTag} className={styles.earlyIcon} />
                    )}
                    {data.userData.hasShop && (
                        <FontAwesomeIcon icon={faStore} className={styles.shopIcon} />
                    )}
                </div>
            </Link>

            <p><Link href={profileLink} className={styles.profileLinkText}>プロフィールを見る ＞</Link></p>
        </section>
    );
}