import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../middleware/index.js";

const router = Router();

export default router;
