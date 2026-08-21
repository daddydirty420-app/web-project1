import { EventEmitter } from "node:events";
import { expect, test } from "vitest";
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

        await expect(completion).rejects.toBe(expectedError);
        expect(callbacks.calls).toEqual({ close: 0, error: 1, timeout: 0 });
        expect(unhandledRejections).toEqual([]);
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
    await expect(completion).rejects.toThrow(/ffmpeg exited with code 1/);
    expect(callbacks.calls).toEqual({ close: 1, error: 0, timeout: 0 });
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
    expect(callbacks.calls).toEqual({ close: 1, error: 0, timeout: 0 });
});
