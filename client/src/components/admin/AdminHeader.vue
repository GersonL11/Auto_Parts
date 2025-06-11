<template>
  <header class="admin-header">
    <div class="admin-header-left">
      <img :src="darkMode ? require('@/assets/logopart2.png') : require('@/assets/logopart.png')" alt="AutoParts Logo" class="admin-header-logo" />
      <span class="admin-header-title">¡BIENVENIDO!</span>
    </div>
    <div class="admin-header-right">
      <button class="admin-header-icon-btn" title="Modo oscuro" @click="toggleDarkMode">
        <i :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
      <button class="admin-header-icon-btn notification-btn" title="Notificaciones" @click="toggleNotificaciones">
        <i class="fas fa-bell"></i>
        <span v-if="noLeidos > 0" class="notification-badge">{{ noLeidos }}</span>
      </button>
      <button class="admin-header-icon-btn" title="Configuración">
        <i class="fas fa-cog"></i>
      </button>
      <button class="admin-header-icon-btn" title="Reloj" @click="toggleVentas">
        <i class="fas fa-clock"></i>
        <span v-if="ventasNoLeidas > 0" class="notification-badge ventas-badge">{{ ventasNoLeidas }}</span>
      </button>
      <div class="admin-header-avatar">
        <img v-if="usuario && usuario.fotoPerfil" :src="usuario.fotoPerfil" alt="Avatar" />
        <i v-else class="fas fa-user-circle" style="font-size:2.2rem;color:#fff;background:#42b983;border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;"></i>
      </div>
      <div class="admin-header-search">
        <input type="text" placeholder="Buscar..." />
        <i class="fas fa-search"></i>
      </div>
    </div>
    <NotificationDropdown
      :visible="showNotificaciones"
      @close="showNotificaciones = false"
      @update-unread="updateNoLeidos"
      ref="notiDropdown"
    />
    <VentasDropdown
      :visible="showVentas"
      @close="showVentas = false"
      @notificacion-eliminada="onVentaNotificacionEliminada"
      @opened="onVentasDropdownOpen"
      ref="ventasDropdown"
    />
  </header>
</template>

