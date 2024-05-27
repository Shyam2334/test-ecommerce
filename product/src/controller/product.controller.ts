import { Request, Response } from "express-serve-static-core";
import ProductService from "../service/product.service";

class ProductController {
    constructor(private readonly productService: ProductService) {}

    async create(req: Request, res: Response) {
        try {
            const product = await this.productService.create(req.body);
            res.status(product.status).json(product.data);
        } catch (err) {
            res.status(500).json(err);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const product = await this.productService.update(req.params.id, req.body);
            res.status(product.status).json(product.data);
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

export default ProductController;