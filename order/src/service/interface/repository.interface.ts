import Order from "../../domain/order.domain";

interface IOrderRepository {
    create(order: Order): Promise<Order>
}

export default IOrderRepository;