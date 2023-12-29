import { validationResult } from "express-validator";

export default function checkExpressValidation(request, response, next) {
    try {
        const validator = validationResult(request);
        if (validator.isEmpty()) {
            next();
        }
        else {
            response.status(500).send({ status: false, error: validator.array(), message: "Express Validation Error" });
        }
    }
    catch (error) {
        response.status(500).send({ status: false, error, message: error.message });
    }
}