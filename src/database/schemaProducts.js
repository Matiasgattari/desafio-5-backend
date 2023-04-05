import mongoose, { Schema } from 'mongoose';

export const schemaProducts = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, required: true },
    stock: { type: Number, required: true, min: 1 },
    code: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, required: true },
    id: { type: String, required: true, unique:true}
}, { versionKey: false })


export const productsDB = mongoose.model('products', schemaProducts)