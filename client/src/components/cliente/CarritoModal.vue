<template>
  <div class="cart-modal-overlay" @click.self="$emit('close')">
    <div class="cart-modal">
      <div class="cart-header-row">
        <div class="cart-header-icon">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <span class="cart-title">Carro de Compras</span>
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
                  v-if="item.img"
                  :src="item.img"
                  :alt="item.nombre"
                  class="cart-img"
                />
                <img
                  v-else
                  src="/images/placeholder.png"
                  alt="Sin imagen"
                  class="cart-img"
                />
              </div>
              <div class="cart-info">
                <div class="cart-name">{{ item.nombre }}</div>
                <div class="cart-price-row">
                  <span class="cart-price">L {{ item.precio ? item.precio.toLocaleString() : '0' }}</span>
                  <span class="cart-stock">x{{ item.cantidad }}</span>
                </div>
                <div class="cart-qty-row">
                  <button class="cart-qty-btn" @click="cambiarCantidad(item, -1)" :disabled="item.cantidad <= 1">-</button>
                  <input class="cart-qty-input" type="number" v-model.number="item.cantidad" min="1" :max="item.maxCantidad || 99" @change="actualizarCantidad(item)" />
                  <button class="cart-qty-btn" @click="cambiarCantidad(item, 1)" :disabled="item.maxCantidad && item.cantidad >= item.maxCantidad">+</button>
                  <span style="font-size:0.93em;color:#888;margin-left:0.5em;">/ {{ item.maxCantidad || '∞' }} disp.</span>
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
  background: rgba(30, 60, 114, 0.10);
  z-index: 20000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(16px) saturate(1.5);
  animation: fadeInModal 0.5s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeInModal {
  from { opacity: 0; transform: scale(0.98);}
  to { opacity: 1; transform: scale(1);}
}
.cart-modal {
  background: rgba(255,255,255,0.18);
  border-radius: 2rem;
  box-shadow: 0 12px 48px 0 #1e3c7260, 0 2px 12px #42b98333;
  padding: 2.2rem 2.2rem 1.7rem 2.2rem;
  max-width: 500px;
  width: 99vw;
  margin: 0 auto;
  border: 1.5px solid rgba(66,185,131,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  backdrop-filter: blur(16px) saturate(1.5);
  overflow: hidden;
}
.cart-header-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 2.1rem;
  position: relative;
  gap: 1.2rem;
}
.cart-header-icon {
  background: linear-gradient(135deg, #42b983 60%, #1e3c72 100%);
  border-radius: 50%;
  padding: 0.5em 0.6em;
  box-shadow: 0 4px 24px #42b98355, 0 1.5px 0 #fff4 inset;
  border: 3.5px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.7rem;
}
.cart-header-icon i {
  font-size: 2.5rem;
  color: #fff;
}
.cart-title {
  font-weight: 800;
  font-size: 1.35rem;
  color: #fff;
  letter-spacing: 0.2px;
  text-align: left;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  flex: 1;
}
.cart-close-btn {
  background: none;
  border: none;
  font-size: 2.2rem;
  color: #b0b0b0;
  cursor: pointer;
  position: absolute;
  top: -1.2rem;
  right: -1.2rem;
  transition: color 0.18s, background 0.18s, transform 0.18s;
  border-radius: 50%;
  font-weight: 700;
  line-height: 1;
  width: 2.7rem;
  height: 2.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}
.cart-close-btn:hover {
  color: #ff5252;
  background: none;
  transform: scale(1.12) rotate(8deg);
}
.cart-body {
  margin-bottom: 1.3rem;
  max-height: 340px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #42b983 #e0e7ef;
  width: 100%;
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
  color: #00302cfd;
  font-size: 1.18em;
  padding: 2.2em 0;
  letter-spacing: 0.2px;
}
.cart-empty i {
  font-size: 2.5em;
  color: #ffffff;
  margin-bottom: 0.5em;
  display: block;
}
.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.1em;
}
.cart-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px #1e3c7211;
  padding: 1.1em 1.1em;
  gap: 1.1em;
  position: relative;
  border: none;
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
  width: 70px;
  height: 70px;
  overflow: hidden;
  box-shadow: 0 1px 8px #1e3c7211;
}
.cart-img {
  width: 64px;
  height: 64px;
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
  font-size: 1.13em;
  letter-spacing: 0.1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
  margin-bottom: 0.2em;
}
.cart-price-row {
  font-size: 1em;
  color: #00bcd4;
  margin: 0.1em 0 0.2em 0;
  display: flex;
  align-items: center;
  gap: 0.7em;
}
.cart-price {
  font-weight: 700;
  color: #1e3c72;
  font-size: 1.08em;
}
.cart-stock {
  color: #42b983;
  font-size: 0.97em;
  font-weight: 600;
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
  gap: 0.2em;
  min-width: 90px;
  padding-top: 0.2em;
  margin-left: 0.5em;
}
.cart-subtotal-label {
  font-size: 0.93em;
  color: #888;
}
.cart-subtotal-value {
  font-weight: 800;
  color: #30c16c;
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
  background: none;
  color: #ff5252;
  border: none;
  border-radius: 16px;
  padding: 0.2em 0.7em;
  font-weight: 700;
  margin: 0.7em 0 0 0;
  cursor: pointer;
  font-size: 1em;
  transition: color 0.18s, text-decoration 0.18s;
  display: flex;
  align-items: center;
  gap: 0.4em;
  box-shadow: none;
  text-decoration: underline dotted 1.5px #ff5252;
}
.cart-clear-btn:hover {
  color: #fff;
  background: #ff5252;
  text-decoration: underline solid 2px #fff;
  box-shadow: none;
}
.cart-footer {
  width: 100%;
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}
.cart-summary {
  background: #fff;
  border-radius: 16px;
  padding: 1.1rem 1.2rem 1.1rem 1.2rem;
  font-size: 1.13em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  box-shadow: 0 2px 12px #1e3c7211;
  width: 100%;
  margin-bottom: 0.2em;
}
.cart-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.08em;
  color: #1e3c72;
  font-weight: 700;
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
  font-weight: 900;
}
.cart-pay-btn {
  background: linear-gradient(90deg, #30c16c 0%, #ff9800 100%);
  color: #fff;
  border: none;
  padding: 0.9em 2.2em;
  border-radius: 20px;
  font-weight: 800;
  margin-top: 0.2em;
  cursor: pointer;
  font-size: 1.13em;
  transition: background 0.18s, box-shadow 0.18s, transform 0.15s;
  box-shadow: 0 4px 16px #30c16c33, 0 2px 8px #ff980044;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7em;
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
@media (max-width: 900px) {
  .cart-modal {
    padding: 1.2rem 0.3rem 1.2rem 0.3rem;
    border-radius: 1.1rem;
    max-width: 99vw;
    width: 99vw;
  }
  .cart-header-row {
    gap: 0.7rem;
  }
  .cart-header-icon {
    padding: 0.3em 0.4em;
  }
  .cart-header-icon i {
    font-size: 1.7rem;
  }
  .cart-item {
    padding: 0.7em 0.2em;
    gap: 0.7em;
  }
  .cart-img-wrap {
    width: 44px;
    height: 44px;
  }
  .cart-img {
    width: 40px;
    height: 40px;
  }
  .cart-name {
    max-width: 90px;
  }
  .cart-summary {
    padding: 0.7em 0.5em;
    border-radius: 8px;
  }
  .cart-pay-btn {
    font-size: 1em;
    padding: 0.7em 1.2em;
  }
}
@media (max-width: 500px) {
  .cart-modal {
    max-width: 99vw;
    width: 99vw;
    padding: 0.7rem 0.2rem 0.7rem 0.2rem;
    border-radius: 10px;
  }
  .cart-header-row {
    gap: 0.4rem;
    margin-bottom: 0.7rem;
  }
  .cart-header-icon {
    padding: 0.2em 0.3em;
    margin-right: 0.2rem;
  }
  .cart-header-icon i {
    font-size: 1.2rem;
  }
  .cart-title {
    font-size: 1rem;
  }
  .cart-close-btn {
    font-size: 1.1rem;
    width: 1.5rem;
    height: 1.5rem;
    top: -0.5rem;
    right: -0.5rem;
  }
  .cart-body {
    max-height: 180px;
    font-size: 0.95em;
  }
  .cart-item {
    padding: 0.5em 0.5em;
    border-radius: 10px;
    gap: 0.4em;
  }
  .cart-img-wrap {
    width: 38px;
    height: 38px;
    border-radius: 7px;
  }
  .cart-img {
    width: 32px;
    height: 32px;
    border-radius: 5px;
  }
  .cart-name {
    font-size: 0.98em;
    max-width: 80px;
  }
  .cart-price-row, .cart-stock, .cart-qty-row, .cart-subtotal, .cart-summary, .cart-summary-row, .cart-summary-total {
    font-size: 0.95em;
  }
  .cart-qty-btn, .cart-qty-input {
    width: 18px;
    height: 18px;
    font-size: 0.9em;
    padding: 0;
  }
  .cart-subtotal {
    min-width: 50px;
    padding-top: 0.1em;
    margin-left: 0.2em;
  }
  .cart-remove-btn {
    font-size: 1em;
    margin-left: 0.2em;
  }
  .cart-clear-btn {
    font-size: 0.95em;
    padding: 0.1em 0.3em;
    border-radius: 8px;
    margin: 0.2em 0 0 0;
  }
  .cart-footer {
    margin-top: 0.5rem;
    gap: 0.3em;
  }
  .cart-summary {
    border-radius: 8px;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    margin-bottom: 0.1em;
  }
  .cart-pay-btn {
    font-size: 0.98em;
    padding: 0.4em 1em;
    border-radius: 10px;
    gap: 0.3em;
  }
}
</style>
