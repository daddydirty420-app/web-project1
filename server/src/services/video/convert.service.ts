import { bucket, s3, s3Domain } from "../../infra/aws/s3.js";
import { AppError } from "../../errors.js";
import { Video } from "../../models/index.js";
import fs from "fs";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { spawn } from "child_process";

type Params = {
    videoId: number;
    userId: number;
};

export const convertVideo = async ({ videoId, userId }: Params) => {
    const now = Date.now();

    // video取得
    const video = await Video.findByPk(videoId);
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
    
    const getObjectCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: originalKey,
    });
    
    const s3Object = await s3.send(getObjectCommand);
    const whiteStream = fs.createWriteStream(originalFilePath);

    await new Promise<void>((resolve, reject) => {
        (s3Object.Body as any)
        .pipe(whiteStream)
        .on("finish", resolve)
        .on("error", reject);
    });

    await video.update({ status: "processing" });
    
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
        await video.update({ status: "failed" });
    }, 5 * 60 * 1000); // 5分

    // 再生時間
    const ffprobe = spawn("ffprobe", [
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        originalFilePath
    ]);

    let durationOutput = "";

    ffprobe.stdout.on("data", (data) => {
        durationOutput += data.toString();
    });

    await new Promise<void>((resolve, reject) => {
        ffprobe.on("close", (code) => {
            if (code !== 0) {
                reject(new Error("ffprobe failed"));
            } else {
                resolve();
            }
        });
    });

    const seconds = Math.floor(parseFloat(durationOutput));
    
    await new Promise<void>((resolve, reject) => {
        ffmpeg.on("close", async (code) => {
            clearTimeout(timeout);
    
            if (code !== 0) {
                console.error(`ffmpeg exited with code ${code}`);
                await video.update({ status: 'failed' });
                return;
            }
    
            try {
                const files = fs.readdirSync(convertedDir);
    
                if (files.length === 0) {
                    throw new Error("HLSファイルが生成されていません");
                }
                
                for (const f of files) {
                    const filePath = `${convertedDir}/${f}`;
                        
                    const contentType = f.endsWith(".ts")
                    ? "video/mp2t"
                    : f.endsWith(".m3u8")
                    ? "application/vnd.apple.mpegurl"
                    : "application/octet-stream";
                        
                    const uploadParams = {
                        Bucket: bucket,
                        Key: `video/converted/${userId}/${videoId}/${f}`,
                        Body: fs.createReadStream(filePath),
                        ContentType: contentType,
                    };
    
                    await s3.send(new PutObjectCommand(uploadParams));
                }
    
                const convertedUrl = `${s3Domain}/video/converted/${userId}/${videoId}/${now}_index.m3u8`;
    
                await video.update({
                    status: 'done',
                    converted_url: convertedUrl,
                    duration: seconds,
                });
    
                // 後処理
                fs.rmSync(originalFilePath, { force: true });
                fs.rmSync(convertedDir, { recursive: true, force: true });
            } catch (e) {
                console.error(e);
                await video.update({ status: "failed" });
            }
        });
    });
};