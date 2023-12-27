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

const data = [
    {
        "category": "sports",
        "sub_category": "cycling",
        "product_category": null
    },
    {
        "category": "sports",
        "sub_category": "water_sports",
        "product_category": "swiming"
    },
    {
        "category": "sports",
        "sub_category": "outdoor_sports",
        "product_category": "camping"
    },
    {
        "category": "men",
        "sub_category": "men's_footwear",
        "product_category": "mens slippers"
    },
    {
        "category": "men",
        "sub_category": "men's_footwear",
        "product_category": "men shoes"
    },
    {
        "category": "men",
        "sub_category": "men's_bottomwear",
        "product_category": "men shorts"
    },
    {
        "category": "men",
        "sub_category": "men's_topwear",
        "product_category": "men t-shirt"
    },
    {
        "category": "women",
        "sub_category": null,
        "product_category": null
    },
    {
        "category": "kids",
        "sub_category": null,
        "product_category": null
    }
]

let res = {};
// res = {
//     sports: {
//         cycling: null,
//         water_sports: ['swiming'],
//         outdoor_sports: ['camping']
//     },
//     women: null,
// }

data.map(item => {
    if (item.category && item.sub_category && item.product_category) {
        console.log("first", item.category, res[item.category])
        if (res[item.category]) {
            res[item.category] = {
                ...res[item.category],
                [item.sub_category]: new Array(item.product_category, ...res[item.category][item.sub_category])
            }
        }
        else {
            console.log("second", item.category, item.sub_category, res[item.category])
            res[item.category] = {
                ...res[item.category],
                [item.sub_category]: new Array(item.product_category)
            }
        }
    }
    // else if (item.category && item.sub_category && !item.product_category) {
    //     if (!res[item.category][item.sub_category]) {
    //         res[item.category] = item.sub_category;
    //     }
    //     else {
    //         res[item.category] = {
    //             [item.sub_category]: item.product_category
    //         }
    //     }
    // }
    // else if (item.category && !item.sub_category && !item.product_category) { }
})

console.log(res);