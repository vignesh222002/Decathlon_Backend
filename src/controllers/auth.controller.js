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

export async function generateOTP(field, value) {
    try {
        let otp = JSON.stringify(Math.floor(Math.random() * 1000000))
        while (otp.length != 6) otp = JSON.stringify(Math.floor(Math.random() * 1000000))
        await redisClient.setEx(`otp_${field}_${value}`, 30, otp)
        return otp;
    }
    catch (error) {
        throw new Error(error);
    }
}

export async function verifyOtp(field, value, otp) {
    try {
        const redisOtp = await redisClient.get(`otp_${field}_${value}`)
        return redisOtp == otp
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