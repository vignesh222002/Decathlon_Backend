import express from "express";
import { config } from "dotenv";

// Router Imports
import authRouter from "./src/routes/auth.js";

const app = express();
app.use(express.json());
config();

app.use('/auth', authRouter);

app.listen(process.env.PORT, () => console.log(`Server listening in the Port ${process.env.PORT}`));