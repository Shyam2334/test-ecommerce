import express from "express";
import UserRepository from "../repository/user.repository";
import HashPassword from "../utils/hash.util";
import UserService from "../service/user.service";
import UserController from "../controller/user.controller";
import Jwt from "../utils/jwt.util";

const repository = new UserRepository();
const hashPassword = new HashPassword();
const jwt = new Jwt();
const service = new UserService(repository, hashPassword, jwt);
const controller = new UserController(service);

const router = express.Router();

router.post("/api/user/register", (req, res) => controller.register(req, res));
router.post("/api/user/login", (req, res) => controller.login(req, res));
router.get("/api/user/get-user/:id", (req, res) => controller.getUserById(req, res));

export default router;
