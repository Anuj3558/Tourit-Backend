import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectToMongoDb from "./connection.js";
import userRouter from "./router/userRouter.js";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = 8000;


connectToMongoDb("mongodb://mongo:fKgvTUbgUARhONDaESjTpHxgDwQiojHh@viaduct.proxy.rlwy.net:29219");


app.use(cors({
  origin: 'https://66af9b2738c4bfbde052d861--jazzy-shortbread-d30904.netlify.app', // Your frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true // This is crucial for handling credentials
}));

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


app.use("/", userRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.listen(port, () => console.log(`Listening at port ${port}`));
