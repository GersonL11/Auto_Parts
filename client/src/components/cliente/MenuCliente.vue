<template>
  <div>
    <!-- Botón de login o cuenta, solo uno visible a la vez, FLOTANTE y con fuente Orbitron -->
    <button
      v-if="!usuario && !showLogin"
      class="menu-float-btn"
      @click="$emit('show-login')"
    >
      <i class="fas fa-user" style="font-size:1.2em;"></i>
      Iniciar sesión
    </button>
    <button
      v-else-if="usuario && usuario.rol === 'cliente' && !showMenu && !showLogin"
      class="menu-float-btn"
      @click="$emit('open-menu')"
    >
      <i class="fas fa-user" style="font-size:1.2em;"></i>
      {{ usuario.username || usuario.nombre || 'Mi cuenta' }}
    </button>
    <!-- Página de menú de cliente -->
    <div v-if="usuario && usuario.rol === 'cliente' && showMenu" class="menu-cliente-page">
      <div class="menu-cliente-header">
        <button class="menu-cliente-volver" @click="$emit('close-menu')">
          <i class="fas fa-arrow-left"></i> Volver
        </button>
        <h1><i class="fas fa-user-circle"></i> Mi Cuenta</h1>
      </div>
      <div class="menu-cliente-content">
        <section class="perfil-section">
          <h2>Editar Perfil</h2>
          <form @submit.prevent="actualizarDatos" class="perfil-form">
            <label>
              Nombre:
              <input v-model="form.nombre" type="text" autocomplete="name" />
            </label>
            <label>
              Usuario:
              <input v-model="form.username" type="text" autocomplete="username" />
            </label>
            <label>
              Email:
              <input v-model="form.email" type="email" autocomplete="email" />
            </label>
            <label>
              Nueva Contraseña:
              <input v-model="form.password" type="password" autocomplete="new-password" placeholder="••••••••" />
            </label>
            <button type="submit" class="btn-actualizar">Actualizar</button>
          </form>
        </section>
        <hr class="menu-divider" />
        <section class="carrito-section">
          <h2><i class="fas fa-shopping-cart"></i> Carrito de Compras</h2>
          <div class="carrito-list">
            <p v-if="!usuario.carrito || usuario.carrito.length === 0">Tu carrito está vacío.</p>
            <ul v-else>
              <li v-for="(item, idx) in usuario.carrito" :key="idx">
                <span class="carrito-item-nombre">{{ item.nombre }}</span>
                <span class="carrito-item-cantidad">x{{ item.cantidad }}</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuCliente',
  props: {
    usuario: { type: Object, default: null },
    showLogin: { type: Boolean, default: false },
    showMenu: { type: Boolean, default: false }
  },
  data() {
    return {
      form: {
        nombre: this.usuario?.nombre || '',
        email: this.usuario?.email || '',
        username: this.usuario?.username || '',
        password: ''
      }
    }
  },
  watch: {
    usuario: {
      handler(n) {
        this.form.nombre = n?.nombre || ''
        this.form.email = n?.email || ''
        this.form.username = n?.username || ''
        this.form.password = ''
      },
      deep: true
    }
  },
  methods: {
    actualizarDatos() {
      // Solo envía password si fue modificada
      const payload = {
        nombre: this.form.nombre,
        email: this.form.email,
        username: this.form.username
      }
      if (this.form.password) payload.password = this.form.password
      this.$emit('update-user', payload)
      this.form.password = ''
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');
.menu-float-btn {
  position: fixed;
  top: 18px;
  right: 32px;
  z-index: 10001;
  border: none;
  background: linear-gradient(90deg, #ff9800 0%, #42b983 100%);
  color: #fff;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  font-weight: 700;
  border-radius: 16px;
  padding: 0.6em 2em;
  font-size: 1.13em;
  display: flex;
  align-items: center;
  gap: 0.7em;
  box-shadow: 0 2px 12px #1e3c7240;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.13s;
}
.menu-float-btn:hover {
  background: linear-gradient(90deg, #42b983 0%, #ff9800 100%);
  color: #fff;
  box-shadow: 0 6px 24px #42b98355;
  transform: translateY(-2px) scale(1.06);
}
.menu-float-btn i {
  color: #232b36;
  margin-right: 0.5em;
}
.menu-cliente-page {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #42b983 0%, #f9a825 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 0;
  animation: fadeIn 0.7s;
}
.menu-cliente-header {
  width: 100vw;
  background: rgba(255,255,255,0.98);
  box-shadow: 0 2px 16px #1e3c7240;
  padding: 1.2rem 0 0.7rem 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
}
.menu-cliente-header h1 {
  font-family: 'Orbitron', Arial, sans-serif;
  font-size: 2.1rem;
  color: #1e3c72;
  margin: 0 auto;
  font-weight: 900;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.7em;
}
.menu-cliente-header .menu-cliente-volver {
  position: absolute;
  left: 36px;
  top: 50%;
  transform: translateY(-50%);
  background: #fff;
  color: #1e3c72;
  border: none;
  border-radius: 20px;
  padding: 0.5em 1.5em;
  font-weight: 700;
  font-size: 1em;
  box-shadow: 0 2px 8px #1e3c7240;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.menu-cliente-content {
  background: rgba(255,255,255,0.97);
  padding: 2.5rem 3rem;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(30,60,114,0.18);
  text-align: center;
  min-width: 320px;
  max-width: 95vw;
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}
.perfil-section {
  margin-bottom: 1.5rem;
}
.perfil-form label {
  display: block;
  margin-bottom: 1em;
  color: #222;
  text-align: left;
  font-weight: 600;
}
.perfil-form input {
  width: 100%;
  padding: 0.5em;
  margin-top: 0.2em;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1em;
}
.btn-actualizar {
  background: linear-gradient(90deg, #42b983 0%, #ff9800 100%);
  color: #fff;
  border: none;
  padding: 0.7em 2em;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1.1em;
  margin-top: 1em;
  transition: background 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 8px #1e3c7240;
}
.btn-actualizar:hover {
  background: linear-gradient(90deg, #ff9800 0%, #42b983 100%);
  box-shadow: 0 6px 24px #42b98355;
}
.menu-divider {
  border: none;
  border-top: 2px solid #eee;
  margin: 2.5rem 0 1.5rem 0;
}
.carrito-section h2 {
  color: #1e3c72;
  font-size: 1.3rem;
  font-weight: 800;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5em;
  justify-content: center;
}
.carrito-list {
  text-align: left;
  margin: 0 auto;
  max-width: 400px;
}
.carrito-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.carrito-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7em 0.5em;
  border-bottom: 1px solid #eee;
  font-size: 1.08em;
}
.carrito-item-nombre {
  font-weight: 600;
  color: #222;
}
.carrito-item-cantidad {
  font-weight: 700;
  color: #42b983;
}
@media (max-width: 600px) {
  .menu-cliente-content {
    padding: 1.2rem 0.7rem;
    min-width: unset;
  }
  .menu-cliente-header h1 {
    font-size: 1.2rem;
  }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-30px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>
