import { config } from "dotenv";
import nodemailer from 'nodemailer';

config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_APP_PASSWORD,
    }
})

function sendMail(toMail, otp, response) {
    console.log("Email", to, otp);
    const mailContent = {
        from: process.env.SENDER_EMAIL,
        to: toMail,
        subject: 'OTP Verification',
        html: `
            <h1>Hello World!</h1>
            <p>Here is your Decathlon OTP ${otp}</p>
        `
    }

    transporter.sendMail(mailContent, (error, data) => {
        if (error) {
            throw new Error(error)
        }
        else {
            response.status(200).send({ status: true, message: "Otp sent to your email", mailId: toMail });
        }
    })
}

export default sendMail;