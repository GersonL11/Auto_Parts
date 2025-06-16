<template>
  <div v-if="visible" class="notification-popover">
    <div class="notification-modal">
      <button class="notification-modal-close" @click="close" aria-label="Cerrar notificaciones">&times;</button>
      <div class="notification-modal-header">
        <span class="notification-modal-title">
          <svg class="notif-bell" viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 1 6 6v2.09c0 .32.15.62.41.8l1.49 1.01a1 1 0 0 1-.41 1.82H4.51a1 1 0 0 1-.41-1.82l1.49-1.01a1 1 0 0 0 .41-.8V8a6 6 0 0 1 6-6zm0 20a2.5 2.5 0 0 1-2.45-2h4.9A2.5 2.5 0 0 1 12 22z" fill="#1e3c72"/></svg>
          Notificaciones
        </span>
      </div>
      <div class="notification-tabs">
        <button :class="['tab-btn', {active: activeTab==='nuevas'}]" @click="activeTab='nuevas'">
          Nuevas
          <span v-if="noLeidos > 0" class="badge">{{ noLeidos }}</span>
        </button>
        <button :class="['tab-btn', {active: activeTab==='todas'}]" @click="activeTab='todas'">Todas</button>
      </div>
      <div class="notification-modal-body">
        <div v-if="loading" class="notif-loading">
          <span class="notif-spinner"></span> Cargando notificaciones...
        </div>
        <div v-else>
          <div v-if="filteredCorreos.length === 0">
            <p>No hay notificaciones <span v-if="activeTab==='nuevas'">nuevas</span><span v-else>registradas</span>.</p>
          </div>
          <ul v-else class="notificaciones-list">
            <li v-for="correo in filteredCorreos" :key="correo._id" :class="{ 'no-leido': !correo.leido }">
              <div class="notif-main">
                <div class="notif-info">
                  <b>{{ correo.nombre }}</b> <span>({{ correo.correo }})</span>
                  <div class="mensaje-preview">{{ correo.mensaje }}</div>
                  <small>{{ formatFecha(correo.fecha) }}</small>
                </div>
                <div class="notif-actions">
                  <button v-if="!correo.leido" class="notif-btn mark" @click="marcarLeido(correo._id)" aria-label="Marcar como leído">
                    <i class="fas fa-check-circle"></i>
                  </button>
                  <button class="notif-btn delete" @click="borrarCorreo(correo._id)" aria-label="Eliminar notificación">
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
  name: 'NotificationDropdown',
  props: {
    visible: { type: Boolean, default: false },
  },
  data() {
    return {
      correos: [],
      loading: true,
      activeTab: 'nuevas',
    };
  },
  computed: {
    noLeidos() {
      return this.correos.filter(c => !c.leido).length;
    },
    filteredCorreos() {
      if (this.activeTab === 'nuevas') {
        return this.correos.filter(c => !c.leido);
      }
      return this.correos;
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    async fetchCorreos() {
      this.loading = true;
      try {
        const res = await fetch('http://localhost:3000/api/correos');
        this.correos = await res.json();
      } catch (e) {
        this.correos = [];
      }
      this.loading = false;
      this.$emit('update-unread', this.noLeidos); 
    },
    async marcarLeido(id) {
      try {
        await fetch(`http://localhost:3000/api/correos/${id}/leido`, { method: 'PATCH' });
        await this.fetchCorreos();
      } catch (e) {
        // Error al marcar como leído. 
      }
    },
    async borrarCorreo(id) {
      if (!confirm('¿Seguro que deseas borrar esta notificación?')) return;
      try {
        await fetch(`http://localhost:3000/api/correos/${id}`, { method: 'DELETE' });
        await this.fetchCorreos();
        // El evento ya se emite en fetchCorreos
      } catch (e) {
        // Error al borrar la notificación. 
      }
    },
    formatFecha(fecha) {
      if (!fecha) return '';
      return new Date(fecha).toLocaleString('es-HN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  },
  mounted() {
    this.fetchCorreos();
  },
  watch: {
    visible(val) {
      if (val) this.fetchCorreos();
    }
  }
};
</script>

<style scoped>
:root {
  --notif-bg: #fff;
  --notif-border: 1.5px solid #e3e8f0;
  --notif-radius: 14px;
  --notif-shadow: 0 2px 12px 0 rgba(30,40,60,0.07);
  --notif-accent: #42b983;
  --notif-danger: #ff5252;
  --notif-title: #1e3c72;
  --notif-muted: #b0b8c9;
  --notif-badge-bg: #ff5252;
  --notif-btn-bg: #f5f7fa;
  --notif-btn-hover: #e3fbe7;
}

.notification-popover {
  position: absolute;
  top: 6.0rem; 
  right: 0;
  z-index: 5000;
  min-width: 370px;
}
.notification-modal {
  position: relative;
  box-shadow: var(--notif-shadow);
  margin-top: 0;
  pointer-events: auto;
  z-index: 41000;
  background: var(--notif-bg, #fff);
  border: var(--notif-border);
  border-radius: 22px;
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
.notification-modal::before {
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
.notification-modal-close {
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
.notification-modal-close:hover {
  color: var(--notif-danger);
  background: #f5f7fa;
}
.notification-modal-header {
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
.notification-modal-title .notif-bell {
  width: 1.2em;
  height: 1.2em;
  color: var(--notif-accent);
  margin-right: 0.2em;
}
.notification-tabs {
  display: flex;
  border-bottom: 1px solid #f0f2f7;
  background: transparent;
  padding: 0 1.5rem;
  gap: 0.5em;
  font-size: 1em;
}
.tab-btn {
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
  box-shadow: 0 2px 8px #232b3608, 0 1.5px 0 #fff inset;
  z-index: 1;
  outline: none;
  font-size: 1.08em;
  box-sizing: border-box;
  min-width: 90px;
  text-align: center;
  user-select: none;
}
.tab-btn:not(.active):hover {
  background: #e3e8f0;
  color: #1e3c72;
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 4px 16px #42b98322;
}
.tab-btn.active {
  background: #fff;
  color: #1e3c72;
  border-bottom: 2.5px solid #42b983;
  font-size: 1.18em;
  box-shadow: 0 4px 16px #42b98311, 0 2px 0 #fff inset;
  z-index: 2;
  transform: translateY(-3px) scale(1.07);
}
.tab-btn.active.nuevas {
  color: #30c16c;
  border-bottom: 2.5px solid #30c16c;
  background: #eafff3;
}
.tab-btn.active.todas {
  color: #ff9800;
  border-bottom: 2.5px solid #ff9800;
  background: #fff8e1;
}
.badge {
  background: #ff5252;
  color: #fff;
  border-radius: 12px;
  font-size: 0.93em;
  font-weight: 700;
  padding: 0.1em 0.7em;
  margin-left: 0.4em;
  vertical-align: middle;
  display: inline-block;
  box-shadow: 0 1px 4px #ff525233;
}
.notification-modal-body {
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
.notificaciones-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1 1 0%;
  min-height: 120px;
  max-height: 48vh;
  overflow-y: auto;
  background: transparent;
}
.notification-modal-body > div > p {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}
.notificaciones-list li {
  padding: 1em 1.1em 0.9em 1.1em;
  border-radius: 10px;
  margin-bottom: 12px;
  background: #f8fafc;
  color: #1a2233;
  border: 1px solid #e3e8f0;
  box-shadow: none;
  display: flex;
  align-items: flex-start;
  position: relative;
  transition: background 0.13s, border 0.13s;
}
.notificaciones-list li.no-leido {
  background: #e3fbe7;
  border: 1.5px solid var(--notif-accent);
}
.notificaciones-list li:hover {
  background: #f3f7fa;
  border-color: #42b98333;
}
.notif-main {
  display: flex;
  width: 100%;
  position: relative;
}
.notif-info {
  flex: 1 1 0%;
  min-width: 0;
  font-size: 1em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.notif-actions {
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
.notif-btn {
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
.notif-btn i, .notif-btn svg {
  font-size: 1.1em;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}
.notif-btn.mark {
  color: #42b983;
}
.notif-btn.mark:hover {
  background: #e3fbe7;
  color: #1e3c72;
}
.notif-btn.delete {
  color: #ff5252;
}
.notif-btn.delete:hover {
  background: #ffeaea;
  color: #c82333;
}
.admin-dark-mode .notification-modal,
.admin-dark-mode .notification-modal::before {
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
.admin-dark-mode .notification-modal {
  background: var(--notif-bg);
  color: #e3e8f0;
  border: var(--notif-border);
}
.admin-dark-mode .notification-modal::before {
  border-bottom: 14px solid #232b36;
}
.admin-dark-mode .notification-modal-header,
.admin-dark-mode .notification-tabs,
.admin-dark-mode .notification-modal-body {
  background: transparent;
  color: #e3e8f0;
}
.admin-dark-mode .tab-btn {
  color: #e3e8f0;
  background: #232b36;
  border: 1.5px solid #3a4250;
  border-bottom: none;
  box-shadow: 0 2px 8px #42b98311;
}
.admin-dark-mode .tab-btn:not(.active):hover {
  background: #2d3442;
  color: #42e39a;
}
.admin-dark-mode .tab-btn.active {
  background: #232b36;
  color: #42e39a;
  border-bottom: 2.5px solid #42e39a;
}
.admin-dark-mode .tab-btn.active.nuevas {
  color: #42e39a;
  border-bottom: 2.5px solid #42e39a;
  background: #1e3c72;
}
.admin-dark-mode .tab-btn.active.todas {
  color: #ffb300;
  border-bottom: 2.5px solid #ffb300;
  background: #232b36;
}
.admin-dark-mode .notificaciones-list li {
  background: #2d3442;
  color: #e3e8f0;
  border: 1px solid #3a4250;
}
.admin-dark-mode .notificaciones-list li.no-leido {
  background: #22332a;
  border: 1.5px solid var(--notif-accent);
}
.admin-dark-mode .notificaciones-list li:hover {
  background: #232b36;
  border-color: #42e39a99;
}
.admin-dark-mode .notif-info b {
  color: #e3e8f0;
}
.admin-dark-mode .notif-info span {
  color: var(--notif-accent);
}
.admin-dark-mode .mensaje-preview {
  color: #e3e8f0;
  background: transparent;
}
.admin-dark-mode .notif-info small {
  color: #b0b8c9;
}
.admin-dark-mode .notif-btn {
  background: transparent;
  color: #b0b8c9;
}
.admin-dark-mode .notif-btn.mark {
  color: #42e39a;
}
.admin-dark-mode .notif-btn.mark:hover {
  background: #22332a;
  color: #fff;
}
.admin-dark-mode .notif-btn.delete {
  color: #ff5252;
}
.admin-dark-mode .notif-btn.delete:hover {
  background: #3a2323;
  color: #fff;
}
.notification-modal input,
.notification-modal select,
.notification-modal textarea {
  border-radius: 10px;
  border: 1.5px solid #e3e8f0;
  padding: 0.5em 1em;
  font-size: 1em;
  outline: none;
  transition: border 0.18s;
}
.notification-modal input:focus,
.notification-modal select:focus,
.notification-modal textarea:focus {
  border: 1.5px solid #42b983;
}
</style>
