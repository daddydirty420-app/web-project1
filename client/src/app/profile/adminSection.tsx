"use client";

import { getAccessToken } from "@/lib/getAccessToken";
import clsx from "clsx";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { sleep } from "../../lib/sleep";
import styles from "./profile-admin.module.css";
import { User } from "./profileTypes";

type Props = {
    userId: string;
    adminPage: boolean;
};

export const AdminSection = ({ userId, adminPage }: Props) => {
    const [data, setData] = useState<User | null>(null);
    const [popup, setPopup] = useState(false);
    const [addPenalty, setAddPenalty] = useState(0);
    const [deleteUriage, setDeleteUriage] = useState(0);
    const [deleteReason, setDeleteReason] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!adminPage) {
            router.push(`/profile/${userId}`);
            return;
        }

        const fetchData = async () => {
            try {
                const accessToken = await getAccessToken();

                if (!accessToken) {
                    alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-admin/profile/${userId}`, {
                    method: "GET",
                    cache: "no-store",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (res.status === 403) {
                    router.push(`/profile/${userId}`);
                    return;
                }

                if (res.ok) {
                    const data = await res.json();
                    setData(data);
                }
            } catch (err) {}
        };

        fetchData();
    }, [userId, adminPage, router]);

    const submitPenalty = async (addPenalty: number) => {
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-admin/add-penalty/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ addPenalty }),
            });

            const data = await res.json();

            if (res.ok) {
                setAddPenalty(0);
                setPopup(false);
                setData((prev) => (prev ? { ...prev, penalty_points: prev.penalty_points + addPenalty } : prev));
                toast.success("ペナルティポイントを付与しました");
                await sleep(1500);

                router.refresh();
            }
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    const uriageDecrease = async (deleteUriage: number) => {
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-admin/delete-uriage/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ deleteUriage }),
            });

            const data = await res.json();

            if (res.ok) {
                setDeleteUriage(0);
                setPopup(false);
                setData((prev) => (prev ? { ...prev, uriagekin: prev.uriagekin - deleteUriage } : prev));
                toast.success("売上金を没収しました");
                await sleep(1500);

                router.refresh();
            }
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    const deleteUser = async (deleteReason: string) => {
        try {
            const accessToken = await getAccessToken();

            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-admin/delete-user/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ deleteReason }),
            });

            const data = await res.json();

            if (res.ok) {
                setDeleteReason("");
                setPopup(false);
                toast.success("ユーザーを削除しました");
                await sleep(2000);

                router.refresh();
            }
        } catch (err) {
            alert("システムエラーが発生しました。時間をおいて再試行してください");
        }
    };

    return (
        <>
            <div className="text-center">
                <p>
                    ペナルティポイント：<span className="font-bold">{data?.penalty_points}ポイント</span>
                </p>
                <button type="button" className={clsx("mt-4 mb-4", styles.adButton)} onClick={() => setPopup(true)}>
                    売上金没収/削除
                </button>
            </div>

            {popup && (
                <>
                    <div className={styles.overlay} onClick={() => setPopup(false)} />

                    <div className={styles.popup}>
                        <X strokeWidth={1.5} className={styles.x} onClick={() => setPopup(false)} />

                        <div className={styles.inputDiv}>
                            <p className={styles.inputTitle}>ペナルティポイント</p>

                            <input
                                type="number"
                                name="addPenalty"
                                value={addPenalty}
                                onChange={(e) => setAddPenalty(Number(e.target.value))}
                                placeholder="ペナルティポイント"
                                className={styles.input}
                                required
                            />

                            <button
                                type="button"
                                className={styles.popupButton}
                                onClick={() => submitPenalty(addPenalty)}
                            >
                                ペナルティ付与
                            </button>
                        </div>

                        <div className={styles.inputDiv}>
                            <p className={styles.inputTitle}>売上金没収</p>

                            <input
                                type="number"
                                name="deleteUriage"
                                value={deleteUriage}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (data?.uriagekin !== undefined && value > data.uriagekin) {
                                        setDeleteUriage(data.uriagekin);
                                    } else {
                                        setDeleteUriage(value);
                                    }
                                }}
                                placeholder="没収金額"
                                className={styles.input}
                                required
                                max={data?.uriagekin}
                            />

                            <button
                                type="button"
                                className={styles.popupButton}
                                onClick={() => uriageDecrease(deleteUriage)}
                            >
                                売上金没収
                            </button>
                        </div>

                        <div className={styles.inputDiv}>
                            <p className={styles.inputTitle}>削除</p>

                            <input
                                type="text"
                                name="deleteReason"
                                value={deleteReason}
                                onChange={(e) => setDeleteReason(e.target.value)}
                                placeholder="削除理由"
                                className={styles.input}
                                required
                            />

                            <button
                                type="button"
                                className={styles.popupButton}
                                onClick={() => deleteUser(deleteReason)}
                            >
                                削除する
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
