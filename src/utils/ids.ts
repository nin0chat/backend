export function generateID(): string {
    const time = Date.now();
    const randomlyGeneratedNumberOf5Digits = Math.floor(Math.random() * 100000);
    return `${time}.${randomlyGeneratedNumberOf5Digits}`;
}
