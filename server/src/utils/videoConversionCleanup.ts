import fs from "fs";

type Params = {
    originalFilePath: string;
    convertedDir: string;
};

export const cleanupVideoConversionFiles = ({ originalFilePath, convertedDir }: Params): void => {
    const cleanupErrors: unknown[] = [];

    try {
        fs.rmSync(originalFilePath, { force: true });
    } catch (error) {
        cleanupErrors.push(error);
    }

    try {
        fs.rmSync(convertedDir, { recursive: true, force: true });
    } catch (error) {
        cleanupErrors.push(error);
    }

    if (cleanupErrors.length > 0) {
        throw new AggregateError(cleanupErrors, "Failed to clean up video conversion files");
    }
};
