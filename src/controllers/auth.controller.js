import { db } from "../db/index.js";
import jwt from "jsonwebtoken";

export async function login(purpose, field) {
    try {
        let [rows, columns] = await db.query(`SELECT phone_number, email FROM users where ${purpose} = '${field}';`);
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