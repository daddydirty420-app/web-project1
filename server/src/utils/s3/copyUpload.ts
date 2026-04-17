import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { bucket, region, s3 } from "../../infra/aws/s3.js";
import { AppError } from "../../errors.js";

type GetFileNameParams = {
    url: string;
};

type CopyS3Params = {
    sourceUrl: string;
    destKey: string;
};

export const getFileName = ({ url }: GetFileNameParams) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
};

export const copyS3Object = async ({ sourceUrl, destKey }: CopyS3Params) => {
    const sourceKey = sourceUrl.split(".amazonaws.com/")[1];
    if (!sourceKey) throw new AppError("Invalid S3 URL", 400);

    const getCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: sourceKey,
    });
    const response = await s3.send(getCommand);
    const body = await response.Body?.transformToByteArray();

    const putCommand = new PutObjectCommand({
        Bucket: bucket,
        Key: destKey,
        Body: body,
        ContentType: response.ContentType,
    });
    await s3.send(putCommand);

    return `https://${bucket}.s3.${region}.amazonaws.com/${destKey}`;
};
