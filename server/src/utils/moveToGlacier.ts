import { s3Domain } from "../infra/aws/s3.js";
import { copyCmdS3 } from "./s3/copyCmd.js";
import { deleteCmdS3 } from "./s3/deleteCmd.js";

type Params = {
    userId: number;
    url: string;
};

export const moveToGlacier = async ({ userId, url }: Params) => {
    if (!url) return null;

    const key = url.split(".amazonaws.com/")[1];
    if (!key) throw new Error(`S3キーを抽出できませんでした: ${url}`);

    const now = Date.now();
    const archiveKey = `archive/${userId}/${now}_${key.split("/").pop()}`;

    await copyCmdS3({ key, archiveKey });

    await deleteCmdS3({ key });

    return `${s3Domain}/${archiveKey}`;
};

export default moveToGlacier;
