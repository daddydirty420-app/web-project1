"use client";

import guideImage1 from "@/assets/images/website-image/guide-image/2026年9月10日に1,000獲得.png";
import guideImage2 from "@/assets/images/website-image/guide-image/売上金使用フローガイド.png";
import { X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";

export const Client = () => {
    const [modalSrc, setModalSrc] = useState<StaticImageData | null>(null);

    return (
        <>
            <div className="flex mt-4">
                {[guideImage1, guideImage2].map((img, i) => (
                    <figure
                        key={i}
                        className="relative w-1/2 aspect-video cursor-pointer"
                        onClick={() => setModalSrc(img)}
                    >
                        <Image src={img} alt={`ガイド図 ${i + 1}`} fill className="rounded shadow object-cover" />
                    </figure>
                ))}
            </div>

            {modalSrc && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50">
                    <X
                        onClick={() => setModalSrc(null)}
                        className="absolute top-20 right-4 w-8 h-8 text-white cursor-pointer"
                    />

                    <div className="max-w-[80vw] sm:max-w-[768px] max-h-[80vh]">
                        <Image
                            src={modalSrc}
                            alt="拡大ガイド画像"
                            width={1920}
                            height={1080}
                            className="rounded-lg shadow-lg object-contain"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
