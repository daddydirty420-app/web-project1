import { S3Client } from "@aws-sdk/client-s3";

const bucket = process.env.AWS_BUCKET;
const region = process.env.AWS_REGION;

const s3Domain = `https://${bucket}.s3.${region}.amazonaws.com`;

const s3 = new S3Client({
    region: region || "ap-northeast-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

export { bucket, region, s3, s3Domain };
