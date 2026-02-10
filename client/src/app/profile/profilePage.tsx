import { Back, Container, Header, Footer } from '@/components';
import { Res } from './profileTypes';
import { ProfileMain } from './profileMain';
import { AdminSection } from './adminSection';
import { SocialSection } from './socialSection';
import { ItemList } from './itemList';

type Props = {
    data: Res;
    userId: string;
    currentUserId: string | null;
    adminPage?: boolean;
    loggedIn: boolean;
};

export const ProfilePage = ({ data, userId, currentUserId, adminPage, loggedIn }: Props) => {
    return (
        <>
        <Header />

        <Container header>
            <Back />

            {adminPage && <AdminSection userId={userId} adminPage />}
            <ProfileMain data={data} userId={userId} currentUserId={currentUserId} adminPage={adminPage} loggedIn={loggedIn} />
            <SocialSection data={data} userId={userId} />
            {data.itemList.hasItemCount > 0 && <ItemList userId={userId} defaultVideoList={data.itemList} adminPage={adminPage} />}
        </Container>

        <Footer />
        </>
    )
}