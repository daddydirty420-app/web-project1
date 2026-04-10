import { s3Domain } from "../../infra/aws/s3.js";
import { AppError } from "../../errors.js";
import fs from "fs";
import { spawn } from "child_process";
import { getVideo, updateStatus } from "../../services/video.js";
import { downloadVideoFromS3, uploadVideoToS3 } from "../../utils/s3/index.js";
import { getDuration } from "../../utils/ffmpeg.js";

type Params = {
    videoId: number;
    userId: number;
};

export const convertVideoUseCase = async ({ videoId, userId }: Params) => {
    const now = Date.now();

    // video取得
    const video = await getVideo({ videoId });
    if (!video) {
        throw new AppError("VIDEO_NOT_FOUND", 404);
    }

    const originalUrl = video.original_url;
    if (!originalUrl) {
        throw new AppError("ORIGINAL_URL_NOT_FOUND", 400);
    }

    const originalKey = originalUrl.replace(`${s3Domain}/`, '');
    
    // 拡張子を抽出
    let ext = originalKey.split('.').pop();
    if (!["mp4", "mov", "webm", "mkv"].includes(ext)) {
        ext = "mp4"; // 最終フォールバック
    }
    
    // 一時保存先
    const originalFilePath = `tmp/original_${videoId}_${now}.${ext}`;
    const convertedDir = `tmp/converted_${videoId}_${now}`;
    
    fs.mkdirSync("tmp", { recursive: true });
    
    await downloadVideoFromS3({ key: originalKey, filePath: originalFilePath });

    updateStatus({ video, data: { status: "processing" } }).catch((err) => {
        console.error("service video updateStatus error:", err);
    });
    
    // 変換ディレクトリ作成
    fs.mkdirSync(convertedDir, { recursive: true });
    
    // ffmpegでHLS変換
    const ffmpeg = spawn("ffmpeg", [
        "-y",                       // ← 追加（既存ファイルを上書き）
        "-i", originalFilePath,
        "-map", "0:v:0",            // ← 追加（動画トラックを明示）
        "-map", "0:a:0?",           // ← 追加（音声はあれば使う）
        "-profile:v", "baseline",
        "-level", "3.0",
        "-start_number", "0",
        "-hls_time", "10",
        "-hls_playlist_type", "vod",
        "-hls_segment_filename", `${convertedDir}/${now}_seg_%03d.ts`, // ← 追加（名前が綺麗）
        "-f", "hls",
        `${convertedDir}/${now}_index.m3u8`
    ]);
    
    const timeout = setTimeout(async () => {
        console.error("ffmpeg timeout");
        ffmpeg.kill("SIGKILL");
        updateStatus({ video, data: { status: "failed" } }).catch((err) => {
            console.error("service video updateStatus error:", err);
        });
    }, 5 * 60 * 1000); // 5分

    // 再生時間
    const seconds = await getDuration({ filePath: originalFilePath });
    
    await new Promise<void>((resolve, reject) => {
        ffmpeg.on("close", async (code) => {
            clearTimeout(timeout);
    
            if (code !== 0) {
                console.error(`ffmpeg exited with code ${code}`);
                updateStatus({ video, data: { status: "failed" } }).catch((err) => {
                    console.error("service video updateStatus error:", err);
                });
                return;
            }
    
            try {
                const files = fs.readdirSync(convertedDir);
    
                if (files.length === 0) {
                    throw new Error("HLSファイルが生成されていません");
                }
                
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
    
                const convertedUrl = `${s3Domain}/video/converted/${userId}/${videoId}/${now}_index.m3u8`;
    
                updateStatus({ video, data: {
                    status: "done",
                    converted_url: convertedUrl,
                    duration: seconds,
                } }).catch((err) => {
                    console.error("service video updateStatus error:", err);
                });
    
                // 後処理
                fs.rmSync(originalFilePath, { force: true });
                fs.rmSync(convertedDir, { recursive: true, force: true });
            } catch (e) {
                console.error(e);
                updateStatus({ video, data: { status: "failed" } }).catch((err) => {
                    console.error("service video updateStatus error:", err);
                });
            }
        });
    });
};