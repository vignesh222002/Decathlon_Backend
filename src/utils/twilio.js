import twilio from "twilio";
import { config } from "dotenv";

config();

const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilio(accountSID, authToken);

function sendMessage(to, otp, response) {
    twilioClient.messages.create({
        body: `Hi, Here is your Decathlon OTP ${otp}`,
        to,
        from: twilioPhoneNumber,
    })
        .then((res) => response.status(200).send({ status: true, message: "Otp sent to your Phone Number", phone_number: to }))
        .catch((error) => { throw new Error(error) })
}