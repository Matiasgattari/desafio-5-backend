console.log("hola, desde la carpeta public");

// @ts-ignore
const serverSocket = io()

const cargarBTN = document.getElementById('botonCargar')
// console.log("cargarBTN", cargarBTN);

const eliminarBTN = document.getElementById('botonEliminar')
// console.log("eliminarBTN", eliminarBTN);
const eliminarID = document.getElementById('eliminarID')

const titulo = document.getElementById('titulo')
// console.log("titulo", titulo);
const descripcion = document.getElementById('descripcion')
// console.log("descripcion", descripcion);
const precio = document.getElementById('precio')
// console.log("precio", precio);
const urlIMG = document.getElementById('urlIMG')
// console.log("urlIMG", urlIMG);
const stock = document.getElementById('stock')
// console.log("stock", stock);
const codigo = document.getElementById('codigo')
// console.log("codigo", codigo);
const categoria = document.getElementById('categoria')
// console.log("categoria", categoria);



// const formulario = document.getElementById("formulario")
// formulario?.addEventListener("click", (e)=>{
// e.preventDefault()
// } )



//doy funcionalidad al boton de eliminar producto "ELIMINAR"
eliminarBTN?.addEventListener("click", ()=>{
   // @ts-ignore
    const idEliminar = eliminarID?.value

    serverSocket.emit('eliminarProducto', idEliminar)

} )





//doy funcionalidad al boton de agregar productos "CARGAR"
// @ts-ignore
cargarBTN?.addEventListener("click", (e)=>{
    // @ts-ignore
    const valorTitulo= titulo?.value
    // @ts-ignore
    const valorDescripcion= descripcion?.value
    // @ts-ignore
    const valorPrecio= precio?.value
    // @ts-ignore
    const valorUrlIMG= urlIMG?.value
    // @ts-ignore
    const valorStock= stock?.value
    // @ts-ignore
    const valorCodigo= codigo?.value
    // @ts-ignore
    const valorCategoria= categoria?.value

    const productoAgregar = {"title":valorTitulo,"description":valorDescripcion,"price":valorPrecio,"thumbnail":valorUrlIMG,"stock":valorStock,"code":valorCodigo,"category":valorCategoria}


serverSocket.emit('nuevoProducto', productoAgregar)



} )



//Intento de actualizacion automatica al agregar un nuevo producto    
const plantillaMensajes = `
    {{#if hayProductos}}
    <h4>PRODUCTOS</h4>
    <ul>
        {{#each productos}}
        <li>{{this}}</li>
        {{/each}}
    </ul>
    {{else}}
    <p class="text-danger">sin productos...</p>
    {{/if}}
    
    `
const armarHtmlMensajes = Handlebars.compile(plantillaMensajes)
    
serverSocket.on('actualizarProductos', productosStorage => {
        
    const divProductos = document.getElementById('productos')
       
    if (divProductos) {
        const productos = []

        productosStorage.forEach(element => {productos.push(JSON.stringify(element))  })
           
        divProductos.innerHTML = armarHtmlMensajes({ productos, hayProductos: productos.length > 0 })
            
    }
})