import { AppError } from '../errors.js';

export function toNullableNumber(value: any): number | null {
    if (value === null || value === '') return null;
    const num = Number(value);
    if (Number.isNaN(num)) {
        throw new AppError('INVALID_NUMBER', 400);
    }
    return num;
}
