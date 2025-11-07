"use client";

import { Session } from "next-auth";
import styles from "../ss.module.css";
import SSUI from "../ssUI";
import { ComOrFreeOption } from "../type";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    session: Session | null;
    ComOrFreeOption: ComOrFreeOption[];
};

export default function Form({ session, ComOrFreeOption }: Props) {
    const [selectOption, seetSelectOption] = useState(null);
    const [checked, setChecked] = useState(false);

    const router = useRouter();

    const submit = async () => {};

    return (
        <SSUI title="ショップ登録">
            <h2 className={styles.subtitle}>事業形態</h2>
        </SSUI>
    );
};