"use client";

import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import styles from "./title-back.module.css";
import clsx from "clsx";

export const Back = () => {
    const router = useRouter();

    return <FontAwesomeIcon onClick={() => router.back()} icon={faAngleLeft} className={clsx("mb-2", styles.back)} />;
};
