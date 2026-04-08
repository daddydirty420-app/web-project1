import { PutObjectCommand } from "@aws-sdk/client-s3";
import { bucket, s3 } from "../../infra/aws/s3.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type signedParams = {
    key: string;
    contentType: string;
};

export const generateSignedUrl = ({ key, contentType }: signedParams) => {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
    });

    return getSignedUrl(s3, command, { expiresIn: 60 });
};