import express from "express";
import colors from "colors";
import ConnectDB from "./config/db.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import { errorListening } from "./middlewares/error.js";
import postRoute from "./routes/postRoute.js";
import userRoute from "./routes/userRoute.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(cookieParser());

//configuration env file
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

//database configuration
ConnectDB();

app.get("/", (req, res) => {
  res.send("<h1>API is running....</h1>");
});

//routes
app.use("/api/v1", postRoute);
app.use("/api/v1", userRoute);
//img load in browser
app.use("/gallery", express.static("public/gallery"));

//errorHandling
app.use(errorListening);
//server listening(PORT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running at port : http://localhost:${PORT}`.cyan.underline.bold
  );
});
