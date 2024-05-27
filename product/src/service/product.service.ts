import CreateProductDto from "../dto/create-product.dto";
import IProductRepository from "./interface/repository.interface";

class ProductService {
    constructor(private readonly productRepository: IProductRepository) {}

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
}

export default ProductService;