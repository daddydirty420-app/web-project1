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
