import Listener from "../channel/listener";
import Publisher from "../channel/publisher";
import CreateProductDto from "../dto/create-product.dto";
import UpdateProductDto from "../dto/update-product.dto";
import IProductRepository from "./interface/repository.interface";

class ProductService {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly listener: Listener,
        private readonly publisher: Publisher,
    ) {
        this.consumeProductQueue();
    }

    async create(productDto: CreateProductDto) {
        const product = await this.productRepository.findByName(productDto.name)
        if (product) {
            return {
                status: 409,
                data: "Product already exists"
            }
        }

        const newProduct = await this.productRepository.create(productDto);
        return {
            status: 201,
            data: newProduct
        }
    }

    async update(id: string, productDto: UpdateProductDto) {
        const updatedProduct = await this.productRepository.update(id, productDto);
        if (!updatedProduct) {
            return {
                status: 404,
                data: "Product not found"
            }
        }
        
        return {
            status: 200,
            data: updatedProduct
        }
    }

    consumeProductQueue() {
        try {
            this.listener.listen("order_event", "order_created", async ({ productId }) => {
                const product = await this.productRepository.findById(productId);
                this.publisher.publish("product_event", "product_detail", { product })
            });
        } catch (err) {
            console.error(err);
        }
    }
}

export default ProductService;