import express from 'express';
import OrderService from '../service/order.service';
import OrderController from '../controller/order.controller';
import verify from '../middleware/verify.middleware';
import Listener from '../channel/listener';
import Publisher from '../channel/publisher';
import OrderRepository from '../repository/order.repository';

const repository = new OrderRepository();
const listener = new Listener();
const publisher = new Publisher();
const service = new OrderService(repository, listener, publisher);
const controller = new OrderController(service);

const router = express.Router();

router.post("/api/order", verify, (req, res) => controller.create(req, res));

export default router;