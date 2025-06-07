<template>
  <div class="pagar-page fade-in">
    <div class="pagar-container">
      <button class="pagar-cerrar" @click="$emit('cancelar')" title="Cancelar">&times;</button>
      <h2 class="pagar-title"><i class="fas fa-credit-card"></i> Portal de Pago</h2>
      <div class="pagar-content">
        <div class="pagar-resumen">
          <h3>Resumen de tu compra</h3>
          <ul class="pagar-lista">
            <li v-for="item in carrito" :key="item._id" class="pagar-item">
              <img
                v-if="item.img"
                :src="item.img"
                :alt="item.nombre"
                class="pagar-img"
              />
              <img
                v-else
                src="/images/placeholder.png"
                alt="Sin imagen"
                class="pagar-img"
              />
              <div class="pagar-item-info">
                <div class="pagar-item-nombre">{{ item.nombre }}</div>
                <div class="pagar-item-detalle">{{ item.marca }} <span v-if="item.modelo">/ {{ item.modelo }}</span></div>
                <div class="pagar-item-cantidad">Cantidad: {{ item.cantidad }}</div>
              </div>
              <div class="pagar-item-precio">L {{ (item.precio || 0).toLocaleString() }}</div>
            </li>
          </ul>
          <div class="pagar-total-row">
            <span>Total a pagar:</span>
            <span class="pagar-total">L {{ total.toLocaleString() }}</span>
          </div>
        </div>
        <form class="pagar-form" @submit.prevent="confirmarPago">
          <h3>Datos del comprador</h3>
          <label>
            Nombre completo
            <input v-model="form.nombre" type="text" required autocomplete="name" />
          </label>
          <label>
            Email
            <input v-model="form.email" type="email" required autocomplete="email" />
          </label>
          <label>
            Teléfono
            <input v-model="form.telefono" type="tel" required autocomplete="tel" />
          </label>
          <label>
            Dirección de entrega
            <input v-model="form.direccion" type="text" required autocomplete="street-address" />
          </label>
          <h3>Método de pago</h3>
          <div class="pagar-metodos">
            <label class="pagar-metodo">
              <input type="radio" value="tarjeta" v-model="form.metodoPago" required />
              <i class="fas fa-credit-card"></i> Tarjeta de crédito/débito
            </label>
            <label class="pagar-metodo">
              <input type="radio" value="efectivo" v-model="form.metodoPago" />
              <i class="fas fa-money-bill-wave"></i> Pago en efectivo (al recibir)
            </label>
            <label class="pagar-metodo">
              <input type="radio" value="transferencia" v-model="form.metodoPago" />
              <i class="fas fa-university"></i> Transferencia bancaria
            </label>
          </div>
          <div v-if="form.metodoPago === 'tarjeta'" class="pagar-tarjeta">
            <label>
              Número de tarjeta
              <input v-model="form.tarjeta" type="text" maxlength="19" placeholder="0000 0000 0000 0000" required />
            </label>
            <div class="pagar-tarjeta-row">
              <label>
                Expira
                <input v-model="form.expira" type="text" maxlength="5" placeholder="MM/AA" required />
              </label>
              <label>
                CVV
                <input v-model="form.cvv" type="password" maxlength="4" placeholder="•••" required />
              </label>
            </div>
          </div>
          <button class="pagar-btn" :disabled="pagando">
            <span v-if="!pagando"><i class="fas fa-check"></i> Confirmar y pagar</span>
            <span v-else><i class="fas fa-spinner fa-spin"></i> Procesando...</span>
          </button>
          <div v-if="error" class="pagar-error">{{ error }}</div>
        </form>
      </div>
    </div>
    <transition name="fade">
      <div v-if="toastMsg" :class="['cart-toast', 'toast-bottom-right', toastType === 'error' ? 'toast-error' : '']">
        <i v-if="toastType==='success'" class="fas fa-check-circle toast-check"></i>
        <i v-else-if="toastType==='error'" class="fas fa-times-circle toast-error-icon"></i>
        {{ toastMsg }}
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'PagarPasarela',
  props: {
    carrito: { type: Array, required: true },
    usuario: { type: Object, default: null }
  },
  data() {
    return {
      form: {
        nombre: this.usuario?.nombre || '',
        email: this.usuario?.email || '',
        telefono: '',
        direccion: '',
        metodoPago: '',
        tarjeta: '',
        expira: '',
        cvv: ''
      },
      pagando: false,
      error: '',
      exito: false,
      toastMsg: '',
      toastType: 'success',
    }
  },
  computed: {
    total() {
      return this.carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    }
  },
  methods: {
    async confirmarPago() {
      this.error = '';
      if (!this.form.nombre || !this.form.email || !this.form.telefono || !this.form.direccion || !this.form.metodoPago) {
        this.toastType = 'error';
        this.toastMsg = 'Por favor, completa todos los campos obligatorios.';
        setTimeout(() => { this.toastMsg = '' }, 5000);
        return;
      }
      if (this.form.metodoPago === 'tarjeta') {
        if (!/^[0-9]{4} ?[0-9]{4} ?[0-9]{4} ?[0-9]{4}$/.test(this.form.tarjeta)) {
          this.toastType = 'error';
          this.toastMsg = 'Número de tarjeta inválido.';
          setTimeout(() => { this.toastMsg = '' }, 5000);
          return;
        }
        if (!/^\d{2}\/\d{2}$/.test(this.form.expira)) {
          this.toastType = 'error';
          this.toastMsg = 'Fecha de expiración inválida.';
          setTimeout(() => { this.toastMsg = '' }, 5000);
          return;
        }
        if (!/^\d{3,4}$/.test(this.form.cvv)) {
          this.toastType = 'error';
          this.toastMsg = 'CVV inválido.';
          setTimeout(() => { this.toastMsg = '' }, 5000);
          return;
        }
      }
      this.pagando = true;
      try {
        await fetch('http://localhost:3000/api/pago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: this.form.nombre,
            email: this.form.email,
            telefono: this.form.telefono,
            direccion: this.form.direccion,
            metodoPago: this.form.metodoPago,
            carrito: this.carrito,
            total: this.total
          })
        });
        await fetch('http://localhost:3000/api/ventas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cliente: this.form.nombre,
            email: this.form.email,
            telefono: this.form.telefono,
            direccion: this.form.direccion,
            metodoPago: this.form.metodoPago,
            carrito: this.carrito,
            total: this.total
          })
        });
        this.toastType = 'success';
        this.toastMsg = '¡Pago realizado con éxito!';
        setTimeout(() => {
          this.toastMsg = '';
          this.$emit('pago-completado');
        }, 5000);
      } catch (e) {
        this.toastType = 'error';
        this.toastMsg = 'Ocurrió un error al procesar el pago.';
        setTimeout(() => { this.toastMsg = '' }, 5000);
      } finally {
        this.pagando = false;
      }
    }
  }
}
</script>

