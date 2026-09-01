import { S3Metadata } from "../models/index.js";
import { CreateS3MetadataParams } from "../types/serviceType/s3Metadata.js";

export const createS3Metadata = async ({ data, transaction }: CreateS3MetadataParams) => {
    await S3Metadata.create(data, { transaction });
};
