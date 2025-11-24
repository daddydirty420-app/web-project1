"use client";

import { useRouter } from "next/navigation";
import styles from "../ss.module.css";
import SSUI from "../ssUI";
import { BankAccount } from "../type";
import { useEffect, useRef, useState } from "react";

type Props = {
    shopId: string;
    account: BankAccount;
};

export default function Form({ shopId, account }: Props) {
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

    const submit = async () => {};

    return (
        <SSUI title="ショップ口座登録"></SSUI>
    );
};