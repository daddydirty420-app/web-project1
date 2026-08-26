import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { buckets, s3 } from "../../infra/aws/s3.js";

type Params = {
    key: string;
};

export const deleteCmdS3 = async ({ key }: Params) => {
    const deleteCmd = new DeleteObjectCommand({
        Bucket: buckets.public,
        Key: key,
    });

    await s3.send(deleteCmd);
};
