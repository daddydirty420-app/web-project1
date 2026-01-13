'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import styles from './mypage.module.css';
import { refreshToken } from '@/lib/refreshToken';

type ReferenceCode = {
    output: string;
}

type Props = {
    itemCount: number;
    referenceCount: number;
}

export default function ReferenceCode({ itemCount, referenceCount }: Props) {
    const [visiblePopup, setVisiblePopup] = useState(false);
    const [referenceCodeOutput, setReferenceCodeOutput] = useState<ReferenceCode | null>(null);

    const outputReferenceCode = async () => {
        try {
            const accessToken = await refreshToken();
            
            if (!accessToken) {
                alert("認証に失敗しました。時間を置いて再試行するか、再度ログインしてください。");
                return;
            }
            
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reference-code/output`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.ok) {
                const data = await res.json();
                setReferenceCodeOutput(data);
                setVisiblePopup(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
        {itemCount > 0 && referenceCount < 3 && (
            <div className={styles.linkElem} onClick={outputReferenceCode}>
                <p>紹介コード発行</p>
            </div>
        )}

        {visiblePopup && referenceCodeOutput && (
            <>
            <div className={styles.overlay} onClick={() => setVisiblePopup(false)} />

            <div className={styles.popup}>
                <X
                strokeWidth={1.5}
                onClick={() => setVisiblePopup(false)}
                className={styles.x} />
                <p className={styles.popupTitle}>紹介コード発行</p>
                <p
                    className={styles.output}
                    onClick={async () => {
                        try {
                            await navigator.clipboard.writeText(referenceCodeOutput.output);
                            console.log("コピーしました：", referenceCodeOutput.output);
                            alert('コピーしました');
                        } catch (err) {
                            console.error("コピー失敗:", err);
                        }
                    }}
                >
                    {referenceCodeOutput.output}
                </p>
                <p className={styles.popupText}>コードをクリックするとコピーできます。</p>
                <small className={styles.popupSmall}>※ 紹介コードを入力したユーザーが商品を出品しない限り、ポイントは付与されません。</small>
            </div>
            </>
        )}
        </>
    );
}