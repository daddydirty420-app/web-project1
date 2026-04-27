export type ShopIdBody = {
    frontFileName?: string;
    frontFileType?: string;
    rearFileName?: string;
    rearFileType?: string;
    idFrontUpload: boolean;
    idRearUpload: boolean;
    permitFiles: Array<{
        fileName: string;
        fileType: string | null;
        uploaded: boolean;
    }>;
};
