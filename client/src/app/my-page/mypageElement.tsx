import Logout from './logout';
import styles from './mypage.module.css';
import Link from 'next/link';
import { User, Res } from './types';
import MypageUI from './mypageUI';
import ProfileSection from './profileSection';
import MoneySection from './moneySection';
import LinkSection from './linkSection';

type Props = {
    user: User;
    data: Res;
    profileLink: string;
};

export default function MypageElement({ user, data, profileLink }: Props) {
    return (
        <MypageUI>
            <ProfileSection user={user} data={data} profileLink={profileLink} />

            <Link href='/upload/before' className={styles.uploadButton}>出品する</Link>

            <MoneySection user={user} />

            <nav className={styles.block}>
                <LinkSection user={user} data={data} profileLink={profileLink} />

                <Logout />
            </nav>
        </MypageUI>
    );
};