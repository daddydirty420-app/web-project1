import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION ?? "ap-northeast-1";

const buckets = {
    public: process.env.AWS_BUCKET,
    verificationDocuments: process.env.AWS_VERIFICATION_DOCUMENTS_BUCKET,
} as const;

if (!buckets.public) {
    throw new Error("AWS_BUCKET is not defined");
}

if (!buckets.verificationDocuments) {
    throw new Error("AWS_VERIFICATION_DOCUMENTS_BUCKET is not defined");
}

const publicS3Domain = `https://${buckets.public}.s3.${region}.amazonaws.com`;

const s3 = new S3Client({
    region: region || "ap-northeast-1",
});

export { buckets, region, s3, publicS3Domain };
