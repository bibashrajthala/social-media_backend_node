import express from "express";

import { registerUser } from "../Controllers/AuthController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("authroute is working");
});

router.post("/register", registerUser);

export default router;
