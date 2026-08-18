// チェックデジット検証関数
export const isValidCompanyNumber = (value: string): boolean => {
    if (!/^[0-9]{13}$/.test(value)) return false;

    const digits = value.split("").map(Number);
    const basicNumber = digits.slice(1); // 12桁の基礎番号

    // 右から数えて偶数桁の合計（インデックスは0始まりなので偶数が偶数桁）
    const evenSum = basicNumber.filter((_, i) => i % 2 === 0).reduce((acc, cur) => acc + cur, 0);

    // 右から数えて奇数桁の合計
    const oddSum = basicNumber.filter((_, i) => i % 2 === 1).reduce((acc, cur) => acc + cur, 0);

    const checkDigit = 9 - ((evenSum * 2 + oddSum) % 9);

    return digits[0] === checkDigit;
};
