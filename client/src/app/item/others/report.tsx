import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "../itemCommon.module.css";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

type Props = {
    id: string;
    itemReport: boolean;
    page: "normal" | "admin";
    reportCount?: number;
};

export const Report = ({ id, itemReport, page, reportCount }: Props) => {
    const itemLink = `/report/item/${id}`;
    const commentLink = `/report/comment/${id}`;
    const adminItemLink = `/admin/report-list/item/${id}`;
    const adminCommentLink = `/admin/report-list/comment/${id}`;

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
            <small className={styles.reportText}>報告{page === "admin" ? `：${reportCount}件` : ""}</small>
        </Link>
    );
};