<style scoped>
.pagar-page {
  min-height: 100vh;
  background: rgba(20, 40, 80, 0.32);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 30000;
  backdrop-filter: blur(24px) saturate(1.7);
  -webkit-backdrop-filter: blur(24px) saturate(1.7);
}
.fade-in {
  animation: fadeInSoft 0.7s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeInSoft {
  from { opacity: 0; transform: translateY(32px) scale(0.98);}
  to { opacity: 1; transform: translateY(0) scale(1);}
}
.pagar-container {
  background: rgba(30, 60, 114, 0.22);
  border-radius: 2rem;
  box-shadow: 0 12px 48px 0 #1e3c7260, 0 2px 12px #42b98333;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 340px;
  max-width: 900px;
  width: 98vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  backdrop-filter: blur(20px) saturate(1.5);
  -webkit-backdrop-filter: blur(20px) saturate(1.5);
  max-height: 96vh;
  overflow-y: auto;
}
.pagar-cerrar {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #b0b0b0;
  cursor: pointer;
  transition: color 0.18s;
  z-index: 2;
  border-radius: 50%;
  width: 2.7rem;
  height: 2.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}
.pagar-cerrar:hover {
  color: #ff5252;
  background: none;
  transform: scale(1.12) rotate(8deg);
}
.pagar-title {
  font-size: 2.1rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 1.5rem;
  letter-spacing: 1.2px;
  text-align: center;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  text-shadow: 0 2px 8px #1e3c7260;
}
.pagar-content {
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
}
.pagar-resumen {
  flex: 1 1 320px;
  min-width: 280px;
  max-width: 380px;
  background: rgba(255,255,255,0.22);
  border-radius: 18px;
  box-shadow: 0 2px 8px #00eaff11;
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  margin-bottom: 1.2rem;
  color: #fff;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
.pagar-resumen h3 {
  font-size: 1.18rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 1.1rem;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #1e3c7260;
}
.pagar-lista {
  list-style: none;
  padding: 0;
  margin: 0 0 1.2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.pagar-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px #42b98311;
  padding: 0.7rem 0.7rem;
}
.pagar-img {
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 8px;
  background: #f5f5f5;
  box-shadow: 0 1px 4px #00eaff11;
}
.pagar-item-info {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.pagar-item-nombre {
  font-weight: 700;
  color: #232b36;
  font-size: 1.08rem;
}
.pagar-item-detalle {
  color: #42b983;
  font-size: 0.97rem;
  font-weight: 600;
}
.pagar-item-cantidad {
  color: #7a8ca3;
  font-size: 0.97rem;
}
.pagar-item-precio {
  font-weight: 900;
  color: #42b983; /* verde visible */
  font-size: 1.25rem;
  text-shadow: none;
  min-width: 90px;
  text-align: right;
}
.pagar-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.18rem;
  font-weight: 900;
  color: #fff;
  border-top: 1.5px solid #e0e0e0;
  padding-top: 0.7rem;
  margin-top: 0.7rem;
}
.pagar-total-row span:first-child {
  color: #fff;
  font-weight: 800;
  font-size: 1.13rem;
  text-shadow: 0 2px 8px #1e3c7260;
}
.pagar-total {
  color: #fff;
  font-size: 1.6rem;
  font-weight: 900;
  text-shadow: none;
}
.pagar-form {
  flex: 1 1 320px;
  min-width: 280px;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  background: rgba(255,255,255,0.22);
  border-radius: 18px;
  box-shadow: 0 2px 8px #00eaff11;
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  color: #fff;
  backdrop-filter: blur(8px) saturate(1.2);
}
.pagar-form h3 {
  font-size: 1.13rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 0.7rem;
  letter-spacing: 1px;
  text-shadow: 0 2px 8px #1e3c7260;
}
.pagar-form label {
  display: block;
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.2rem;
  font-size: 1.01rem;
  text-shadow: 0 2px 8px #1e3c7260;
}
.pagar-form input[type="text"],
.pagar-form input[type="email"],
.pagar-form input[type="tel"],
.pagar-form input[type="password"] {
  width: 100%;
  padding: 0.5em;
  border-radius: 8px;
  border: 1.5px solid #42b983;
  font-size: 1em;
  margin-bottom: 0.5em;
  font-family: inherit;
  outline: none;
  background: rgba(255,255,255,0.7);
  color: #1e3c72;
  transition: border 0.18s, background 0.18s;
}
.pagar-form input:focus {
  border: 1.5px solid #00eaff;
  background: #fff;
}
.pagar-metodos {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 0.7rem;
}
.pagar-metodo {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-weight: 600;
  font-size: 1.01rem;
  cursor: pointer;
  color: #fff;
}
.pagar-metodo input[type="radio"] {
  accent-color: #42b983;
  margin-right: 0.5em;
}
.pagar-tarjeta {
  margin-bottom: 0.7rem;
}
.pagar-tarjeta-row {
  display: flex;
  gap: 1rem;
}
.pagar-tarjeta-row label {
  flex: 1 1 50%;
}
.pagar-btn {
  background: linear-gradient(90deg, #42b983 0%, #00eaff 100%);
  color: #fff;
  border: none;
  border-radius: 18px;
  padding: 0.7rem 2.2rem;
  font-size: 1.13rem;
  font-weight: 900;
  cursor: pointer;
  margin-top: 1.2rem;
  transition: background 0.18s, box-shadow 0.18s, transform 0.13s;
  box-shadow: 0 2px 8px #42b98322;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  justify-content: center;
}
.pagar-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.pagar-btn:hover:not(:disabled) {
  background: linear-gradient(90deg, #00eaff 0%, #42b983 100%);
  box-shadow: 0 6px 24px #42b98333;
  transform: translateY(-2px) scale(1.06);
}
.pagar-error {
  color: #ff5252;
  font-weight: 700;
  margin-top: 0.7rem;
  text-align: center;
  text-shadow: 0 2px 8px #fff;
}
.cart-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: opacity 0.45s cubic-bezier(.4,0,.2,1), transform 0.45s cubic-bezier(.4,0,.2,1);
  opacity: 0.95;
  backdrop-filter: blur(18px) saturate(1.7);
  -webkit-backdrop-filter: blur(18px) saturate(1.7);
  animation: toast-fade-in 0.5s cubic-bezier(.4,0,.2,1);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.45s cubic-bezier(.4,0,.2,1), transform 0.45s cubic-bezier(.4,0,.2,1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(32px) scale(0.98);
}
@keyframes toast-fade-in {
  from { opacity: 0; transform: translateY(32px) scale(0.98); }
  to { opacity: 0.95; transform: translateY(0) scale(1); }
}
@media (max-width: 900px) {
  .pagar-container {
    flex-direction: column;
    min-width: unset;
    max-width: 99vw;
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    max-height: 99vh;
    overflow-y: auto;
  }
  .pagar-content {
    flex-direction: column;
    gap: 1.2rem;
  }
  .pagar-resumen, .pagar-form {
    max-width: 99vw;
    min-width: unset;
    padding: 1rem 0.5rem 1rem 0.5rem;
  }
}
@media (max-width: 500px) {
  .pagar-modal {
    max-width: 99vw;
    width: 99vw;
    padding: 1.2rem 0.3rem 1.2rem 0.3rem;
    border-radius: 1.1rem;
  }
  .pagar-title {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  .pagar-form {
    gap: 0.3rem;
    margin-bottom: 0.5rem;
    padding: 0.2rem 0.1rem;
  }
  .pagar-form-group {
    width: 99%;
    margin-bottom: 0.2rem;
  }
  .pagar-form input,
  .pagar-form select {
    font-size: 0.95rem;
    padding: 0.3rem 0.5rem;
    border-radius: 7px;
  }
  .pagar-btn {
    font-size: 0.95rem;
    padding: 0.3rem 0;
    border-radius: 7px;
    margin: 0.3rem auto 0.2rem auto;
    width: 99%;
  }
  .pagar-resumen {
    font-size: 0.95rem;
    padding: 0.5rem 0.2rem;
    border-radius: 8px;
  }
}
</style>
