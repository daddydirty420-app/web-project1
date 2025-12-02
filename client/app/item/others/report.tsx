import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../itemCommon.module.css";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import clsx from "clsx";

type Props = {
    id: string;
    itemReport: boolean;
    page: "normal" | "admin";
    reportCount?: number;
};

export default function Report({ id, itemReport, page, reportCount }: Props) {
    const itemLink = `/report/item/${id}`;
    const commentLink = `/report/comment/${id}`;
    const adminItemLink = `/madmax/report-list/item/${id}`;
    const adminCommentLink = `/madmax/report-list/comment/${id}`;

    let link = "";
    if (page === "normal") {
        link = `${itemReport ? itemLink : commentLink}`;
    } else if (page === "admin") {
        link = `${itemReport ? adminItemLink : adminCommentLink}`;
    } else {
        console.error("ページ信号が正しくありません。");
        return;
    }

    return (
        <Link href={link} className={styles.reportLink}>
            <FontAwesomeIcon icon={faFlag} className={styles.reportIcon} />
            <small className={clsx('text-[var(--gray-50)] underline', styles.small)}>報告{page === "admin" ? `：${reportCount}件` : ""}</small>
        </Link>
    );
};