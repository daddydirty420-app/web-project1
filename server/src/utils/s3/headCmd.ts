import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { buckets, s3 } from "../../infra/aws/s3.js";

type Params = {
    key: string;
};

export const headCmdS3 = async ({ key }: Params) => {
    await s3.send(
        new HeadObjectCommand({
            Bucket: buckets.public,
            Key: key,
        }),
    );
};
