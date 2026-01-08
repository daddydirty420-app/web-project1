"use client";

import styles from "../transfar.module.css";
import TransfarUI from "../transfarUI";
import { User } from "../types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    user: User;
    reccomendPayValue: number;
};

export default function Form({ user, reccomendPayValue }: Props) {
    const [value, setValue] = useState(0);
    const [isInvalid, setIsInvalid] = useState(false);
    const [popup, setPopup] = useState(false);
    const router = useRouter();

    const limit = user.ReccomendMonth
    ? user.uriagekin - reccomendPayValue
    : user.uriagekin;

    const submit = async () => {
        if (!value || value < 1000) {
            alert("1,000円以上から申請可能です。");
            return;
        }

        if (value > limit) {
            alert(`申請金額は売上金${limit.toLocaleString()}円以内にしてください。`);
            return;
        }

        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transfar/request-create`, {
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
                alert(data.message);
                console.error(data.message);
                return;
            }

            alert("振込申請が完了しました。翌々週金曜日以降に指定の口座にお振込みされます。");
            router.push(`/transfar/detail/${data.transId}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <TransfarUI title="振込申請金額を入力">
            <p className={styles.smallAttention}>※FLEXレコメンド月額プランをご利用中のお客様は、振込申請金額の上限が現在の売上金からFLEXレコメンドの料金を引いた額となっております。</p>

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
                <p className={styles.transTextValue}>{(value - 200).toLocaleString()}</p>
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
                    <X className={styles.x} onClick={() => setPopup(false)} />
                    
                    <p className={styles.popupTitle}>お振込み内容の確認</p>

                    <div className={styles.popupTransValueDiv}>
                        <p className={styles.popupSubTitle}>振込金額</p>
                        <p className={styles.popupTransValue}>￥{(value - 200).toLocaleString()}</p>
                    </div>

                    <p className={styles.popupSubTitle}>振込先口座</p>
                    <div className={styles.popupAccountDiv}>
                        <div className={styles.twoTextFlex}>
                            <p className={styles.accountText}>銀行：</p>
                            <span className="font-bold">{user.BankAccount?.bank_name}</span>
                        </div>
                        <div className={styles.twoTextFlex}>
                            <p className={styles.accountText}>支店：</p>
                            <span className="font-bold">{user.BankAccount?.branch}</span>
                        </div>
                        <div className={styles.twoTextFlex}>
                            <p className={styles.accountText}>口座種別：</p>
                            <span className="font-bold">{user.BankAccount?.AccountTypeOption?.name}</span>
                        </div>
                        <div className={styles.twoTextFlex}>
                            <p className={styles.accountText}>口座番号：</p>
                            <span className="font-bold">{user.BankAccount?.account_number}</span>
                        </div>
                        <div className={styles.twoTextFlex}>
                            <p className={styles.accountText}>名義：</p>
                            <span className="font-bold">{user.BankAccount?.meigi}</span>
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
        </TransfarUI>
    );
};