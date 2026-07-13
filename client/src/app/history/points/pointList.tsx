"use client";

import { useState } from "react";
import { User } from "./type";

type Props = {
    user: User;
};

export const PointList = ({ user }: Props) => {
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // SWRInfinite
};
