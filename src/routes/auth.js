import { Router } from "express";
import { config } from "dotenv";
import { isUserExist, login, signUp } from "../controllers/auth.controller.js";
import sendMail from "../utils/nodemailer.js";
import sendMessage from "../utils/twilio.js";
import { generateOTP, saveVerifiedUser, verifyOtp } from "../utils/otp.js";

const router = Router();
config();

router.post('/login', async (request, response) => {
    // Query.by = 'email' | 'phone_number'
    if (request.query.by === 'email' | request.query.by === 'phone_number') {
        // Body.email contains a valid email address

        try {
            const field = request.query.by;
            const value = request.body[request.query.by]
            const otp = await generateOTP(field, value);
            // console.log("first", value, otp);
            if (request.query.by === 'email') {
                sendMail(value, otp, response);
            }
            else if (request.query.by === 'phone_number') {
                sendMessage(value, otp, response);
            }
        }
        catch (error) {
            response.status(500).send({ status: false, error, message: error.message })
        }
    }
    else {
        response.status(500).send({ status: false, error: "Send the Query Correctly like, by = 'email' | 'phone_number'" })
    }
})

router.post('/verifyOtp', async (request, response) => {
    // Query.by = 'email' | 'phone_number'

    if (request.query.by === 'email' | request.query.by === 'phone_number') {
        // Body.email contains a valid email address and Body.otp contains 6 digit OTP
        // Body.verified Optional
        try {
            const field = request.query.by;
            const value = request.body[request.query.by]
            const otp = request.body.otp;
            // verify OTP
            if (await verifyOtp(field, value, otp)) {
                if (await isUserExist(field, value)) {
                    const token = await login(field, value);
                    response.status(200).send({ status: true, token })
                }
                else {
                    if (request.body.email && request.body.phone_number) {
                        let alreadyVerified = (request.query.by === 'email') ? 'phone_number' : (request.query.by === 'phone_number') && 'email'
                        signUp(request.body.email, request.body.phone_number, alreadyVerified, response);
                    }
                    else {
                        await saveVerifiedUser(field, value)
                        response.status(200).send({ status: true, message: `${field} is verified`, [field]: value });
                    }
                }
            }
            else {
                throw new Error('OTP Mismatched');
            }
        }
        catch (error) {
            response.status(500).send({ status: false, error, message: error.message })
        }
    }
    else {
        response.status(500).send({ status: false, error: "Send the Query Correctly like, by = 'email' | 'phone_number'" })
    }
})

// router.get('/getUser', (request, response) => {
//     const authHeader = request.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (token == null) {
//         response.status(401).send({ status: false, message: "Token Invalid" });
//     }
//     else {
//         jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, result) => {
//             if (err) {
//                 response.status(403).send({ status: false, message: "Token Expired" });
//             }
//             else {
//                 db.query(`select * from users where email = '${result.email}' and phone_number = '${result.phone_number}';`, (err, result) => {
//                     if (err) {
//                         response.status(500).send({ status: false, error: err });
//                     }
//                     else if (result.length === 0) {
//                         response.status(500).send({ status: false, message: "User Doesn't Exist" })
//                     }
//                     else {
//                         response.status(200).send({ status: true, user: result })
//                     }
//                 })
//             }
//         })
//     }
// })

export default router;