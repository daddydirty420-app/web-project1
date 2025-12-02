export type Item = {
    id: string;
    name: string;
    explain: string;
    image_url: string[];
    category_text: string;
    price: number;
    seller_id: number;
    stock_all: number;
    stock_now: number;
    stock_20: number;
    sold_out: boolean;
    draft: boolean;
    public: boolean;
    early_sell: boolean;
    updatedAt: Date;
    uploaded_date: Date;
    not_finish: boolean;
    save_at: Date;
    deleted_at: Date;
    ItemConditionOption?: ItemConditionOption | null;
    User?: User | null;
    Video?: Video | null;
    Sale?: Sale | null;
    ParentDelivery?: Delivery | null;
    ReccomendItem?: ReccomendItem | null;
    ColorSizes?: ColorSize[] | null;
};

export type ItemConditionOption = {
    name: string;
};

export type User = {
    id: string;
    user_name: string;
    profile_image: string;
    early_seller: boolean;
    honnin_verified: boolean;
    star_amount: number;
    star_average: number;
    ShopInfo?: ShopInfo | null;
};

export type ShopInfo = {
    id: string;
};

export type Video = {
    id: string;
    thumbnail_url: string;
    title: string;
    summary: string;
    duration: string;
    play_count: number;
    original_url: string;
    converted_url: string;
    status: string;
};

export type Sale = {
    id: string;
    before_price: number;
    discount_rate: number;
    discount_amount: number;
    sale_flag: boolean;
};

export type Delivery = {
    ShippingDayOption?: ShippingDayOption | null;
    ShippingServiceOption?: ShippingServiceOption | null;
    DeliveryTodouhuken?: TodouhukenOption | null;
};

export type ShippingDayOption = {
    name: string;
};

export type ShippingServiceOption = {
    name: string;
};

export type TodouhukenOption = {
    name: string;
};

export type ReccomendItem = {
    plus: boolean;
};

export type ColorSize = {
    kind: string;
    color: string;
    size: string;
    image_url: string;
    stock_all: number;
    stock_now: number;
    SizeOption?: SizeOption | null;
    SizeShoesOption?: SizeShoesOption | null;
    SizeWearOption?: SizeWearOption | null;
};

export type SizeOption = {
    name: string;
};

export type SizeShoesOption = {
    name: string;
};

export type SizeWearOption = {
    name: string;
};

export type Comment = {
    id: string;
    text: string;
    sort_number: number;
    item_id: string;
    user_id: string;
    parent_comment_id: string;
    createdAt: Date;
    updatedAt: Date;
    pin: boolean;
    replyCount: number;
    isMyComment: boolean;
    isGoodByMe: boolean;
    goodCount: number;
    reportCount: number;
    User?: User | null;
    Item?: Item | null;
}