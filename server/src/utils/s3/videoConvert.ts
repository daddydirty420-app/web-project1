import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { bucket, s3 } from "../../infra/aws/s3.js";
import fs from "fs";

type DownloadParams = {
    key: string;
    filePath: string;
};

type UploadParams = {
    key: string;
    filePath: string;
    contentType: string;
};

export const downloadVideoFromS3 = async ({ key, filePath }: DownloadParams) => {
    const getObjectCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    const s3Object = await s3.send(getObjectCommand);
    const writeStream = fs.createWriteStream(filePath);

    await new Promise<void>((resolve, reject) => {
        (s3Object.Body as any)
        .pipe(writeStream)
        .on("finish", resolve)
        .on("error", reject);
    });
};

export const uploadVideoToS3 = async ({ filePath, key, contentType }: UploadParams) => {
    await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fs.createReadStream(filePath),
        ContentType: contentType,
    }));
};