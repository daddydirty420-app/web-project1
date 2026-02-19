"use client";

import styles from "../transfar.module.css";
import TransfarUI from "../transfarUI";
import { User } from "../types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { refreshToken } from "@/lib/refreshToken";
import toast from "react-hot-toast";

type Props = {
    user: User;
};

export const Form = ({ user }: Props) => {
    const [value, setValue] = useState(0);
    const [isInvalid, setIsInvalid] = useState(false);
    const [popup, setPopup] = useState(false);
    const router = useRouter();

    const limit = user.uriagekin;

    const submit = async () => {
        if (value === 0) {
            toast.error("変換金額を入力してください。");
            return;
        }

        if (value > limit) {
            toast.error(`変換金額は売上金${limit.toLocaleString()}円以内にしてください。`);
            return;
        }

        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transfar/points-create`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ value, limit }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error("ポイント変換に失敗しました。");
                console.error(data.message);
                return;
            }

            alert(`売上金${value.toLocaleString()}円をポイントに変換しました。ポイントの有効期限は本日から180日後になります。`);
            router.push("/my-page");
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <TransfarUI title="ポイントに変換">
            <div className={styles.transInputDiv}>
                <p className={styles.transDivTitle}>現在の売上金</p>
                <p className={styles.transTextValue}>￥{user.uriagekin.toLocaleString()}</p>
            </div>

            <div className={styles.transInputDiv}>
                <p className={styles.transDivTitle}>返還金額</p>
                <div className={styles.inputFlex}>
                    <p className={styles.text14}>￥</p>
                    <input
                    type="text"
                    pattern="[0-9]*"
                    value={value}
                    onChange={(e) => {
                        const num = Number(e.target.value);
                        setValue(num);

                        if ((num > limit) || (num === 0)) {
                            setIsInvalid(true);
                        } else {
                            setIsInvalid(false);
                        }
                    }}
                    placeholder="例）30,000"
                    className={`${styles.transValueInput} ${isInvalid ? styles.invalidInput : ""}`}
                    required
                    />
                </div>
            </div>

            <div className={styles.transInputDiv}>
                <p className={styles.transDivTitle}>変換後のポイント</p>
                <p className={styles.transTextValue}>￥{(user.points + value).toLocaleString()}</p>
            </div>

            <div className={styles.transInputDiv}>
                <p className={styles.transDivTitle}>変換後の売上金</p>
                <p className={styles.transTextValue}>￥{(user.uriagekin - value).toLocaleString()}</p>
            </div>

            <button
            type="button"
            className={styles.pageButton}
            onClick={() => setPopup(true)}>
                確認する
            </button>

            {popup && (
                <>
                <div className={styles.overlay} onClick={() => setPopup(false)} />

                <div className={styles.popup}>
                    <X
                    strokeWidth={1.5}
                    className={styles.x}
                    onClick={() => setPopup(false)} />
                    
                    <p className={styles.popupTitle}>確認</p>

                    <div className={styles.popupTransValueDiv}>
                        <p className={styles.popupSubTitle}>変換金額</p>
                        <p className={styles.popupTransValue}>￥{value.toLocaleString()}</p>
                    </div>

                    <p className={styles.popupSmall}>※ポイントの有効期限は獲得日から6か月後です。有効期限を経過した場合、ポイントは自動消滅となります。</p>
                    <p className={styles.popupSmall}>※変換金額の返金・払い戻し等はできません。</p>

                    <button
                    type="button"
                    onClick={submit}
                    className={styles.popupButton}
                    >
                        変換する
                    </button>
                </div>
                </>
            )}
        </TransfarUI>
    );
};