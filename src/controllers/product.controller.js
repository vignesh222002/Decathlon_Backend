import { db } from "../db/index.js";

export async function getAllCategory(request, response) {
    console.log("first");
    try {
        let [rows, columns] = await db.query(`
        select category, sub_category, product_category from category
            left join sub_category on category.id = sub_category.category_id
            left join product_category on sub_category.id = product_category.sub_category_id;
        `)
        console.log("Result", rows);
        response.status(200).send(rows);
    }
    catch (error) {
        response.status(500).send({ status: false, error, message: error.message })
    }
}