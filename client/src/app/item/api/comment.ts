import { apiFetch, apiFetchNoToken } from "../../../lib/api/client";

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

export const fetchCommentSort = async (commentId: string) => {
    return apiFetchNoToken(`/comment/${commentId}/sort-number/add?number=2`, {
        method: "PATCH",
    });
};
