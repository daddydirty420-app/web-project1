import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";
import { fileURLToPath } from "url";

import configFile from "../config/config.js";

import AccountTypeOptionModel from "./account_type_option.js";
import AddressModel from "./address.js";
import BankAccountModel from "./bank_account.js";
import BanksModel from "./banks.js";
import BlogCategoryOptionModel from "./blog_category_option.js";
import BlogModel from "./blog.js";
import BranchesModel from "./branches.js";
import CancelFeeReturnOptionModel from "./cancel_fee_return_option.js";
import CancelModel from "./cancel.js";
import CartModel from "./cart.js";
import CategoryCampOptionModel from "./category_camp_option.js";
import CategoryHikeOptionModel from "./category_hike_option.js";
import CategoryOtherOptionModel from "./category_other_option.js";
import CategoryWearOptionModel from "./category_wear_option.js";
import CategoryModel from "./category.js";
import ChatModel from "./chat.js";
import ColorSizeModel from "./color_size.js";
import ComOrFreeOptionModel from "./com_or_free_option.js";
import CommentReportOptionModel from "./comment_report_option.js";
import CommentReportModel from "./comment_report.js";
import CommentModel from "./comment.js";
import DeletedItemsModel from "./deletedItems.js";
import DeletedOrderSystemsModel from "./deletedordersystem.js";
import DeliveryStatusOptionModel from "./delivery_status_option.js";
import DeliveryModel from "./delivery.js";
import EmailChangeTokensModel from "./emailchangetoken.js";
import FollowModel from "./follow.js";
import GenderOptionModel from "./gender_option.js";
import GoodCommentModel from "./good_comment.js";
import GoodItemModel from "./good_item.js";
import IdCardModel from "./id_card.js";
import InquiryModel from "./inquiry.js";
import ItemBuyerReportOptionModel from "./item_buyer_report_option.js";
import ItemBuyerReportModel from "./item_buyer_report.js";
import ItemCategory1OptionModel from "./item_category1_option.js";
import ItemConditionOptionModel from "./item_condition_option.js";
import ItemReportOptionModel from "./item_report_option.js";
import ItemReportModel from "./item_report.js";
import ItemModel from "./item.js";
import ItemDeleteLogsModel from "./itemdeletelog.js";
import JournalReasonOptionModel from "./journal_reason_option.js";
import JournalModel from "./journal.js";
import KanjyoOptionModel from "./kanjyo_option.js";
import NameModel from "./name.js";
import NotificationModel from "./notification.js";
import PaidInfoModel from "./paid_info.js";
import PasswordResetTokensModel from "./passwordresettoken.js";
import PaymentMethodOptionModel from "./payment_method_option.js";
import PointConversionLogsModel from "./pointconversionlog.js";
import PointsHistoryModel from "./points_history.js";
import PointsUriageOverModel from "./points_uriage_over.js";
import ReccomendItemModel from "./reccomend_item.js";
import ReccomendMonthModel from "./reccomend_month.js";
import ReccomendPaidInfoModel from "./reccomend_paid_info.js";
import ReferenceCodeModel from "./reference_code.js";
import RefreshTokensModel from "./refreshtoken.js";
import SaleModel from "./sale.js";
import SalesHistoryModel from "./sales_history.js";
import SearchModel from "./search.js";
import SearchWordsModel from "./searchword.js";
import ShippingDayOptionModel from "./shipping_day_option.js";
import ShippingServiceOptionModel from "./shipping_service_option.js";
import ShopInfoEditModel from "./shop_info_edit.js";
import ShopInfoModel from "./shop_info.js";
import SignupVerificationTokensModel from "./signupverificationtoken.js";
import SizeOptionModel from "./size_option.js";
import SizeShoesOptionModel from "./size_shoes_option.js";
import SizeWearOptionModel from "./size_wear_option.js";
import StarHistoryModel from "./star_history.js";
import SuggestWordsModel from "./suggestword.js";
import TodouhukenOptionModel from "./todouhuken_option.js";
import TransReasonOptionModel from "./trans_reason_option.js";
import TransfarModel from "./transfar.js";
import UriagekinHistoryModel from "./uriagekin_history.js";
import UserModel from "./user.js";
import UserDeleteLogsModel from "./userdeletelog.js";
import VideoModel from "./video.js";
import WatchHistoryModel from "./watch_history.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
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
db.CancelFeeReturnOption = CancelFeeReturnOptionModel;
db.Cancel = CancelModel;
db.Cart = CartModel;
db.CategoryCampOption = CategoryCampOptionModel;
db.CategoryHikeOption = CategoryHikeOptionModel;
db.CategoryOtherOption = CategoryOtherOptionModel;
db.CategoryWearOption = CategoryWearOptionModel;
db.Category = CategoryModel;
db.Chat = ChatModel;
db.ColorSize = ColorSizeModel;
db.ComOrFreeOption = ComOrFreeOptionModel;
db.CommentReportOption = CommentReportOptionModel;
db.CommentReport = CommentReportModel;
db.Comment = CommentModel;
db.DeletedItems = DeletedItemsModel;
db.DeletedOrderSystems = DeletedOrderSystemsModel;
db.DeliveryStatusOption = DeliveryStatusOptionModel;
db.Delivery = DeliveryModel;
db.EmailChangeTokens = EmailChangeTokensModel;
db.Follow = FollowModel;
db.GenderOption = GenderOptionModel;
db.GoodComment = GoodCommentModel;
db.GoodItem = GoodItemModel;
db.IdCard = IdCardModel;
db.Inquiry = InquiryModel;
db.ItemBuyerReportOption = ItemBuyerReportOptionModel;
db.ItemBuyerReport = ItemBuyerReportModel;
db.ItemCategory1Option = ItemCategory1OptionModel;
db.ItemConditionOption = ItemConditionOptionModel;
db.ItemReportOption = ItemReportOptionModel;
db.ItemReport = ItemReportModel;
db.Item = ItemModel;
db.ItemDeleteLogs = ItemDeleteLogsModel;
db.JournalReasonOption = JournalReasonOptionModel;
db.Journal = JournalModel;
db.KanjyoOption = KanjyoOptionModel;
db.Name = NameModel;
db.Notification = NotificationModel;
db.PaidInfo = PaidInfoModel;
db.PasswordResetTokens = PasswordResetTokensModel;
db.PaymentMethodOption = PaymentMethodOptionModel;
db.PointConversionLogs = PointConversionLogsModel;
db.PointsHistory = PointsHistoryModel;
db.PointsUriageOver = PointsUriageOverModel;
db.ReccomendItem = ReccomendItemModel;
db.ReccomendMonth = ReccomendMonthModel;
db.ReccomendPaidInfo = ReccomendPaidInfoModel;
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
db.SignupVerificationTokens = SignupVerificationTokensModel;
db.SizeOption = SizeOptionModel;
db.SizeShoesOption = SizeShoesOptionModel;
db.SizeWearOption = SizeWearOptionModel;
db.StarHistory = StarHistoryModel;
db.SuggestWords = SuggestWordsModel;
db.TodouhukenOption = TodouhukenOptionModel;
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

