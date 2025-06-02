<template>
  <div class="cart-modal-overlay" @click.self="$emit('close')">
    <div class="cart-modal">
      <div class="cart-header">
        <span class="cart-title"><i class="fas fa-shopping-cart"></i> Carrito de Compras</span>
        <button class="cart-close-btn" @click="$emit('close')" title="Cerrar">&times;</button>
      </div>
      <div class="cart-body">
        <div v-if="!carrito.length" class="cart-empty">
          <i class="fas fa-box-open"></i>
          <p>Tu carrito está vacío.</p>
        </div>
        <div v-else>
          <ul class="cart-list">
            <li v-for="item in carrito" :key="item._id" class="cart-item">
              <div class="cart-img-wrap">
                <img
                  :src="item.img || require('../assets/Piezas/alternador.jpg')"
                  :alt="item.nombre"
                  class="cart-img"
                />
              </div>
              <div class="cart-info">
                <div class="cart-name">{{ item.nombre }}</div>
                <div class="cart-brand" v-if="item.marca">{{ item.marca }}</div>
                <div class="cart-desc" v-if="item.descripcion">{{ item.descripcion }}</div>
                <div class="cart-code" v-if="item.codigo">Código: {{ item.codigo }}</div>
                <div class="cart-price-row">
                  <span class="cart-price">L{{ item.precio ? Number(item.precio).toLocaleString() : '0.00' }}</span>
                  <span class="cart-stock" v-if="item.maxCantidad">| {{ item.maxCantidad }} disp.</span>
                </div>
                <div class="cart-qty-row">
                  <button
                    class="cart-qty-btn"
                    @click="cambiarCantidad(item, -1)"
                    :disabled="item.cantidad <= 1"
                  >-</button>
                  <input
                    type="number"
                    min="1"
                    :max="item.maxCantidad"
                    v-model.number="item.cantidad"
                    @change="actualizarCantidad(item)"
                    class="cart-qty-input"
                  />
                  <button
                    class="cart-qty-btn"
                    @click="cambiarCantidad(item, 1)"
                    :disabled="item.cantidad >= item.maxCantidad"
                  >+</button>
                </div>
              </div>
              <div class="cart-subtotal">
                <span class="cart-subtotal-label">Subtotal</span>
                <span class="cart-subtotal-value">L{{ (item.precio * item.cantidad).toLocaleString() }}</span>
                <button class="cart-remove-btn" @click="eliminarProducto(item)" title="Eliminar">&#10005;</button>
              </div>
            </li>
          </ul>
          <button class="cart-clear-btn" @click="vaciarCarrito">
            <i class="fas fa-trash"></i> Vaciar carrito
          </button>
        </div>
        <transition name="fade">
          <div v-if="toastMsg" class="cart-toast">
            {{ toastMsg }}
          </div>
        </transition>
      </div>
      <div class="cart-footer" v-if="carrito.length">
        <div class="cart-summary">
          <div class="cart-summary-row">
            <span>Productos</span>
            <span>{{ totalProductos }}</span>
          </div>
          <div class="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>L{{ totalCarrito.toLocaleString() }}</span>
          </div>
        </div>
        <button class="cart-pay-btn" @click="$emit('ir-a-pagar')">
          <i class="fas fa-credit-card"></i> Ir a pagar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CarritoModal',
  data() {
    return {
      carrito: [],
      toastMsg: ''
    }
  },
  computed: {
    totalProductos() {
      return this.carrito.reduce((t, i) => t + i.cantidad, 0);
    },
    totalCarrito() {
      return this.carrito.reduce((t, i) => t + i.precio * i.cantidad, 0);
    }
  },
  created() {
    this.actualizarCarritoDesdeStorage();
    window.addEventListener('carrito-actualizado', this.actualizarCarritoDesdeStorage);
  },
  beforeUnmount() {
    window.removeEventListener('carrito-actualizado', this.actualizarCarritoDesdeStorage);
  },
  methods: {
    notificarCambioCarrito() {
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
      this.$nextTick(() => {
        window.dispatchEvent(new Event('carrito-actualizado'));
      });
    },
    cambiarCantidad(item, delta) {
      const idx = this.carrito.findIndex(p => p._id === item._id);
      if (idx !== -1) {
        let nueva = this.carrito[idx].cantidad + delta;
        if (nueva < 1) nueva = 1;
        if (item.maxCantidad && nueva > item.maxCantidad) nueva = item.maxCantidad;
        this.carrito[idx].cantidad = nueva;
        this.carrito = [...this.carrito];
        this.notificarCambioCarrito();
        if (delta !== 0) this.mostrarToast('Cantidad actualizada', true);
      }
    },
    actualizarCantidad(item) {
      if (item.cantidad < 1) item.cantidad = 1;
      if (item.maxCantidad && item.cantidad > item.maxCantidad) item.cantidad = item.maxCantidad;
      this.notificarCambioCarrito();
      this.mostrarToast('Cantidad actualizada', true);
    },
    eliminarProducto(item) {
      this.carrito = this.carrito.filter(p => p._id !== item._id);
      this.notificarCambioCarrito();
      this.mostrarToast('Producto eliminado');
    },
    vaciarCarrito() {
      this.carrito = [];
      this.notificarCambioCarrito();
      this.mostrarToast('Carrito vaciado');
    },
    actualizarCarritoDesdeStorage() {
      const guardado = localStorage.getItem('carrito');
      this.carrito = guardado ? JSON.parse(guardado) : [];
    },
    mostrarToast(msg, sutil = false) {
      this.toastMsg = msg;
      setTimeout(() => {
        this.toastMsg = '';
      }, sutil ? 700 : 1200);
    }
  }
}
</script>

