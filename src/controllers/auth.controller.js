import { db } from "../db/index.js";
import jwt from "jsonwebtoken";
import redisClient from "../redis/index.js";

export async function validateUser(request, response, next) {
    try {
        const authToken = request.headers['authorization'];
        const token = authToken ? authToken.split(" ")[1] : null;

        if (!token) {
            response.status(401).send({ status: false, message: "Token Invalid" });
        }
        else {
            jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, result) => {
                if (err) {
                    response.status(403).send({ status: false, message: "Token Expired" })
                }
                else {
                    let [rows, colums] = await db.query(`select count(*) as user from users where id = '${result.id}' and email = '${result.email}' and phone_number = '${result.phone_number}';`)
                    if (rows[0].user > 0) {
                        next();
                    }
                    else {
                        throw new Error("User Doesn't Exist")
                    }
                }
            })
        }
    }
    catch (error) {
        response.status(500).send({ status: false, error, message: error.message });
    }
}

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
        let [rows, columns] = await db.query(`SELECT id, phone_number, email FROM users where ${field} = '${value}';`);
        if (rows.length === 0) {
            throw new Error("User doesn't Exist")
        }
        else {
            const token = jwt.sign(
                rows[0],
                process.env.JWT_ACCESS_TOKEN,
                { expiresIn: '10d' }
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
                { expiresIn: '10d' }
            )
            response.status(200).send({ status: true, phone_number, email, token });
        }
        else throw new Error('SignUp Process Failed, Retry');
    }
    catch (error) {
        throw new Error(error);
    }
}