import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import styles from "./styles/guide-link.module.css";

type GuideLinkProps = {
    heading: string;
    url: string;
};

export const GuideLink = ({ heading, url }: GuideLinkProps) => {
    return (
        <div className={styles.heading}>
            <h3>
                <Link href={url} className={styles.link}>
                    {heading}
                    <FontAwesomeIcon icon={faCircleChevronRight} className={styles.icon} />
                </Link>
            </h3>
        </div>
    );
};
