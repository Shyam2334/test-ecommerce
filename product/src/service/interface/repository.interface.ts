import Product from "../../domain/product.domain";

interface IProductRepository {
    findByName(name: string): Promise<Product | null>
    create(product: Product): Promise<Product>
}

export default IProductRepository;