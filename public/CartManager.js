import { ProductManager } from "./ProductManager.js";
import {
    randomUUID
} from 'crypto'
import fs from 'fs/promises'

import mongoose from 'mongoose';
import { cartsDB } from '../src/database/mongoose.js';





export class CartManager {

    constructor(path) {
        this.carts;
        this.path = path;
        this.products = [];
    }
    async readCarts() {
        const data = await fs.readFile(this.path, "utf-8");
        this.carts = JSON.parse(data);
    }

    async getCarts() {
        await this.readCarts();
        this.carts =await cartsDB.find()
        return this.carts

    }

    async crearCarrito() {

        await this.getCarts()
        const cart = {
            "id": randomUUID(),
            "quantity": 0,
            "products": []
        }
        this.carts.push(cart)

        const jsonCarts = JSON.stringify(this.carts, null, 2)
        await fs.writeFile(this.path, jsonCarts)
        await cartsDB.create(cart)
        console.log("carrito creado correctamente");
    }
    // 
    async agregarProductoAlCarrito(cid, pid) {
        try {
            //instancio productManager
            const productManager = new ProductManager('./productos.txt');

            //ubico producto por pid
            const productos = await productManager.getProducts()
            const productoIndex = productos.findIndex(prod => prod.id == pid)
            const productoFiltrado = productos[productoIndex]

            //ubico carrito por cid
            const carritos = await this.getCarts()
            const carritoIndex = carritos.findIndex(carrito => carrito.id == cid)
            const carritoFiltrado = carritos[carritoIndex]

            //formato de producto a pushear al array de productos del carrito
            let cant = 1
            const produID = {
                "id": `${productoFiltrado.id}`,
                "quantity": `${cant}`
            };

            //array con todos los IDs de los productos del carrito.Es un parche para dejarlo funcional. TRATAR DE ARRAGLAR CUANDO HAYA TIEMPO. 
            const idsDentroDelCarrito = [];
            const carritoProductos = carritoFiltrado.products
            carritoProductos.forEach(element => {
                idsDentroDelCarrito.push(element.id)
            });

            //utilizo array de ids para saber si incluye PID. modifico cantidades o creo nuevo objeto
            if (idsDentroDelCarrito.includes(pid)) {
                const productoDentroDelCarrito = carritoProductos.find(element => element.id == pid)
                productoDentroDelCarrito.quantity++;
                carritoFiltrado.quantity++;
                await this.saveCart()
                await cartsDB.findOneAndUpdate({id:cid},carritoFiltrado)
               
            } else {
                const push = carritoProductos.push(produID)
                carritoFiltrado.quantity++;
                this.carts[carritoIndex].products = carritoProductos
                await this.saveCart()
                await cartsDB.findOneAndUpdate({id:cid},carritoFiltrado)
            }

             return { "message": "producto cargado correctamente"  }
        } catch (error) {
            return error.message
        }
    }


    async saveCart() {
        const jsonCarts = JSON.stringify(this.carts, null, 2)
        await fs.writeFile(this.path, jsonCarts)
    }
    async getCartById(id) {

        const carritos = await this.getCarts()

        // const carritoIndex = carritos.findIndex(carrito => carrito.id == id)
        // const carritoFiltrado = carritos[carritoIndex]
        // return carritoFiltrado
        return await cartsDB.findOne({id:id})
    }

}


//Manager de carritos. Prueba
// const carrito = new CartManager('../carrito.txt')

// const product = {
//     "title": "tv2",
//     "description": "descripcion prod 2",
//     "price": 2500,
//     "thumbnail": "url imagen",
//     "stock": 45,
//     "code": "televisor",
//     "category": "hogar",
//     "status": true,
//     "id": "44820200-b24d-478f-84e9-e69c4f8cf650"
//   };


// await carrito.addProduct("44820200-b24d-478f-84e9-e69c4f8cf650", product)
// await carrito.crearCarrito()
// await carrito.agregarProductoAlCarrito("f4a19e58-569e-4a48-a64b-8fa6b542c959","eb75a066-f01e-410e-b4d0-e622893532fd")
// console.log(await carrito.getCarts())
// console.log(await carrito.getCartById("a6cd0621-fe82-4374-99ea-f78f1e50c998"))


// no se donde ponerlo
// await mongoose.connection.close()