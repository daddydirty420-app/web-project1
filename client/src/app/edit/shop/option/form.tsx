"use client";

import { useState } from "react";
import styles from "../../edit.module.css";
import { ShopInfo } from "../../type";
import { useRouter } from "next/navigation";
import EditUI from "../../editUI";
import { Button, InputTitle } from "@/components/inputForm";
import toast from "react-hot-toast";
import { getAccessToken } from "@/lib/getAccessToken";

type Props = {
    shopId: string;
    shopInfo: ShopInfo;
};

export const Form = ({ shopId, shopInfo }: Props) => {
    const [autoTrans, setAutoTrans] = useState(shopInfo.auto_trans ? "はい" : "いいえ");
    const [openInfo, setOpenInfo] = useState(shopInfo.open_info ? "はい" : "いいえ");

    const router = useRouter();

    const submit = async () => {
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-info-edit/option-edit/${shopId}`, {
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
                toast.error("オプション設定変更に失敗しました。");
            }

            toast.success("オプション設定を変更しました。");
            router.push(`/shop-info/${shopId}`);
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <EditUI title="オプション選択">
            <section className={styles.radioSection}>
                <InputTitle title="自動振込：" />
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
            </section>
            <p className={styles.centerSmall}>
                ※振込申請なしで、毎月の売上を翌月10日にお振込みいたします。（金融機関が休業日の場合、その翌営業日）
            </p>

            <section className={styles.radioSection}>
                <InputTitle title="運営者情報を表示する：" />
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
            </section>
            <p className={styles.centerSmall}>
                ※ショップ情報に会社名、代表者・担当者氏名、所在地、電話番号、メールアドレス、ホームページURLを掲載します。運営者情報を表示しない場合、お客様から請求があったとき、遅滞なく開示するものとします。
            </p>

            <Button onClick={submit}>登録する</Button>
        </EditUI>
    );
};
