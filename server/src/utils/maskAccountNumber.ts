type Params = {
    accountNumber: string;
};

export const maskAccountNumber = ({ accountNumber }: Params) => {
    return `***${accountNumber.slice(-4)}`;
};
