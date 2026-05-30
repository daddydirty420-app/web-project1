import { getServerSession } from "next-auth";
import GoodUI from "../goodUI";
import { UserList } from "../userList";
import { authOptions } from "../../../lib/auth";

export default async function Page() {
    const session = await getServerSession(authOptions);

    return (
        <GoodUI title="いいねしたユーザー">
            <UserList loggedIn={!!session} currentUserId={session?.user.id ?? ""} page="dev" />
        </GoodUI>
    );
}