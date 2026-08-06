import { s3Domain } from "../infra/aws/s3.js";
import { deleteCmdS3 } from "./s3/deleteCmd.js";
import { copyCmdS3, headCmdS3 } from "./s3/index.js";

type Params = {
    userId: number;
    url: string;
};

export const moveToGlacier = async ({ userId, url }: Params) => {
    if (!url) return null;

    const key = url.split(".amazonaws.com/")[1];
    if (!key) throw new Error(`S3キーを抽出できませんでした: ${url}`);

    try {
        await headCmdS3({ key });
    } catch {
        console.warn(`S3にファイルが存在しないためスキップ: ${key}`);
        return null;
    }

    const now = Date.now();
    const archiveKey = `archive/${userId}/${now}_${key.split("/").pop()}`;

    await copyCmdS3({ key: encodeURIComponent(key), archiveKey });

    await deleteCmdS3({ key });

    return `${s3Domain}/${archiveKey}`;
};
