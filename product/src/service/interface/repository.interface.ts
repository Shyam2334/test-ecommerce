import Product from "../../domain/product.domain";

interface IProductRepository {
    findByName(name: string): Promise<Product | null>
    findById(id: string): Promise<Product | null>
    create(product: Product): Promise<Product>
    update(id: string, product: Partial<Product>): Promise<Product | null>
}

export default IProductRepository;