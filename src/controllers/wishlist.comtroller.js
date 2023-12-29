import jwt from "jsonwebtoken";
import { db } from "../db/index.js";

export async function getWishlistProducts(request, response) {
    try {
        const authToken = request.headers['authorization'];
        const token = authToken ? authToken.split(" ")[1] : null;

        jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, result) => {
            let [rows, columns] = await db.query(`
                select * from decathlon.product as p
                inner join decathlon.wishlist as w on w.product_id = p.id and w.user_id = ${result.id}
            `)

            response.status(200).send({ status: 200, data: rows });
        })
    }
    catch (error) {
        response.status(500).send({ status: false, error, message: error.message });
    }
}