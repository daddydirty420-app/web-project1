import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";
import process from "process";

import configFile from "../config/config.js";

import AccountTypeOptionModel from "./account_type_option.js";
import AddressModel from "./address.js";
import BankAccountModel from "./bank_account.js";
import BanksModel from "./banks.js";
import BlogCategoryOptionModel from "./blog_category_option.js";
import BlogModel from "./blog.js";
import BranchesModel from "./branches.js";
import BrandAliasesModel from "./brand_aliases.js";
import BrandsModel from "./brands.js";
import CancelFeeReturnOptionModel from "./cancel_fee_return_option.js";
import CancelModel from "./cancel.js";
import CartModel from "./cart.js";
import CategoriesModel from "./categories.js";
import ChatModel from "./chat.js";
import ComOrFreeOptionModel from "./com_or_free_option.js";
import CommentLikeModel from "./comment_like.js";
import CommentReportOptionModel from "./comment_report_option.js";
import CommentReportModel from "./comment_report.js";
import CommentModel from "./comment.js";
import DeliveryStatusOptionModel from "./delivery_status_option.js";
import DeliveryModel from "./delivery.js";
import FollowModel from "./follow.js";
import GenderOptionModel from "./gender_option.js";
import IdCardModel from "./id_card.js";
import InquiryModel from "./inquiry.js";
import ItemBuyerReportOptionModel from "./item_buyer_report_option.js";
import ItemBuyerReportModel from "./item_buyer_report.js";
import ItemConditionOptionModel from "./item_condition_option.js";
import ItemDeletedModel from "./item_deleted.js";
import ItemDeleteLogsModel from "./item_delete_logs.js";
import ItemLikeModel from "./item_like.js";
import ItemReportOptionModel from "./item_report_option.js";
import ItemReportModel from "./item_report.js";
import ItemShippingProfileModel from "./item_shipping_profile.js";
import ItemModel from "./item.js";
import JournalReasonOptionModel from "./journal_reason_option.js";
import JournalModel from "./journal.js";
import KanjyoOptionModel from "./kanjyo_option.js";
import NameModel from "./name.js";
import NotificationModel from "./notification.js";
import OrderDeletedSystemsModel from "./order_deleted.js";
import OrdersModel from "./orders.js";
import PaymentMethodOptionModel from "./payment_method_option.js";
import PointConversionLogsModel from "./point_conversion_logs.js";
import PointsHistoryModel from "./points_history.js";
import PointsUriageOverModel from "./points_uriage_over.js";
import ReferenceCodeModel from "./reference_code.js";
import RefreshTokensModel from "./refresh_tokens.js";
import SaleModel from "./sale.js";
import SalesHistoryModel from "./sales_history.js";
import SearchModel from "./search.js";
import SearchWordsModel from "./search_words.js";
import ShippingDayOptionModel from "./shipping_day_option.js";
import ShippingServiceOptionModel from "./shipping_service_option.js";
import ShopInfoEditModel from "./shop_info_edit.js";
import ShopInfoModel from "./shop_info.js";
import StarHistoryModel from "./star_history.js";
import SuggestWordsModel from "./suggest_words.js";
import TodouhukenOptionModel from "./todouhuken_option.js";
import TokenEmailChangeModel from "./token_email_change.js";
import TokenPasswordResetModel from "./token_password_reset.js";
import TokenSignupVerificationModel from "./token_signup_verification.js";
import TransReasonOptionModel from "./trans_reason_option.js";
import TransfarModel from "./transfar.js";
import UriagekinHistoryModel from "./uriagekin_history.js";
import UserModel from "./user.js";
import UserDeleteLogsModel from "./user_delete_logs.js";
import VideoModel from "./video.js";
import WatchHistoryModel from "./watch_history.js";

const env = (process.env.NODE_ENV as "development" | "test" | "production") || "development";
const config = (configFile as any)[env];

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(
    config.database as string,
    config.username as string,
    config.password as string,
    config
  );
}

