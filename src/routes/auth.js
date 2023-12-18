import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { config } from "dotenv";
import { login } from "../controllers/auth.controller.js";

const router = Router();
config();

router.post('/login', async (request, response) => {
    // Query.by = 'email' | 'phone_number'

    if (request.query.by === 'email' | request.query.by === 'phone_number') {
        // Body.email contains a valid email address
        try {
            const token = await login(request.query.by, request.body[request.query.by])
            response.status(200).send({ status: true, token })
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