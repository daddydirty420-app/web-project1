import dayjs from "dayjs";

type Params = {
    date: Date | string;
    japanese: boolean;
};

export const formatDate = ({ date, japanese }: Params) => {
    return dayjs(date).format(japanese ? "YYYY年MM月DD日" : "YYYY/MM/DD");
};
