import Link from "next/link";
import { LinkSection } from "./linkSection";
import { Logout } from "./logout";
import { MoneySection } from "./moneySection";
import styles from "./mypage.module.css";
import MypageUI from "./mypageUI";
import { ProfileSection } from "./profileSection";
import { Res, User } from "./types";

type Props = {
    user: User;
    data: Res;
    profileLink: string;
};

export const MypageElement = ({ user, data, profileLink }: Props) => {
    return (
        <MypageUI>
            <ProfileSection user={user} data={data} profileLink={profileLink} />

            <Link href="/upload/before" className={styles.uploadButton}>
                出品する
            </Link>

            <MoneySection user={user} />

            <nav className={styles.block}>
                <LinkSection user={user} data={data} profileLink={profileLink} />

                <Logout />
            </nav>
        </MypageUI>
    );
};
