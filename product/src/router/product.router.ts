import express from 'express';
import ProductRepository from '../repository/product.repository';
import ProductService from '../service/product.service';
import ProductController from '../controller/product.controller';
import adminVerify from '../middleware/admin-verify.middleware';

const router = express.Router();

const repository = new ProductRepository();
const service = new ProductService(repository);
const controller = new ProductController(service);

router.post("/api/product", adminVerify, (req, res) => controller.create(req, res))

export default router;