import express, { Express } from "express";
import cors from "cors";
import router from "./routes";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const port: number = 8081;
export const jwtSecret: string = process.env.JWT_SECRET as string;

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
