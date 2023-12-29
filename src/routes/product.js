import { Router } from "express";
import { getAllCategory, getProductList } from "../controllers/product.controller.js";
import { validateUser } from "../controllers/auth.controller.js";
import { query } from "express-validator";
import checkExpressValidation from '../utils/express-validator.js';

const router = Router();

router.get('/allCategory', [
    validateUser,
    getAllCategory
]);

router.get('/productList', [
    validateUser,
    query('productCategory').notEmpty().isNumeric(),
    checkExpressValidation,
    getProductList
]);

export default router;