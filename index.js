import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import AuthRoute from "./Routes/AuthRoute.js";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

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

app.use("/auth", AuthRoute);

export default app;
