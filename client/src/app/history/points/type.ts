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
};

export type User = {
    id: string;
    points: number;
    PointLots?: PointLots;
};
