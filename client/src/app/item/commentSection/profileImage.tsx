import styles from "./comment.module.css";
import Image from "next/image";
import { User } from "../itemPageTypes";

type Props = {
    user: User | null | undefined;
}

export const ProfileImage = ({ user }: Props) => {
    return (
        <Image
        src={user?.profile_image || "/default-profile.png"}
        alt="プロフィール画像"
        width={40}
        height={40}
        quality={50}
        className={styles.profileImage}
        />
    );
}