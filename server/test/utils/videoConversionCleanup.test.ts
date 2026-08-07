import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
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

        assert.equal(fs.existsSync(originalFilePath), false);
        assert.equal(fs.existsSync(convertedDir), false);
        assert.equal(fs.existsSync(unrelatedFilePath), true);
    } finally {
        fs.rmSync(temporaryRoot, { recursive: true, force: true });
    }
});

test("cleanup対象が存在しない場合も正常終了する", () => {
    const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "video-conversion-cleanup-"));

    try {
        assert.doesNotThrow(() => {
            cleanupVideoConversionFiles({
                originalFilePath: path.join(temporaryRoot, "missing-original"),
                convertedDir: path.join(temporaryRoot, "missing-converted"),
            });
        });
    } finally {
        fs.rmSync(temporaryRoot, { recursive: true, force: true });
    }
});
