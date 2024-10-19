export function generateID(): string {
    return (((BigInt(Date.now()) - 1729373102932n) << 22n) | (1n << 17n) | (1n << 12n) | 0n)
        .toString()
        .padStart(18, "0");
}