export const { AccountTypeOption, Address, BankAccount, Banks, BlogCategoryOption, Blog, Branches, CancelFeeReturnOption, Cancel, Cart, CategoryCampOption, CategoryHikeOption, CategoryOtherOption, CategoryWearOption, Category, Chat, ColorSize, ComOrFreeOption, CommentReportOption, CommentReport, Comment, DeletedItems, DeletedOrderSystems, DeliveryStatusOption, Delivery, EmailChangeTokens, Follow, GenderOption, GoodComment, GoodItem, IdCard, Inquiry, ItemBuyerReportOption, ItemBuyerReport, ItemCategory1Option, ItemConditionOption, ItemReportOption, ItemReport, Item, ItemDeleteLogs, JournalReasonOption, Journal, KanjyoOption, Name, Notification, PaidInfo, PasswordResetTokens, PaymentMethodOption, PointConversionLogs, PointsHistory, PointsUriageOver, ReccomendItem, ReccomendMonth, ReccomendPaidInfo, ReferenceCode, RefreshTokens, Sale, SalesHistory, Search, SearchWords, ShippingDayOption, ShippingServiceOption, ShopInfoEdit, ShopInfo, SignupVerificationTokens, SizeOption, SizeShoesOption, SizeWearOption, StarHistory, SuggestWords, TodouhukenOption, TransReasonOption, Transfar, UriagekinHistory, User, UserDeleteLogs, Video, WatchHistory } = db;
export default db;
