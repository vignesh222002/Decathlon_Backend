import { Router } from "express";
import { getAllCategory } from "../controllers/product.controller.js";

const router = Router();

router.get('/allCategory', getAllCategory)


export default router;