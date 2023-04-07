import {
    randomUUID
} from 'crypto'
import fs from 'fs/promises'

import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { schemaProducts } from '../src/database/mongoose.js';
import { productsDB } from '../src/database/mongoose.js';
import { cartsDB } from '../src/database/mongoose.js';


//constructor para creacion de productos nuevos
export class Product {
    constructor({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category
    }) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.category = category;
        this.id = randomUUID();
    }
}



export class ProductManager {
#productosDb
    constructor(path) {
        this.products;
        this.path = path;
        this.#productosDb = mongoose.model('products', schemaProducts)
    }


    async readProducts() {
        
        const data = await fs.readFile(this.path, "utf-8");
        this.products = JSON.parse(data);
    }

    async getProducts() {
      
     
        const prodd = await productsDB.find().lean()
        // await mongoose.connection.close()
        this.products = prodd;
        return this.products

    }


    async addProduct(title, description, price, thumbnail, stock, code, category) {

        try {
            await this.getProducts()

            const productFind = this.products.find((product) => product.title === title)
            if (productFind) {
                console.log('Ya existe un producto con ese titulo');
            }

            if (title !== undefined && description !== undefined && price !== undefined && stock !== undefined && code !== undefined && category !== undefined) {
               
                const product = new Product({
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    stock: stock,
                    code: code,
                    category: category
                })
                
                const product2 = await productsDB.create({ // insertOne en version mongoose
                    title: title,
                    description: description,
                    price: price,
                    thumbnail: thumbnail,
                    stock: stock,
                    code: code,
                    category: category,
                    status: true,
                    id: randomUUID()
            })
                this.products = await this.getProducts()
                // this.products.push(product)
                const jsonProducts = JSON.stringify(this.products, null, 2)
                await fs.writeFile(this.path, jsonProducts)
                // console.log("this products post push",jsonProducts);

            }

        } catch (error) {
            throw new Error("Los campos no pueden estar vacios")
        }

    }


    async getProductById(id) {

        const jsonProducts =  await this.getProducts()
        
        this.products = jsonProducts

        const productFind = this.products.find((product) => product.id === id)

        if (productFind === undefined) {
            throw new Error("producto no encontrado o ID invalido")
        } else {
            const productoID = await productsDB.findOne({ id: id }).lean()
            return productoID

        }

    }
    


    async deleteProduct(id) {
        const productos = await this.getProducts() //este paso asumo esta de mas
        this.products = productos //este paso asumo esta de mas
        
        await productsDB.deleteOne({ id: id })

        const productos2 = await this.getProducts() //persistencia luego de hacer el getproducts con mongoose
        this.products = productos2

        const jsonProducts = JSON.stringify(this.products, null, 2)
        await fs.writeFile(this.path, jsonProducts)

        return console.log("producto eliminado correctamente");

    }

    async updateProduct(id, prodModificado) {

        const jsonProducts = await fs.readFile(this.path, 'utf-8')
        // this.products = JSON.parse(jsonProducts)

        //busco producto a modificar
        const productos = await this.getProducts()
        this.products = productos
        const product = this.products.find((prod) => prod.id === id);
        const indice = this.products.findIndex(p => p.id === id)

        // creo producto nuevo para reemmplazar al anterior
        if (!product) {
            throw new Error("El id no existe");
        }

        const nuevoProducto = new Product({
            ...product,
            ...prodModificado
        })
        nuevoProducto.id = id

        //reemplazo producto
        this.products[indice] = nuevoProducto

        //actualizo el filesystem
        const jsonProductsModif = JSON.stringify(this.products, null, 2)
        await fs.writeFile(this.path, jsonProductsModif)
        // actualizo mongoDB
        await productsDB.findOneAndUpdate({id:id},nuevoProducto)
        
        console.log("El producto se actualizo con exito", nuevoProducto);
    }

}


//manager de productos. prueba
// const productManager = new ProductManager('../productos.txt');
// console.log('console log de get products',await productManager.getProducts());

// await productManager.addProduct(
//             "computadora5",
//              "descripcion prod 3",
//             3500,
//             "url imagen",
//             45,
//             "televisor",
//            "hogar"
//     )

// console.log("producto filtrado por ID",await productManager.getProductById('ade0f4d9-716b-4453-b88d-6d5df1564232'));

// await productManager.deleteProduct('2310d7bd-fe28-4d91-8fba-d83cbc9673f5')

// const prodModif = {title: "microondas",
// description: "descripcion prod 3",
// price: 3500,
// thumbnail: "url imagen",
// stock: 45,
// code: "cocina",
// category: "hogar"}

// await productManager.updateProduct("3307ab83-226d-49e2-905a-efd18d10572a",prodModif)



//no se donde ponerlo
// await mongoose.connection.close()

