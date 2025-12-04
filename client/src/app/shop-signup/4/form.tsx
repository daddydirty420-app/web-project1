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
    const [autoTrans, setAutoTrans] = useState("いいえ");
    const [openInfo, setOpenInfo] = useState(false);
    const [reccomend, setReccomend] = useState(false);

    const router = useRouter();

    const submit = async () => {};

    const backSubmit = () => router.push(`/shop-signup/3/${shopId}`);

    return (
        <SSUI title="オプション選択">
            <StepBar />

            <div className={styles.radioFlex}>
                <p className={styles.text14}>自動振込を希望する</p>

                <div className={styles.radioColumn}>
                    <label className={styles.radio}>
                        <input
                        type="radio"
                        name="autoTrans"
                        value="はい"
                        checked={autoTrans === "はい"}
                        onChange={(e) => setAutoTrans(e.target.value)}
                        className="cursor-pointer"
                        />
                        <p className={styles.text14}>はい</p>
                    </label>

                    <label className={styles.radio}>
                        <input
                        type="radio"
                        name="autoTrans"
                        value="いいえ"
                        checked={autoTrans === "いいえ"}
                        onChange={(e) => setAutoTrans(e.target.value)}
                        className="cursor-pointer"
                        />
                        <p className={styles.text14}>いいえ</p>
                    </label>
                </div>
            </div>

            <ButtonDiv nextClick={submit} backClick={backSubmit} />
        </SSUI>
    );
};