<template>
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
</template>

<script>
export default {
  name: 'MenuBarra',
  props: {
    open: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    closeSidebar() {
      this.$emit('close-sidebar');
    }
  }
}
</script>

<style scoped>
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
@media (max-width: 900px) {
  .sidebar { width: 70vw; }
}
</style>
