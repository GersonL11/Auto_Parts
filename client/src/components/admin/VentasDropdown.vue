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
      <div class="ventas-tabs-row" style="display: flex; gap: 2em; align-items: center; padding: 0.7em 1.5em 0.2em 1.5em;">
        <span :class="['ventas-tab', {active: tab === 'nuevas'}]" @click="tab = 'nuevas'">
          Nuevas
          <span v-if="nuevasVentas.length > 0" class="ventas-badge">{{ nuevasVentas.length }}</span>
        </span>
        <span :class="['ventas-tab', {active: tab === 'todas'}]" @click="tab = 'todas'">Todas</span>
      </div>
      <div class="ventas-totales-row" style="padding: 0 1.5rem 0.5rem 1.5rem; display: flex; justify-content: flex-end; align-items: center;">
        <span style="font-weight:700; color:#1e3c72;">Total 7 días: L {{ totalVentas7Dias.toLocaleString() }}</span>
      </div>
      <div class="ventas-modal-body">
        <div v-if="loading">Cargando ventas...</div>
        <div v-else>
          <div v-if="(tab === 'nuevas' ? nuevasVentas.length : ventas.length) === 0">
            <p>No hay ventas para mostrar.</p>
          </div>
          <ul v-else class="ventas-list">
            <li v-for="venta in (tab === 'nuevas' ? nuevasVentas : ventas)" :key="venta._id" class="venta-card-anim">
              <div class="venta-main" style="padding: 0.2em 0;">
                <div class="venta-header-row" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.1em;">
                  <span class="venta-nombre" style="font-size: 1em; font-weight: 700; color: #1e3c72; letter-spacing: 0.2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ venta.cliente }}</span>
                  <div style="display: flex; gap: 0.3em; align-items: center;">
                    <button v-if="tab === 'nuevas'" class="venta-btn mark-read" @click="borrarNotificacionVenta(venta._id)" title="Marcar como leída">
                      <i class="fas fa-check"></i>
                    </button>
                  </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: center; margin: 0.2em 0 0.3em 0;">
                  <span class="venta-total" style="font-size: 1.4em; font-weight: 900; color: #42b983;">L {{ venta.total }}</span>
                  <span class="venta-metodo" style="margin-top: 0.1em; font-size: 0.95em; padding: 0.1em 0.7em; border-radius: 8px; font-weight: 700; letter-spacing: 0.2px; background: linear-gradient(90deg, #42b983 60%, #1e3c72 100%); color: #fff; box-shadow: 0 1px 4px #42b98322;">{{ venta.metodoPago }}</span>
                </div>
                <div class="venta-email-row" style="margin: 0.2em 0 0.1em 0; display: flex; align-items: center; color: #2d3442; font-size: 0.95em; font-weight: 500; gap: 0.3em;">
                  <i class="fas fa-envelope" style="margin-right: 0.4em; color: #b0e0ff;"></i>
                  <span class="venta-email">{{ venta.email }}</span>
                </div>
                <div class="venta-meta-row" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.1em; gap: 0.5em;">
                  <span class="venta-fecha" style="display: flex; align-items: center; color: #2d3442; font-size: 0.95em; font-weight: 500;">
                    <i class="fas fa-calendar-alt" style="margin-right: 0.3em; color: #b0e0ff;"></i>{{ formatFecha(venta.fecha) }}
                  </span>
                  <span class="venta-direccion" style="display: flex; align-items: center; color: #2d3442; font-size: 0.95em; font-weight: 500;">
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
      ocultar: [],
      adminId: null,
      tab: 'nuevas'
    };
  },
  computed: {
    nuevasVentas() {
      return this.ventas.filter(v => !this.ocultar.includes(v._id));
    },
    totalVentas7Dias() {
      return this.ventas.reduce((sum, v) => sum + (Number(v.total) || 0), 0);
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async fetchVentas() {
      this.loading = true;
      try {
        if (!this.adminId) {
          const user = localStorage.getItem('autoparts_user');
          if (user) {
            const usuario = JSON.parse(user);
            this.adminId = usuario._id;
          }
        }
        let ocultas = [];
        if (this.adminId) {
          const resLeidas = await fetch(`http://localhost:3000/api/ventas/leidas/admin?adminId=${this.adminId}`);
          ocultas = await resLeidas.json();
        }
        this.ocultar = ocultas;
        const res = await fetch('http://localhost:3000/api/ventas');
        const ventas = await res.json();
        const ahora = new Date();
        const hace7dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
        this.ventas = ventas
          .filter(v => {
            if (!v.fecha) return false;
            const fechaVenta = new Date(v.fecha);
            return fechaVenta >= hace7dias && fechaVenta <= ahora;
          })
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 10);
      } catch (e) {
        this.ventas = [];
      }
      this.loading = false;
    },
    async borrarNotificacionVenta(id) {
      if (!this.adminId) {
        const user = localStorage.getItem('autoparts_user');
        if (user) {
          const usuario = JSON.parse(user);
          this.adminId = usuario._id;
        }
      }
      if (this.adminId) {
        await fetch('http://localhost:3000/api/ventas/leida', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ventaId: id, adminId: this.adminId })
        });
        this.ocultar.push(id);
      }
      this.$emit('notificacion-eliminada', id);
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
  border-radius: 22px; 
  max-width: 350px;
  min-width: 300px;
  width: 400px;
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
  overflow-y: auto;
  max-height: 55vh;
}
.ventas-tabs-row {
  font-size: 1.13em;
  margin-bottom: 0.2em;
  display: flex;
  gap: 1.2em;
}
.ventas-tab {
  font-weight: 700;
  cursor: pointer;
  position: relative;
  padding: 0.45em 1.5em;
  color: #232b36;
  border-radius: 18px 18px 0 0; 
  background: linear-gradient(180deg, #f5f7fa 80%, #e3e8f0 100%);
  border: 1.5px solid #e3e8f0;
  border-bottom: none;
  margin-bottom: -2px;
  transition: color 0.18s, background 0.18s, box-shadow 0.18s, transform 0.12s;
  box-shadow: 0 2px 8px #232b3608;
  z-index: 1;
  outline: none;
  font-size: 1.08em;
  box-sizing: border-box;
  min-width: 90px;
  text-align: center;
  user-select: none;
  box-shadow: 0 2px 8px #232b3608, 0 1.5px 0 #fff inset;
}
.ventas-tab:not(.active):hover {
  background: linear-gradient(180deg, #e3e8f0 80%, #f5f7fa 100%);
  color: #1e3c72;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 16px #42b98322;
}
.admin-dark-mode .ventas-tab {
  color: #e3e8f0;
  background: #232b36;
  border: 1.5px solid #3a4250;
  border-bottom: none;
  box-shadow: 0 2px 8px #42b98311;
}
.admin-dark-mode .ventas-tab:not(.active):hover {
  background: #2d3442;
  color: #42e39a;
}
.ventas-tab.active {
  background: linear-gradient(180deg, #fff 80%, #eafff3 100%);
  color: #1e3c72;
  border-bottom: 2.5px solid #ff5252;
  font-size: 1.18em;
  box-shadow: 0 4px 16px #42b98311, 0 2px 0 #fff inset;
  z-index: 2;
  transform: translateY(-3px) scale(1.07);
}
.admin-dark-mode .ventas-tab.active {
  background: #232b36;
  color: #ff9800;
  border-bottom: 2.5px solid #ff9800;
}
.ventas-tab.active.nuevas {
  color: #30c16c;
  border-bottom: 2.5px solid #30c16c;
  background: #eafff3;
}
.admin-dark-mode .ventas-tab.active.nuevas {
  color: #42e39a;
  border-bottom: 2.5px solid #42e39a;
  background: #1e3c72;
}
.ventas-tab.active.todas {
  color: #ff9800;
  border-bottom: 2.5px solid #ff9800;
  background: #fff8e1;
}
.admin-dark-mode .ventas-tab.active.todas {
  color: #ffb300;
  border-bottom: 2.5px solid #ffb300;
  background: #232b36;
}
.ventas-badge {
  background: #ff5252;
  color: #fff;
  border-radius: 12px;
  font-size: 0.93em;
  font-weight: 700;
  padding: 0.1em 0.7em;
  margin-left: 0.4em;
  vertical-align: middle;
  display: inline-block;
}
.ventas-totales-row {
  font-size: 1.1em;
  margin-bottom: 0.5em;
  color: #232b36;
}
.admin-dark-mode .ventas-totales-row {
  color: #e3e8f0;
}
.ventas-totales-row span {
  font-weight: 700;
}
.ventas-totales-row span:first-child {
  color: #30c16c;
}
.ventas-totales-row span:last-child {
  color: #30c16c !important;
  font-weight: 900;
}
.admin-dark-mode .ventas-totales-row span:last-child {
  color: #42e39a !important;
  font-weight: 900;
}
.ventas-list {
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  padding: 0;
  margin: 0;
  max-width: 100%;
}
.ventas-list li {
  box-shadow: 0 2px 8px #1e3c7212;
  border: 1.5px solid #e3e8f0;
  margin-bottom: 18px;
  padding: 0.7em 1em 0.7em 1em;
  background: #fff;
  animation: cardFadeIn 0.4s cubic-bezier(.4,0,.2,1);
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  min-width: 0;
}
.venta-card-anim {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px #1e3c7212;
  padding: 0.7em 1em 0.7em 1em;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3em;
  min-width: 0;
}
.admin-dark-mode .venta-card-anim {
  background: #232b3b;
  box-shadow: 0 2px 8px #0004;
}
.venta-main {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  padding: 0;
}
.venta-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.1em;
}
.venta-nombre {
  font-size: 1em;
  font-weight: 700;
  color: #1e3c72;
  letter-spacing: 0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.venta-btn {
  font-size: 0.85em;
  width: 1.5em;
  height: 1.5em;
  padding: 0;
  margin: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.venta-btn i, .venta-btn svg {
  font-size: 0.9em;
}
.venta-total {
  font-size: 1.4em;
  font-weight: 900;
  color: #42b983;
  margin-bottom: 0.1em;
}
.venta-metodo {
  margin-top: 0.1em;
  font-size: 0.95em;
  padding: 0.1em 0.7em;
  border-radius: 8px;
  font-weight: 700;
  letter-spacing: 0.2px;
  background: linear-gradient(90deg, #42b983 60%, #1e3c72 100%);
  color: #fff;
  box-shadow: 0 1px 4px #42b98322;
}
.venta-email-row {
  margin: 0.2em 0 0.1em 0;
  display: flex;
  align-items: center;
  color: #2d3442;
  font-size: 0.95em;
  font-weight: 500;
  gap: 0.3em;
  width: 100%;
}
.venta-email {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
}
.venta-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.1em;
  gap: 0.5em;
}
.venta-fecha, .venta-direccion {
  display: flex;
  align-items: center;
  color: #2d3442;
  font-size: 0.95em;
  font-weight: 500;
  gap: 0.2em;
}
@media (max-width: 600px) {
  .venta-card-anim {
    padding: 0.5em 0.5em 0.5em 0.5em;
  }
  .venta-total {
    font-size: 1.1em;
  }
  .ventas-modal {
    min-width: 96vw;
    max-width: 98vw;
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
.admin-dark-mode .venta-nombre {
  color: #b0e0ff !important;
}
.admin-dark-mode .venta-total {
  color: #42ffb9 !important;
}
.admin-dark-mode .venta-email-row,
.admin-dark-mode .venta-fecha,
.admin-dark-mode .venta-direccion {
  color: #e3e8f0 !important;
}
.admin-dark-mode .venta-metodo {
  background: linear-gradient(90deg, #42b983 60%, #1e3c72 100%);
  color: #fff !important;
}
.venta-btn.mark-read {
  background: linear-gradient(135deg, #42b983 60%, #1e3c72 100%);
  border: none;
  color: #fff;
  font-size: 0.9em;
  border-radius: 50%;
  width: 1.3em;
  height: 1.3em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px #42b98333;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.12s;
  outline: none;
  cursor: pointer;
}
.venta-btn.mark-read:hover {
  background: linear-gradient(135deg, #30c16c 60%, #1e3c72 100%);
  color: #fff;
  box-shadow: 0 4px 16px #42b98355;
  transform: scale(1.08);
}
.venta-btn.mark-read i, .venta-btn.mark-read svg {
  font-size: 0.9em;
  color: #fff;
}
.ventas-tabs-row .ventas-tab {
  font-size: 1em;
  padding: 0.3em 1.1em 0.3em 1.1em;
}
.ventas-badge {
  font-size: 0.85em;
  min-width: 1.5em;
  height: 1.5em;
  padding: 0 0.4em;
}
.venta-btn {
  width: 1.1em;
  height: 1.1em;
  font-size: 0.8em;
}
.venta-btn.mark-read {
  width: 1.1em;
  height: 1.1em;
  font-size: 0.8em;
}
.venta-btn.mark-read i, .venta-btn.mark-read svg {
  font-size: 0.8em;
}
.ventas-modal input,
.ventas-modal select,
.ventas-modal textarea {
  border-radius: 10px;
  border: 1.5px solid #e3e8f0;
  padding: 0.5em 1em;
  font-size: 1em;
  outline: none;
  transition: border 0.18s;
}
.ventas-modal input:focus,
.ventas-modal select:focus,
.ventas-modal textarea:focus {
  border: 1.5px solid #42b983;
}
</style>
