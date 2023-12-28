import { db } from "../db/index.js";

export async function getAllCategory(request, resultponse) {
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
        resultponse.status(200).send(result);
    }
    catch (error) {
        resultponse.status(500).send({ status: false, error, message: error.message })
    }
}