import { apiFetch, apiFetchNoToken } from "../../../lib/api/client";

type CommentCreateParams = {
    itemId: string;
    sellerMe?: boolean;
    parentId?: string;
    inputComment: string;
};

type CommentDeleteParams = {
    commentId: string;
    page: "normal" | "admin";
};

type GetReplyListParams = {
    sellerMe?: boolean;
    parentId: string;
    page: "normal" | "admin";
};

export const fetchCommentCreate = async ({ itemId, sellerMe, parentId, inputComment }: CommentCreateParams) => {
    return apiFetch(`/comment/${itemId}?sellerMe=${sellerMe}&parentId=${parentId}`, {
        method: "POST",
        body: JSON.stringify({ inputComment }),
    });
};

export const fetchCommentSortAdd = async (commentId: string, sortNumber: number) => {
    return apiFetchNoToken(`/comment/${commentId}/sort-number/add?number=${sortNumber}`, {
        method: "PATCH",
    });
};

export const fetchCommentDelete = async ({ commentId, page }: CommentDeleteParams) => {
    return apiFetch(`/comment/${commentId}?page=${page}`, {
        method: "DELETE",
    });
};

export const fetchGetReplyList = async ({ parentId, sellerMe, page }: GetReplyListParams) => {
    return apiFetch(`/comment/${parentId}/reply?sellerMe=${sellerMe}${page === "admin" ? "?admin=true" : ""}`, {
        method: "GET",
        cache: "no-store",
    });
};
