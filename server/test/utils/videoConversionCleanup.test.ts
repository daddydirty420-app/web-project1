import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { expect, test } from "vitest";
import { cleanupVideoConversionFiles } from "../../src/utils/videoConversionCleanup.js";

test("元動画と変換途中ディレクトリだけを削除する", () => {
    const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "video-conversion-cleanup-"));
    const originalFilePath = path.join(temporaryRoot, "original-video");
    const convertedDir = path.join(temporaryRoot, "converted-video");
    const unrelatedFilePath = path.join(temporaryRoot, "unrelated-video");

    fs.writeFileSync(originalFilePath, "original");
    fs.mkdirSync(convertedDir);
    fs.writeFileSync(path.join(convertedDir, "segment.ts"), "segment");
    fs.writeFileSync(unrelatedFilePath, "unrelated");

    try {
        cleanupVideoConversionFiles({ originalFilePath, convertedDir });

        expect(fs.existsSync(originalFilePath)).toBe(false);
        expect(fs.existsSync(convertedDir)).toBe(false);
        expect(fs.existsSync(unrelatedFilePath)).toBe(true);
    } finally {
        fs.rmSync(temporaryRoot, { recursive: true, force: true });
    }
});

test("cleanup対象が存在しない場合も正常終了する", () => {
    const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "video-conversion-cleanup-"));

    try {
        expect(() => {
            cleanupVideoConversionFiles({
                originalFilePath: path.join(temporaryRoot, "missing-original"),
                convertedDir: path.join(temporaryRoot, "missing-converted"),
            });
        }).not.toThrow();
    } finally {
        fs.rmSync(temporaryRoot, { recursive: true, force: true });
    }
});
