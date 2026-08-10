type CloseListener = (code: number | null) => void;
type ErrorListener = (error: Error) => void;

type FfmpegProcess = {
    kill(signal: NodeJS.Signals): boolean;
    once(event: "close", listener: CloseListener): void;
    once(event: "error", listener: ErrorListener): void;
    removeListener(event: "close", listener: CloseListener): void;
    removeListener(event: "error", listener: ErrorListener): void;
};

type Params = {
    ffmpeg: FfmpegProcess;
    timeoutMs: number;
    onClose: (code: number | null) => Promise<void>;
    onError: (error: Error) => Promise<void>;
    onTimeout: () => Promise<void>;
};

export const createFfmpegCompletionPromise = ({
    ffmpeg,
    timeoutMs,
    onClose,
    onError,
    onTimeout,
}: Params): Promise<void> => {
    let completionStarted = false;
    let timeout: NodeJS.Timeout;

    const completionPromise = new Promise<void>((resolve, reject) => {
        const finishOnce = (handler: () => Promise<void>): void => {
            if (completionStarted) return;

            completionStarted = true;
            clearTimeout(timeout);
            ffmpeg.removeListener("close", handleClose);
            ffmpeg.removeListener("error", handleError);
            void handler().then(resolve).catch(reject);
        };

        const handleClose = (code: number | null): void => {
            finishOnce(() => onClose(code));
        };

        const handleError = (error: Error): void => {
            finishOnce(() => onError(error));
        };

        ffmpeg.once("error", handleError);
        ffmpeg.once("close", handleClose);

        timeout = setTimeout(() => {
            finishOnce(async () => {
                ffmpeg.kill("SIGKILL");
                await onTimeout();
            });
        }, timeoutMs);
    });

    // getDurationの完了前に失敗しても、後続のawaitまで未処理rejectionにしない。
    void completionPromise.catch(() => undefined);

    return completionPromise;
};
