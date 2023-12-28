import { Router } from "express";
import { getAllCategory } from "../controllers/product.controller.js";
import { validateUser } from "../controllers/auth.controller.js";

const router = Router();

router.get('/allCategory', validateUser, getAllCategory)

export default router;