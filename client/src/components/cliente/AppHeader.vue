<template>
  <header class="app-header">
    <div class="header-left">
      <img :src="require('../../assets/logopart.png')" alt="AutoParts Logo" class="header-logo" />
      <span class="header-title">
        <i class="fas fa-cogs header-icon"></i>
        AutoParts
      </span>
    </div>
    <nav class="header-nav">
      <a
        class="header-link"
        :class="{ active: current === 'home' }"
        href="#"
        @click.prevent="$emit('go-home')"
      >
        <i class="fas fa-home"></i>
        Inicio
      </a>
      <a
        class="header-link"
        :class="{ active: current === 'parts' }"
        href="#"
        @click.prevent="$emit('show-parts')"
      >
        <i class="fas fa-cube"></i>
        Piezas
      </a>
      <a
        class="header-link"
        :class="{ active: current === 'about' }"
        href="#"
        @click.prevent="$emit('show-about')"
      >
        <i class="fas fa-users"></i>
        Sobre nosotros
      </a>
      <a
        class="header-link"
        :class="{ active: current === 'contact' }"
        href="#"
        @click.prevent="$emit('show-contact')"
      >
        <i class="fas fa-envelope"></i>
        Contáctanos
      </a>
    </nav>
    <button
      v-if="!usuario"
      class="header-login-btn"
      @click="$emit('show-login')"
    >
      <i class="fas fa-user-circle"></i>
      Iniciar sesión
    </button>
    <div v-else class="header-user-menu">
      <button class="header-user-btn" @click="$emit('abrir-menu-cliente')">
        <i class="fas fa-user-circle"></i>
        {{ usuario.nombre }}
      </button>
    </div>
  </header>
</template>

<script>
export default {
  name: "AppHeader",
  props: {
    current: {
      type: String,
      default: "home"
    },
    usuario: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      mostrarMenu: false
    }
  },
  methods: {
    handleLogout() {
      this.$emit('logout')
      this.mostrarMenu = false
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background: linear-gradient(90deg, #232b36 0%, #3a4250 60%, #ff9800 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 1.2rem 2.5rem 1.2rem 2.5rem;
  box-shadow: 0 4px 24px #232b3622, 0 1.5px 0 #ff9800;
  z-index: 1000;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  animation: headerFadeIn 0.8s cubic-bezier(.4,0,.2,1);
  transition: background 0.3s;
}
@keyframes headerFadeIn {
  from { opacity: 0; transform: translateY(-40px);}
  to { opacity: 1; transform: translateY(0);}
}
.header-left {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  min-width: 0;
}
.header-logo {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 12px #42b98333;
  padding: 0.3rem;
  transition: box-shadow 0.3s;
  flex-shrink: 0;
}
.header-title {
  font-size: 2rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px #232b36cc;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  transition: color 0.2s;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.header-icon {
  color: #42b983;
  font-size: 1.3rem;
  margin-right: 0.2rem;
  transition: color 0.2s;
}
.header-title:hover .header-icon {
  color: #ff9800;
}
.header-nav {
  display: flex;
  align-items: center;
  gap: 2.2rem;
  flex-wrap: wrap;
}
.header-link {
  color: #e0e0e0;
  font-size: 1.13rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: 1px;
  padding: 0.3rem 1.1rem;
  border-radius: 8px;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.header-link i {
  font-size: 1.1rem;
  color: #42b983;
  transition: color 0.2s;
}
.header-link.active,
.header-link:hover {
  background: linear-gradient(90deg, #ff9800 0%, #42b983 100%);
  color: #232b36;
  box-shadow: 0 2px 8px #ff980033;
  text-decoration: none;
  transform: translateY(-2px) scale(1.06);
}
.header-link.active i,
.header-link:hover i {
  color: #232b36;
}
.header-login-btn {
  background: linear-gradient(90deg, #42b983 0%, #ff9800 100%);
  color: #232b36;
  border: none;
  border-radius: 18px;
  padding: 0.55rem 1.7rem;
  font-size: 1.08rem;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 0 2px 12px #42b98333, 0 1px 4px #ff980033;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.13s;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  margin-left: 1.2rem;
  flex-shrink: 0;
}
.header-login-btn i {
  font-size: 1.3rem;
  color: #232b36;
  transition: color 0.2s;
}
.header-login-btn:hover {
  background: linear-gradient(90deg, #232b36 0%, #ff9800 100%);
  color: #fff;
  box-shadow: 0 6px 24px #ff980055;
  transform: translateY(-2px) scale(1.06);
}
.header-login-btn:hover i {
  color: #fff;
}
.header-user-menu {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.header-user-btn {
  background: linear-gradient(90deg, #42b983 0%, #ff9800 100%);
  color: #232b36;
  border: none;
  border-radius: 18px;
  padding: 0.55rem 1.7rem;
  font-size: 1.08rem;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 0 2px 12px #42b98333, 0 1px 4px #ff980033;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.13s;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.header-user-btn i {
  font-size: 1.3rem;
  color: #232b36;
  transition: color 0.2s;
}
@media (max-width: 1100px) {
  .app-header {
    flex-wrap: wrap;
    padding: 1rem 1rem 1rem 1rem;
  }
  .header-nav {
    gap: 1.1rem;
  }
  .header-title {
    font-size: 1.2rem;
  }
  .header-logo {
    width: 38px;
    height: 38px;
  }
  .header-login-btn {
    padding: 0.5rem 1.1rem;
    font-size: 0.98rem;
    margin-left: 0.5rem;
  }
}
@media (max-width: 700px) {
  .app-header {
    flex-direction: column;
    align-items: stretch;
    gap: 0.7rem;
    padding: 0.7rem 0.3rem 0.7rem 0.3rem;
  }
  .header-left {
    justify-content: center;
    margin-bottom: 0.5rem;
  }
  .header-nav {
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .header-login-btn {
    align-self: center;
    margin-left: 0;
    margin-top: 0.7rem;
    width: 100%;
    justify-content: center;
  }
}
</style>
