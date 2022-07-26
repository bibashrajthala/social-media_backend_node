import express from "express";

import { registerUser, loginUser } from "../Controllers/AuthController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("authroute is working");
});

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
