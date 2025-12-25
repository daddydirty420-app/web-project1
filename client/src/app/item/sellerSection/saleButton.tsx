"use client";

import styles from "./seller.module.css";
import { Item } from "../itemPageTypes";
import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    item: Item;
};

export default function SaleButton({ item }: Props) {
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
                alert("値引き率は1～50%の間で設定してください。");
                return;
            }
        }

        if (selected === "amount") {
            const maxAmount = sale ? Math.round(sale.before_price / 2) : 0;
            if (amount < 1 || amount > maxAmount) {
                alert(`値引き額は1円～${maxAmount}円の間で設定してください。`);
                return;
            }
        }

        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale/sale-edit/${sale?.id}`, {
                method: 'PATCH',
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ discountRate, discountAmount, finalPrice }),
            });

            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                setSalePopup(false);
                router.refresh();
            } else {
                const msgJson = await res.json();
                console.error(msgJson.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const end = async () => {
        try {
            const accessToken = await refreshToken();

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

            if (res.ok) {
                const data = await res.json();
                alert(data.message);
                setSaleStopPopup(false);
                router.refresh();
            } else {
                const msgJson = await res.json();
                console.error(msgJson.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
        <div className={styles.buttonDiv}>
            <button type="button" className={styles.saleButton} onClick={() => setSalePopup(true)}>値引きする</button>
            {sale?.sale_flag && <button type="button" className={styles.blackButton} onClick={() => setSaleStopPopup(true)}>値引きをやめる</button>}
        </div>

        {salePopup && (
            <>
            <div className={styles.overlay} onClick={() => setSalePopup(false)} />

            <div className={styles.popup}>
                <X className={styles.x} onClick={() => setSalePopup(false)} />
                
                <p className={styles.popupTitle}>値引きする</p>
                <div className={styles.labelDiv}>
                    <p className={styles.labelText}>値引き額の設定：</p>
                    <div className={styles.labelColumn}>
                        <label className={styles.radio}>
                            <input
                            type="radio"
                            name="discountType"
                            value="rate"
                            checked={selected === "rate"}
                            onChange={() => handleSelect("rate")}
                            className="cursor-pointer"
                            />
                            値引き率
                        </label>

                        <label className={styles.radio}>
                            <input
                            type="radio"
                            name="discountType"
                            value="amount"
                            checked={selected === "amount"}
                            onChange={() => handleSelect("amount")}
                            className="cursor-pointer"
                            />
                            値引き額
                        </label>
                    </div>
                </div>
                <small className={styles.popupSmall}>1円または1%引き～半額まで</small>

                {selected === "rate" && (
                    <label className={styles.labelDiv}>
                        <p className={styles.labelText}>値引き率：</p>
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
                        <p>%</p>
                    </label>
                )}

                {selected === "amount" && (
                    <label className={styles.labelDiv}>
                        <p className={styles.labelText}>値引き額：</p>
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
                        <p>円</p>
                    </label>
                )}

                <p className={styles.priceText}>値引き前価格：<span className="font-bold">￥{sale?.before_price.toLocaleString()}</span></p>
                {item.Sale?.sale_flag && <p className={styles.priceText}>現在の価格：<span className="font-bold">￥{item.price.toLocaleString()}</span></p>}
                {selected === "rate" && <p className={styles.priceText}>値引き後価格：<span className="font-bold">￥{finalPrice.toLocaleString()}</span></p>}
                {selected === "amount" && <p className={styles.priceText}>値引き後価格：<span className="font-bold">￥{finalPrice.toLocaleString()}</span></p>}

                <button type="button" className={styles.popupButton} onClick={update}>値引きする</button>
            </div>
            </>
        )}

        {saleStopPopup && (
            <>
            <div className={styles.overlay} onClick={() => setSaleStopPopup(false)} />

            <div className={styles.popup}>
                <X className={styles.x} onClick={() => setSaleStopPopup(false)} />
                
                <p className={styles.popupTitle}>値引きをやめる</p>

                <p className={styles.priceText}>現在の価格：<span className="font-bold">￥{item.price.toLocaleString()}</span></p>
                <p className={styles.priceText}>値引き前価格：<span className="font-bold text-[var(--alert)]">￥{sale?.before_price.toLocaleString()}</span></p>

                <button type="button" className={styles.popupButton} onClick={end}>値引きをやめる</button>
            </div>
            </>
        )}
        </>
    );
};