import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { IdCard } from "../models/index.js";

const router = Router();

export default router;