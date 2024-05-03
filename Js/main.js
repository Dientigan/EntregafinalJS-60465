let productos = [];

fetch("./Js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

/*funcion de creado de tarjetas*/    

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-pincipal");
let botonesCompra = document.querySelectorAll(".boton-compra");
const numerito = document.querySelector("#numerito");

function cargarProductos (productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {

        const div = document.createElement("div");
        div.classList.add("opciones-plato")
        div.innerHTML = `
        <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
        <div class="informacion-plato">
        <h3 class="nombre-comida">${producto.titulo}</h3>
        <p class="precio">${producto.precio}</p>
        <div class="categoria"><p>Categoria: <span>${producto.categoria.nombre}</span></p>
            <button class="boton-compra" id="${producto.id}">agregar</button>
        </div>
        `;
        contenedorProductos.append(div);
    })
    actualizarBotonCompra();
}

/*seleccion categorias y clase activa*/

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("activo"));
        e.currentTarget.classList.add("activo");

        if (e.currentTarget.id != "todos") {
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            cargarProductos(productos);
        }
      
    })
});

/* funcion agregado */

function actualizarBotonCompra(){
    botonesCompra = document.querySelectorAll(".boton-compra");

    botonesCompra.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito;

let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else{
    productosEnCarrito = [];
}


function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
     actualizarNumerito();

     localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc,producto)=> acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}