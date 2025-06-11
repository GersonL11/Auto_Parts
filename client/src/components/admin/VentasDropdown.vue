<template>
  <div v-if="visible" class="ventas-modal-overlay" @click.self="close">
    <div class="ventas-modal">
      <div class="ventas-modal-header">
        <span class="ventas-modal-title">
          <i class="fas fa-clock" style="color:#42b983;"></i>
          Ventas recientes
        </span>
        <button class="ventas-modal-close" @click="close">&times;</button>
      </div>
      <div class="ventas-modal-body">
        <div v-if="loading">Cargando ventas...</div>
        <div v-else>
          <div v-if="ventas.length === 0">
            <p>No hay ventas recientes.</p>
          </div>
          <ul v-else class="ventas-list">
            <li v-for="venta in ventas.filter(v => !ocultar.includes(v._id))" :key="venta._id">
              <div class="venta-main">
                <div class="venta-info">
                  <b>{{ venta.cliente }}</b>
                  <div class="venta-total">Total: L {{ venta.total }}</div>
                  <small>{{ formatFecha(venta.fecha) }}</small>
                  <div class="venta-email">{{ venta.email }}</div>
                </div>
                <div class="venta-detalle">
                  <span class="venta-metodo">{{ venta.metodoPago }}</span>
                  <span class="venta-direccion">{{ venta.direccion }}</span>
                  <button class="venta-btn delete venta-btn-elegante" @click="borrarNotificacionVenta(venta._id)" title="Quitar notificación de venta">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VentasDropdown',
  props: {
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      ventas: [],
      loading: true,
      ocultar: JSON.parse(localStorage.getItem('ventas_ocultas') || '[]')
    };
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async fetchVentas() {
      this.loading = true;
      try {
        const res = await fetch('http://localhost:3000/api/ventas');
        const ventas = await res.json();
        // Ordenar por fecha descendente y mostrar solo las 10 más recientes
        this.ventas = ventas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 10);
      } catch (e) {
        this.ventas = [];
      }
      this.loading = false;
    },
    borrarNotificacionVenta(id) {
      if (!this.ocultar.includes(id)) {
        this.ocultar.push(id);
        localStorage.setItem('ventas_ocultas', JSON.stringify(this.ocultar));
        this.$emit('notificacion-eliminada', id);
      }
    },
    formatFecha(fecha) {
      if (!fecha) return '';
      return new Date(fecha).toLocaleString('es-HN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.fetchVentas();
        this.$emit('opened');
      }
    }
  },
  mounted() {
    if (this.visible) this.fetchVentas();
  }
}
</script>

<style scoped>
.ventas-modal-overlay {
  position: fixed;
  inset: 0;
  background: linear-gradient(120deg, rgba(30,40,60,0.85) 0%, rgba(60,80,120,0.85) 100%);
  backdrop-filter: blur(8px) saturate(1.2);
  z-index: 30000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInModal 0.4s cubic-bezier(.4,0,.2,1);
}
.ventas-modal {
  background: #fff;
  color: #232b36;
  border-radius: 20px;
  box-shadow: 0 8px 40px 0 rgba(30,40,60,0.18), 0 1.5px 0 rgba(66,185,131,0.08);
  border: 1.5px solid #e3e8f0;
  min-width: 370px;
  max-width: 96vw;
  min-height: 120px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  animation: modalPopIn 0.5s cubic-bezier(.4,0,.2,1);
}
.ventas-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.3rem 2rem 1rem 2rem;
  border-bottom: 1px solid #f0f2f7;
  background: #fff;
  border-radius: 20px 20px 0 0;
}
.ventas-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #22304a;
  display: flex;
  align-items: center;
  gap: 0.6em;
  letter-spacing: 0.5px;
}
.ventas-modal-title i {
  font-size: 1.1em;
  color: #42b983;
}
.ventas-modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #b0b8c9;
  cursor: pointer;
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.ventas-modal-close:hover {
  color: #ff5252;
  background: #f5f7fa;
}
.ventas-modal-body {
  padding: 1.7rem 2rem 1.7rem 2rem;
  background: #fff;
  color: #232b36;
  border-radius: 0 0 20px 20px;
}
.ventas-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.ventas-list li {
  padding: 1.1em 1.3em 1em 1.3em;
  border-radius: 14px;
  margin-bottom: 18px;
  background: #f8fafc;
  color: #1a2233;
  border: 1px solid #e3e8f0;
  box-shadow: 0 2px 10px 0 rgba(30,40,60,0.06);
  display: flex;
  align-items: flex-start;
  position: relative;
  transition: box-shadow 0.18s, background 0.18s, border 0.18s;
  animation: cardFadeIn 0.5s cubic-bezier(.4,0,.2,1);
}
.ventas-list li:hover {
  box-shadow: 0 6px 18px 0 #42b98322, 0 2px 8px #ff980022;
  border-color: #42b98333;
  background: #f3f7fa;
}
.venta-main {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.1em;
}
.venta-info {
  flex: 1 1 0%;
  min-width: 0;
  font-size: 1em;
  font-family: 'Segoe UI', Arial, sans-serif;
}
.venta-info b {
  font-size: 1.08em;
  color: #22304a;
  font-weight: 700;
}
.venta-total {
  color: #42b983;
  font-weight: 700;
  margin: 0.18em 0 0.08em 0;
  font-size: 1em;
}
.venta-email {
  color: #8a97b1;
  font-size: 0.97em;
  margin-top: 0.1em;
}
.venta-detalle {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  align-items: flex-end;
  font-size: 0.97em;
  color: #1e3c72;
  min-width: 110px;
  position: relative;
}
.venta-metodo {
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg, #42b983 60%, #1e3c72 100%);
  padding: 0.18em 0.7em;
  border-radius: 7px;
  font-size: 0.97em;
  margin-bottom: 0.1em;
  box-shadow: 0 1px 4px #42b98322;
  border: none;
}
.venta-direccion {
  color: #8a97b1;
  font-size: 0.97em;
  margin-bottom: 0.1em;
}
.venta-btn {
  background: #fff;
  border: 1px solid #e3e8f0;
  cursor: pointer;
  padding: 0.45em 0.65em;
  border-radius: 50%;
  transition: box-shadow 0.15s, background 0.15s, color 0.15s, transform 0.13s;
  font-size: 1.13em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px #ff525211;
  color: #b0b8c9;
  margin-top: 0.2em;
  outline: none;
}
.venta-btn-elegante {
  background: #fff;
  color: #ff5252;
  border: 1.5px solid #ff5252;
  box-shadow: 0 2px 8px #ff525211;
  position: relative;
}
.venta-btn-elegante:hover, .venta-btn-elegante:focus {
  background: #ff5252;
  color: #fff;
  box-shadow: 0 4px 12px #ff525222;
  border-color: #ff5252;
  transform: scale(1.08) translateY(-1px);
}
.venta-btn-elegante svg {
  display: block;
  filter: none;
  transition: filter 0.15s;
}
.venta-btn-elegante:active {
  transform: scale(0.97);
  box-shadow: 0 1px 4px #ff525244;
}
@media (max-width: 600px) {
  .ventas-modal {
    min-width: 98vw;
    max-width: 100vw;
    min-height: 100px;
    max-height: 98vh;
    border-radius: 0;
  }
  .ventas-modal-header, .ventas-modal-body {
    padding-left: 0.7rem;
    padding-right: 0.7rem;
  }
}
@keyframes fadeInModal {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes modalPopIn {
  0% { opacity: 0; transform: scale(0.92) translateY(40px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes cardFadeIn {
  0% { opacity: 0; transform: translateY(20px) scale(0.97); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