<style scoped>
.cart-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(20, 24, 31, 0.72);
  z-index: 20000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px) brightness(0.96);
  animation: fadeInModal 0.5s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeInModal {
  from { opacity: 0; transform: scale(0.98);}
  to { opacity: 1; transform: scale(1);}
}
.cart-modal {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 16px 48px #1e3c7260, 0 2px 8px #42b98322;
  min-width: 340px;
  max-width: 99vw;
  width: 540px;
  padding: 2.2rem 2.2rem 1.7rem 2.2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  border: none;
  font-family: 'Segoe UI', Arial, sans-serif;
}
.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.7rem;
  border-bottom: 1.5px solid #e0e7ef;
  padding-bottom: 0.9em;
}
.cart-title {
  font-size: 1.5rem;
  color: #181c24;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.cart-close-btn {
  background: none;
  border: none;
  font-size: 2.1rem;
  color: #b0b0b0;
  cursor: pointer;
  font-weight: 700;
  line-height: 1;
  padding: 0 0.3em;
  transition: color 0.18s, transform 0.18s;
}
.cart-close-btn:hover {
  color: #ff5252;
  transform: scale(1.15) rotate(8deg);
}
.cart-body {
  margin-bottom: 1.3rem;
  max-height: 420px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #42b983 #e0e7ef;
}
.cart-body::-webkit-scrollbar {
  height: 8px;
  background: #e0e7ef;
  border-radius: 8px;
}
.cart-body::-webkit-scrollbar-thumb {
  background: #42b983;
  border-radius: 8px;
}
.cart-empty {
  text-align: center;
  color: #888;
  font-size: 1.18em;
  padding: 2.2em 0;
  letter-spacing: 0.2px;
}
.cart-empty i {
  font-size: 2.5em;
  color: #e0e0e0;
  margin-bottom: 0.5em;
  display: block;
}
.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}
.cart-item {
  display: flex;
  align-items: flex-start;
  background: #fafdff;
  border-radius: 16px;
  box-shadow: 0 2px 8px #00eaff11;
  padding: 1.1em 1.1em;
  gap: 1.5em;
  position: relative;
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.18s, transform 0.18s, background 0.18s;
}
.cart-item:hover {
  background: #f8fafc;
  box-shadow: 0 8px 32px #42b98333, 0 0 0 2px #42b98355;
  transform: scale(1.03);
  z-index: 2;
}
.cart-img-wrap {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f6f8fa;
  border-radius: 14px;
  width: 100px;
  height: 100px;
  overflow: hidden;
  box-shadow: 0 1px 8px #1e3c7211;
}
.cart-img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  border-radius: 10px;
  display: block;
}
.cart-info {
  flex: 1 1 60%;
  display: flex;
  flex-direction: column;
  gap: 0.18em;
  min-width: 0;
  padding-top: 0.2em;
}
.cart-name {
  font-weight: 700;
  color: #181c24;
  text-align: left;
  font-size: 1.18em;
  letter-spacing: 0.1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
  cursor: pointer;
  transition: color 0.18s;
}
.cart-name:hover {
  color: #42b983;
}
.cart-brand {
  color: #42b983;
  font-size: 0.98em;
  font-weight: 600;
}
.cart-desc, .cart-code {
  color: #444;
  font-size: 0.97em;
  margin-bottom: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}
