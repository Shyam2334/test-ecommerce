import Order from "../domain/order.domain";
import OrderModel from "../model/order.model";
import IOrderRepository from "../service/interface/repository.interface";

class OrderRepository implements IOrderRepository {
    async create(order: Order) {
        const newOrder = new OrderModel(order)
        await newOrder.save();
        return newOrder;
    }
}

export default OrderRepository;