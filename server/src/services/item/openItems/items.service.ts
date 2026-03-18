export type ItemListView = 
| "index"
| "profile"
| "search";

type Params = {
    userId: number | null;
    type: "video" | "item";
    page: number;
    view: ItemListView;
    pageUserId?: number;
};

export const getItems = async ({ userId, type, page, view, pageUserId }: Params) => {
    switch (type) {}
};