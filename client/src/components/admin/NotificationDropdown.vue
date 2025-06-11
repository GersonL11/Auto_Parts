<template>
  <div v-if="visible" class="notification-modal-overlay" @click.self="close">
    <div class="notification-modal">
      <div class="notification-modal-header">
        <span class="notification-modal-title">
          <svg class="notif-bell" viewBox="0 0 24 24"><path d="M12 2a6 6 0 0 1 6 6v2.09c0 .32.15.62.41.8l1.49 1.01a1 1 0 0 1-.41 1.82H4.51a1 1 0 0 1-.41-1.82l1.49-1.01a1 1 0 0 0 .41-.8V8a6 6 0 0 1 6-6zm0 20a2.5 2.5 0 0 1-2.45-2h4.9A2.5 2.5 0 0 1 12 22z" fill="#1e3c72"/></svg>
          Notificaciones
        </span>
        <button class="notification-modal-close" @click="close">&times;</button>
      </div>
      <div class="notification-tabs">
        <button :class="['tab-btn', {active: activeTab==='nuevas'}]" @click="activeTab='nuevas'">
          Nuevas
          <span v-if="noLeidos > 0" class="badge">{{ noLeidos }}</span>
        </button>
        <button :class="['tab-btn', {active: activeTab==='todas'}]" @click="activeTab='todas'">Todas</button>
      </div>
      <div class="notification-modal-body">
        <div v-if="loading">Cargando notificaciones...</div>
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
                  <button v-if="!correo.leido" class="notif-btn mark" @click="marcarLeido(correo._id)">
                    <i class="fas fa-check-circle"></i>
                    
                  </button>
                  <button class="notif-btn delete" @click="borrarCorreo(correo._id)">
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
      this.$emit('update-unread', this.noLeidos); // Emitir evento al cargar correos
    },
    async marcarLeido(id) {
      try {
        await fetch(`http://localhost:3000/api/correos/${id}/leido`, { method: 'PATCH' });
        await this.fetchCorreos();
        // El evento ya se emite en fetchCorreos
      } catch (e) {
        // Error al marcar como leído. Puedes mostrar un mensaje si lo deseas.
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
  --color-bg-light: #fff;
  --color-bg-dark: #181c24;
  --color-modal-light: #f7fafd;
  --color-modal-dark: #232a36;
  --color-border-light: #e0e7ef;
  --color-border-dark: #2c3440;
  --color-title-light: #1e3c72;
  --color-title-dark: #b3c6e0;
  --color-primary: #42b983;
  --color-danger: #ff5252;
  --color-badge-light: #ff5252;
  --color-badge-dark: #ff7b7b;
  --color-unread-light: #e3f2fd;
  --color-unread-dark: #22304a;
  --color-hover-light: #f5f7fa;
  --color-hover-dark: #232a36;
  --color-shadow-light: #1e3c7244;
  --color-shadow-dark: #000a1a44;
  --color-text-light: #232b36;
  --color-text-dark: #e3eaf7;
  --color-muted-light: #888;
  --color-muted-dark: #b3b3b3;
}

.notification-modal-overlay {
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
.notification-modal {
  background: #fff;
  color: #232b36;
  border-radius: 20px;
  box-shadow: 0 8px 40px 0 rgba(30,40,60,0.18), 0 1.5px 0 rgba(66,185,131,0.08);
  border: 1.5px solid #e3e8f0;
  width: 500px; /* Ancho ideal fijo */
  min-width: 370px;
  max-width: 96vw;
  height: 520px; /* Altura ideal fija */
  min-height: 400px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
  display: flex;
  flex-direction: column;
  animation: modalPopIn 0.5s cubic-bezier(.4,0,.2,1);
}
.notification-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.3rem 2rem 1rem 2rem;
  border-bottom: 1px solid #f0f2f7;
  background: #fff;
  border-radius: 20px 20px 0 0;
}
.notification-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #22304a;
  display: flex;
  align-items: center;
  gap: 0.6em;
  letter-spacing: 0.5px;
}
.notification-modal-title .notif-bell {
  width: 1.3em;
  height: 1.3em;
  color: #42b983;
  margin-right: 0.2em;
}
.notification-modal-close {
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
.notification-modal-close:hover {
  color: #ff5252;
  background: #f5f7fa;
}
.notification-tabs {
  display: flex;
  border-bottom: 1px solid #f0f2f7;
  background: #fff;
  padding: 0 2rem;
  gap: 0.5em;
  font-size: 1.08em;
}
.tab-btn {
  background: none;
  border: none;
  font-size: 1.08em;
  font-weight: 700;
  color: #22304a;
  padding: 0.8em 1.5em 0.7em 1.5em;
  border-radius: 14px 14px 0 0;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  position: relative;
  letter-spacing: 0.5px;
}
.tab-btn.active {
  background: #fff;
  color: #42b983;
  border-bottom: 2.5px solid #42b983;
  z-index: 2;
  box-shadow: 0 2px 8px #42b98322;
}
.badge {
  background: #ff5252;
  color: #fff;
  font-size: 0.85em;
  font-weight: 700;
  border-radius: 1em;
  padding: 0.1em 0.7em;
  margin-left: 0.5em;
  vertical-align: middle;
  box-shadow: 0 1px 4px #ff525233;
}
.notification-modal-body {
  padding: 1.7rem 2rem 1.7rem 2rem;
  background: #fff;
  color: #232b36;
  border-radius: 0 0 20px 20px;
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
  max-height: 260px; /* Ajusta según el diseño deseado */
  overflow-y: auto;
  transition: min-height 0.2s;
}
.notification-modal-body > div > p {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.notificaciones-list li {
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
.notificaciones-list li.no-leido {
  background: #e3f2fd;
  border: 2px solid #42b983;
  box-shadow: 0 6px 24px #42b98333;
}
.notificaciones-list li:hover {
  box-shadow: 0 6px 18px 0 #42b98322, 0 2px 8px #ff980022;
  border-color: #42b98333;
  background: #f3f7fa;
}
.notif-main {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.1em;
}
.notif-info {
  flex: 1 1 0%;
  min-width: 0;
  font-size: 1em;
  font-family: 'Segoe UI', Arial, sans-serif;
}
.notif-info b {
  font-size: 1.08em;
  color: #22304a;
  font-weight: 700;
}
.mensaje-preview {
  color: #232b36;
  font-size: 1em;
  margin: 0.35em 0 0.18em 0;
  font-weight: 400;
  word-break: break-word;
  line-height: 1.5;
}
.notif-info span {
  color: #42b983;
  font-size: 1em;
  font-weight: 600;
}
.notif-info small {
  color: #232b36;
  font-size: 0.98em;
  display: block;
  margin-top: 0.18em;
}
.notif-actions {
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  align-items: flex-end;
  margin-left: 0.5em;
}
.notif-btn {
  background: #fff;
  border: 1px solid #e3e8f0;
  font-size: 1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3em;
  padding: 0.25em 0.7em;
  border-radius: 7px;
  transition: box-shadow 0.15s, background 0.15s, color 0.15s, transform 0.13s;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #b0b8c9;
  outline: none;
}
.notif-btn.mark {
  color: #42b983;
  border: 1.5px solid #42b983;
  background: #e3fbe7;
}
.notif-btn.mark:hover {
  background: #c6f7d4;
  color: #1e3c72;
  box-shadow: 0 2px 8px #42b98333;
}
.notif-btn.delete {
  color: #ff5252;
  border: 1.5px solid #ff5252;
  background: #ffeaea;
}
.notif-btn.delete:hover {
  background: #ff5252;
  color: #fff;
  box-shadow: 0 4px 12px #ff525222;
  border-color: #ff5252;
  transform: scale(1.08) translateY(-1px);
}
.notif-btn svg {
  display: block;
  filter: none;
  transition: filter 0.15s;
}
.notif-btn:active {
  transform: scale(0.97);
  box-shadow: 0 1px 4px #ff525244;
}
@media (max-width: 600px) {
  .notification-modal {
    width: 98vw;
    min-width: unset;
    max-width: 100vw;
    height: 98vh;
    min-height: unset;
    max-height: 98vh;
    border-radius: 0;
  }
  .notification-modal-header, .notification-modal-body, .notification-tabs {
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
