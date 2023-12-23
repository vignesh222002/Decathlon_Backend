import { db } from "../db/index.js";
import jwt from "jsonwebtoken";
import redisClient from "../redis/index.js";

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

export async function signUp(email, phone_number, alreadyVerified, response) {
    try {
        let redisKey = (alreadyVerified === 'email')
            ? `verified_email_${email}`
            : (alreadyVerified === 'phone_number')
            && `verified_phone_number_${phone_number}`
        const redisValue = await redisClient.get(redisKey);
        if (redisValue === 'true') {
            // Register User in DB
            await db.query(`insert into users (phone_number, email) values ('${phone_number}', '${email}');`)
            const token = jwt.sign(
                { phone_number, email },
                process.env.JWT_ACCESS_TOKEN,
                { expiresIn: '1d' }
            )
            response.status(200).send({ status: true, phone_number, email, token });
        }
        else throw new Error('SignUp Process Failed, Retry');
    }
    catch (error) {
        throw new Error(error);
    }
}