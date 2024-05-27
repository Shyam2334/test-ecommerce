import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
    name: string,
    company: string,
    price: number,
    desc: string,
    quantity: number
}

const ProductSchema: Schema<IProduct> = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    company: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    }
})

const ProductModel = mongoose.model<IProduct>("Product", ProductSchema)

export { IProduct, ProductModel }