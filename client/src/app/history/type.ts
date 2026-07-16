export type PointsHistoryResponse = {
    history: PointsHistory[];
    nextCursor: string | null;
    hasMore: boolean;
};

export type PointReasonOption = {
    id: string;
    name: string;
};

export type PointsHistory = {
    id: string;
    points: number;
    createdAt: Date;
    PointReasonOption: PointReasonOption;
};

export type PointLots = {
    id: string;
    points: number;
    used_points: number;
    expires_at: Date;
    alertPoints: number;
};

export type UriagekinLots = {
    id: string;
    uriagekin: number;
    used_Uriagekin: number;
    expires_at: Date;
    alertUriagekin: number;
};

export type User = {
    id: string;
    points: number;
    PointLots?: PointLots;
    UriagekinLots?: UriagekinLots;
};
