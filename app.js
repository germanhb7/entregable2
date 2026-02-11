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

const contenedorProductos = document.querySelector(".productos-container");
const totalCarritoEl = document.getElementById("totalCarrito");
const btnVaciar = document.getElementById("vaciarCarrito");
const btnFinalizar = document.getElementById("finalizarCompra");

function limpiarCarrito(mostrarMensaje = false) {
  carrito = [];
  localStorage.removeItem("carrito");
  actualizarCarrito();
  if (mostrarMensaje) {
    Swal.fire("Carrito vaciado", "", "info");
  }
}

function actualizarCarrito() {
  const total = carrito.reduce((acc, item) => acc + item.precio, 0);
  if (totalCarritoEl) {
    totalCarritoEl.innerText = total.toLocaleString("es-AR");
  }
}

function mostrarProductos() {
  if (!contenedorProductos) return;
  
  contenedorProductos.innerHTML = "";
  productos.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("producto");
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" class="producto-img">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio.toLocaleString("es-AR")}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedorProductos.appendChild(card);
  });
}

function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;

  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarrito();

  Swal.fire({
    title: "¡Producto agregado!",
    text: `${producto.nombre} se agregó con éxito.`,
    icon: "success",
    timer: 1800,
    showConfirmButton: false
  });
}

function esTarjetaValida(numero, vencimiento, cvv) {
  const soloNumeros = numero.replace(/\D/g, '');
  const [mes, anio] = vencimiento.split('/').map(n => n.trim());
  
  return (
    soloNumeros.length === 16 &&
    /^\d{2}\/\d{2}$/.test(vencimiento) &&
    Number(mes) >= 1 && Number(mes) <= 12 &&
    cvv.length >= 3 && cvv.length <= 4 &&
    /^\d+$/.test(cvv)
  );
}

function mostrarFormularioTarjeta() {
  Swal.fire({
    title: "Información de la Tarjeta de Crédito",
    html: `
      <input type="text" id="numTarjeta" class="swal2-input" placeholder="Número de Tarjeta (16 dígitos)" maxlength="19">
      <input type="text" id="vencimiento" class="swal2-input" placeholder="Vencimiento (MM/AA)" maxlength="5">
      <input type="text" id="codigo" class="swal2-input" placeholder="Código de Seguridad (CVV)" maxlength="4">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Pagar",
    preConfirm: () => {
      const numero = document.getElementById("numTarjeta")?.value || "";
      const vencimiento = document.getElementById("vencimiento")?.value || "";
      const codigo = document.getElementById("codigo")?.value || "";

      if (!esTarjetaValida(numero, vencimiento, codigo)) {
        Swal.showValidationMessage(
          "Datos inválidos: revisa número (16 dígitos), vencimiento (MM/AA) y CVV (3-4 dígitos)"
        );
        return false;
      }

      return { numero, vencimiento, codigo };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("¡Pago exitoso!", "Tu compra fue procesada correctamente", "success");
      limpiarCarrito();
    }
  });
}

if (btnVaciar) {
  btnVaciar.addEventListener("click", () => limpiarCarrito(true));
}

if (btnFinalizar) {
  btnFinalizar.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire("Carrito vacío", "Agrega productos antes de continuar", "warning");
      return;
    }

    const metodoPago = document.getElementById("pago")?.value || "efectivo";
    const metodoEntrega = document.getElementById("entrega")?.value || "retirar";

    if (metodoPago === "tarjeta") {
      mostrarFormularioTarjeta();
    } else {
      Swal.fire(
        "¡Compra realizada!",
        `Pago: ${metodoPago} | Entrega: ${metodoEntrega}`,
        "success"
      );
      limpiarCarrito();
    }
  });
}

mostrarProductos();
actualizarCarrito();
mostrarComentarios();

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
      comentarios.push(res.value);
      localStorage.setItem("comentarios", JSON.stringify(comentarios));
      mostrarComentarios();
      Swal.fire("¡Gracias por tu comentario!", "", "success");
    }
  });
});

document.getElementById("suscribirse").addEventListener("click", () => {
  const email = document.getElementById("emailNewsletter").value;
  if (email.includes("@")) {
    Swal.fire("¡Suscripción exitosa!", "Gracias por suscribirte", "success");
    document.getElementById("emailNewsletter").value = "";
  } else {
    Swal.fire("Correo inválido", "Ingresá un correo válido", "error");
  }
});