import { Back, Container } from '@/components';
import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import { Res } from './profileTypes';
import ProfileMain from './profileMain';
import ItemSection from './itemSection';
import AdminSection from './adminSection';
import SocialSection from './socialSection';

type Props = {
    data: Res;
    userId: string;
    currentUserId: string | null;
    adminPage?: boolean;
    loggedIn: boolean;
};

export default function ProfilePage({ data, userId, currentUserId, adminPage, loggedIn }: Props) {
    return (
        <>
        <Header />

        <Container header>
            <Back />

            {adminPage && <AdminSection userId={userId} adminPage />}
            <ProfileMain data={data} userId={userId} currentUserId={currentUserId} adminPage={adminPage} loggedIn={loggedIn} />
            <SocialSection data={data} userId={userId} />
            {data.itemList.hasItemCount > 0 && <ItemSection userId={userId} defaultVideoList={data.itemList} adminPage={adminPage} />}
        </Container>

        <Footer />
        </>
    )
}