<template>
  <div class="admin-layout">
    <AdminHeader />
    <MenuBarra :open="open" @close-sidebar="closeSidebar" @logout="handleLogout" />
    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script>
import MenuBarra from './MenuBarra.vue';
import AdminHeader from './AdminHeader.vue';
export default {
  name: 'AdminLayout',
  components: { MenuBarra, AdminHeader },
  data() {
    return { open: true }
  },
  methods: {
    closeSidebar() { this.open = false },
    handleLogout() {
      // Redirige y limpia sesión globalmente
      this.$router.push('/');
      // Limpieza básica de localStorage
      localStorage.removeItem('autoparts_user');
      localStorage.removeItem('carrito');
      localStorage.removeItem('ventas_ocultas');
      localStorage.removeItem('admin_dark_mode');
      localStorage.removeItem('auth_token');
      // Emitir evento global para que App.vue pueda resetear el estado
      this.$root && this.$root.$emit && this.$root.$emit('admin-logout');
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
@media (max-width: 900px) {
  .dashboard-cards { flex-direction: column; gap: 1.2rem; }
}
</style>