import { Back, Container, Header, Footer } from 'components';
import { Res } from './profileTypes';
import ProfileMain from './profileMain';
import ShopButton from './shopButton';
import FollowSection from './followSection';
import StarSection from './starSection';
import ItemSection from './itemSection';
import AdminSection from './adminSection';
import { Session } from 'next-auth';

type Props = {
    data: Res;
    userId: string;
    adminPage?: boolean;
    session: Session | null;
};

export default function ProfilePage({ data, userId, adminPage, session }: Props) {
    return (
        <>
        <Header />

        <Container header>
            <Back />

            {adminPage && <AdminSection userId={userId} adminPage session={session} />}
            <ProfileMain data={data} userId={userId} session={session} adminPage={adminPage} />
            {data.hasShop && <ShopButton shopId={String(data.user.ShopInfo?.id)} />}
            <FollowSection userId={userId} session={session} />
            <StarSection user={data.user} userId={userId} />
            {data.itemList.hasItemCount > 0 && <ItemSection userId={userId} defaultVideoList={data.itemList} adminPage={adminPage} />}
        </Container>

        <Footer />
        </>
    )
}