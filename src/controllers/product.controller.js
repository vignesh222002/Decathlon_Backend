import jwt from "jsonwebtoken";
import { db } from "../db/index.js";

export async function getAllCategory(request, response) {
    try {
        let [rows, columns] = await db.query(`
                select category, sub_category, product_category, product_category.id as id from category
                left join sub_category on category.id = sub_category.category_id
                left join product_category on sub_category.id = product_category.sub_category_id;
            `)

        let result = {};
        rows.map(item => {
            const { category, sub_category, product_category, id } = item;

            if (category) {
                result[category] = {
                    ...result[category]
                };
            }

            if (sub_category) {
                result[category] = {
                    ...result[category],
                    [sub_category]: result[category][sub_category] ? [...result[category][sub_category]] : []
                }
            }

            if (product_category) {
                result[category] = {
                    ...result[category],
                    [sub_category]: [{ id, category: product_category }, ...result[category][sub_category]]
                }
            }
        })
        response.status(200).send(result);
    }
    catch (error) {
        response.status(500).send({ status: false, error, message: error.message });
    }
}

export async function getProductList(request, response) {
    try {
        const authToken = request.headers['authorization'];
        const token = authToken ? authToken.split(" ")[1] : null;

        jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, result) => {
            let [rows, columns] = await db.query(`
                select p.id, p.product_brand, p.product_name, p.original_price, p.warranty, p.discount, w.id is not null as wishlist,
                case
                    when count(s.source > 0) then json_arrayagg(s.source)
                    else json_array()
                end as source
                from decathlon.product as p
                left join decathlon.source as s on p.id = s.product_id
                left join decathlon.wishlist as w on w.product_id = p.id and w.user_id = ${result.id}
                where p.product_category_id = ${request.query.productCategory}
                group by p.id, w.id;
            `)

            let data = rows.map(item => ({
                ...item,
                wishlist: Boolean(item.wishlist),
            }))

            response.status(200).send({ status: true, productCategory: +(request.query.productCategory), userId: result.id, data });
        })
    } catch (error) {
        response.status(500).send({ status: false, error, message: error.message });
    }
}

export async function getProduct(request, response) {
    try {
        const authToken = request.headers['authorization'];
        const token = authToken ? authToken.split(" ")[1] : null;

        jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, result) => {
            let [rows, columns] = await db.query(`
                select p.id, p.product_brand, p.product_name, p.original_price, p.warranty, p.discount, w.id is not null as wishlist,
                case
                    when count(s.source > 0) then json_arrayagg(s.source)
                    else json_array()
                end as source
                from decathlon.product as p
                left join decathlon.source as s on p.id = s.product_id
                left join decathlon.wishlist as w on p.id = w.product_id and w.user_id = ${result.id}
                where p.id = ${request.query.productId}
                group by w.id;
            `)

            let data = rows.map(item => ({
                ...item,
                wishlist: Boolean(item.wishlist),
            }))

            response.status(200).send({ status: true, userId: result.id, data })
        })
    }
    catch (error) {
        response.status(500).send({ status: false, error, message: error.message });
    }
}