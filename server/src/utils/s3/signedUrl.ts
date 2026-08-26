import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { buckets, s3 } from "../../infra/aws/s3.js";

type signedParams = {
    key: string;
    contentType: string;
};

export const generateSignedUrl = ({ key, contentType }: signedParams) => {
    const command = new PutObjectCommand({
        Bucket: buckets.public,
        Key: key,
        ContentType: contentType,
    });

    return getSignedUrl(s3, command, { expiresIn: 60 });
};
