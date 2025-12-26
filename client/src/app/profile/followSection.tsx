import FollowStat from "./followStat";
import styles from './profile.module.css';

type Props = {
    userId: string;
};

export default async function FollowSection({ userId }: Props) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/follow/count/${userId}`, { cache: 'no-store' });

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