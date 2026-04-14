import { createOutputData } from "../../services/referenceCode.js";
import { generateRandomReferenceCode } from "../../utils/generateReferenceCode.js";

type Params = {
    userId: number;
};

export const outputReferenceCodeUseCase = async ({ userId }: Params) => {
    // 紹介コード生成
    const output = generateRandomReferenceCode();

    await createOutputData({
        data: {
            output,
            output_user_id: userId,
        },
    });

    return output;
};