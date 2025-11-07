import styles from "./video.module.css";
import commonS from "../itemCommon.module.css";
import { Item } from "../itemPageTypes";
import { FollowButton, Star } from "@/components";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faCampground, faStore } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { Session } from "next-auth";
import Link from "next/link";

type Props = {
    item: Item;
    sellerMe?: boolean;
    session: Session | null;
    page: "normal" | "admin";
};

export default function UserSection({ item, sellerMe, session, page }: Props) {
    const user = item.User ?? null;
    const sellerId = user?.id;
    const profileUrl = `/profile/${sellerId}`;

    return (
        <section>
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
                    <h4 className={styles.userName}>{user?.user_name}</h4>
                    {user?.honnin_verified && <FontAwesomeIcon icon={faCircleCheck} className={styles.honninIcon} />}
                    {user?.early_seller && <FontAwesomeIcon icon={faCampground} className={styles.earlyIcon} />}
                    {user?.ShopInfo && <FontAwesomeIcon icon={faStore} className={styles.shopIcon} />}
                </Link>
                {!sellerMe && page === "normal" && <FollowButton targetUserId={sellerId ?? ""} withCount={false} session={session} />}
            </div>

            <div className="flex items-center ml-4 mt-1">
                {user && user?.star_amount > 0 && <small className={clsx("text-[var(--gray-50)] mr-1", commonS.small)}>{Number(user.star_average).toFixed(1)}</small>}
                <Star userId={sellerId ?? ""} />
                <small className={clsx("text-blue-500 ml-1", commonS.small)}>{user?.star_amount.toLocaleString()}</small>
            </div>
        </section>
    );
};