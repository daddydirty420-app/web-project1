"use client";

import styles from "../transfer.module.css";
import TransferUI from "../transferUI";
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

    const pageButtonHandle = () => {
        if (!value || value < 1000) {
            toast.error("1,000円以上から申請可能です。");
            return;
        }

        setPopup(true);
    };

    const submit = async () => {
        if (!value || value < 1000) {
            toast.error("1,000円以上から申請可能です。");
            return;
        }

        if (value > limit) {
            toast.error(`申請金額は売上金${limit.toLocaleString()}円以内にしてください。`);
            return;
        }

        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transfer/request-create`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    transValue: value,
                    limit,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error("振込申請データの登録に失敗しました。");
                console.error(data.message);
                return;
            }

            alert("振込申請が完了しました。翌々週金曜日以降に指定の口座にお振込みされます。");
            router.push(`/transfer/detail/${data.transId}`);
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <TransferUI title="振込申請金額を入力">
            <div className={styles.transInputDiv}>
                <p className={styles.transDivTitle}>現在の売上金</p>
                <p className={styles.transTextValue}>￥{user.uriagekin.toLocaleString()}</p>
            </div>

            <div className={styles.transInputDiv}>
                <p className={styles.transDivTitle}>振込申請金額</p>
                <div>
                    <div className={styles.inputFlex}>
                        <p className={styles.text14}>￥</p>
                        <input
                        type="text"
                        pattern="[0-9]*"
                        value={value}
                        onChange={(e) => {
                            const num = Number(e.target.value);
                            setValue(num);

                            if (num < 1000 || num > limit) {
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
                    <p className={styles.smallGray}>￥1,000から申請可能です</p>
                </div>
            </div>

            <div className={styles.transInputDiv}>
                <p className={styles.transDivTitle}>振込手数料</p>
                <p className={styles.transTextValue}>￥200</p>
            </div>

            <div className={styles.transInputDiv}>
                <p className={styles.transDivTitle}>振込金額</p>
                <p className={styles.transTextValue}>￥{(value - 200).toLocaleString()}</p>
            </div>

            <button
            type="button"
            className={styles.pageButton}
            onClick={pageButtonHandle}>
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
                    
                    <p className={styles.popupTitle}>お振込み内容の確認</p>

                    <div className={styles.popupTransValueDiv}>
                        <p className={styles.popupSubTitle}>振込金額</p>
                        <p className={styles.popupTransValue}>￥{(value - 200).toLocaleString()}</p>
                    </div>

                    <p className={styles.popupSubTitle}>振込先口座</p>
                    <div className={styles.popupAccountDiv}>
                        <div className={styles.twoTextFlex}>
                            <p>銀行：</p>
                            <span className={styles.twoTextContent}>{user.BankAccount?.bank_name}</span>
                        </div>
                        <div className={styles.twoTextFlex}>
                            <p>支店：</p>
                            <span className={styles.twoTextContent}>{user.BankAccount?.branch}</span>
                        </div>
                        <div className={styles.twoTextFlex}>
                            <p>口座種別：</p>
                            <span className={styles.twoTextContent}>{user.BankAccount?.AccountTypeOption?.name}</span>
                        </div>
                        <div className={styles.twoTextFlex}>
                            <p>口座番号：</p>
                            <span className={styles.twoTextContent}>{user.BankAccount?.account_number}</span>
                        </div>
                        <div className={styles.twoTextFlex}>
                            <p>名義：</p>
                            <span className={styles.twoTextContent}>{user.BankAccount?.meigi}</span>
                        </div>
                    </div>

                    <button
                    type="button"
                    onClick={submit}
                    className={styles.popupButton}
                    >
                        申請する
                    </button>
                </div>
                </>
            )}
        </TransferUI>
    );
};