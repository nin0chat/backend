export const history: any[] = [];

export function saveMessageToHistory(message: any) {
    history.push(message);
    if (history.length > 100) {
        history.shift();
    }
}
