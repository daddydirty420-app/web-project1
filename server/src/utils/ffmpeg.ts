import { spawn } from "child_process";

type DurationParams = {
    filePath: string;
};

export const getDuration = async ({ filePath }: DurationParams): Promise<number> => {
    const ffprobe = spawn("ffprobe", [
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        filePath
    ]);

    let durationOutput = "";
    ffprobe.stdout.on("data", (data) => {
        durationOutput += data.toString();
    });

    await new Promise<void>((resolve, reject) => {
        ffprobe.on("close", (code) => {
            code !== 0 ? reject(new Error("ffprobe failed")) : resolve();
        });
    });

    return Math.floor(parseFloat(durationOutput));
};