import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import { startAllCrons } from './cron/index.js';
startAllCrons();

dotenv.config();

const app = express();

import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import ItemsRouter from "./routes/item.js";
import ItemListRouter from "./routes/item_list.js";
import ItemPageRouter from "./routes/item_page.js";
import ItemUploadRouter from "./routes/item_upload.js";
import AddressRouter from "./routes/address.js";
import BankAccountRouter from "./routes/bank_account.js";
import BlogRouter from "./routes/blog.js";
import CancelRouter from "./routes/cancel.js";
import CartRouter from "./routes/cart.js";
import CategoryRouter from "./routes/category.js";
import ChatRouter from "./routes/chat.js";
import ColorSizeRouter from "./routes/color_size.js";
import CommentReportRouter from "./routes/comment_report.js";
import CommentRouter from "./routes/comment.js";
import DeliveryRouter from "./routes/delivery.js";
import FollowRouter from "./routes/follow.js";
import GoodCommentRouter from "./routes/good_comment.js";
import GoodItemRouter from "./routes/good_item.js";
import IdCardRouter from "./routes/id_card.js";
import InquiryRouter from "./routes/inquiry.js";
import ItemBuyerReportRouter from "./routes/item_buyer_report.js";
import ItemReportRouter from "./routes/item_report.js";
import JournalRouter from "./routes/journal.js";
import NameRouter from "./routes/name.js";
import NotificationRouter from "./routes/notification.js";
import PaidInfoRouter from "./routes/paid_info.js";
import PaidItemListRouter from "./routes/paid_item_list.js";
import PointsHistoryRouter from "./routes/points_history.js";
import PointsUriageOverRouter from "./routes/points_uriage_over.js"
import ReccomendItemRouter from './routes/reccomend_item.js';
import ReccomendMonthRouter from './routes/reccomend_month.js';
import ReccomendPaidInfoRouter from './routes/reccomend_paid_info.js';
import ReferenceCodeRouter from './routes/reference_code.js';
import SaleRouter from './routes/sale.js';
import SalesHistoryRouter from './routes/sales_history.js';
import SearchRouter from './routes/search.js';
import ShopInfoRouter from './routes/shop_info.js';
import ShopInfoEditRouter from './routes/shop_info_edit.js';
import ShopSignupRouter from "./routes/shop-signup.js";
import StarHistoryRouter from './routes/star_history.js';
import SuggestWordsRouter from "./routes/suggest_words.js";
import TransfarRouter from './routes/transfar.js';
import UriagekinHistoryRouter from './routes/uriagekin_history.js';
import UserEditRouter from "./routes/user-edit.js";
import VideoRouter from './routes/video.js';
import WatchHistoryRouter from './routes/watch_history.js';
import BlogAdminRouter from "./routes/admin/blog_admin.js";
import CommentAdminRouter from "./routes/admin/comment_admin.js";
import ItemAdminRouter from "./routes/admin/item_admin.js";
import ItemListAdminRouter from "./routes/admin/item_list_admin.js";
import ItemPageAdminRouter from "./routes/admin/item_page_admin.js";
import ItemReportAdminRouter from "./routes/admin/item_report_admin.js";
import PaidListAdminRouter from "./routes/admin/paid_list_admin.js";
import ReferenceCodeAdminRouter from './routes/admin/reference_code_admin.js';
import ShopInfoAdminRouter from "./routes/admin/shop_info_admin.js";
import TransfarAdminRouter from "./routes/admin/transfar_admin.js";
import UserAdminRouter from './routes/admin/user_admin.js';

import db from './models/index.js';
db.sequelize.sync();

// view engine setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var session_opt = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }
};
app.use(session(session_opt));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:3000",
    /\.vercel\.app$/,
    "https://web-project1-fawn.vercel.app",
    "https://app.fuckintesting.com",
    "https://api.fuckintesting.com",
  ],
  credentials: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


app.use('/api/user', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/item', ItemsRouter);
app.use('/api/item-list', ItemListRouter);
app.use('/api/item-page', ItemPageRouter);
app.use('/api/item-upload', ItemUploadRouter);
app.use('/api/address', AddressRouter);
app.use('/api/bank-account', BankAccountRouter);
app.use('/api/blog', BlogRouter);
app.use('/api/cancel', CancelRouter);
app.use('/api/cart', CartRouter);
app.use('/api/category', CategoryRouter);
app.use('/api/chat', ChatRouter);
app.use('/api/color-size', ColorSizeRouter);
app.use('/api/comment-report', CommentReportRouter);
app.use('/api/comment', CommentRouter);
app.use('/api/delivery', DeliveryRouter);
app.use('/api/follow', FollowRouter);
app.use('/api/good-comment', GoodCommentRouter);
app.use('/api/good-item', GoodItemRouter);
app.use('/api/inquiry', InquiryRouter);
app.use('/api/item-buyer-report', ItemBuyerReportRouter);
app.use('/api/item-report', ItemReportRouter);
app.use('/api/journal', JournalRouter);
app.use('/api/name', NameRouter);
app.use('/api/notification', NotificationRouter);
app.use('/api/paid-info', PaidInfoRouter);
app.use("/api/paid-item-list", PaidItemListRouter);
app.use('/api/personal-info', IdCardRouter);
app.use('/api/points-history', PointsHistoryRouter);
app.use('/api/points-uriage-over', PointsUriageOverRouter);
app.use('/api/reccomend-item', ReccomendItemRouter);
app.use('/api/reccomend-month', ReccomendMonthRouter);
app.use('/api/reccomend-paid-info', ReccomendPaidInfoRouter);
app.use('/api/reference-code', ReferenceCodeRouter);
app.use('/api/sale', SaleRouter);
app.use('/api/sales-history', SalesHistoryRouter);
app.use('/api/search', SearchRouter);
app.use('/api/shop-info', ShopInfoRouter);
app.use('/api/shop-info-edit', ShopInfoEditRouter);
app.use("/api/shop-signup", ShopSignupRouter);
app.use('/api/star-history', StarHistoryRouter);
app.use("/api/suggest-words", SuggestWordsRouter);
app.use('/api/transfar', TransfarRouter);
app.use('/api/uriagekin-history', UriagekinHistoryRouter);
app.use("/api/user-edit", UserEditRouter);
app.use('/api/video', VideoRouter);
app.use('/api/watch-history', WatchHistoryRouter);
app.use("/api/blog-admin", BlogAdminRouter);
app.use("/api/comment-admin", CommentAdminRouter);
app.use('/api/item-admin', ItemAdminRouter);
app.use('/api/item-list-admin', ItemListAdminRouter);
app.use('/api/item-page-admin', ItemPageAdminRouter);
app.use('/api/item-report-admin', ItemReportAdminRouter);
app.use("/api/paid-list-admin", PaidListAdminRouter);
app.use('/api/reference-code-admin', ReferenceCodeAdminRouter);
app.use('/api/shop-info-admin', ShopInfoAdminRouter);
app.use('/api/transfar-admin', TransfarAdminRouter);
app.use('/api/user-admin', UserAdminRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.send({ error: err.message });
});

export default app;