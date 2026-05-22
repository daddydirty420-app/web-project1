import { apiFetchServer } from "../../../../lib/api/server";
import { BankAccount } from "../../type";

type AccountPageResponse = {
    data: BankAccount;
};

export const fetchAccountPage = async (): Promise<AccountPageResponse> => {
    return apiFetchServer("/bank-account/myaccount", {
        cache: "no-store",
    });
};
