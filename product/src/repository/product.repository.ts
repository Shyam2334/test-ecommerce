import Product from "../domain/product.domain";
import { ProductModel } from "../model/product.model";
import IProductRepository from "../service/interface/repository.interface";

class ProductRepository implements IProductRepository {
    async create(product: Product) {
        const newProduct = new ProductModel(product);
        await newProduct.save();
        return newProduct;
    }

    async update(id: string, product: Partial<Product>) {
        const updatedProduct = await ProductModel.findOneAndUpdate({ _id: id }, product, { new: true });
        return updatedProduct;
    }

    async findByName(name: string) {
        return await ProductModel.findOne({ name });
    }

    async findById(id: string) {
        return await ProductModel.findOne({ _id: id });
    }
}

export default ProductRepository;