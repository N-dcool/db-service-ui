export function formatTime(seconds: number): string {
    if(seconds <= 0) return '00:00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return [h, m ,s].map((v) => String(v).padStart(2, '0')).join(':');
}

export function formatDate(isoString: string): string {
    return new Date(isoString).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}