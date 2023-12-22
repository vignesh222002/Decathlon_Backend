import { db } from "../db/index.js";
import jwt from "jsonwebtoken";

export async function isUserExist(field, value) {
    try {
        let [rows, columns] = await db.query(`select count(*) as user_exists from users where ${field} = '${value}'`)
        if (rows[0].user_exists > 0) {
            return true;
        }
        else return false
    }
    catch (error) {
        throw new Error(error);
    }
}

export async function login(field, value) {
    try {
        let [rows, columns] = await db.query(`SELECT phone_number, email FROM users where ${field} = '${value}';`);
        if (rows.length === 0) {
            throw new Error("User doesn't Exist")
        }
        else {
            const token = jwt.sign(
                rows[0],
                process.env.JWT_ACCESS_TOKEN,
                { expiresIn: '1d' }
            )
            return token;
        }
    }
    catch (error) {
        throw new Error(error);
    }
}