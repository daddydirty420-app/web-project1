import { Transaction } from "sequelize";

export type CreatePoint180Params = {
    data: {
        points_180: number;
    };
    transaction?: Transaction;
};

export type CreateUriage180Params = {
    data: {
        uriagekin_180: number;
    };
    transaction?: Transaction;
};

export type CreateOverConfiscatedParams = {
    data: {
        points_confiscated: number;
        uriagekin_confiscated: number;
    };
    transaction?: Transaction;
};
