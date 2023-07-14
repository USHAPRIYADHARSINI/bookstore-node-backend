import express from "express"; // "type": "module"
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import booksRouter from './routes/books.routes.js';
import addtocartRouter from './routes/addtocart.routes.js';
import paymentRouter from './routes/payment.routes.js';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

const client = new MongoClient(MONGO_URL); // phone dial
// top-level await

await client.connect(); // call button
console.log("Mongo is connected ✌️😊");

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.use("/users", userRouter);
app.use("/books", booksRouter);
app.use("/users/cart", addtocartRouter);
app.use("/payment", paymentRouter);

app.listen(PORT, () => console.log("server started on port : ", PORT));

export { client };
