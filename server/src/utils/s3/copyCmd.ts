import { CopyObjectCommand } from "@aws-sdk/client-s3";
import { buckets, s3 } from "../../infra/aws/s3.js";

type Params = {
    key: string;
    archiveKey: string;
};

export const copyCmdS3 = async ({ key, archiveKey }: Params) => {
    const bucket = buckets.public;
    
    await s3.send(
        new CopyObjectCommand({
            Bucket: bucket,
            CopySource: `${bucket}/${key}`,
            Key: archiveKey,
            StorageClass: "GLACIER",
        }),
    );
};
