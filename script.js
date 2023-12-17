import express from "express";
import { config } from "dotenv";
import authRouter from "./src/routes/auth.js";
import { db } from "./src/db/index.js";

const app = express();
app.use(express.json());
config();

app.use('/auth', authRouter);

db.connect((err) => {
    if (err) {
        console.log("Mysql connection error", err);
    }
    else {
        console.log("Mysql connected Sucessfully")
    }
});

app.listen(process.env.PORT, () => console.log(`Server listening in the Port ${process.env.PORT}`));