import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3.js";

type Params = {
    bucketName: string;
    objectKey: string;
    body: Buffer;
    contentType?: string;
};

export const uploadS3Object = async ({ bucketName, objectKey, body, contentType }: Params) => {
    const result = await s3.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
            Body: body,
            ContentType: contentType,
        }),
    );

    return {
        etag: result.ETag ?? null,
        versionId: result.VersionId ?? null,
    };
};
