type TaskTarget = Record<string, number | string | null>;

type Params = {
    taskName: string;
    target: TaskTarget;
    task: () => Promise<void>;
};

export const runDetachedTask = ({ taskName, target, task }: Params): void => {
    void Promise.resolve()
        .then(task)
        .catch((error: unknown) => {
            console.error("Detached task failed", { taskName, target, error });
        });
};
