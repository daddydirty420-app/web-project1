"use client";

import styles from "./video.module.css";
import { Item } from "../itemPageTypes";
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { refreshToken } from "@/lib/refreshToken";

type Props = {
    item: Item;
    sellerMe?: boolean;
    page: "normal" | "admin" | "draft" | "confirm" | "deleted";
};

export const VideoElem = ({ item, sellerMe, page }: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const videoEl = videoRef.current;
        if (!videoEl) return;

        const url = item.Video?.converted_url ?? item.Video?.original_url;
        if (!url) return;

        if (Hls.isSupported() && url.endsWith('.m3u8')) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(videoEl);
            return () => hls.destroy();
        } else {
            videoEl.src = url;
        }
    }, [item.Video]);

        
    const playCount = async () => {
        if (sellerMe || page !== "normal") return;
        try {
            const accessToken = await refreshToken();

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/video/onplay/${item.Video?.id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${accessToken ?? ""}`,
                },
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
        {item.Video?.converted_url || item.Video?.original_url ? (
            <video
            ref={videoRef}
            controls
            poster={item.Video.thumbnail_url ?? '/no-image(16x9).png'}
            playsInline
            onPlay={playCount}
            className={styles.videoPlayer}
            >お使いのブラウザは動画再生に対応していません。</video>
        ) : (
            <p className="text-base">動画がありません。</p>
        )}
        </>
    );
};