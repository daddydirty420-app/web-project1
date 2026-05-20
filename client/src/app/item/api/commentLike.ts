import { apiFetch } from "../../../lib/api/client";

export const fetchCommentLikeAdd = async (commentId: string) => {
    return apiFetch(`/comment-like/${commentId}`, {
        method: "POST",
    });
};

export const fetchCommentLikeRemove = async (commentId: string) => {
    return apiFetch(`/comment-like/${commentId}`, {
        method: "DELETE",
    });
};
