<template>
  <div>
    <div class="sidebar-backdrop" v-if="open" @click="closeSidebar"></div>
    <aside class="sidebar" :class="{ open }">
      <button class="sidebar-toggle" @click="closeSidebar">
        <i class="fas fa-times"></i>
      </button>
      <nav>
        <ul>
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
    <button class="sidebar-fab" v-if="!open" @click="openSidebar" aria-label="Abrir menú">
      <i class="fas fa-bars"></i>
    </button>
    <!-- Aquí va el contenido de la ruta seleccionada -->
    <div class="admin-content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarMenu',
  data() {
    return { open: false }
  },
  methods: {
    openSidebar() { this.open = true },
    closeSidebar() { this.open = false },
    navigate(page) {
      this.$emit('navigate', page)
      this.closeSidebar()
    }
  }
}
</script>

<style scoped>
.sidebar-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30,60,114,0.18);
  z-index: 1001;
}
.sidebar {
  position: fixed;
  top: 0; left: 0;
  width: 240px;
  height: 100vh;
  background: linear-gradient(135deg, #232b36 80%, #42b983 100%);
  color: #fff;
  box-shadow: 2px 0 16px #1e3c7244;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(.4,0,.2,1);
  z-index: 1002;
  padding: 2rem 1.2rem 1.2rem 1.2rem;
  display: flex;
  flex-direction: column;
}
.sidebar.open {
  transform: translateX(0);
}
.sidebar-toggle {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.6rem;
  align-self: flex-end;
  margin-bottom: 2rem;
  cursor: pointer;
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
  font-size: 1.15rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: color 0.18s;
}
.sidebar nav a:hover {
  color: #00eaff;
}
.sidebar-fab {
  position: fixed;
  top: 2.2rem;
  left: 2.2rem;
  z-index: 1000;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
  box-shadow: 0 2px 8px #42b98344;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s;
}
.sidebar-fab:hover {
  background: #00eaff;
}
.admin-content {
  margin-left: 240px;
  padding: 2rem;
}
@media (max-width: 600px) {
  .sidebar { width: 80vw; }
  .admin-content { margin-left: 80vw; }
}
</style>