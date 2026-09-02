import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { AppError } from "../../errors.js";
import { s3 } from "./s3.js";

type Params = {
    bucketName?: string;
    objectKey: string;
    versionId?: string | null;
};

export const deleteS3Object = async ({ bucketName, objectKey, versionId }: Params) => {
    if (!bucketName) throw new AppError("S3_BUCKET_NOT_FOUND", 404);

    await s3.send(
        new DeleteObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
            VersionId: versionId ?? undefined,
        }),
    );
};
