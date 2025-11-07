'use client'

import { useEffect, useState } from 'react';

export function useCurrentUser() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
                credentials: 'include',
                cache: 'no-store'
            });
            if (res.ok) {
                const data = await res.json();
                setCurrentUserId(String(data.currentUserId));
            }
        };
        fetchCurrentUser();
    }, []);

    return currentUserId;
}