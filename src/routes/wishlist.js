import Router from "express";
import { validateUser } from "../controllers/auth.controller.js";
import { getWishlistProducts } from "../controllers/wishlist.comtroller.js";

const router = Router();

router.get('/', [
    validateUser,
    getWishlistProducts
])

export default router;