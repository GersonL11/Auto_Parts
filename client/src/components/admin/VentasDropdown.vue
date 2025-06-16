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
      <div style="padding: 0 1.5rem 0.5rem 1.5rem;">
      </div>
      <div style="padding: 0 1.5rem 0.5rem 1.5rem; display: flex; flex-direction: column; gap: 0.5em;">
        <div style="display: flex; gap: 0.5em;">
          <input v-model="fechaInicio" type="date" style="flex:1; padding: 0.4em 0.7em; border-radius: 8px; border: 1px solid #e3e8f0; font-size: 1em;" />
          <input v-model="fechaFin" type="date" style="flex:1; padding: 0.4em 0.7em; border-radius: 8px; border: 1px solid #e3e8f0; font-size: 1em;" />
        </div>
      </div>
      <div class="ventas-modal-body">
        <div v-if="loading">Cargando ventas...</div>
        <div v-else>
          <div v-if="ventas.length === 0">
            <p>No hay ventas recientes.</p>
          </div>
          <ul v-else class="ventas-list">
            <li v-for="venta in ventasFiltradas" :key="venta._id" class="venta-card-anim">
              <div class="venta-main" style="padding: 0.2em 0;">
                <div class="venta-header-row" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.2em;">
                  <span class="venta-nombre" style="font-size: 1.18em; font-weight: 800; color: #fff; letter-spacing: 0.5px;">{{ venta.cliente }}</span>
                  <button class="venta-btn delete" @click="borrarNotificacionVenta(venta._id)" title="Quitar notificación de venta">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; margin: 0.2em 0 0.3em 0;">
                  <span class="venta-total" style="font-size: 2em; font-weight: 900; color: #42b983;">L {{ venta.total }}</span>
                  <span class="venta-metodo" style="margin-top: 0.18em; font-size: 1em; background: linear-gradient(90deg, #42b983 60%, #1e3c72 100%); color: #fff; padding: 0.18em 1.1em; border-radius: 12px; box-shadow: 0 1px 4px #42b98322; font-weight: 700; letter-spacing: 0.5px;">{{ venta.metodoPago }}</span>
                </div>
                <div class="venta-email-row" style="margin: 0.4em 0 0.1em 0; display: flex; align-items: center; color: #e3e8f0; font-size: 1em; font-weight: 500;">
                  <i class="fas fa-envelope" style="margin-right: 0.4em; color: #b0e0ff;"></i>
                  <span class="venta-email">{{ venta.email }}</span>
                </div>
                <div class="venta-meta-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.2em;">
                  <span class="venta-fecha" style="display: flex; align-items: center; color: #e3e8f0; font-size: 1em; font-weight: 500;">
                    <i class="fas fa-calendar-alt" style="margin-right: 0.3em; color: #b0e0ff;"></i>{{ formatFecha(venta.fecha) }}
                  </span>
                  <span class="venta-direccion" style="display: flex; align-items: center; color: #e3e8f0; font-size: 1em; font-weight: 500;">
                    <i class="fas fa-map-marker-alt" style="margin-right: 0.3em; color: #b0e0ff;"></i>{{ venta.direccion }}
                  </span>
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
      fechaInicio: '',
      fechaFin: '',
      ocultar: JSON.parse(localStorage.getItem('ventas_ocultas') || '[]')
    };
  },
  computed: {
    ventasFiltradas() {
      function getLocalYMD(dateStr) {
        const d = new Date(dateStr);
        const y = d.getFullYear();
        const m = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        return `${y}-${m}-${day}`;
      }
      const fechaInicio = this.fechaInicio ? this.fechaInicio : null;
      const fechaFin = this.fechaFin ? this.fechaFin : null;
      return this.ventas
        .filter(v => !this.ocultar.includes(v._id))
        .filter(v => {
          if (!fechaInicio && !fechaFin) return true;
          if (!v.fecha) return false;
          const ventaLocal = getLocalYMD(v.fecha);
          // Solo una fecha: mostrar solo ese día
          if (fechaInicio && !fechaFin) {
            return ventaLocal === fechaInicio;
          }
          if (!fechaInicio && fechaFin) {
            return ventaLocal === fechaFin;
          }
          if (fechaInicio && fechaFin) {
            return ventaLocal >= fechaInicio && ventaLocal <= fechaFin;
          }
          return true;
        })
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }
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
  position: absolute;
  top: 6.0rem;
  right: 2.5rem;
  left: unset;
  bottom: unset;
  background: none;
  z-index: 5000;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  width: 100%;
  height: auto;
  pointer-events: none;
}
.ventas-modal {
  position: relative;
  box-shadow: var(--notif-shadow, 0 2px 12px 0 rgba(30,40,60,0.07));
  margin-top: 0;
  pointer-events: auto;
  z-index: 41000;
  background: var(--notif-bg, #fff);
  border: var(--notif-border, 1.5px solid #e3e8f0);
  border-radius: var(--notif-radius, 14px);
  width: 400px;
  max-width: 96vw;
  min-width: 320px;
  height: auto;
  max-height: 80vh;
  overflow-y: visible;
  padding: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  position: relative;
  opacity: 1;
}
.ventas-modal::before {
  content: '';
  position: absolute;
  top: -14px;
  right: 32px;
  left: unset;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 14px solid #fff;
  filter: drop-shadow(0 2px 4px #232b3622);
  z-index: 1;
}
.admin-dark-mode .ventas-modal,
.admin-dark-mode .ventas-modal::before {
  --notif-bg: #232b36;
  --notif-border: 1.5px solid #353b4a;
  --notif-title: #e3e8f0;
  --notif-accent: #42e39a;
  --notif-danger: #ff5252;
  --notif-muted: #b0b8c9;
  --notif-badge-bg: #ff5252;
  --notif-btn-bg: #2d3442;
  --notif-btn-hover: #22332a;
}
.admin-dark-mode .ventas-modal {
  background: var(--notif-bg);
  color: #e3e8f0;
  border: var(--notif-border);
}
.admin-dark-mode .ventas-modal::before {
  border-bottom: 14px solid #232b36;
}
.ventas-modal-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1.1rem 1.5rem 1rem 1.5rem;
  border-bottom: 1px solid #f0f2f7;
  background: transparent;
  border-radius: var(--notif-radius) var(--notif-radius) 0 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--notif-title);
  gap: 0.7em;
}
.ventas-modal-title i {
  width: 1.2em;
  height: 1.2em;
  color: var(--notif-accent);
  margin-right: 0.2em;
}
.ventas-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--notif-muted);
  cursor: pointer;
  border-radius: 50%;
  width: 2.1rem;
  height: 2.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.ventas-modal-close:hover {
  color: var(--notif-danger);
  background: #f5f7fa;
}
.ventas-modal-body {
  padding: 1.2rem 1.5rem 1.2rem 1.5rem;
  background: transparent;
  color: #232b36;
  border-radius: 0 0 var(--notif-radius) var(--notif-radius);
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 0;
}
.ventas-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1 1 0%;
  min-height: 120px;
  max-height: 48vh;
  overflow-y: auto;
  background: transparent;
}
.ventas-list li {
  box-shadow: 0 2px 12px 0 rgba(30,40,60,0.10);
  border: 1.5px solid #e3e8f0;
  margin-bottom: 18px;
  padding: 1.2em 1.3em 1.1em 1.3em;
  background: #fff;
  animation: cardFadeIn 0.4s cubic-bezier(.4,0,.2,1);
  display: flex;
  align-items: flex-start;
  position: relative;
  transition: background 0.13s, border 0.13s;
}
.venta-card-anim {
  animation: cardFadeIn 0.4s cubic-bezier(.4,0,.2,1);
}
.venta-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.2em;
}
.venta-nombre {
  font-size: 1.13em;
  color: #1e3c72;
  font-weight: 700;
  margin-bottom: 0.1em;
}
.venta-total {
  color: #42b983;
  font-weight: 900;
  font-size: 1.18em;
  margin-left: 0;
  margin-top: 0.1em;
}
.venta-btn.delete {
  margin-top: 0.1em;
}
.venta-badges-row, .venta-meta-row {
  margin-top: 0.4em;
}
.admin-dark-mode .ventas-list li {
  background: #2d3442;
  color: #e3e8f0;
  border: 1px solid #3a4250;
}
.admin-dark-mode .ventas-list li:hover {
  background: #232b36;
  border-color: #42e39a99;
}
.venta-main {
  display: flex;
  width: 100%;
  position: relative;
  flex-direction: column;
  gap: 0.2em;
}
.venta-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7em;
}
.venta-nombre {
  font-size: 1.05em;
  color: var(--notif-title, #1e3c72);
  font-weight: 700;
}
.venta-total {
  color: var(--notif-accent, #42b983);
  font-weight: 700;
  font-size: 1.05em;
  margin-left: 0.5em;
}
.venta-meta-row {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-top: 0.1em;
}
.venta-email, .venta-fecha {
  color: #8a97b1;
  font-size: 0.97em;
}
.venta-badges-row {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin-top: 0.1em;
}
.venta-metodo {
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg, #42b983 60%, #1e3c72 100%);
  padding: 0.18em 0.7em;
  border-radius: 7px;
  font-size: 0.97em;
  box-shadow: 0 1px 4px #42b98322;
  border: none;
  display: inline-block;
}
.venta-direccion {
  color: #8a97b1;
  font-size: 0.97em;
}
.venta-detalle {
  position: absolute;
  right: -0.3em;
  bottom: -0.3em;
  display: flex;
  flex-direction: row;
  gap: 0.15em;
  align-items: flex-end;
  justify-content: flex-end;
  min-width: 3.8em;
}
.venta-btn {
  background: transparent;
  border: none;
  font-size: 1.1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  transition: background 0.15s, color 0.15s;
  color: #7a869a;
  outline: none;
  box-shadow: none;
  padding: 0;
}
.venta-btn i, .venta-btn svg {
  font-size: 1.1em;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}
.venta-btn.delete {
  color: #ff5252;
}
.venta-btn.delete:hover {
  background: #ffeaea;
  color: #c82333;
}
.admin-dark-mode .venta-btn {
  background: transparent;
  color: #b0b8c9;
}
.admin-dark-mode .venta-btn.delete {
  color: #ff5252;
}
.admin-dark-mode .venta-btn.delete:hover {
  background: #3a2323;
  color: #fff;
}
.venta-email-row, .venta-meta-row span {
  color: #2d3442 !important;
  font-size: 1em;
  font-weight: 500;
}
.venta-email-row i, .venta-meta-row i {
  color: #1e3c72 !important;
}
.admin-dark-mode .venta-email-row, .admin-dark-mode .venta-meta-row span {
  color: #e3e8f0 !important;
}
.admin-dark-mode .venta-email-row i, .admin-dark-mode .venta-meta-row i {
  color: #b0e0ff !important;
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
