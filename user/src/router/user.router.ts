import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello from user router\n");
});

export default router;
