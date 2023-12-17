import express from "express";
import { config } from "dotenv";

const app = express();
app.use(express.json());
config();


app.listen(process.env.PORT, () => console.log(`Server listening in the Port ${process.env.PORT}`))