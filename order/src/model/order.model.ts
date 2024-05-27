import { Schema, Document, model } from "mongoose";

interface IProduct {
    name: string;
    company: string;
    price: number;
    desc: string;
}

interface IOrder extends Document {
    product: IProduct;
    userId: string;
}

const ProductSchema: Schema<IProduct> = new Schema({
    name: String,
    company: String,
    price: Number,
    desc: String
});

const OrderSchema: Schema<IOrder> = new Schema({
    product: ProductSchema,
    userId: String
});

const OrderModel = model<IOrder>("Order", OrderSchema);

export default OrderModel;