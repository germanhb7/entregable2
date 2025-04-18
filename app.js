// Simulación de productos
const productos = [
  { id: 1, nombre: "Pizza Napolitana", precio: 18000, imagen: "img/pizza-napolitana.jpg" },
  { id: 2, nombre: "Pizza Mozzarella", precio: 15000, imagen: "img/pizza-mozzarella.jpg" },
  { id: 3, nombre: "Hamburguesa Completa", precio: 12000, imagen: "img/hamburguesa-doble.jpg" },
  { id: 4, nombre: "Lomo Completo", precio: 14000, imagen: "img/lomos-completo.jpg" },
  { id: 5, nombre: "Lomos Simple", precio: 9000, imagen: "img/lomos-simple.jpg" },
  { id: 6, nombre: "Tacos de Carne", precio: 11000, imagen: "img/tacos-de-carne.jpg" },
  { id: 7, nombre: "Tacos de Pollo", precio: 10000, imagen: "img/tacos-de-pollo.jpg" },
  { id: 8, nombre: "Empanadas", precio: 7000, imagen: "img/empanadas.jpg" },
  { id: 9, nombre: "Milanesa con Papas", precio: 16000, imagen: "img/milanesa-con-papas.jpg" },
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let comentarios = JSON.parse(localStorage.getItem("comentarios")) || [];

// Mostrar productos
const contenedorProductos = document.querySelector(".productos-container");

function mostrarProductos() {
  contenedorProductos.innerHTML = "";
  productos.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("producto"); // Clase correcta según tu CSS
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" class="producto-img">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio} + IVA</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedorProductos.appendChild(card);
  });
}
mostrarProductos();

// Agregar al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();

  // Mostrar el SweetAlert de éxito
  Swal.fire("¡Producto agregado!", `${producto.nombre} se agregó con éxito al carrito.`, "success");
}

// Mostrar total
function actualizarCarrito() {
  const total = carrito.reduce((acc, item) => acc + item.precio, 0);
  document.getElementById("totalCarrito").innerText = total;
}
actualizarCarrito();

// Vaciar carrito
document.getElementById("vaciarCarrito").addEventListener("click", () => {
  carrito = [];
  localStorage.removeItem("carrito");
  actualizarCarrito();
  Swal.fire("Carrito vaciado", "", "info");
});

// Finalizar compra
document.getElementById("finalizarCompra").addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire("Tu carrito está vacío", "Agrega productos antes de comprar", "warning");
    return;
  }

  const metodoPago = document.getElementById("pago").value;
  const metodoEntrega = document.getElementById("entrega").value;

  if (metodoPago === "tarjeta") {
    mostrarFormularioTarjeta();
  } else {
    Swal.fire("¡Compra realizada!", `Pago: ${metodoPago} - Entrega: ${metodoEntrega}`, "success");
    carrito = [];
    localStorage.removeItem("carrito");
    actualizarCarrito();
  }
});

// Formulario tarjeta de crédito con SweetAlert2
function mostrarFormularioTarjeta() {
  Swal.fire({
    title: "Información de la Tarjeta de Crédito",
    html:
      `<input type="text" id="numTarjeta" class="swal2-input" placeholder="Número de Tarjeta">` +
      `<input type="text" id="vencimiento" class="swal2-input" placeholder="MM/AA">` +
      `<input type="text" id="codigo" class="swal2-input" placeholder="Código de Seguridad">`,
    focusConfirm: false,
    preConfirm: () => {
      const numero = document.getElementById("numTarjeta").value;
      const vencimiento = document.getElementById("vencimiento").value;
      const codigo = document.getElementById("codigo").value;

      if (!numero || !vencimiento || !codigo) {
        Swal.showValidationMessage("Completa todos los campos");
        return false;
      }

      Swal.fire("¡Pago exitoso!", "Tu compra fue procesada correctamente", "success");
      carrito = [];
      localStorage.removeItem("carrito");
      actualizarCarrito();
    }
  });
}

// Obtener los comentarios almacenados en localStorage al cargar la página
function mostrarComentarios() {
  const lista = document.getElementById("comentarios-lista");
  lista.innerHTML = ""; // Limpiar lista actual
  comentarios.forEach(comentario => {
    const p = document.createElement("p");
    p.textContent = comentario;
    lista.appendChild(p);
  });
}
mostrarComentarios();

// Agregar comentario
document.getElementById("agregarComentario").addEventListener("click", () => {
  Swal.fire({
    title: "Escribe tu comentario",
    input: "text",
    inputLabel: "¿Qué te pareció el servicio?",
    inputPlaceholder: "Muy bueno, excelente atención...",
    showCancelButton: true,
    confirmButtonText: "Enviar",
  }).then((res) => {
    if (res.isConfirmed && res.value) {
      // Agregar el comentario al arreglo y a localStorage
      comentarios.push(res.value);
      localStorage.setItem("comentarios", JSON.stringify(comentarios));

      // Mostrar el nuevo comentario en la página
      mostrarComentarios();
      
      Swal.fire("¡Gracias por tu comentario!", "", "success");
    }
  });
});

// Newsletter
document.getElementById("suscribirse").addEventListener("click", () => {
  const email = document.getElementById("emailNewsletter").value;
  if (email.includes("@")) {
    Swal.fire("¡Suscripción exitosa!", "Gracias por suscribirte", "success");
    document.getElementById("emailNewsletter").value = "";
  } else {
    Swal.fire("Correo inválido", "Ingresá un correo válido", "error");
  }
});
