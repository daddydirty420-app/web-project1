"use client";

import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import styles from "./title-back.module.css";

export const Back = () => {
    const router = useRouter();

    return <FontAwesomeIcon onClick={() => router.back()} icon={faAngleLeft} className={clsx("mb-2", styles.back)} />;
};
