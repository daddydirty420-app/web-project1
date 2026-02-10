import styles from "./profile.module.css";
import { FollowSection } from "./followSection";
import { StarSection } from "./starSection";
import { ShopButton } from "./shopButton";
import { Res } from "./profileTypes";

type Props = {
    data: Res;
    userId: string;
};

export const SocialSection = ({ data, userId }: Props) => {
    return (
        <section className={styles.socialSection}>
            <div className={styles.socialRow}>
                <FollowSection userId={userId} />
                <StarSection user={data.user} userId={userId} />
            </div>

            {data.hasShop && (
                <ShopButton shopId={String(data.user.ShopInfo?.id)} />
            )}
        </section>
    );
}