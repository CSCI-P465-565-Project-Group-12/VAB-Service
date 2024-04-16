import express, { Express } from "express";
import cors from "cors";
import router from "./routes";
import dotenv from "dotenv";
import { Stripe } from 'stripe';
dotenv.config();

const app: Express = express();
const port: number = 8081;
export const jwtSecret: string = process.env.JWT_SECRET as string;
export const mailUrl = process.env.MAIL_URL as string;
export const userUrl = process.env.USER_URL as string;
export const stripe = new Stripe( process.env.STRIPE_SECRET_KEY as string);
// export const mailUrl = "http://localhost:8082"
// export const userUrl = "http://localhost:8080"

app.use(express.json({ limit: '50mb' }));
app.use(express.json());
app.use(express.urlencoded({
	extended: true,
}));

app.use(cors());

app.use(router);

app.listen(port, (): void => {
	console.log(`Server is running: ${port}`);
});
