import { Router, Request, Response } from "express";
import { Op } from "sequelize";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { IdCard } from "../models/index.js";

const router = Router();

export default router;