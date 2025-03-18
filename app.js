// Definición de variables globales
const IVA = 1.21;
let totalCarrito = 0;
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let metodoPago = "";
let metodoEntrega = "";

// Lista de productos disponibles en la tienda
const productos = [
  { id: 1, nombre: "Pizza Napolitana", precio: 18000 },
  { id: 2, nombre: "Pizza Mozzarella", precio: 15000 },
  { id: 3, nombre: "Hamburguesa Doble", precio: 12000 },
  { id: 4, nombre: "Hamburguesa Simple", precio: 10000 },
  { id: 5, nombre: "Lomos Completo", precio: 13000 },
  { id: 6, nombre: "Lomos Simple", precio: 9000 },
  { id: 7, nombre: "Tacos de Carne", precio: 11000 },
  { id: 8, nombre: "Tacos de Pollo", precio: 10000 },
  { id: 9, nombre: "Empanadas", precio: 7000 },
  { id: 10, nombre: "Milanesa con Papas", precio: 16000 }
];

// Función para calcular el precio con IVA incluido
const calcularIva = (precio) => precio * IVA;

// Función para mostrar los productos disponibles
const mostrarProductos = () => {
  const contenedorProductos = document.getElementById('productos');
  contenedorProductos.innerHTML = ''; // Limpiar cualquier contenido anterior

  productos.forEach((producto) => {
    const productoDiv = document.createElement('div');
    productoDiv.classList.add('producto');

    const productoHTML = `
      <h3>${producto.nombre}</h3>
      <p>$${producto.precio} + IVA</p>
      <button class="agregar-btn" data-id="${producto.id}">Agregar al carrito</button>
    `;

    productoDiv.innerHTML = productoHTML;
    contenedorProductos.appendChild(productoDiv);
  });

  // Asignar eventos de agregar al carrito
  document.querySelectorAll('.agregar-btn').forEach((btn) => {
    btn.addEventListener('click', agregarAlCarrito);
  });
};

// Función para agregar productos al carrito
const agregarAlCarrito = (e) => {
  const productoId = parseInt(e.target.getAttribute('data-id'));
  const producto = productos.find(p => p.id === productoId);

  if (producto) {
    const cantidad = parseInt(prompt(`¿Cuántas unidades de ${producto.nombre} deseas agregar?`));
    if (cantidad > 0) {
      carrito.push({ ...producto, cantidad });
      totalCarrito += calcularIva(producto.precio) * cantidad;
      actualizarCarrito();
      guardarCarritoLocalStorage();
    } else {
      alert("Cantidad inválida");
    }
  }
};

// Función para actualizar la vista del carrito
const actualizarCarrito = () => {
  document.getElementById('totalCarrito').innerText = totalCarrito.toFixed(2);
};

// Función para vaciar el carrito
const vaciarCarrito = () => {
  carrito = [];
  totalCarrito = 0;
  actualizarCarrito();
  guardarCarritoLocalStorage();
};

// Función para guardar carrito en localStorage
const guardarCarritoLocalStorage = () => {
  localStorage.setItem('carrito', JSON.stringify(carrito));
};

// Función para finalizar la compra
const finalizarCompra = () => {
  metodoPago = document.getElementById('pago').value;
  metodoEntrega = document.getElementById('entrega').value;

  if (!metodoPago || !metodoEntrega) {
    alert("Por favor, selecciona ambos métodos de pago y entrega.");
    return;
  }

  const resumenCompra = `
    Método de pago: ${metodoPago}
    Método de entrega: ${metodoEntrega}
    Total a pagar: $${totalCarrito.toFixed(2)}
  `;
  alert("Compra Finalizada:\n" + resumenCompra);

  vaciarCarrito();
};

// Inicializar el simulador
const init = () => {
  mostrarProductos();
  document.getElementById('vaciarCarrito').addEventListener('click', vaciarCarrito);
  document.getElementById('finalizarCompra').addEventListener('click', finalizarCompra);
};

init();
