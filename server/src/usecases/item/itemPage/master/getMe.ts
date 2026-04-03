import { User } from "../../../../models/index.js";

type Params = {
    userId: number | null;
};

export const getMe = async ({ userId }: Params) => {
    let me = null;

    if (userId) {
        me = await User.findByPk(userId, {
            attributes: ["id", "user_name", "profile_image"],
        });
    }

    return me;
};