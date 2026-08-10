import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { createFfmpegCompletionPromise } from "../../src/utils/ffmpegCompletion.js";

class FakeFfmpeg extends EventEmitter {
    killCount = 0;

    kill(): boolean {
        this.killCount += 1;
        return true;
    }
}

const createCallbacks = () => {
    const calls = { close: 0, error: 0, timeout: 0 };

    return {
        calls,
        onClose: async () => {
            calls.close += 1;
        },
        onError: async (error: Error) => {
            calls.error += 1;
            throw error;
        },
        onTimeout: async () => {
            calls.timeout += 1;
        },
    };
};

test("getDuration相当の待機中にerrorが発生しても一度だけrejectする", async () => {
    const ffmpeg = new FakeFfmpeg();
    const callbacks = createCallbacks();
    const unhandledRejections: unknown[] = [];
    const handleUnhandledRejection = (error: unknown) => unhandledRejections.push(error);
    process.on("unhandledRejection", handleUnhandledRejection);

    try {
        const completion = createFfmpegCompletionPromise({
            ffmpeg,
            timeoutMs: 1_000,
            ...callbacks,
        });
        const expectedError = new Error("spawn failed");

        ffmpeg.emit("error", expectedError);
        ffmpeg.emit("close", 1);
        await new Promise((resolve) => setImmediate(resolve));

        await assert.rejects(completion, expectedError);
        assert.deepEqual(callbacks.calls, { close: 0, error: 1, timeout: 0 });
        assert.deepEqual(unhandledRejections, []);
    } finally {
        process.removeListener("unhandledRejection", handleUnhandledRejection);
    }
});

test("getDuration相当の待機中に非ゼロcloseが発生してもsettleする", async () => {
    const ffmpeg = new FakeFfmpeg();
    const callbacks = createCallbacks();
    callbacks.onClose = async (code?: number | null) => {
        callbacks.calls.close += 1;
        throw new Error(`ffmpeg exited with code ${code}`);
    };

    const completion = createFfmpegCompletionPromise({
        ffmpeg,
        timeoutMs: 1_000,
        ...callbacks,
    });

    ffmpeg.emit("close", 1);
    await assert.rejects(completion, /ffmpeg exited with code 1/);
    assert.deepEqual(callbacks.calls, { close: 1, error: 0, timeout: 0 });
});

test("正常終了ではclose処理を一度だけ実行してresolveする", async () => {
    const ffmpeg = new FakeFfmpeg();
    const callbacks = createCallbacks();
    const completion = createFfmpegCompletionPromise({
        ffmpeg,
        timeoutMs: 1_000,
        ...callbacks,
    });

    ffmpeg.emit("close", 0);
    ffmpeg.emit("close", 0);

    await completion;
    assert.deepEqual(callbacks.calls, { close: 1, error: 0, timeout: 0 });
});
