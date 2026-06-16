"use client";

import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import styles from "./title-back.module.css";

type Props = {
    url?: string;
};

export const Back = ({ url }: Props) => {
    const router = useRouter();

    return (
        <FontAwesomeIcon
            onClick={() => {
                if (url) {
                    router.push(url);
                    return;
                }

                router.back();
            }}
            icon={faAngleLeft}
            className={clsx("mb-2", styles.back)}
        />
    );
};
