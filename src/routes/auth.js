import { Router } from "express";
import jwt from "jsonwebtoken";
import { db } from "../db/index.js";
import { config } from "dotenv";

const router = Router();
config();

router.post('/login', (request, response) => {
    // Query.by = 'email' | 'phone'

    if (request.query.by === 'email') {
        // Body.email contains a valid email address

        db.query(`SELECT phone_number, email FROM users where email = '${request.body.email}';`, (err, result) => {
            if (err) {
                response.status(500).send({ status: false, error: err });
            }
            else if (result.length === 0) {
                response.status(500).send({ status: false, message: "Email Doesn't Exist" })
            }
            else {
                const token = jwt.sign(
                    { email: result[0].email, phone_number: result[0].phone_number },
                    process.env.JWT_ACCESS_TOKEN,
                    { expiresIn: '1d' }
                )
                response.status(200).send({ status: true, token })
            }
        });
    }
})

router.get('/getUser', (request, response) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        response.status(401).send({ status: false, message: "Token Invalid" });
    }
    else {
        jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, result) => {
            if (err) {
                response.status(403).send({ status: false, message: "Token Expired" });
            }
            else {
                db.query(`select * from users where email = '${result.email}' and phone_number = '${result.phone_number}';`, (err, result) => {
                    if (err) {
                        response.status(500).send({ status: false, error: err });
                    }
                    else if (result.length === 0) {
                        response.status(500).send({ status: false, message: "User Doesn't Exist" })
                    }
                    else {
                        response.status(200).send({ status: true, user: result })
                    }
                })
            }
        })
    }
})

export default router;