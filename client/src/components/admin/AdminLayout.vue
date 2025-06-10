<template>
  <div class="admin-layout">
    <aside class="sidebar" :class="{ open }">
      <div class="sidebar-logo">
        <i class="fas fa-cogs"></i>
        <span>AutoParts</span>
      </div>
      <nav>
        <ul>
          <li>
            <router-link to="/admin/dashboard" @click="closeSidebar">
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/admin/movimientos" @click="closeSidebar">
              <i class="fas fa-exchange-alt"></i> Movimientos
            </router-link>
          </li>
          <li>
            <router-link to="/admin/repuestos" @click="closeSidebar">
              <i class="fas fa-cogs"></i> Repuestos
            </router-link>
          </li>
          <li>
            <router-link to="/admin/usuarios" @click="closeSidebar">
              <i class="fas fa-users"></i> Usuarios
            </router-link>
          </li>
          <li>
            <router-link to="/admin/ventas" @click="closeSidebar">
              <i class="fas fa-cash-register"></i> Ventas
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLayout',
  data() {
    return { open: true }
  },
  methods: {
    closeSidebar() { this.open = false }
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
.sidebar {
  width: 240px;
  background: #232b36;
  color: #fff;
  min-height: 100vh;
  box-shadow: 2px 0 16px #1e3c7244;
  display: flex;
  flex-direction: column;
  padding: 2rem 1rem 1rem 1rem;
}
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2.5rem;
  color: #42b983;
}
.sidebar-logo i {
  font-size: 2rem;
}
.sidebar nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.sidebar nav li {
  margin-bottom: 1.5rem;
}
.sidebar nav a {
  color: #fff;
  text-decoration: none;
  font-size: 1.13rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  transition: background 0.18s, color 0.18s;
}
.sidebar nav a.router-link-exact-active,
.sidebar nav a:hover {
  background: #42b983;
  color: #fff;
}
.admin-content {
  flex: 1;
  padding: 2.5rem 2rem 2rem 2rem;
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
  .sidebar { width: 70vw; }
}
</style>