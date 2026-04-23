import { FollowSection } from "./followSection";
import styles from "./profile.module.css";
import { Res } from "./profileTypes";
import { ShopButton } from "./shopButton";
import { StarSection } from "./starSection";

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

            {data.hasShop && <ShopButton shopId={String(data.user.ShopInfo?.id)} />}
        </section>
    );
};
