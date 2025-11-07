import { S3Client, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION || "ap-northeast-1" });
const BUCKET = process.env.AWS_BUCKET || "flexoutdoor";

async function moveToGlacier(url: string, userId: number): Promise<string | null> {
    if (!url) return null;

    const key = url.split(".amazonaws.com/")[1];
    if (!key) throw new Error(`S3キーを抽出できませんでした: ${url}`);

    const timestamp = Date.now();
    const archiveKey = `archive/${userId}/${timestamp}_${key.split("/").pop()}`;

    await s3.send(
        new CopyObjectCommand({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${key}`,
            Key: archiveKey,
            StorageClass: "GLACIER",
        })
    );

    await s3.send(
        new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: key,
        })
    );

    return `https://${BUCKET}.s3.amazonaws.com/${archiveKey}`;
};

export default moveToGlacier;