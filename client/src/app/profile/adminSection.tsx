'use client';

import { User } from './profileTypes';
import styles from './profile-admin.module.css';
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Session } from 'next-auth';

type Props = {
    userId: string;
    adminPage: boolean;
    session: Session | null;
};

export default function AdminSection({ userId, adminPage, session }: Props) {
    const [data, setData] = useState<User | null>(null);
    const [popup, setPopup] = useState(false);
    const [addPenalty, setAddPenalty] = useState(0);
    const [deleteUriage, setDeleteUriage] = useState(0);
    const [deleteReason, setDeleteReason] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!adminPage) return;
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-admin/profile/${userId}`, {
                    cache: 'no-store',
                    headers: {
                        Authorization: `Bearer ${session?.accessToken ?? ""}`,
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
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [userId, adminPage, session, router]);

    const submitPenalty = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-admin/add-penalty/${userId}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ addPenalty }),
            });

            const data = await res.json();

            if (res.ok) {
                setAddPenalty(0);
                setPopup(false);
                setData(prev => prev ? { ...prev, penalty_points: prev.penalty_points + addPenalty }: prev);
                router.refresh();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const submitUriage = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-admin/delete-uriage/${userId}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ deleteUriage }),
            });

            const data = await res.json();

            alert(data.message);
            if (res.ok) {
                setDeleteUriage(0);
                setPopup(false);
                setData(prev => prev ? { ...prev, uriagekin: prev.uriagekin - deleteUriage}: prev);
                router.refresh();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const submitDeleteUser = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-admin/delete-user/${userId}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ deleteReason }),
            });

            const data = await res.json();

            alert(data.message);
            if (res.ok) {
                setDeleteReason('');
                setPopup(false);
                router.refresh();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
        <div className='text-center'>
            <p>ペナルティポイント：<span className='font-bold'>{data?.penalty_points}ポイント</span></p>
            <button type='button' className={clsx('mt-4 mb-4', styles.adButton)} onClick={() => setPopup(true)}>売上金没収/削除</button>
        </div>

        {popup && (
            <>
            <div className={styles.overlay} onClick={() => setPopup(false)} />

            <div className={styles.popup}>
                <X className={styles.popupClose} onClick={() => setPopup(false)} />
                <p className={styles.popupTitle}>ペナルティポイント</p>
                <form onSubmit={submitPenalty}>
                    <input
                    type='number'
                    name='addPenalty'
                    value={addPenalty}
                    onChange={(e) => setAddPenalty(Number(e.target.value))}
                    placeholder='ペナルティポイント'
                    className={styles.input}
                    required
                    />
                    <button type='submit' className={styles.popupButton}>ペナルティ付与</button>
                </form>

                <p className={styles.popupTitle}>売上金没収</p>
                <form onSubmit={submitUriage}>
                    <input
                    type='number'
                    name='deleteUriage'
                    value={deleteUriage}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        if (data?.uriagekin !== undefined && value > data.uriagekin) {
                            setDeleteUriage(data.uriagekin);
                        } else {
                            setDeleteUriage(value);
                        }
                    }}
                    placeholder='没収金額'
                    className={styles.input}
                    required
                    max={data?.uriagekin}
                    />
                    <button type='submit' className={styles.popupButton}>売上金没収</button>
                </form>

                <p className={styles.popupTitle}>削除</p>
                <form onSubmit={submitDeleteUser}>
                    <input
                    type='text'
                    name='deleteReason'
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    placeholder='削除理由'
                    className={styles.input}
                    required
                    />
                    <button type='submit' className={styles.popupButton}>削除する</button>
                </form>
            </div>
            </>
        )}
        </>
    )
}