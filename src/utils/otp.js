import redisClient from "../redis/index.js";

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