// モデルを読み込む
const db: any = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.AccountTypeOption = AccountTypeOptionModel;
db.Address = AddressModel;
db.BankAccount = BankAccountModel;
db.Banks = BanksModel;
db.BlogCategoryOption = BlogCategoryOptionModel;
db.Blog = BlogModel;
db.Branches = BranchesModel;
db.BrandAliases = BrandAliasesModel;
db.Brands = BrandsModel;
db.CancelFeeReturnOption = CancelFeeReturnOptionModel;
db.Cancel = CancelModel;
db.Cart = CartModel;
db.Categories = CategoriesModel;
db.Chat = ChatModel;
db.ComOrFreeOption = ComOrFreeOptionModel;
db.CommentLike = CommentLikeModel;
db.CommentReportOption = CommentReportOptionModel;
db.CommentReport = CommentReportModel;
db.Comment = CommentModel;
db.DeliveryStatusOption = DeliveryStatusOptionModel;
db.Delivery = DeliveryModel;
db.Follow = FollowModel;
db.GenderOption = GenderOptionModel;
db.IdCard = IdCardModel;
db.Inquiry = InquiryModel;
db.ItemBuyerReportOption = ItemBuyerReportOptionModel;
db.ItemBuyerReport = ItemBuyerReportModel;
db.ItemConditionOption = ItemConditionOptionModel;
db.ItemDeleted = ItemDeletedModel;
db.ItemDeleteLogs = ItemDeleteLogsModel;
db.ItemLike = ItemLikeModel;
db.ItemReportOption = ItemReportOptionModel;
db.ItemReport = ItemReportModel;
db.ItemShippingProfile = ItemShippingProfileModel;
db.Item = ItemModel;
db.JournalReasonOption = JournalReasonOptionModel;
db.Journal = JournalModel;
db.KanjyoOption = KanjyoOptionModel;
db.Name = NameModel;
db.Notification = NotificationModel;
db.OrderDeletedSystems = OrderDeletedSystemsModel;
db.Orders = OrdersModel;
db.PaymentMethodOption = PaymentMethodOptionModel;
db.PointConversionLogs = PointConversionLogsModel;
db.PointsHistory = PointsHistoryModel;
db.PointsUriageOver = PointsUriageOverModel;
db.ReferenceCode = ReferenceCodeModel;
db.RefreshTokens = RefreshTokensModel;
db.Sale = SaleModel;
db.SalesHistory = SalesHistoryModel;
db.Search = SearchModel;
db.SearchWords = SearchWordsModel;
db.ShippingDayOption = ShippingDayOptionModel;
db.ShippingServiceOption = ShippingServiceOptionModel;
db.ShopInfoEdit = ShopInfoEditModel;
db.ShopInfo = ShopInfoModel;
db.StarHistory = StarHistoryModel;
db.SuggestWords = SuggestWordsModel;
db.TodouhukenOption = TodouhukenOptionModel;
db.TokenEmailChange = TokenEmailChangeModel;
db.TokenPasswordReset = TokenPasswordResetModel;
db.TokenSignupVerification = TokenSignupVerificationModel;
db.TransReasonOption = TransReasonOptionModel;
db.Transfar = TransfarModel;
db.UriagekinHistory = UriagekinHistoryModel;
db.User = UserModel; 
db.UserDeleteLogs = UserDeleteLogsModel;
db.Video = VideoModel;
db.WatchHistory = WatchHistoryModel;

// リレーションを設定
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export const { AccountTypeOption, Address, BankAccount, Banks, BlogCategoryOption, Blog, Branches, BrandAliases, Brands, CancelFeeReturnOption, Cancel, Cart, Categories, Chat, ComOrFreeOption, CommentLike, CommentReportOption, CommentReport, Comment, DeliveryStatusOption, Delivery, Follow, GenderOption, IdCard, Inquiry, ItemBuyerReportOption, ItemBuyerReport, ItemConditionOption, ItemDeleted, ItemLike, ItemReportOption, ItemReport, ItemShippingProfile, Item, ItemDeleteLogs, JournalReasonOption, Journal, KanjyoOption, Name, Notification, OrderDeleted, Orders, PaymentMethodOption, PointConversionLogs, PointsHistory, PointsUriageOver, ReferenceCode, RefreshTokens, Sale, SalesHistory, Search, SearchWords, ShippingDayOption, ShippingServiceOption, ShopInfoEdit, ShopInfo, StarHistory, SuggestWords, TodouhukenOption, TokenEmailChange, TokenPasswordReset, TokenSignupVerification, TransReasonOption, Transfar, UriagekinHistory, User, UserDeleteLogs, Video, WatchHistory } = db;
export default db;
