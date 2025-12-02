import styles from "./comment.module.css";
import { Comment } from "../itemPageTypes";
import clsx from "clsx";
import { formatRelativeTime } from "@/lib/formatRelativeTime";

type Props = {
    comment: Comment;
}

export default function CommentDataDiv({ comment }: Props) {
    return (
        <div className="flex">
            <p className={styles.commentDataText}>{comment.User?.user_name}</p>
            <p className={clsx("ml-1 mr-1", styles.commentDataText)}>・</p>
            <p className={styles.commentDataText}>{formatRelativeTime(comment.createdAt)}</p>
        </div>

    );
}