.cart-price-row {
  font-size: 1em;
  color: #00bcd4;
  margin: 0.2em 0 0.3em 0;
  display: flex;
  align-items: center;
  gap: 0.7em;
}
.cart-price {
  font-weight: 700;
  color: #00bcd4;
}
.cart-stock {
  color: #888;
  font-size: 0.93em;
}
.cart-qty-row {
  display: flex;
  align-items: center;
  gap: 0.18em;
  background: #f3f7fa;
  border-radius: 8px;
  padding: 2px 8px;
  box-shadow: 0 1px 4px #1e3c7211;
  margin-top: 0.2em;
}
.cart-qty-btn {
  background: #e0e7ef;
  border: none;
  border-radius: 6px;
  width: 28px;
  height: 28px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.2em;
  transition: background 0.15s, color 0.15s, transform 0.15s;
  color: #1e3c72;
  box-shadow: 0 1px 4px #42b98311;
}
.cart-qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.cart-qty-btn:hover:not(:disabled) {
  background: #42b983;
  color: #fff;
  transform: scale(1.13);
}
.cart-qty-input {
  width: 40px;
  padding: 0.2em 0.4em;
  border-radius: 6px;
  border: 1.5px solid #42b983;
  font-size: 1em;
  text-align: center;
  margin-left: 0.2em;
}
.cart-subtotal {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5em;
  min-width: 100px;
  padding-top: 0.2em;
}
.cart-subtotal-label {
  font-size: 0.93em;
  color: #888;
}
.cart-subtotal-value {
  font-weight: 800;
  color: #42b983;
  font-size: 1.18em;
  letter-spacing: 0.1px;
}
.cart-remove-btn {
  background: none;
  border: none;
  color: #b0b0b0;
  font-size: 1.3em;
  cursor: pointer;
  margin-left: 0.5em;
  transition: color 0.18s, transform 0.18s;
  padding: 0 0.1em;
}
.cart-remove-btn:hover {
  color: #ff5252;
  transform: scale(1.18) rotate(-10deg);
}
.cart-clear-btn {
  background: #f6f8fa;
  color: #1e3c72;
  border: none;
  border-radius: 16px;
  padding: 0.5em 1.2em;
  font-weight: 700;
  margin: 1.2em 0 0 0;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
}
.cart-clear-btn:hover {
  background: #ff5252;
  color: #fff;
  box-shadow: 0 4px 18px #ff525244;
}
.cart-footer {
  width: 100%;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1em;
}
.cart-summary {
  background: #f3f4f6;
  border-radius: 10px;
  padding: 1rem 1.2rem;
  font-size: 1.13em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  box-shadow: 0 1px 4px #00eaff11;
  width: 100%;
}
.cart-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cart-summary-total {
  font-size: 1.18em;
  font-weight: 800;
  color: #1e3c72;
  border-top: 1.5px solid #e0e7ef;
  padding-top: 0.5em;
  margin-top: 0.3em;
}
.cart-summary-total span:last-child {
  color: #30c16c;
  font-size: 1.22em;
  margin-left: 0.5em;
  letter-spacing: 0.5px;
}
.cart-pay-btn {
  background: linear-gradient(90deg, #30c16c 0%, #ff9800 100%);
  color: #fff;
  border: none;
  padding: 0.7em 1.8em;
  border-radius: 20px;
  font-weight: 800;
  margin-top: 0.2em;
  cursor: pointer;
  font-size: 1em;
  transition: background 0.18s, box-shadow 0.18s, transform 0.15s;
  box-shadow: 0 4px 16px #30c16c33, 0 2px 8px #ff980044;
  letter-spacing: 0.3px;
}
.cart-pay-btn:hover {
  background: linear-gradient(90deg, #ff9800 0%, #30c16c 100%);
  box-shadow: 0 8px 24px #30c16c44, 0 2px 8px #ff980055;
  transform: scale(1.04);
}
.cart-toast {
  background: #222c;
  color: #fff;
  padding: 0.3em 1.2em;
  border-radius: 10px;
  font-size: 0.98em;
  font-weight: 500;
  box-shadow: 0 2px 8px #1e3c7240;
  z-index: 999;
  opacity: 0.93;
  text-align: center;
  pointer-events: none;
  animation: fadeInToast 0.2s;
  left: 50%;
  top: 18px;
  position: absolute;
  transform: translateX(-50%);
}
@keyframes fadeInToast {
  from { opacity: 0; transform: translateX(-50%) translateY(-20px);}
  to { opacity: 0.93; transform: translateX(-50%) translateY(0);}
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
/* Responsive */
@media (max-width: 900px) {
  .cart-modal {
    width: 99vw;
    padding: 1.1rem 0.5rem 1rem 0.5rem;
    min-width: unset;
  }
  .cart-item {
    padding: 0.7em 0.2em;
    gap: 0.7em;
  }
  .cart-img-wrap {
    width: 60px;
    height: 60px;
  }
  .cart-img {
    width: 56px;
    height: 56px;
  }
  .cart-name,
  .cart-desc,
  .cart-code {
    max-width: 120px;
  }
  .cart-summary {
    padding: 0.7em 0.5em;
    border-radius: 8px;
  }
}
</style>
