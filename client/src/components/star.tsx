'use client';

import { Rating, Star as RatingStar } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css';
import { useEffect, useState } from 'react';

type Props = {
    userId: string;
};

export default function Star({ userId }: Props) {
    const [star, setStar] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/star/${userId}`, {
                    method: 'GET',
                    cache: 'no-store'
                });

                if (res.ok) {
                    const data = await res.json();
                    setStar(Number(data.user.star_average) || 0);
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [userId]);

    return (
        <Rating
            style={{ maxWidth: 80 }}
            value={star}
            readOnly
            itemStyles={{
                itemShapes: RatingStar,
                activeFillColor: "#facc15",
                inactiveFillColor: "#d5d7dc",
            }}
        />
    );
}