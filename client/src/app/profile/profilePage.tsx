import { Back, Container } from "@/components";
import Footer from "@/components/footer/footer";
import Header from "@/components/header/header";
import { AdminSection } from "./adminSection";
import { ItemList } from "./itemList";
import { ProfileMain } from "./profileMain";
import { Res } from "./profileTypes";
import { SocialSection } from "./socialSection";

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
                <ProfileMain
                    data={data}
                    userId={userId}
                    currentUserId={currentUserId}
                    adminPage={adminPage}
                    loggedIn={loggedIn}
                />
                <SocialSection data={data} userId={userId} />
                {data.itemList.hasItemCount > 0 && (
                    <ItemList userId={userId} defaultVideoList={data.itemList} adminPage={adminPage} />
                )}
            </Container>

            <Footer />
        </>
    );
};
