/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import styles from "../edit.module.css";
import { InputStr, Button, InputTitle } from "@/components/inputForm/index";
import EditUI from "../editUI";
import { BankAccount } from "../type";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { refreshToken } from "@/lib/refreshToken";
import clsx from "clsx";

type Props = {
    account: BankAccount;
    page: "normal" | "transfar" | "shop" | "shop-signup" | "com-free";
    shopId?: string;
    shopEditId?: string;
};

export default function AccountEditForm({ account, page, shopId, shopEditId }: Props) {
    const [bankQuery, setBankQuery] = useState(account.bank_name || "");
    const [bankSuggestions, setBankSuggestions] = useState<{
        name: string;
        code: string;
        hira: string;
        kana: string;
    }[]>([]);
    const [showBankSuggest, setShowBankSuggest] = useState(false);
    const [isSelectingBank, setIsSelectingBank] = useState(false);

    const [bankCode, setBankCode] = useState(account.bank_code || "");
    
    const [branchQuery, setBranchQuery] = useState(account.branch || "");
    const [branchSuggestions, setBranchSuggestions] = useState<{
        name: string;
        code: string;
        hira: string;
        kana: string;
    }[]>([]);
    const [showBranchSuggest, setShowBranchSuggest] = useState(false);
    const [isSelectingBranch, setIsSelectingBranch] = useState(false);
    
    const [branchCode, setBranchCode] = useState(account.branch_code || "");
    
    const [accountType, setAccountType] = useState(account.AccountTypeOption?.name || "");
    const [accountNumber, setAccountNumber] = useState(account.account_number || "");
    const [meigi, setMeigi] = useState(account.meigi || "");

    const router = useRouter();
    
    const suggestTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isSelectingBank) return;
        if (!bankQuery || bankQuery === account.bank_name) {
            setBankSuggestions([]);
            setShowBankSuggest(false);
            return;
        };

        if (suggestTimeout.current) clearTimeout(suggestTimeout.current);

        suggestTimeout.current = setTimeout(async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank-account/search-bank-name?keyword=${bankQuery}`);

                const data = await res.json();

                if (!res.ok) {
                    console.error("銀行名検索エラー：", data.message);
                    setBankSuggestions([]);
                    setShowBankSuggest(false);
                    return;
                }

                const suggestions = data?.banks?.map((b: any) => ({
                    name: b.name,
                    code: b.code,
                    kana: b.kana,
                    hira: b.hira,
                    normalize: b.normalize,
                })) || [];

                setBankSuggestions(suggestions);
                setShowBankSuggest(suggestions.length > 0);
            } catch (err) {
                console.error("銀行名検索エラー：", err);
                setBankSuggestions([]);
                setShowBankSuggest(false);
            }
        }, 300);

        return () => {
            if (suggestTimeout.current) clearTimeout(suggestTimeout.current);
        };
    }, [bankQuery, account.bank_name, isSelectingBank]);

    useEffect(() => {
        if (isSelectingBranch) return;
        if (!branchQuery || branchQuery === account.branch) {
            setBranchSuggestions([]);
            setShowBranchSuggest(false);
            return;
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank-account/search-branch?keyword=${branchQuery}&bankCode=${bankCode || account.bank_code}`);
                
                const data = await res.json();

                if (!res.ok) {
                    console.error("支店名検索エラー：", data.message);
                    setBranchSuggestions([]);
                    setShowBranchSuggest(false);
                    return;
                }

                const suggestions = data?.branches?.map((b: any) => ({
                    name: b.name,
                    code: b.code,
                    kana: b.kana,
                    hira: b.hira,
                })) || [];

                setBranchSuggestions(suggestions);
                setShowBranchSuggest(suggestions.length > 0);
            } catch (err) {
                console.error("支店名検索エラー：", err);
                setBranchSuggestions([]);
                setShowBranchSuggest(false);
            }
        }, 300);

        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, [branchQuery, bankCode, account, isSelectingBranch]);

    const submit = async () => {
        if (!bankQuery.trim() || !branchQuery.trim() || !accountType || !accountNumber.trim() || !meigi.trim()) {
            alert("空の項目があります。");
            return;
        }

        if (!/^[0-9]{5,7}$/.test(accountNumber)) {
            alert("口座番号は5〜7桁の半角数字で入力してください。");
            return;
        }

        const body = {
            bankName: bankQuery.trim(),
            bankCode: bankCode,
            branch: branchQuery.trim(),
            branchCode: branchCode,
            accountType: accountType,
            accountNumber: accountNumber.padStart(7, "0"),
            meigi: meigi.trim(),
        };

        try {
            const accessToken = await refreshToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            if (page === "shop") {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-info-edit/account-edit/${shopId}`, {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(body),
                });

                const data = await res.json();

                if (!res.ok) {
                    alert(data.message || "更新に失敗しました。");
                    return;
                }

                alert("口座情報の変更を受け付けました。審査完了までしばらくお待ちください。");
                router.push(`/shop-info/${shopId}`);
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank-account/account-edit/${account.id}`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "更新に失敗しました。");
                return;
            }

            if (page === "normal") {
                alert("口座情報を更新しました。");
                router.push("/my-page");
            } else if (page === "transfar") {
                router.push("/transfar/request");
            } else if (page === "shop-signup") {
                router.push(`/shop-signup/step5/${shopId}`);
            } else if (page === "com-free") {
                router.push(`/edit/shop/com-free/confirm/${shopEditId}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <EditUI title="振込口座の設定">
            {page === "normal" && <p className={styles.text12}>※振込申請の際にも口座を設定できます。</p>}

            <div className={styles.inputDiv}>
                <InputTitle title="銀行名" hissu />
                <input
                type="text"
                value={bankQuery}
                onChange={(e) => setBankQuery(e.target.value)}
                onFocus={() => {
                    setShowBankSuggest(true);
                    setShowBranchSuggest(false);
                }}
                onBlur={() => setTimeout(() => setShowBankSuggest(false), 150)}
                placeholder="〇〇銀行"
                className={styles.input}
                required
                />
                {showBankSuggest && bankSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border rounded w-full shadow-md max-h-48 overflow-y-auto">
                        {bankSuggestions.map((bank, i) => (
                            <li
                            key={i}
                            onMouseDown={() => {
                                setIsSelectingBank(true);
                                setBankQuery(bank.name);
                                setBankCode(bank.code);
                                setShowBankSuggest(false);
                                account.bank_name = bank.name;

                                setTimeout(() => setIsSelectingBank(false), 500);
                            }}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {bank.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={styles.inputDiv}>
                <InputTitle title="支店名" hissu />
                <input
                type="text"
                value={branchQuery}
                onChange={(e) => setBranchQuery(e.target.value)}
                onFocus={() => {
                    setShowBranchSuggest(true);
                    setShowBankSuggest(false);
                }}
                onBlur={() => setTimeout(() => setShowBranchSuggest(false), 150)}
                placeholder="〇〇支店"
                className={styles.input}
                required
                />
                {showBranchSuggest && branchSuggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border rounded w-full shadow-md max-h-48 overflow-y-auto">
                        {branchSuggestions.map((branch, i) => (
                            <li
                            key={i}
                            onMouseDown={() => {
                                setIsSelectingBranch(true);
                                setBranchQuery(branch.name);
                                setBranchCode(branch.code);
                                setShowBranchSuggest(false);
                                account.branch = branch.name;

                                setTimeout(() => setIsSelectingBranch(false), 500);
                            }}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {branch.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className={styles.inputDiv}>
                <InputTitle title="口座種別" hissu />
                <select
                aria-label="口座種別"
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className={styles.select}
                >
                    <option value="" disabled>--1つ選択してください。--</option>
                    <option value="普通預金">普通預金</option>
                    <option value="当座預金">当座預金</option>
                    <option value="その他">その他</option>
                </select>
            </div>

            <InputStr
            title="口座番号"
            type="text"
            value={accountNumber}
            onChange={(v) => setAccountNumber(v.replace(/[^0-9]/g, ""))}
            placeholder="0000000（半角数字のみ）"
            hissu
            numeric
            patternNum
            />

            <InputStr
            title="口座名義"
            type="text"
            value={meigi}
            onChange={setMeigi}
            placeholder="〇〇　〇〇"
            hissu
            />

            {page === "shop" && (
                <p className={clsx(styles.centerSmall, "mt-4")}>※口座情報の変更は審査が必要になります。登録される口座情報の変更は審査が完了し次第となります。審査には1~2週間ほどお時間を頂戴しております。</p>
            )}

            <Button onClick={submit}>登録する</Button>
        </EditUI>
    );
};