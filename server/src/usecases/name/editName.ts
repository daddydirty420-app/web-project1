import { AppError } from "../../errors.js";
import { getName, updateName } from "../../services/name.js";

type Params = {
    nameId: number;
    sei: string;
    mei: string;
    seiKana: string;
    meiKana: string;
};

// PATCH /name/:id
// summary: 氏名変更
// page: /edit/name
export const editNameUseCase = async ({ nameId, sei, mei, seiKana, meiKana }: Params) => {
    // name取得
    const name = await getName({ nameId });

    if (!name) throw new AppError("NAME_NOT_FOUND", 404);

    // db更新
    await updateName({
        name,
        data: {
            sei,
            mei,
            sei_kana: seiKana,
            mei_kana: meiKana,
        },
    });
};
