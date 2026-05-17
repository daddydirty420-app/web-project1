"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Notification } from "./type";

type Response = {
    notificationList: Notification[];
    unreadCount: number;
};

export const NotificationList = () => {
    const [popup, setPopup] = useState(false);

    const router = useRouter();

    // APIフェッチ

    return (
        <></>
    );
};
