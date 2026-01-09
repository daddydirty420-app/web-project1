import styles from "./video.module.css";
import { Item } from "../itemPageTypes";
import { FollowButton, Star } from "@/components";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faCampground, faStore, faTag } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

type Props = {
    item: Item;
    sellerMe?: boolean;
    page: "normal" | "admin";
    userId: string | null;
};

export default function UserSection({ item, sellerMe, page, userId }: Props) {
    const user = item.User ?? null;
    const sellerId = user?.id;
    const profileUrl = `/profile/${sellerId}`;

    return (
        <section className={styles.userSection}>
            <div className={styles.userFlex}>
                <Link href={profileUrl} className={styles.userLink}>
                    <Image
                    src={user?.profile_image || "/default-profile.png"}
                    alt="プロフィール画像"
                    width={45}
                    height={45}
                    priority
                    quality={50}
                    className={styles.profileImage}
                    />

                    <div className={styles.nameBlock}>
                        <h4 className={styles.userName}>{user?.user_name}</h4>

                        <div className={styles.iconRow}>
                            {user?.honnin_verified && (
                                <FontAwesomeIcon icon={faCircleCheck} className={styles.honninIcon} />
                            )}
                            {user?.early_seller && (
                                <FontAwesomeIcon icon={faTag} className={styles.earlyIcon} />
                            )}
                            {user?.ShopInfo && (
                                <FontAwesomeIcon icon={faStore} className={styles.shopIcon} />
                            )}
                        </div>

                        <div className={styles.starDiv}>
                            {user && user?.star_amount > 0 && <small className={styles.starAverage}>{Number(user.star_average).toFixed(1)}</small>}
                            <Star userId={sellerId ?? ""} />
                            <small className={styles.starAmount}>{user?.star_amount.toLocaleString()}</small>
                        </div>
                    </div>
                </Link>
                {!sellerMe && page === "normal" && <FollowButton targetUserId={sellerId ?? ""} withCount={false} currentUserId={userId} />}
            </div>
        </section>
    );
};