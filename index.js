import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// routes
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";
import UploadRoute from "./Routes/UploadRoute.js";

const app = express();

// middleware to take data form body ie. from user
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// to allow cross origin resources to interact,(to allow frontend url to interact with backend url)
app.use(express.json());
app.use(cors());

// to serve images inside public/images folder to frontend in /images path
app.use(express.static("public"));
app.use("/images", express.static("images"));

dotenv.config();

const port = process.env.PORT;

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(port, (req, res) => {
      console.log(`Listening to port ${port}`);
    })
  )
  .catch((error) => console.log(error));

app.get("/", (_, res) => {
  res.send("Sever is running");
});

// use routes
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/post", PostRoute);
app.use("/upload", UploadRoute);

export default app;
