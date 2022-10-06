// CLASES
class Producto {
    constructor(id, nombre, descripcion, precio, cantidad) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.cantidad = cantidad;
    }
}

const producto1 = new Producto(1, "Crossaint", "Crossaint de jamon y queso", 250, 1);
const producto2 = new Producto(2, "Medialuna", "Medialuna de grasa", 110, 1);
const producto3 = new Producto(3, "Pan", "1kg de pan", 250, 1);
const producto4 = new Producto(4, "Cafe", "Cafe negro", 300, 1);
const producto5 = new Producto(5, "Muffin", "Muffin de chocolate", 350, 1);
const producto6 = new Producto(6, "Batido", "Batido de frutilla", 400, 1);
const producto7 = new Producto(7, "Tostado", "Tostado de JyQ", 350, 1);
const producto8 = new Producto(8, "Sandwich de miga", "Sandwich de JyQ", 250, 1);

const productos = [producto1, producto2, producto3, producto4, producto5, producto6, producto7, producto8];

let carrito = [];

// FUNCION VACIAR


const toggleVaciarButton = () => vaciarCarrito.style.display = carrito.length === 0 ? "none" : "";

// FUNCION CANTIDADES , RECIBE UN TIPO

const creadorCantidades = (tipo, producto) => {

    const id = producto.id;

    let div = document.createElement("div");
    div.className = "input-group";
    div.innerHTML = `
    <button class="btn btn-outline-danger" onclick="modificarCantidad('${tipo}', '${id}', 'del')" type="button" id="rmv${tipo}${id}">-</button>
    <input onkeyup="modificarCantidad('${tipo}', '${id}', 'nada')"  type="number" min="1" max="100" id="cantidad${tipo}${id}" class="form-control" value="${producto.cantidad}">
    <button class="btn btn-outline-success" onclick="modificarCantidad('${tipo}', '${id}', 'add')" type="button" id="add${tipo}${id}">+</button>
    `
    return div;
}

const modificarCantidad = (tipo, id, operacion) => {
    let inputCantidad = document.getElementById("cantidad" + tipo + id);
    let cantidad =  parseInt(inputCantidad.value);
    if(operacion == "add") {
        cantidad = cantidad + 1;
    } else if(operacion == 'del') {
        cantidad = cantidad - 1;
        if (cantidad = cantidad < 1 ? 1 : cantidad);

    } else {
        if (cantidad < 1) cantidad = 1;
    }
    inputCantidad.value = cantidad;
    if(tipo == "p") { // producto
        const producto = productos.find(e => e.id == id);
        producto.cantidad = cantidad;
    } else if(tipo == "c") { // carrito
        const productoEnCarrito = carrito.find(e => e.id == id);
        productoEnCarrito.cantidad = cantidad;
        actualizarCarrito();
    }
}


// CONTENEDOR DE PRODUCTOS

const contenedorProductos = document.getElementById("contenedorProductos");

productos.forEach((producto) => {
    let col3 = document.createElement("div");
    col3.className = "col-3 mt-3";
    let card = document.createElement("div");
    card.className = "card";
    card.style.width = "18rem";
    col3.appendChild(card);
    let img = document.createElement("img");
    img.src = `img/${producto.id}.jpg`;
    img.className = "card-img-top img-thumbnail ";
    img.alt = "...";
    card.appendChild(img);
    let cardBody = document.createElement("div");
    cardBody.className = "card-body text-center";
    card.appendChild(cardBody);
    let cardTitle = document.createElement("h3");
    cardTitle.className = "card-title";
    cardTitle.innerText = `${producto.nombre}`;
    cardBody.appendChild(cardTitle);
    let cardText = document.createElement("p");
    cardText.className = "card-text";
    cardText.innerText = `${producto.descripcion}`;
    cardBody.appendChild(cardText);
    let cardText2 = document.createElement("p");
    cardText2.innerText = `$${producto.precio}`;
    cardBody.appendChild(cardText2);
    cardBody.appendChild(creadorCantidades("p", producto));
    let sectionBtn = document.createElement("div");
    sectionBtn.className = "d-flex justify-content-center";
    cardBody.appendChild(sectionBtn);
    let btn = document.createElement("a");
    btn.id = `btnAgregar${producto.id}`;
    btn.addEventListener("click", () => {
        confirmCartAlert("Se ha agregado el producto al carrito.");
    })
    btn.className = "btn btn-primary mt-3";
    btn.innerText = "Agregar al carrito";
    btn.onclick = () => agregarAlCarrito(producto.id);
    sectionBtn.appendChild(btn);

    contenedorProductos.appendChild(col3);

})


