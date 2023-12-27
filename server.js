import express from "express";
import { config } from "dotenv";

// Router Imports
import authRouter from "./src/routes/auth.js";
import productRouter from "./src/routes/product.js";

const app = express();
app.use(express.json());
config();

app.use('/auth', authRouter);
app.use('/product', productRouter);

app.listen(process.env.PORT, () => console.log(`Server listening in the Port ${process.env.PORT}`));