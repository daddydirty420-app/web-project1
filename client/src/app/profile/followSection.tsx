import { FollowStat } from "./followStat";
import styles from './profile.module.css';

type Props = {
    userId: string;
};

export const FollowSection = async ({ userId }: Props) => {
    const res = await fetch(`${process.env.API_URL}/follow/${userId}/count`, {
        method: "GET",
        cache: 'no-store',
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error(errorData.message);
        return;
    }

    const { followCount, followerCount } = await res.json();

    return (
        <section className={styles.followDiv}>
            <FollowStat userId={userId} type="follow" initialCount={followCount} />
            <FollowStat userId={userId} type="follower" initialCount={followerCount} />
        </section>
    );
}