// Agregar cosas al carrito


const agregarAlCarrito = (id) => {
    const productoToAdd = productos.find(producto => producto.id == id);
    const productoEnCarrito = carrito.find(producto => producto.id == id);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad = productoEnCarrito.cantidad + productoToAdd.cantidad;
    } else {
        carrito.push({ ...productoToAdd });
    }
    productoToAdd.cantidad = 1;
    actualizarCarrito();
}

// CARRITO DOM

const contenedorCarrito = document.getElementById("contenedorCarrito");
const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", actualizarCarrito);

// ACTUALIZAR CARRITO

function actualizarCarrito() {
    localStorage.setItem("carritoStorage", JSON.stringify(carrito));
    toggleVaciarButton();
    // vaciamos el contenedor
    contenedorCarrito.innerHTML = '';
    // iteración en el carrito, producto a producto
    carrito.forEach(producto => {
        let div = document.createElement("div");
        div.className = "col-md-3 mt-3";
        let card = document.createElement("div");
        card.className = "card";
        div.appendChild(card);
        let img = document.createElement("img");
        img.src = `img/${producto.id}.jpg`
        img.className = "card-img-top img-fluid py-3";
        card.appendChild(img);
        let cardBody = document.createElement("div");
        cardBody.className = "card-body";
        card.appendChild(cardBody);
        let h3 = document.createElement("h3");
        h3.className = "card-title";
        h3.innerText = `${producto.nombre}`;
        cardBody.appendChild(h3);
        let p = document.createElement("p");
        p.className = "card-text";
        p.innerText = `$${producto.precio}`;
        cardBody.appendChild(p);
        cardBody.appendChild(creadorCantidades("c", producto));
        let button = document.createElement("button");
        button.onclick = () => eliminarDelCarrito(producto.id);
        button.id = "buttonDel"
        button.addEventListener("click", () => {
            confirmCartAlert("Se ha eliminado el producto del carrito.")
        })
        button.innerText = "Eliminar del carrito";
        button.className = "btn btn-primary mt-3";
        cardBody.appendChild(button);
        contenedorCarrito.appendChild(div);

    })


    calcularTotalCompra();

}





// Borrar cosas del carrito 

const eliminarDelCarrito = (id) => {
    const producto = carrito.find(producto => producto.id === id);
    carrito.splice(carrito.indexOf(producto), 1);

    actualizarCarrito();
}

// VACIAR CARRITO 


const vaciarCarrito = document.getElementById("vaciarCarrito");


vaciarCarrito.addEventListener("click", () => {
    Swal.fire({
        width: "25em",
        icon: 'warning',
        title: '¿Esta seguro de querer vaciar el carrito?',
        confirmButtonText: "Aceptar",
        confirmButtonColor: "green",
        showConfirmButton: true,
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        cancelButtonColor: "red",
    }).then((result) => {
        if(result.isConfirmed) {
            carrito = [];
            Swal.fire({
                width: "25em",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
            })
            actualizarCarrito();
        }
    })

});


// COMPRA

const totalCompra = document.getElementById("totalCompra");

const calcularTotalCompra = () => {
    let total = 0;
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });
    totalCompra.innerHTML = total;
}

const cargarCarrito = () => {
    if (localStorage.getItem("carritoStorage") == null) return;
    carrito = JSON.parse(localStorage.getItem("carritoStorage"));
    actualizarCarrito();
}
cargarCarrito()

function confirmCartAlert(texto) {
    Swal.fire({
        width: "25em",
        position: 'bottom-end',
        icon: 'success',
        html: `<h5>${texto}</h5>`,
        showConfirmButton: false,
        backdrop: false,
        timer: 2500,
        timerProgressBar: true,
    })
}