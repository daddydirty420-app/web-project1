import { Transaction } from "sequelize";
import S3Metadata from "../../models/s3_metadata.js";

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

export type S3MetadataTransactionParams = {
    s3Metadata: InstanceType<typeof S3Metadata>;
    transaction?: Transaction;
};
