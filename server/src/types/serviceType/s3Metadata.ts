import { Transaction } from "sequelize";

export type S3MetadataIdParams = {
    s3MetadataId: number;
};

export type CreateS3MetadataParams = {
    data: {
        bucket_name: string;
        object_key: string;
        version_id: string | null;
        original_file_name: string;
        content_type: string;
        file_size: number;
        etag: string | null;
    };
    transaction?: Transaction;
};
