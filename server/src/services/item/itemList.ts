type Params = {
    type: string;
    page: number;
    userId: number | null;
    keyword?: string | null;
};

export const getItemList = ({ type, page, userId }: Params) => {
    switch (type) {}
}