import { spawn } from "child_process";
import crypto from "crypto";
import fs from "fs";
import { AppError } from "../../errors.js";
import { s3Domain } from "../../infra/aws/s3.js";
import { getVideo, updateStatus } from "../../services/video.js";
import { getDuration } from "../../utils/ffmpeg.js";
import { downloadVideoFromS3, uploadVideoToS3 } from "../../utils/s3/index.js";

type Params = {
    videoId: number;
    userId: number;
};

// PATCH /video/:id/convert
// summary: 動画HLS変換
// page: /upload
export const convertVideoUseCase = async ({ videoId, userId }: Params) => {
    const now = Date.now();
    const tempId = crypto.randomUUID();

    // video取得
    const video = await getVideo({ videoId });
    if (!video) {
        throw new AppError("VIDEO_NOT_FOUND", 404);
    }

    const originalUrl = video.original_url;
    if (!originalUrl) {
        throw new AppError("ORIGINAL_URL_NOT_FOUND", 400);
    }

    const originalKey = originalUrl.replace(`${s3Domain}/`, "");

    // 一時保存先
    const originalFilePath = `tmp/original_${videoId}_${now}_${tempId}`;
    const convertedDir = `tmp/converted_${videoId}_${now}_${tempId}`;

    fs.mkdirSync("tmp", { recursive: true });

    await downloadVideoFromS3({ key: originalKey, filePath: originalFilePath });

    await updateStatus({ video, data: { status: "processing" } });

    // 変換ディレクトリ作成
    fs.mkdirSync(convertedDir, { recursive: true });

    // ffmpegでHLS変換
    const ffmpeg = spawn("ffmpeg", [
        "-y", // ← 追加（既存ファイルを上書き）
        "-i",
        originalFilePath,
        "-map",
        "0:v:0", // ← 追加（動画トラックを明示）
        "-map",
        "0:a:0?", // ← 追加（音声はあれば使う）
        "-profile:v",
        "baseline",
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-vf",
        "scale='min(1280,iw)':-2",
        "-level",
        "3.0",
        "-start_number",
        "0",
        "-hls_time",
        "10",
        "-hls_playlist_type",
        "vod",
        "-hls_segment_filename",
        `${convertedDir}/${now}_${tempId}_seg_%03d.ts`, // ← 追加（名前が綺麗）
        "-f",
        "hls",
        `${convertedDir}/${now}_${tempId}_index.m3u8`,
    ]);

    ffmpeg.stderr.on("data", (data) => {
        console.log(data.toString());
    });

    const timeout = setTimeout(async () => {
        console.error("ffmpeg timeout");
        ffmpeg.kill("SIGKILL");

        await updateStatus({ video, data: { status: "failed" } });
    }, 5 * 60 * 1000); // 5分

    // 再生時間
    let seconds: number = 0;
    try {
        seconds = await getDuration({ filePath: originalFilePath });
    } catch (err) {
        console.error(err);
    }

    await new Promise<void>((resolve, reject) => {
        ffmpeg.on("close", async (code) => {
            clearTimeout(timeout);

            if (code !== 0) {
                console.error(`ffmpeg exited with code ${code}`);
                await updateStatus({ video, data: { status: "failed" } });
                return reject(new AppError(`ffmpeg exited with code ${code}`, 422));
            }

            try {
                // HLSファイル生成
                const files = fs.readdirSync(convertedDir);

                const hasPlaylist = files.some((f) => f.endsWith(".m3u8"));
                if (!hasPlaylist) {
                    return reject(new AppError("playlist not generated", 422));
                }

                // HLSファイルS3アップロード
                for (const f of files) {
                    const filePath = `${convertedDir}/${f}`;
                    const key = `video/converted/${userId}/${videoId}/${f}`;

                    const contentType = f.endsWith(".ts")
                        ? "video/mp2t"
                        : f.endsWith(".m3u8")
                        ? "application/vnd.apple.mpegurl"
                        : "application/octet-stream";

                    await uploadVideoToS3({ filePath, key, contentType });
                }

                const convertedUrl = `${s3Domain}/video/converted/${userId}/${videoId}/${now}_${tempId}_index.m3u8`;

                // video更新
                if (video.status === "processing") {
                    await updateStatus({
                        video,
                        data: {
                            status: "done",
                            converted_url: convertedUrl,
                            duration: seconds,
                        },
                    });
                }

                // 後処理
                fs.rmSync(originalFilePath, { force: true });
                fs.rmSync(convertedDir, { recursive: true, force: true });

                resolve();
            } catch (e) {
                console.error(e);
                await updateStatus({ video, data: { status: "failed" } });
                reject(new AppError("server error", 500));
            } finally {
                fs.rmSync(originalFilePath, { force: true });
                fs.rmSync(convertedDir, { recursive: true, force: true });
            }
        });

        ffmpeg.on("error", (err) => {
            reject(err);
        });
    });
};
