export function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const d = typeof date === 'string' ? new Date(date) : date;
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay >= 1 && diffDay <= 7) {
        return `${diffDay}日前`;
    } else if (diffDay < 1) {
        if (diffHour >= 1) {
            return `${diffHour}時間前`;
        } else if (diffMin >= 1) {
            return `${diffMin}分前`;
        } else {
            return '1分前';
        }
    } else {
        return d.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    }
}
