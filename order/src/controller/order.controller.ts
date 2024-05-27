import { Response } from "express";
import AuthRequest from "../dto/request.dto";
import OrderService from "../service/order.service";


class OrderController {
    constructor(private readonly orderService: OrderService) {}

    async create(req: AuthRequest, res: Response) {
        try {
            const order = await this.orderService.create(req.body.product_id, req.user.id);
            res.status(order.status).json(order.data);
        } catch (err) {
            res.status(500).json(err);
        }           
    }
}

export default OrderController;