import Product from "../domain/product.domain";
import { ProductModel } from "../model/product.model";
import IProductRepository from "../service/interface/repository.interface";

class ProductRepository implements IProductRepository {
    async create(product: Product) {
        const newProduct = new ProductModel(product);
        await newProduct.save();
        return newProduct;
    }

    async findByName(name: string) {
        return await ProductModel.findOne({ name });
    }
}

export default ProductRepository;