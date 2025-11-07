"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./comment.module.css";
import { useState } from "react";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Report from "../others/report";
import { Comment } from "../itemPageTypes";

type Props = {
    comment: Comment;
    page: "normal" | "admin";
}

export default function ReportFloat({ comment, page }: Props) {
    const [floatVisible, setFloatVisible] = useState(false);

    return (
        <>
        <FontAwesomeIcon
        icon={faEllipsis}
        className={styles.dotIcon}
        onClick={() => {
            if (!comment.isMyComment) {
                setFloatVisible(!floatVisible);
            }
        }}
        />

        {floatVisible && (
            <div className={styles.float}>
                <Report id={comment.id} itemReport={false} page={page} reportCount={comment.reportCount} />
            </div>
        )}
        </>
    );
}