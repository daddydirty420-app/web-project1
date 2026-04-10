"use client";

import styles from "./seller.module.css";
import { Item } from "../itemPageTypes";
import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { InputTitle } from "@/components/inputForm";
import toast from "react-hot-toast";
import { getAccessToken } from "@/lib/getAccessToken";

type Props = {
    item: Item;
};

export const SaleButton = ({ item }: Props) => {
    const [salePopup, setSalePopup] = useState(false);
    const [selected, setSelected] = useState("rate");
    const [discountRate, setDiscountRate] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [saleStopPopup, setSaleStopPopup] = useState(false);
    const router = useRouter();

    if (item.status === "soldout") return;

    const sale = item.Sale;

    const finalPrice = selected === "rate"
    ? Math.round((sale?.before_price ?? item.price) * (1 - discountRate / 100))
    : (sale?.before_price ?? item.price) - discountAmount;

    const handleSelect = (value: "rate" | "amount") => {
        setSelected(value);

        setDiscountRate(0);
        setDiscountAmount(0);
    };

    const update = async (e: React.FormEvent) => {
        e.preventDefault();

        const rate = Math.round(discountRate);
        const amount = Math.round(discountAmount);

        if (selected === "rate") {
            if (rate < 1 || rate > 50) {
                toast.error("値引き率は1～50%の間で設定してください。");
                return;
            }
        }

        if (selected === "amount") {
            const maxAmount = sale ? Math.round(sale.before_price / 2) : 0;
            if (amount < 1 || amount > maxAmount) {
                toast.error(`値引き額は1円～${maxAmount}円の間で設定してください。`);
                return;
            }
        }

        try {
            const accessToken = await getAccessToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale/${sale?.id}/edit`, {
                method: 'PATCH',
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ discountRate, discountAmount, finalPrice }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("値引きしました！");
                console.log(data.message)
                setSalePopup(false);
                router.refresh();
            } else {
                toast.error("値引きに失敗しました。")
                console.error(data.message);
            }
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    const end = async () => {
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale/sale-stop/${sale?.id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("値引きを終了しました！");
                console.log(data.message);
                setSaleStopPopup(false);
                router.refresh();
            } else {
                toast.error("値引きの終了に失敗しました。");
                console.error(data.message);
            }
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください。");
            console.error(err);
        }
    };

    return (
        <>
        <div className={styles.buttonDiv}>
            <button type="button" className={styles.saleButton} onClick={() => setSalePopup(true)}>値引きする</button>
            {sale?.sale_flag && <button type="button" className={styles.saleStopButton} onClick={() => setSaleStopPopup(true)}>値引きをやめる</button>}
        </div>

        {salePopup && (
            <>
            <div className={styles.overlay} onClick={() => setSalePopup(false)} />

            <div className={styles.popup}>
                <X
                strokeWidth={1.5}
                className={styles.x}
                onClick={() => setSalePopup(false)} />
                
                <p className={styles.popupTitle}>値引きする</p>
                <div className={styles.radioDiv}>
                    <InputTitle title="値引き額の設定" />
                    <div className={styles.radioColumn}>
                        <label className={styles.radioLabel}>
                            <input
                            type="radio"
                            name="discountType"
                            value="rate"
                            checked={selected === "rate"}
                            onChange={() => handleSelect("rate")}
                            className={styles.radio}
                            />
                            <p className={styles.radioText}>値引き率</p>
                        </label>

                        <label className={styles.radioLabel}>
                            <input
                            type="radio"
                            name="discountType"
                            value="amount"
                            checked={selected === "amount"}
                            onChange={() => handleSelect("amount")}
                            className={styles.radio}
                            />
                            <p className={styles.radioText}>値引き額</p>
                        </label>
                    </div>
                </div>
                <small className={styles.popupSmall}>1円または1%引き～半額まで</small>

                {selected === "rate" && (
                    <label className={styles.inputLabelDiv}>
                        <p className={styles.inputLabelText}>値引き率</p>
                        <div className={styles.inputDiv}>
                            <input
                            type="text"
                            name="discountRate"
                            value={discountRate}
                            onChange={(e) => {
                                const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                                setDiscountRate(Number(onlyNums));
                            }}
                            placeholder="例：10（半角英数字）"
                            required
                            className={styles.input}
                            />
                            <p className={styles.text13}>%</p>
                        </div>
                    </label>
                )}

                {selected === "amount" && (
                    <label className={styles.inputLabelDiv}>
                        <p className={styles.inputLabelText}>値引き額</p>
                        <div className={styles.inputDiv}>
                            <input
                            type="text"
                            name="discountAmount"
                            value={discountAmount}
                            onChange={(e) => {
                                const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                                setDiscountAmount(Number(onlyNums));
                            }}
                            placeholder="例：300（半角英数字）"
                            required
                            className={styles.input}
                            />
                            <p className={styles.text13}>円</p>
                        </div>
                    </label>
                )}

                <div className={styles.priceTextDiv}>
                    <div className={styles.twoTextRow}>
                        <p>値引き前価格：</p>
                        <span className={styles.twoTextContent}>￥{sale?.before_price.toLocaleString()}</span>
                    </div>
                    {item.Sale?.sale_flag && (
                        <div className={styles.twoTextRow}>
                            <p>現在の価格：</p>
                            <span className={styles.twoTextContent}>￥{item.price.toLocaleString()}</span>
                        </div>
                    )}
                    {selected === "rate" && (
                        <div className={styles.twoTextRow}>
                            <p>値引き後価格：</p>
                            <span className={styles.finalPrice}>￥{finalPrice.toLocaleString()}</span>
                        </div>
                    )}
                    {selected === "amount" && (
                        <div className={styles.twoTextRow}>
                            <p>値引き後価格：</p>
                            <span className={styles.finalPrice}>￥{finalPrice.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <button
                type="button"
                className={styles.popupButton}
                onClick={update}>値引きする</button>
            </div>
            </>
        )}

        {saleStopPopup && (
            <>
            <div className={styles.overlay} onClick={() => setSaleStopPopup(false)} />

            <div className={styles.popup}>
                <X className={styles.x} onClick={() => setSaleStopPopup(false)} />
                
                <p className={styles.popupTitle}>値引きをやめる</p>

                <div className={styles.priceTextDiv}>
                    <div className={styles.twoTextRow}>
                        <p>現在の価格：</p>
                        <span className={styles.twoTextContent}>￥{item.price.toLocaleString()}</span>
                    </div>
                    <div className={styles.twoTextRow}>
                        <p>値引き前価格：</p>
                        <span className={styles.finalPrice}>￥{sale?.before_price.toLocaleString()}</span>
                    </div>
                </div>

                <button
                type="button"
                className={styles.popupButton}
                onClick={end}>値引きをやめる</button>
            </div>
            </>
        )}
        </>
    );
};