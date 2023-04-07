import express from 'express'
import { engine } from 'express-handlebars'
import { Server as SocketIOServer } from 'socket.io'
import { productsRouter } from './routes/productsRouter.js';
import { cartsRouter } from './routes/cartsRouter.js';
import { PORT } from './config/config.sv.js';
import { ProductManager } from '../public/ProductManager.js';


const productManager = new ProductManager('./productos.txt')


const app = express()

app.engine('handlebars', engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.static('./public'))
app.use(express.static('./static'))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)




const httpServer = app.listen(PORT)
console.log(`listening on port ${PORT}`);
// lo mismo que me devuelve el http.createServer() !!

const io = new SocketIOServer(httpServer)


app.get('/', async (req, res) => {
   res.json({"message":"bienvenido al servidor"})
})




//PARTE PROBLEMA: al presionar el boton de "cargar" o eliminar, esta misma orden se envia en loop haciendo crashear la pagina (se cargan entre 1-11 veces el mismo producto con distinto id). Al eliminar entiendo pasa algo similar pero como elimina 1 solo producto x id no crashea.
app.get('/realtimeproducts', async (req, res, next) => {

    const listado1 = await productManager.getProducts()




    //probando recibir producto nuevo para agregar por socket.io
    io.on('connection', async clientSocket => {

    clientSocket.on('nuevoProducto',async function agregarProd (productoAgregar)  {
     await productManager.addProduct(productoAgregar.title,productoAgregar.description,productoAgregar.price,productoAgregar.thumbnail,productoAgregar.stock,productoAgregar.code,productoAgregar.category)

    })
    
    clientSocket.emit('actualizarProductos', listado1)
    // io.sockets.emit('actualizarProductos', listado1) 

    clientSocket.on('eliminarProducto',  productoEliminar => {
        productManager.deleteProduct(productoEliminar)
    })

    })



    const listado = [];
    listado1.forEach(element => {listado.push(JSON.stringify(element))});

res.render('realTimeProducts.handlebars', {
        titulo: 'Products',
        encabezado: 'Lista de productos en base de datos',
        listado,
        hayListado: listado.length > 0
   })
})










app.get('/home', async (req, res, next) => {
  
    const listado1 = await productManager.getProducts()
    

    const producto = [];
    listado1.forEach(element => {producto.push(JSON.stringify(element))
        
    });
    
        res.render('home.handlebars', {
            titulo: 'Products',
            encabezado: 'Lista de productos en base de datos',
            producto,
            hayProductos: producto.length > 0
        })
})

app.get('/chat', async (req,res,next) => {
  
res.render('chat.handlebars', {
    titulo: 'Products',
    encabezado: 'Lista de productos en base de datos'
})
})

