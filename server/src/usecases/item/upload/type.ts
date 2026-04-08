export type Video = {
    id: number;
};

export type Item = {
    id: number;
    Video?: Video | null;
};