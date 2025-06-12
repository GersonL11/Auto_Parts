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
  <button class="sidebar-logout-btn subtle" @click="showConfirm = true" title="Cerrar sesión">
    <i class="fas fa-sign-out-alt"></i>
  </button>
  <div v-if="showConfirm" class="logout-confirm-overlay">
    <div class="logout-confirm-dialog">
      <p>¿Seguro que deseas cerrar sesión?</p>
      <div class="logout-confirm-actions">
        <button class="confirm-btn" @click="confirmLogout">Aceptar</button>
        <button class="cancel-btn" @click="showConfirm = false">Cancelar</button>
      </div>
    </div>
  </div>
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
  data() {
    return {
      showConfirm: false
    }
  },
  methods: {
    closeSidebar() {
      this.$emit('close-sidebar');
    },
    confirmLogout() {
      this.showConfirm = false;
      this.$nextTick(() => {
        this.$emit('logout');
        if (typeof window !== 'undefined') {
          const event = new Event('admin-logout');
          window.dispatchEvent(event);
        }
      });
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
.sidebar-logout-btn {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 240px;
  background: linear-gradient(90deg, #ff9800 0%, #ff5252 100%);
  color: #fff;
  border: none;
  border-radius: 0 18px 0 0;
  padding: 1rem 1.5rem;
  font-size: 1.08rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  box-shadow: 0 -2px 12px #ff980033;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  z-index: 2000;
}
.sidebar-logout-btn i {
  font-size: 1.3rem;
  color: #fff;
  transition: color 0.2s;
}
.sidebar-logout-btn:hover {
  background: linear-gradient(90deg, #ff5252 0%, #ff9800 100%);
  color: #fff;
  box-shadow: 0 -6px 24px #ff980055;
}
.sidebar-logout-btn.subtle {
  background: none;
  color: #b0b8c9;
  box-shadow: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  left: 18px;
  bottom: 18px;
  padding: 0;
  justify-content: center;
  align-items: center;
  display: flex;
  font-size: 1.5rem;
  transition: background 0.18s, color 0.18s;
}
.sidebar-logout-btn.subtle i {
  font-size: 1.5rem;
  color: #b0b8c9;
  transition: color 0.2s;
}
.sidebar-logout-btn.subtle:hover {
  background: #232b36;
  color: #ff5252;
}
.sidebar-logout-btn.subtle:hover i {
  color: #ff5252;
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
@media (max-width: 900px) {
  .sidebar { width: 70vw; }
  .sidebar-logout-btn {
    width: 70vw;
  }
  .sidebar-logout-btn.subtle {
    left: 10px;
    bottom: 10px;
    width: 38px;
    height: 38px;
    font-size: 1.2rem;
  }
}
</style>
