<template>
  <div v-if="usuario && usuario.rol === 'admin'">
    <div class="admin-layout" :class="{ 'blurred-bg': showConfirmLogout }">
      <AdminHeader :usuario="usuario" @usuario-actualizado="handleUsuarioActualizado" />
      <MenuBarra :open="open" @close-sidebar="closeSidebar" @show-logout-modal="showConfirmLogout = true" />
      <div class="admin-content">
        <router-view />
      </div>
    </div>
    <div v-if="showConfirmLogout" class="logout-confirm-overlay">
      <div class="logout-confirm-dialog">
        <p>¿Seguro que deseas cerrar sesión?</p>
        <div class="logout-confirm-actions">
          <button class="confirm-btn" @click="confirmLogout">Aceptar</button>
          <button class="cancel-btn" @click="showConfirmLogout = false">Cancelar</button>
        </div>
      </div>
    </div>
    <transition name="fade-loader">
      <div v-if="showLoader" class="logout-loader-overlay">
        <div class="logout-loader-spinner"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import MenuBarra from './MenuBarra.vue';
import AdminHeader from './AdminHeader.vue';
export default {
  name: 'AdminLayout',
  components: { MenuBarra, AdminHeader },
  data() {
    return {
      open: true,
      usuario: null,
      showConfirmLogout: false,
      showLoader: false
    }
  },
  created() {
    // Cargar usuario desde localStorage al iniciar
    const userStr = localStorage.getItem('autoparts_user');
    if (userStr) {
      this.usuario = JSON.parse(userStr);
    }
  },
  methods: {
    closeSidebar() { this.open = false },
    confirmLogout() {
      this.showConfirmLogout = false;
      this.showLoader = true;
      setTimeout(() => {
        this.usuario = null;
        localStorage.removeItem('autoparts_user');
        localStorage.removeItem('carrito');
        localStorage.removeItem('ventas_ocultas');
        localStorage.removeItem('admin_dark_mode');
        localStorage.removeItem('auth_token');
        this.$root && this.$root.$emit && this.$root.$emit('admin-logout');
        window.location.href = '/'; // Forzar refresh total del sitio
      }, 900); // Duración de la animación de loader
    },
    handleUsuarioActualizado(nuevoUsuario) {
      this.usuario = nuevoUsuario;
      localStorage.setItem('autoparts_user', JSON.stringify(nuevoUsuario));
    }
  },
  watch: {
    usuario(val) {
      if (!val || val.rol !== 'admin') {
        this.showConfirmLogout = false;
      }
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f4f7fb;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  transition: filter 0.3s;
}
.blurred-bg {
  filter: blur(10px) brightness(0.95) saturate(1.2);
  pointer-events: none;
  user-select: none;
}
.logout-confirm-overlay {
  position: fixed;
  z-index: 3000;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(30, 44, 72, 0.32);
  display: flex;
  align-items: center;
  justify-content: center;
}
.logout-confirm-dialog {
  background: #232b36;
  color: #fff;
  padding: 2rem 2.5rem;
  border-radius: 14px;
  box-shadow: 0 4px 32px #0002;
  min-width: 260px;
  text-align: center;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
.logout-confirm-dialog p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}
.logout-confirm-actions {
  display: flex;
  gap: 1.2rem;
  justify-content: center;
}
.confirm-btn {
  background: #ff5252;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s;
}
.confirm-btn:hover {
  background: #ff9800;
}
.cancel-btn {
  background: none;
  color: #b0b8c9;
  border: 1px solid #b0b8c9;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.cancel-btn:hover {
  background: #232b36;
  color: #ff5252;
}
.admin-content {
  flex: 1;
  padding: 7.0rem 2rem 2rem 2rem; 
}
.dashboard-cards {
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}
.dashboard-card {
  flex: 1 1 220px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px #42b98322;
  padding: 2rem 1.5rem 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 220px;
  max-width: 320px;
}
.dashboard-card.visits { background: #ff5a8a; color: #fff; }
.dashboard-card.revenue { background: #6c63ff; color: #fff; }
.dashboard-card.orders { background: #1cc8ee; color: #fff; }
.dashboard-card.users { background: #1ecab8; color: #fff; }
.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  opacity: 0.85;
  margin-bottom: 0.7rem;
  letter-spacing: 1px;
}
.card-value {
  font-size: 2.2rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}
.card-desc {
  font-size: 1rem;
  opacity: 0.95;
}
.card-desc .up { color: #00e676; font-weight: bold; }
.card-desc .down { color: #ff5252; font-weight: bold; }
.logout-loader-overlay {
  position: fixed;
  z-index: 4000;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(30, 44, 72, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}
.logout-loader-spinner {
  width: 54px;
  height: 54px;
  border: 6px solid #42b98333;
  border-top: 6px solid #42b983;
  border-radius: 50%;
  animation: spin-loader 0.8s linear infinite;
  background: transparent;
}
@keyframes spin-loader {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.fade-loader-enter-active, .fade-loader-leave-active {
  transition: opacity 0.4s;
}
.fade-loader-enter-from, .fade-loader-leave-to {
  opacity: 0;
}
@media (max-width: 900px) {
  .dashboard-cards { flex-direction: column; gap: 1.2rem; }
}
</style>