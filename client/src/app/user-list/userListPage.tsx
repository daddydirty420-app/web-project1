import { User } from "./type";
import { UserList } from "./userList";
import UserListUI from "./userListUI";

type Props = {
    title: string;
    loggedIn: boolean;
    id: string;
    currentUserId: string;
    userList: User[];
    userCount: number;
    page: "follow" | "good-item" | "good-comment";
    followTab?: "follow" | "follower" | null;
    myFollow?: boolean;
};

export const UserListPage = ({
    title,
    loggedIn,
    id,
    currentUserId,
    userList,
    userCount,
    page,
    followTab,
    myFollow
}: Props) => {
    return (
        <UserListUI title={title}>
            <UserList
            loggedIn={loggedIn}
            id={id}
            currentUserId={currentUserId}
            userList={userList}
            page={page}
            followTab={followTab}
            myFollow={myFollow}
            />
        </UserListUI>
    );
};