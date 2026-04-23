"use client";

import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Comment } from "../itemPageTypes";
import { Report } from "../others/report";
import styles from "./comment.module.css";

type Props = {
    comment: Comment;
    page: "normal" | "admin";
};

export const ReportFloat = ({ comment, page }: Props) => {
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
};
