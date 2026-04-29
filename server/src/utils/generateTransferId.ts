import crypto from "crypto";
import { getTransferIdExistingOne } from "../services/transfer.js";

export const generateTransferId = async (): Promise<string> => {
    for (let i = 0; i < 5; i++) {
        const id = crypto.randomBytes(11).toString("hex");
        const existing = await getTransferIdExistingOne({ id });
        if (!existing) return id;
    }
    throw new Error("Failed to generate unique transfer_id after 5 attempts.");
};