<script>
import NotificationDropdown from './NotificationDropdown.vue';
import VentasDropdown from './VentasDropdown.vue';
export default {
  name: 'AdminHeader',
  components: { NotificationDropdown, VentasDropdown },
  data() {
    return {
      darkMode: false,
      showNotificaciones: false,
      showVentas: false,
      noLeidos: 0,
      ventasNoLeidas: 0
    }
  },
  mounted() {
    // Cargar preferencia de modo oscuro
    const isDark = localStorage.getItem('admin_dark_mode') === 'true';
    this.darkMode = isDark;
    this.applyDarkMode(isDark);
    // Inicializar contador de no leídos al montar
    this.fetchUnreadCount();
    this.fetchVentasNoLeidas();
    // Actualización automática del contador de notificaciones
    this._notiInterval = setInterval(() => {
      this.fetchUnreadCount();
    }, 10000); // cada 10 segundos
  },
  beforeUnmount() {
    if (this._notiInterval) clearInterval(this._notiInterval);
  },
  watch: {
    darkMode(val) {
      this.applyDarkMode(val);
      localStorage.setItem('admin_dark_mode', val ? 'true' : 'false');
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
    toggleNotificaciones() {
      this.showNotificaciones = !this.showNotificaciones;
      if (this.showNotificaciones) {
        this.$nextTick(() => {
          this.$refs.notiDropdown?.fetchCorreos();
        });
      }
    },
    toggleVentas() {
      this.showVentas = !this.showVentas;
      if (this.showVentas) {
        this.$nextTick(() => {
          this.$refs.ventasDropdown?.fetchVentas();
        });
      }
    },
    applyDarkMode(enable) {
      const root = document.documentElement;
      if (enable) {
        root.classList.add('admin-dark-mode');
      } else {
        root.classList.remove('admin-dark-mode');
      }
    },
    updateNoLeidos(count) {
      this.noLeidos = count;
    },
    async fetchUnreadCount() {
      try {
        const res = await fetch('http://localhost:3000/api/correos');
        const correos = await res.json();
        this.noLeidos = correos.filter(c => !c.leido).length;
      } catch {
        this.noLeidos = 0;
      }
    },
    async fetchVentasNoLeidas() {
      try {
        const res = await fetch('http://localhost:3000/api/ventas');
        const ventas = await res.json();
        // Solo cuenta las ventas que no están ocultas en localStorage
        const ocultas = JSON.parse(localStorage.getItem('ventas_ocultas') || '[]');
        this.ventasNoLeidas = ventas.filter(v => !ocultas.includes(v._id)).length;
      } catch {
        this.ventasNoLeidas = 0;
      }
    },
    onVentaNotificacionEliminada(id) {
      // Guarda en localStorage y actualiza el contador
      let ocultas = JSON.parse(localStorage.getItem('ventas_ocultas') || '[]');
      if (!ocultas.includes(id)) {
        ocultas.push(id);
        localStorage.setItem('ventas_ocultas', JSON.stringify(ocultas));
      }
      this.fetchVentasNoLeidas();
    },
    onVentasDropdownOpen() {
      this.fetchVentasNoLeidas();
    },
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.admin-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background: linear-gradient(90deg, #232b36 0%, #3a4250 60%, #ff9800 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 2.5rem 1.2rem 2.5rem;
  box-shadow: 0 4px 24px #232b3622, 0 1.5px 0 #ff9800;
  z-index: 1100;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.admin-header-left {
  display: flex;
  align-items: center;
  gap: 1.1rem;
}
.admin-header-logo {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 12px #42b98333;
  padding: 0.3rem;
}
.admin-header-title {
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px #232b36cc;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.admin-header-right {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.admin-header-icon-btn {
  background: none;
  border: none;
  color: #e0e0e0;
  font-size: 1.35rem;
  cursor: pointer;
  margin: 0 0.1rem;
  position: relative;
  transition: color 0.18s, background 0.18s;
  border-radius: 50%;
  padding: 0.4rem;
}
.admin-header-icon-btn:hover {
  color: #ff9800;
  background: #232b36;
}
.notification-btn {
  position: relative;
}
.notification-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ff5252;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 900;
  border-radius: 50%;
  padding: 0.13em 0.5em;
  box-shadow: 0 1px 4px #ff980033;
}
.ventas-badge {
  background: #42b983;
  color: #fff;
  top: 2px;
  right: -8px;
  font-size: 0.75rem;
  font-weight: 900;
  border-radius: 50%;
  padding: 0.13em 0.5em;
  box-shadow: 0 1px 4px #42b98333;
  position: absolute;
}
.admin-header-avatar {
  margin-left: 0.7rem;
  margin-right: 0.7rem;
}
.admin-header-avatar img {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px #42b98333;
}
.admin-header-search {
  display: flex;
  align-items: center;
  background: #232b36;
  border-radius: 18px;
  padding: 0.2rem 0.8rem;
  box-shadow: 0 2px 8px #42b98322;
  margin-left: 0.7rem;
}
.admin-header-search input {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
  outline: none;
  padding: 0.3rem 0.5rem;
  font-family: inherit;
}
.admin-header-search i {
  color: #42b983;
  font-size: 1.1rem;
  margin-left: 0.3rem;
}
@media (max-width: 900px) {
  .admin-header {
    flex-wrap: wrap;
    padding: 1rem 1rem 1rem 1rem;
  }
  .admin-header-title {
    font-size: 1.2rem;
  }
  .admin-header-logo {
    width: 38px;
    height: 38px;
  }
  .admin-header-avatar img {
    width: 28px;
    height: 28px;
  }
}
@media (max-width: 600px) {
  .admin-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
    padding: 0.7rem 0.3rem 0.7rem 0.3rem;
  }
  .admin-header-left {
    justify-content: center;
    margin-bottom: 0.5rem;
  }
  .admin-header-right {
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .admin-header-search {
    margin-left: 0;
    margin-top: 0.7rem;
    width: 100%;
    justify-content: center;
  }
}
</style>

<style>
.admin-dark-mode body,
.admin-dark-mode {
  background: #161a20 !important;
  color: #e0e0e0 !important;
}
.admin-dark-mode .admin-header {
  background: linear-gradient(90deg, #181c22 0%, #232b36 60%, #ff9800 100%) !important;
  box-shadow: 0 4px 24px #181c2222, 0 1.5px 0 #ff9800;
}
.admin-dark-mode .admin-header-logo {
  background: #232b36 !important;
}
.admin-dark-mode .admin-header-title {
  color: #fff !important;
}
.admin-dark-mode .admin-header-search {
  background: #232b36 !important;
}
.admin-dark-mode .admin-header-icon-btn {
  color: #e0e0e0 !important;
}
.admin-dark-mode .admin-header-icon-btn:hover {
  color: #ff9800 !important;
  background: #181c22 !important;
}
.admin-dark-mode .sidebar {
  background: #181c22 !important;
  color: #e0e0e0 !important;
  box-shadow: 2px 0 16px #000a !important;
}
.admin-dark-mode .sidebar-logo {
  color: #42e08f !important;
}
.admin-dark-mode .sidebar nav a {
  color: #e0e0e0 !important;
  background: transparent !important;
}
.admin-dark-mode .sidebar nav a.router-link-exact-active,
.admin-dark-mode .sidebar nav a:hover {
  background: #232b36 !important;
  color: #ff9800 !important;
}
.admin-dark-mode .admin-content,
.admin-dark-mode .dashboard-card {
  background: #232b36 !important;
  color: #e0e0e0 !important;
  box-shadow: 0 2px 12px #000a !important;
}
.admin-dark-mode .dashboard-card.users {
  background: linear-gradient(120deg, #1ecab8 60%, #232b36 100%) !important;
  color: #fff !important;
}
.admin-dark-mode .dashboard-card.repuestos {
  background: linear-gradient(120deg, #ffb300 60%, #232b36 100%) !important;
  color: #fff !important;
}
.admin-dark-mode .dashboard-card.movimientos {
  background: linear-gradient(120deg, #1cc8ee 60%, #232b36 100%) !important;
  color: #fff !important;
}
.admin-dark-mode .dashboard-card.revenue {
  background: linear-gradient(120deg, #6c63ff 60%, #232b36 100%) !important;
  color: #fff !important;
}
.admin-dark-mode .admin-table {
  background: #232b36 !important;
  color: #e0e0e0 !important;
  border-radius: 12px !important;
  box-shadow: 0 2px 8px #000a !important;
}
.admin-dark-mode .admin-table th {
  background: #181c22 !important;
  color: #ff9800 !important;
  border-bottom: 1.5px solid #232b36 !important;
}
.admin-dark-mode .admin-table td {
  border-bottom: 1px solid #232b36 !important;
}
.admin-dark-mode .admin-table tr:hover {
  background: #232b36 !important;
}
.admin-dark-mode .btn-agregar,
.admin-dark-mode .btn-guardar {
  background: #42e08f !important;
  color: #181c22 !important;
  box-shadow: 0 2px 8px #42e08f33 !important;
}
.admin-dark-mode .btn-agregar:hover,
.admin-dark-mode .btn-guardar:hover {
  background: #ff9800 !important;
  color: #fff !important;
}
.admin-dark-mode .btn-editar {
  background: #1cc8ee !important;
  color: #181c22 !important;
}
.admin-dark-mode .btn-editar:hover {
  background: #ff9800 !important;
  color: #fff !important;
}
.admin-dark-mode .btn-eliminar {
  background: #ff5252 !important;
  color: #fff !important;
}
.admin-dark-mode .btn-eliminar:hover {
  background: #c62828 !important;
}
.admin-dark-mode .btn-cancelar {
  background: #232b36 !important;
  color: #e0e0e0 !important;
  border: 1.5px solid #444 !important;
}
.admin-dark-mode .btn-cancelar:hover {
  background: #ff5252 !important;
  color: #fff !important;
}
.admin-dark-mode .modal-bg {
  background: rgba(24,28,34,0.92) !important;
}
.admin-dark-mode .modal-form {
  background: #232b36 !important;
  color: #e0e0e0 !important;
  border: 1.5px solid #42e08f44 !important;
  box-shadow: 0 8px 32px #000a !important;
}
.admin-dark-mode .modal-form label {
  color: #42e08f !important;
}
.admin-dark-mode .modal-form input {
  background: #181c22 !important;
  color: #fff !important;
  border: 1.5px solid #42e08f !important;
}
.admin-dark-mode .modal-form input:focus {
  border: 1.5px solid #ff9800 !important;
  background: #232b36 !important;
}
.admin-dark-mode .custom-file-label {
  background: #181c22 !important;
  color: #42e08f !important;
  border: 1.5px solid #42e08f !important;
}
.admin-dark-mode .custom-file-label:active,
.admin-dark-mode .custom-file-input-wrapper input[type="file"]:focus + .custom-file-label {
  border: 1.5px solid #ff9800 !important;
  background: #232b36 !important;
}
.admin-dark-mode .img-preview {
  border: 1.5px solid #42e08f44 !important;
  box-shadow: 0 2px 8px #42e08f22 !important;
}
.admin-dark-mode .admin-header-avatar img {
  border: 2px solid #42e08f !important;
}
.admin-dark-mode .card-title,
.admin-dark-mode .card-desc {
  color: #e0e0e0 !important;
}
.admin-dark-mode .form-row label {
  color: #42e08f !important;
}
.admin-dark-mode .form-row input {
  background: #181c22 !important;
  color: #fff !important;
  border: 1.5px solid #42e08f !important;
}
.admin-dark-mode .form-row input:focus {
  border: 1.5px solid #ff9800 !important;
  background: #232b36 !important;
}
</style>
