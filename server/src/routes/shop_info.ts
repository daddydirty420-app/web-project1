import { Router } from "express";
import {
    shopInfoPostRootController,
    shopInfoPatchByIdRepNameController,
    shopInfoPatchByIdPhoneNumberController,
    shopInfoPatchByIdOptionController,
    shopInfoPatchByIdSignup3Controller,
    shopInfoPatchByIdSignup4Controller,
    shopInfoPatchByIdSignupEditController,
    shopInfoPatchByIdSignup5Controller,
    shopInfoGetMyController,
    shopInfoGetByIdAddressController,
    shopInfoGetByIdBankAccountController,
    shopInfoGetByIdRepNameController,
    shopInfoGetByIdConNameController,
    shopInfoGetByIdPhoneNumberController,
    shopInfoGetByIdCompanyNameController,
    shopInfoGetByIdOptionController,
    shopInfoGetByIdComFreeController,
    shopInfoGetSignup1Controller,
    shopInfoGetByIdSignup2Controller,
    shopInfoGetByIdSignup3Controller,
    shopInfoGetByIdSignup5Controller,
} from "../controllers/shop_info.js";
import { authenticateToken } from "../middleware/index.js";
import {
    createShopStep1RateLimit,
    getShopAddressRateLimit,
    getShopBankAccountRateLimit,
    getShopComFreeRateLimit,
    getShopCompanyNameRateLimit,
    getShopConNameRateLimit,
    getShopMeRateLimit,
    getShopOptionRateLimit,
    getShopPhoneNumberRateLimit,
    getShopRepNameRateLimit,
    getShopSignup1RateLimit,
    getShopSignup2RateLimit,
    getShopSignup3RateLimit,
    getShopSignup5RateLimit,
    shopOptionEditRateLimit,
    shopPhoneNumberEditRateLimit,
    shopRepNameEditRateLimit,
    shopSignup3RateLimit,
    shopSignup4RateLimit,
    shopSignup5EditRateLimit,
    shopSignup5RateLimit,
} from "../middleware/rateLimit/shopInfoRateLimit.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import {
    createSignup1BBodySchema,
    repNameBodySchema,
    shopIdCardBodySchema,
    shopOptionBodySchema,
} from "../validators/body/shopInfo.js";
import { phoneNumberBodySchema } from "../validators/body/users.js";
import { idParamSchema } from "../validators/params/id.js";

const router = Router();

// POST /shop-info
// summary: ShopInfo作成　事業者登録
// page: /shop-signup/step1
router.post(
    "/",
    authenticateToken,
    createShopStep1RateLimit,
    validateBody(createSignup1BBodySchema),
    shopInfoPostRootController,
);

// PATCH /shop-info/:id/rep-name
// summary 代表者氏名変更
// page: /edit/name/shop/rep-name/signup/[id]
router.patch(
    "/:id/rep-name",
    authenticateToken,
    shopRepNameEditRateLimit,
    validateParams(idParamSchema),
    validateBody(repNameBodySchema),
    shopInfoPatchByIdRepNameController,
);

// PATCH /shop-info/:id/phone-number
// summary: 電話番号変更
// page: /edit/phone-number/shop/[id]
router.patch(
    "/:id/phone-number",
    authenticateToken,
    shopPhoneNumberEditRateLimit,
    validateParams(idParamSchema),
    validateBody(phoneNumberBodySchema),
    shopInfoPatchByIdPhoneNumberController,
);

// PATCH /shop-info/:id/option
// summary: オプション変更
// page: /edit/shop/option/[id]
router.patch(
    "/:id/option",
    authenticateToken,
    shopOptionEditRateLimit,
    validateParams(idParamSchema),
    validateBody(shopOptionBodySchema),
    shopInfoPatchByIdOptionController,
);

// PATCH /shop-info/:id/signup/3
// summary: ショップ登録身分証・許認可証追加
// page: /shop-signup/step3/[id]
router.patch(
    "/:id/signup/3",
    authenticateToken,
    shopSignup3RateLimit,
    validateParams(idParamSchema),
    validateBody(shopIdCardBodySchema),
    shopInfoPatchByIdSignup3Controller,
);

// PATCH /shop-info/:id/signup/4
// summary: ショップ登録オプション選択
// page: /shop-signup/step4/[id]
router.patch(
    "/:id/signup/4",
    authenticateToken,
    shopSignup4RateLimit,
    validateParams(idParamSchema),
    validateBody(shopOptionBodySchema),
    shopInfoPatchByIdSignup4Controller,
);

