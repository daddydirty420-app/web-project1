"use client";

import styles from "../ss.module.css";
import StepBar from "../stepBar";
import SSUI from "../ssUI";
import ButtonDiv from "../buttonDiv";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
    shopId: string;
    reccomend: boolean;
};

export default function Form({ shopId }: Props) {
    const [autoTrans, setAutoTrans] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [reccomend, setReccomend] = useState(false);

    const router = useRouter();

    const submit = async () => {};

    const backSubmit = () => router.push(`/shop-signup/3/${shopId}`);

    return (
        <SSUI title="オプション選択">
            <StepBar />

            <ButtonDiv nextClick={submit} backClick={backSubmit} />
        </SSUI>
    );
};