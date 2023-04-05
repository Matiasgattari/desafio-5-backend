import mongoose, { Schema } from 'mongoose';
// import { ProductManager } from '../../public/productManajer.js';

import { MONGODB_PATH } from '../config/config.mongo.js';

await mongoose.connect(MONGODB_PATH)
console.log(`conectado a base de datos en ${MONGODB_PATH}`);

// const schemaCarts = new mongoose.Schema({
//     id: { type: string, required: true },
//     quantity: { type: number },
//     products: { type: Array}
// }, { versionKey: false })


// const schemaMessages = new mongoose.Schema({
//     user: { type: String, required: true },
//     message: { type: String, required: true }
// }, { versionKey: false })




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


// await productsDB.deleteMany()


// const productManager = new ProductManager('../../productos.txt');
// const poductosLeidos = await productManager.getProducts()
// console.log(poductosLeidos);


// await productsDB.insertMany(poductosLeidos)

// await productsDB.create({ // insertOne en version mongoose
//         title: "tv1",
//         description: "descripcion prod 3",
//         price: 3500,
//         thumbnail: "url imagen",
//         stock: 45,
//         code: "televisor",
//         category: "hogar",
//         status: true,
//         id: "1"
// })
// await productsDB.create({ // insertOne en version mongoose
//         title: "tv2",
//         description: "descripcion prod 3",
//         price: 3500,
//         thumbnail: "url imagen",
//         stock: 45,
//         code: "televisor",
//         category: "hogar",
//         status: true,
//         id: "2"
// })
// await productsDB.create({ // insertOne en version mongoose
//         title: "tv4",
//         description: "descripcion prod 3",
//         price: 3500,
//         thumbnail: "url imagen",
//         stock: 45,
//         code: "televisor",
//         category: "hogar",
//         status: true,
//         id: "3"
// })


const productosBase = await productsDB.find()

// console.log(productosBase);








// await mongoose.connection.close()

