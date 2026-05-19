export type ZipCloudResponse = {
    message: string | null;
    results:
        | {
              zipcode: string;
              prefcode: string;
              address1: string;
              address2: string;
              address3: string;
              kana1: string;
              kana2: string;
              kana3: string;
          }[]
        | null;
    status: number;
};

export type AddressResult = {
    todouhuken_id: number;
    todouhuken_name: string;
    shikutyouson: string;
    banchi: string;
};
