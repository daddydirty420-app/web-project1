import { apiFetch } from "../../../lib/api/client";

type CommentCreateParams = {
    itemId: string;
    sellerMe?: boolean;
    parentId?: string;
    inputComment: string;
};

export const fetchCommentCreate = async ({ itemId, sellerMe, parentId, inputComment }: CommentCreateParams) => {
    return apiFetch(`/comment/${itemId}?sellerMe=${sellerMe}&parentId=${parentId}`, {
        method: "POST",
        body: JSON.stringify({ inputComment }),
    });
};
