import Listener from "../channel/listener";
import Publisher from "../channel/publisher";
import IOrderRepository from "./interface/repository.interface";

class OrderService {
    constructor(
        private readonly orderRepository: IOrderRepository,
        private readonly listener: Listener,
        private readonly publisher: Publisher
    ) {}

    async create(productId: string, userId: string) {
        await this.publisher.publish("order_event", "order_created", { productId, userId });

        const product = await new Promise<any>((resolve) => {
            this.listener.listen("product_event", "product_detail", ({ product }) => {
                this.orderRepository.create({ product, userId });
                resolve(product);
            });
        });

        // Create order
        return {
            status: 201,
            data: product
        }
    }
}

export default OrderService;