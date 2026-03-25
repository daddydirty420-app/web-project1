import createError from 'http-errors';
import express from 'express';
import type { Request, Response, NextFunction } from "express-serve-static-core";
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
import UsersMeItemsRouter from "./routes/users/me/items.js";
import authRouter from "./routes/auth.js";
import ItemRouter from "./routes/item.js";
import ItemsRouter from "./routes/items.js";
import ItemLikeRouter from "./routes/item_like.js";
import ItemListOldRouter from "./routes/item_list_old.js";
import ItemPageRouter from "./routes/item_page.js";
import ItemUploadRouter from "./routes/item_upload.js";
import AddressRouter from "./routes/address.js";
import BankAccountRouter from "./routes/bank_account.js";
import BlogRouter from "./routes/blog.js";
import CancelRouter from "./routes/cancel.js";
import CartRouter from "./routes/cart.js";
import ChatRouter from "./routes/chat.js";
import CommentLikeRouter from "./routes/comment-like.js";
import CommentRouter from "./routes/comment.js";
import DeliveryRouter from "./routes/delivery.js";
import FollowRouter from "./routes/follow.js";
import IdCardRouter from "./routes/id_card.js";
import InquiryRouter from "./routes/inquiry.js";
import JournalRouter from "./routes/journal.js";
import NameRouter from "./routes/name.js";
import NotificationRouter from "./routes/notification.js";
import OrdersRouter from "./routes/orders.js";
import PointsHistoryRouter from "./routes/points_history.js";
import PointsUriageOverRouter from "./routes/points_uriage_over.js";
import ReferenceCodeRouter from './routes/reference_code.js';
import ReportRouter from "./routes/report.js";
import SaleRouter from './routes/sale.js';
import SalesHistoryRouter from './routes/sales_history.js';
import SearchRouter from './routes/search.js';
import ShopInfoRouter from './routes/shop_info.js';
import ShopInfoEditRouter from './routes/shop_info_edit.js';
import ShopComFreeRouter from "./routes/shop-com-free.js";
import ShopSignupCreateRouter from "./routes/shop-signup-create.js";
import ShopSignupRouter from "./routes/shop-signup.js";
import StarHistoryRouter from './routes/star_history.js';
import SuggestWordsRouter from "./routes/suggest_words.js";
import TransferRouter from './routes/transfer.js';
import UriagekinHistoryRouter from './routes/uriagekin_history.js';
import UserEditRouter from "./routes/user-edit.js";
import VideoRouter from './routes/video.js';
import WatchHistoryRouter from './routes/watch_history.js';
import BlogAdminRouter from "./routes/admin/blog_admin.js";
import CommentAdminRouter from "./routes/admin/comment_admin.js";
import ItemAdminRouter from "./routes/admin/item_admin.js";
import ItemListAdminRouter from "./routes/admin/item_list_admin.js";
import ItemPageAdminRouter from "./routes/admin/item_page_admin.js";
import OrdersListAdminRouter from "./routes/admin/orders_list_admin.js";
import ReferenceCodeAdminRouter from './routes/admin/reference_code_admin.js';
import ReportAdminRouter from "./routes/admin/report.js";
import ShopInfoAdminRouter from "./routes/admin/shop_info_admin.js";
import TransferAdminRouter from "./routes/admin/transfer_admin.js";
import UserAdminRouter from './routes/admin/user_admin.js';
import TestRouter from "./routes/test.js";

import db from './models/index.js';
import { AppError } from './errors.js';
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

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_PROD,
  process.env.CLIENT_URL_DEV,
];

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use('/api/user', usersRouter);
app.use("/api/users/me/items", UsersMeItemsRouter);
app.use('/api/auth', authRouter);
app.use('/api/item', ItemRouter);
app.use('/api/items', ItemsRouter);
app.use('/api/item-like', ItemLikeRouter);
app.use('/api/item-list-old', ItemListOldRouter);
app.use('/api/item-page', ItemPageRouter);
app.use('/api/item-upload', ItemUploadRouter);
app.use('/api/address', AddressRouter);
app.use('/api/bank-account', BankAccountRouter);
app.use('/api/blog', BlogRouter);
app.use('/api/cancel', CancelRouter);
app.use('/api/cart', CartRouter);
app.use('/api/chat', ChatRouter);
app.use('/api/comment-like', CommentLikeRouter);
app.use('/api/comment', CommentRouter);
app.use('/api/delivery', DeliveryRouter);
app.use('/api/follow', FollowRouter);
app.use('/api/inquiry', InquiryRouter);
app.use('/api/journal', JournalRouter);
app.use('/api/name', NameRouter);
app.use('/api/notification', NotificationRouter);
app.use('/api/orders', OrdersRouter);
app.use('/api/personal-info', IdCardRouter);
app.use('/api/points-history', PointsHistoryRouter);
app.use('/api/points-uriage-over', PointsUriageOverRouter);
app.use('/api/reference-code', ReferenceCodeRouter);
app.use("/api/report", ReportRouter)
app.use('/api/sale', SaleRouter);
app.use('/api/sales-history', SalesHistoryRouter);
app.use('/api/search', SearchRouter);
app.use('/api/shop-info', ShopInfoRouter);
app.use('/api/shop-info-edit', ShopInfoEditRouter);
app.use("/api/shop-com-free", ShopComFreeRouter);
app.use("/api/shop-signup-create", ShopSignupCreateRouter);
app.use("/api/shop-signup", ShopSignupRouter);
app.use('/api/star-history', StarHistoryRouter);
app.use("/api/suggest-words", SuggestWordsRouter);
app.use('/api/transfer', TransferRouter);
app.use('/api/uriagekin-history', UriagekinHistoryRouter);
app.use("/api/user-edit", UserEditRouter);
app.use('/api/video', VideoRouter);
app.use('/api/watch-history', WatchHistoryRouter);
app.use("/api/blog-admin", BlogAdminRouter);
app.use("/api/comment-admin", CommentAdminRouter);
app.use('/api/item-admin', ItemAdminRouter);
app.use('/api/item-list-admin', ItemListAdminRouter);
app.use('/api/item-page-admin', ItemPageAdminRouter);
app.use("/api/orders-list-admin", OrdersListAdminRouter);
app.use('/api/reference-code-admin', ReferenceCodeAdminRouter);
app.use("/api/report-admin", ReportAdminRouter);
app.use('/api/shop-info-admin', ShopInfoAdminRouter);
app.use('/api/transfer-admin', TransferAdminRouter);
app.use('/api/user-admin', UserAdminRouter);
app.use("/api/test", TestRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.publicMessage ?? undefined
    });
  }

  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "サーバーエラーが発生しました",
  });
});

export default app;