"use client";

import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import styles from "./title-back.module.css";

type pageTitleProps = {
    title: string;
};

export const TitleAndBack = ({ title }: pageTitleProps) => {
    const router = useRouter();

    return (
        <div className="mb-2">
            <h1 className={styles.title}>{title}</h1>

            <FontAwesomeIcon onClick={() => router.back()} icon={faAngleLeft} className={styles.back} />
        </div>
    );
};
