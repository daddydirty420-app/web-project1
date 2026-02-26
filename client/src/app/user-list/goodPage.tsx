import { User } from "./type";
import { UserList } from "./userList";
import GoodUI from "./goodUI";

type Props = {
    title: string;
    loggedIn: boolean;
    id: string;
    currentUserId: string;
    userList: User[];
    page: "follow" | "good-item" | "good-comment";
    followTab?: "follow" | "follower" | null;
    myFollow?: boolean;
};

export const GoodPage = ({
    title,
    loggedIn,
    id,
    currentUserId,
    userList,
    page,
    followTab,
    myFollow
}: Props) => {
    return (
        <GoodUI title={title}>
            <UserList
            loggedIn={loggedIn}
            id={id}
            currentUserId={currentUserId}
            userList={userList}
            page={page}
            followTab={followTab}
            myFollow={myFollow}
            />
        </GoodUI>
    );
};