// PATCH /shop-info/:id/signup/edit
// summary: ショップ登録確認ページ　インプット編集
// page: /shop-signup/step5/[id]
router.patch(
    "/:id/signup/edit",
    authenticateToken,
    shopSignup5EditRateLimit,
    validateParams(idParamSchema),
    shopInfoPatchByIdSignupEditController,
);

// PATCH /shop-info/:id/signup/5
// summary: ショップ登録　確定
// page: /shop-signup/step5/[id]
router.patch(
    "/:id/signup/5",
    authenticateToken,
    shopSignup5RateLimit,
    validateParams(idParamSchema),
    shopInfoPatchByIdSignup5Controller,
);

// GET /shop-info/my
// summary: ショップのidを取得
// page: /link/edit/shop
router.get(
    "/my",
    getShopMeRateLimit,
    authenticateToken,
    shopInfoGetMyController,
);

// GET /shop-info/:id/address
// summary: 会社所在地取得
// page: /edit/address/shop/[id]・/edit/address/shop/signup/[id]
router.get(
    "/:id/address",
    getShopAddressRateLimit,
    authenticateToken,
    validateParams(idParamSchema),
    shopInfoGetByIdAddressController,
);

// GET /shop-info/:id/bank-account
// summary: ショップ口座情報取得
// page: /edit/account/shop/[id]・/edit/account/shop/signup/[id]
router.get(
    "/:id/bank-account",
    getShopBankAccountRateLimit,
    authenticateToken,
    validateParams(idParamSchema),
    shopInfoGetByIdBankAccountController,
);

// GET /shop-info/:id/rep-name
// summary: 代表者氏名取得
// page: /edit/name/shop/rep-name/[id]・/edit/name/shop/rep-name/signup/[id]
router.get(
    "/:id/rep-name",
    getShopRepNameRateLimit,
    authenticateToken,
    validateParams(idParamSchema),
    shopInfoGetByIdRepNameController,
);

// GET /shop-info/:id/con-name
// summary: 担当者氏名取得
// page: /edit/name/shop/con-name/[id]・/edit/name/shop/con-name/signup/[id]
router.get(
    "/:id/con-name",
    getShopConNameRateLimit,
    authenticateToken,
    validateParams(idParamSchema),
    shopInfoGetByIdConNameController,
);

// GET /shop-info/:id/phone-number
// summary: 電話番号取得
// page: /edit/phone-number/shop/[id]
router.get(
    "/:id/phone-number",
    getShopPhoneNumberRateLimit,
    authenticateToken,
    validateParams(idParamSchema),
    shopInfoGetByIdPhoneNumberController,
);

// GET /shop-info/:id/company-name
// summary: 会社名取得
// page: /edit/shop/company-name/[id]
router.get(
    "/:id/company-name",
    getShopCompanyNameRateLimit,
    authenticateToken,
    validateParams(idParamSchema),
    shopInfoGetByIdCompanyNameController,
);

// GET /shop-info/:id/option
// summary: オプション取得
// page: /edit/shop/option/[id]
router.get(
    "/:id/option",
    getShopOptionRateLimit,
    authenticateToken,
    validateParams(idParamSchema),
    shopInfoGetByIdOptionController,
);

// GET /shop-info/:id/com-free
// summary: 事業形態取得
// page: /edit/shop/com-free/[id]
router.get(
    "/:id/com-free",
    getShopComFreeRateLimit,
    authenticateToken,
    validateParams(idParamSchema),
    shopInfoGetByIdComFreeController,
);

// GET /shop-info/signup/1
// summary: 事業者情報登録ページ　インプット表示データ取得
// page: /shop-signup/step1
router.get(
    "/signup/1",
    getShopSignup1RateLimit,
    authenticateToken,
    shopInfoGetSignup1Controller,
);

// GET /shop-info/:id/signup/2
// summary: ショップ口座登録ページ　インプット表示データ取得
// page: /shop-signup/step2/[id]
router.get(
    "/:id/signup/2",
    getShopSignup2RateLimit,
    authenticateToken,
    validateParams(idParamSchema),
    shopInfoGetByIdSignup2Controller,
);

// GET /shop-info/:id/signup/3
// summary: ショップ身分証登録ページ　インプット表示データ取得
// page: /shop-signup/step3/[id]
router.get(
    "/:id/signup/3",
    getShopSignup3RateLimit,
    authenticateToken,
    validateParams(idParamSchema),
    shopInfoGetByIdSignup3Controller,
);

// GET /shop-info/:id/signup/5
// summary: ショップ登録確認ページデータ取得
// page: /shop-signup/step5/[id]
router.get(
    "/:id/signup/5",
    getShopSignup5RateLimit,
    authenticateToken,
    validateParams(idParamSchema),
    shopInfoGetByIdSignup5Controller,
);

export default router;
