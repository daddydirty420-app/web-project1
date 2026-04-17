'use client';

import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function InitSession() {
    useEffect(() => {
        if (!document.cookie.includes('session_id')) {
            const sessionId = uuidv4();
            document.cookie = `session_id=${sessionId}; path=/; max-age=${60 * 60 * 24 * 30}`;
        }
    }, []);

    return null;
}
