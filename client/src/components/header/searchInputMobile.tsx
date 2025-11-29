"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faClock, faSearch } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { refreshToken } from "@/lib/refreshToken";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
    loggedIn: boolean;
};

type SearchHistoryItem = {
    search_text: string;
    createdAt: string;
};

export default function SearchInputMobile({ loggedIn }: Props) {
    const [value, setValue] = useState("");
    const [isMobile, setIsMobile] = useState(true);
    const [searchMode, setSearchMode] = useState(false);
    const [searchHis, setSearchHis] = useState<string[]>([]);
    const [suggestList, setSuggestList] = useState<string[]>([]);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const router = useRouter();

    useEffect(() => {
        const checkWidth = () => setIsMobile(window.innerWidth < 768);
        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    if (!isMobile) return null;

    const searchHistory = async () => {
        try {
            const accessToken = await refreshToken();

            if (!accessToken) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/history`, {
                method: "GET",
                cache: "no-store",
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.message);
                return;
            }

            const dataList: string[] = (data.sortedData as SearchHistoryItem[]).map(
                (item: any) => item.search_text
            );

            setSearchHis(dataList);

            console.log(searchHis);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSuggest = async (word: string) => {
        if (!word.trim()) {
            setSuggestList([]);
            return;
        }
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/suggest?keyword=${word}`, {
                method: "GET",
                cache: "no-store",
            });

            const data = await res.json();

            setSuggestList(data.suggest);
        } catch (err) {
            console.error(err);
            setSuggestList([]);
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue(val);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            fetchSuggest(val);
        }, 300);

        fetchSuggest(val);
    };

    return (
        <>
        {!searchMode && (
            <FontAwesomeIcon
            icon={faSearch}
            className={clsx(styles.searchIcon, styles.activeIcon)}
            onClick={() => {
                setSearchMode(true);
                if (loggedIn) {
                    searchHistory();
                }
            }}
            />
        )}

        {searchMode && (
            <>
            <div className={styles.searchOverlayMobile}>
                <div className={styles.searchArea}>
                    <input
                    type="text"
                    name="検索"
                    placeholder="検索"
                    className={styles.searchInputMobile}
                    value={value}
                    onChange={onChange}
                    />
                    <FontAwesomeIcon
                    icon={faAngleLeft}
                    className={styles.closeSearchAreaIcon}
                    onClick={() => setSearchMode(false)}
                    />
                    <FontAwesomeIcon
                    icon={faSearch} 
                    className={`${styles.searchIconMobile} ${value ? styles.activeIcon : ""}`}
                    onClick={() => {
                        if (!value.trim()) return;
                        router.push(`/search?keyword=${encodeURIComponent(value)}`);
                    }}
                    />
                </div>

                <div className={styles.suggestArea}>
                    <div className={styles.suggestInner}>
                        <p className={styles.categoryText}><Link href="/search/category">カテゴリー検索</Link></p>
                        {!suggestList && searchHis?.map((v, i) => (
                            <div
                            key={i}
                            className={styles.suggestItem}
                            onClick={() => {
                                router.push(`/search?keyword=${encodeURIComponent(v)}`);
                            }}
                            >
                                <FontAwesomeIcon icon={faClock} className={styles.hisIcon} />
                                <p className={styles.suggestText}>{v}</p>
                            </div>
                        ))}

                        {suggestList && suggestList?.map((v, i) => (
                            <div
                            key={i}
                            className={styles.suggestItem}
                            onClick={() => {
                                router.push(`/search?keyword=${encodeURIComponent(v)}`);
                            }}
                            >
                                <FontAwesomeIcon icon={faSearch} className={styles.suggestSearchIcon} />
                                <p className={styles.suggestText}>{v}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </>
        )}
        </>
    );
};