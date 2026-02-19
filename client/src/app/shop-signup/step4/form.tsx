"use client";

import styles from "../ss.module.css";
import { StepBar } from "../stepBar";
import SSUI from "../ssUI";
import { ButtonDiv } from "../buttonDiv";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/lib/refreshToken";
import toast from "react-hot-toast";

type Props = {
    shopId: string;
};

export const Form = ({ shopId }: Props) => {
    const [autoTrans, setAutoTrans] = useState("いいえ");
    const [openInfo, setOpenInfo] = useState("いいえ");

    const router = useRouter();

    const submit = async () => {
        try {
            const accessToken = await refreshToken();
        
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-signup-create/4/${shopId}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ autoTrans, openInfo }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                toast.error("オプション設定に失敗しました。");
            }

            router.push(`/shop-signup/step5/${shopId}`);
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const backSubmit = () => router.push(`/shop-signup/step3/${shopId}`);

    return (
        <SSUI title="オプション選択">
            <StepBar />

            <div className={styles.optionDiv}>
                <div className={styles.radioFlexOption}>
                    <p className={styles.text14}>自動振込を希望する</p>

                    <div className={styles.radioColumn}>
                        <label className={styles.radioLabel}>
                            <input
                            type="radio"
                            name="autoTrans"
                            value="はい"
                            checked={autoTrans === "はい"}
                            onChange={(e) => setAutoTrans(e.target.value)}
                            className={styles.radio}
                            />
                            <p className={styles.radioText}>はい</p>
                        </label>

                        <label className={styles.radioLabel}>
                            <input
                            type="radio"
                            name="autoTrans"
                            value="いいえ"
                            checked={autoTrans === "いいえ"}
                            onChange={(e) => setAutoTrans(e.target.value)}
                            className={styles.radio}
                            />
                            <p className={styles.radioText}>いいえ</p>
                        </label>
                    </div>
                </div>

                <p className={styles.centerSmall}>※振込申請なしで、毎月の売上を翌月10日にお振込みいたします。（金融機関が休業日の場合、その翌営業日）</p>
            </div>

            <div className={styles.optionDiv}>
                <div className={styles.radioFlexOption}>
                    <p className={styles.text14}>運営者情報を表示する</p>

                    <div className={styles.radioColumn}>
                        <label className={styles.radioLabel}>
                            <input
                            type="radio"
                            name="openInfo"
                            value="はい"
                            checked={openInfo === "はい"}
                            onChange={(e) => setOpenInfo(e.target.value)}
                            className={styles.radio}
                            />
                            <p className={styles.radioText}>はい</p>
                        </label>

                        <label className={styles.radioLabel}>
                            <input
                            type="radio"
                            name="openInfo"
                            value="いいえ"
                            checked={openInfo === "いいえ"}
                            onChange={(e) => setOpenInfo(e.target.value)}
                            className={styles.radio}
                            />
                            <p className={styles.radioText}>いいえ</p>
                        </label>
                    </div>
                </div>

                <p className={styles.centerSmall}>※ショップ情報に会社名、代表者・担当者氏名、所在地、電話番号、メールアドレス、ホームページURLを掲載します。運営者情報を表示しない場合、お客様から請求があったとき、遅滞なく開示するものとします。</p>
            </div>

            <ButtonDiv nextClick={submit} backClick={backSubmit} />
        </SSUI>
    );
};