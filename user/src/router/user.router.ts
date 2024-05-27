import express from "express";
import UserRepository from "../repository/user.repository";
import HashPassword from "../utils/hash.util";
import UserService from "../service/user.service";
import UserController from "../controller/user.controller";

const repository = new UserRepository();
const hashPassword = new HashPassword();
const service = new UserService(repository, hashPassword);
const controller = new UserController(service);

const router = express.Router();

router.post("/api/user/register", (req, res) => controller.register(req, res));

export default router;
