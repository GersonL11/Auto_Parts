<template>
  <div>
    <transition name="slide-menu-soft">
      <aside v-if="show" class="menu-cliente-sidebar">
        <div class="menu-cliente-header">
          <img v-if="usuario?.fotoPerfil" :src="usuario.fotoPerfil" alt="Foto de perfil" class="menu-cliente-avatar" />
          <i v-else class="fas fa-user-circle"></i>
          <span class="menu-cliente-nombre">{{ usuario?.nombre }}</span>
          <button class="menu-cliente-close" @click="$emit('close')">&times;</button>
        </div>
        <div class="menu-cliente-body">
          <button class="menu-cliente-btn" @click="handleClick('ver-perfil')">
            <i class="fas fa-id-card"></i> Mi perfil
          </button>
          <button class="menu-cliente-btn" @click="handleClick('ver-compras')">
            <i class="fas fa-shopping-bag"></i> Mis compras
          </button>
          <button class="menu-cliente-btn" @click="handleClick('ver-carrito')">
            <i class="fas fa-shopping-cart"></i> Carro de compras
          </button>
          <hr class="menu-cliente-divider" />
          <button class="menu-cliente-btn logout" @click="handleClick('logout')">
            <i class="fas fa-sign-out-alt"></i> Cerrar sesión
          </button>
        </div>
      </aside>
    </transition>
    <transition name="menu-backdrop-fade">
      <div v-if="show" class="menu-cliente-backdrop" @click="$emit('close')"></div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'MenuCliente',
  props: {
    usuario: { type: Object, default: null },
    show: { type: Boolean, default: true }
  },
  methods: {
    handleClick(event) {
      this.$emit(event);
      this.$emit('close'); // Cierra el menú después de la acción
    }
  }
}
</script>

<style scoped>
/* --- PREMIUM CLIENT SIDEBAR & MODALS --- */
.menu-cliente-sidebar {
  background: rgba(255,255,255,0.18);
  border-radius: 2rem 0 0 2rem;
  box-shadow: 0 12px 48px 0 #1e3c7260, 0 2px 12px #42b98333;
  border: 1.5px solid rgba(66,185,131,0.18);
  backdrop-filter: blur(16px) saturate(1.5);
  padding: 2.7rem 2.2rem 2.2rem 2.2rem;
  max-width: 420px;
  width: 350px;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  z-index: 30010;
  animation: slideInMenu 0.3s cubic-bezier(.4,0,.2,1);
  transition: box-shadow 0.2s, border 0.2s, background 0.2s;
  overflow: hidden;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
@keyframes slideInMenu {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.slide-menu-enter-active, .slide-menu-leave-active {
  transition: transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.3s;
}
.slide-menu-enter-from, .slide-menu-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-menu-soft-enter-active, .slide-menu-soft-leave-active {
  transition: opacity 0.5s cubic-bezier(.4,0,.2,1), transform 0.5s cubic-bezier(.4,0,.2,1);
}
.slide-menu-soft-enter-from, .slide-menu-soft-leave-to {
  opacity: 0;
  transform: translateX(64px) scale(0.98);
}
.menu-backdrop-fade-enter-active, .menu-backdrop-fade-leave-active {
  transition: opacity 0.5s cubic-bezier(.4,0,.2,1);
}
.menu-backdrop-fade-enter-from, .menu-backdrop-fade-leave-to {
  opacity: 0;
}
.menu-cliente-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7em;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 2.1rem;
  letter-spacing: 0.5px;
  width: 100%;
  border-bottom: none;
  padding-bottom: 0;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
.menu-cliente-avatar {
  width: 82px;
  height: 82px;
  border-radius: 50%;
  object-fit: cover;
  background: #fff;
  border: 3.5px solid #fff;
  box-shadow: 0 4px 24px #42b98355, 0 1.5px 0 #fff4 inset;
  margin-bottom: 0.5rem;
}
.menu-cliente-header i {
  font-size: 3.2rem;
  color: #fff;
  background: linear-gradient(135deg, #42b983 60%, #1e3c72 100%);
  border-radius: 50%;
  padding: 0.5em 0.6em;
  box-shadow: 0 4px 24px #42b98355, 0 1.5px 0 #fff4 inset;
  border: 3.5px solid #fff;
  margin-bottom: 0.5rem;
}
.menu-cliente-nombre {
  font-weight: 800;
  font-size: 1.08rem;
  color: #fff;
  background: none;
  letter-spacing: 0.2px;
  text-align: center;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
.menu-cliente-close {
  background: rgba(255,255,255,0.7);
  border: none;
  font-size: 2.1rem;
  color: #ff5252;
  cursor: pointer;
  position: absolute;
  top: 1.1rem;
  right: 1.3rem;
  transition: color 0.18s, background 0.18s, transform 0.18s;
  border-radius: 50%;
  padding: 0.18em 0.5em;
  box-shadow: 0 2px 8px #ff525222;
  z-index: 2;
}
.menu-cliente-close:hover {
  color: #fff;
  background: #ff5252;
  transform: scale(1.12) rotate(8deg);
}
.menu-cliente-body {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 0.2rem;
  width: 100%;
}
.menu-cliente-btn {
  background: rgba(255,255,255,0.7);
  color: #1e3c72;
  border: none;
  border-radius: 12px;
  padding: 0.65rem 0.9rem;
  font-size: 0.99rem;
  font-weight: 700;
  letter-spacing: 0.1px;
  box-shadow: 0 1px 8px #42b98311;
  cursor: pointer;
  outline: none;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.13s;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  margin-bottom: 0.1rem;
  text-shadow: none;
  position: relative;
  overflow: hidden;
}
.menu-cliente-btn i {
  font-size: 1.08rem;
  background: #fff;
  border-radius: 50%;
  padding: 0.13em 0.25em;
  box-shadow: 0 1px 4px #42b98311;
  color: #42b983;
  border: 1px solid #e0e7ef;
}
.menu-cliente-btn:hover {
  background: linear-gradient(90deg, #42b983 0%, #1e3c72 100%);
  color: #fff;
  box-shadow: 0 12px 36px #1e3c7244;
  transform: translateY(-2px) scale(1.05);
}
.menu-cliente-btn:hover i {
  color: #fff;
  background: #42b983;
  border: 1px solid #1e3c72;
}
.menu-cliente-btn.logout {
  background: linear-gradient(90deg, #ff9800 0%, #ff5252 100%);
  color: #fff;
  box-shadow: 0 2px 8px #ff980011;
  border: none;
  font-size: 0.99rem;
  padding: 0.65rem 0.9rem;
}
.menu-cliente-btn.logout i {
  color: #ff5252;
  background: #fff8f8;
  border: 1px solid #ffbdbd;
}
.menu-cliente-btn.logout:hover {
  background: linear-gradient(90deg, #ff5252 0%, #ff9800 100%);
  color: #fff;
  box-shadow: 0 6px 18px #ff525211;
}
.menu-cliente-btn.logout:hover i {
  color: #fff;
  background: #ff5252;
  border: 1px solid #ff9800;
}
.menu-cliente-divider {
  border: none;
  border-top: 1.5px solid #e0e7ef;
  margin: 1.5rem 0 1rem 0;
  box-shadow: none;
}
.menu-cliente-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(20, 40, 80, 0.32);
  backdrop-filter: blur(24px) saturate(1.7);
  -webkit-backdrop-filter: blur(24px) saturate(1.7);
  z-index: 30000;
}

/* --- MODAL PERFIL PREMIUM, GLASS, MODERNO Y CREATIVO --- */
.perfil-cliente-modal {
  background: rgba(255,255,255,0.18);
  border-radius: 2rem;
  box-shadow: 0 12px 48px 0 #1e3c7260, 0 2px 12px #42b98333;
  padding: 2.7rem 2.2rem 2.2rem 2.2rem;
  max-width: 420px;
  width: 98vw;
  margin: 0 auto;
  border: 1.5px solid rgba(66,185,131,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  animation: fadeInPerfil 0.5s cubic-bezier(.4,0,.2,1);
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  backdrop-filter: blur(16px) saturate(1.5);
  overflow: hidden;
}
@keyframes fadeInPerfil {
  from { opacity: 0; transform: translateY(32px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.perfil-cliente-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7em;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 2.1rem;
  letter-spacing: 0.5px;
  width: 100%;
  border-bottom: none;
  padding-bottom: 0;
}
.perfil-cliente-header i {
  font-size: 3.2rem;
  color: #fff;
  background: linear-gradient(135deg, #42b983 60%, #1e3c72 100%);
  border-radius: 50%;
  padding: 0.5em 0.6em;
  box-shadow: 0 4px 24px #42b98355, 0 1.5px 0 #fff4 inset;
  border: 3.5px solid #fff;
  margin-bottom: 0.5rem;
}
.perfil-cliente-header span {
  font-weight: 800;
  font-size: 1.25rem;
  color: #1e3c72;
  background: none;
  letter-spacing: 0.2px;
  text-align: center;
}
.perfil-cliente-close {
  background: rgba(255,255,255,0.7);
  border: none;
  font-size: 2.1rem;
  color: #ff5252;
  cursor: pointer;
  position: absolute;
  top: 1.1rem;
  right: 1.3rem;
  transition: color 0.18s, background 0.18s, transform 0.18s;
  border-radius: 50%;
  padding: 0.18em 0.5em;
  box-shadow: 0 2px 8px #ff525222;
  z-index: 2;
}
.perfil-cliente-close:hover {
  color: #fff;
  background: #ff5252;
  transform: scale(1.12) rotate(8deg);
}
.perfil-cliente-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.perfil-cliente-form-group {
  position: relative;
  margin-bottom: 0.5rem;
}
.perfil-cliente-form input {
  width: 100%;
  padding: 1.1rem 1rem 0.5rem 1rem;
  border-radius: 10px;
  border: none;
  border-bottom: 2.5px solid #d1d5db;
  font-size: 1.13rem;
  font-weight: 500;
  color: #1e3c72;
  background: rgba(255,255,255,0.7);
  outline: none;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  box-shadow: 0 1px 8px #42b98311;
}
.perfil-cliente-form input:focus {
  border-bottom: 2.5px solid #42b983;
  background: #fff;
}
.perfil-cliente-form label {
  position: absolute;
  left: 1rem;
  top: 1.1rem;
  color: #888;
  font-size: 1.01rem;
  font-weight: 600;
  pointer-events: none;
  transition: 0.18s cubic-bezier(.4,0,.2,1);
  background: transparent;
}
.perfil-cliente-form input:focus + label,
.perfil-cliente-form input:not(:placeholder-shown) + label {
  top: -0.7rem;
  left: 0.7rem;
  font-size: 0.89rem;
  color: #42b983;
  background: #fff;
  padding: 0 0.3em;
  border-radius: 6px;
}
.perfil-cliente-btn {
  width: 100%;
  margin: 1.5rem 0 0.7rem 0;
  padding: 1.2rem 0;
  border-radius: 16px;
  font-size: 1.18rem;
  font-weight: 800;
  letter-spacing: 0.2px;
  background: linear-gradient(90deg, #42b983 0%, #1e3c72 100%);
  color: #fff;
  border: none;
  box-shadow: 0 8px 32px #42b98333, 0 1.5px 0 #fff4 inset;
  font-family: inherit;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.13s;
  backdrop-filter: blur(2px);
}
.perfil-cliente-btn:hover {
  background: linear-gradient(90deg, #1e3c72 0%, #42b983 100%);
  color: #fff;
  box-shadow: 0 12px 36px #1e3c7244;
  transform: translateY(-2px) scale(1.05);
}
.perfil-cliente-btn.restablecer {
  background: linear-gradient(90deg, #ff9800 0%, #ff5252 100%);
  color: #fff;
  font-size: 1.09rem;
  font-weight: 700;
  margin-top: 1.2rem;
  margin-bottom: 0.2rem;
  box-shadow: 0 2px 8px #ff980011;
  border: none;
}
.perfil-cliente-btn.restablecer:hover {
  background: linear-gradient(90deg, #ff5252 0%, #ff9800 100%);
  color: #fff;
  box-shadow: 0 6px 18px #ff525211;
}
.perfil-cliente-exito {
  color: #42b983;
  font-weight: 700;
  margin-top: 0.7rem;
  font-size: 1.05rem;
  text-align: center;
}
.perfil-cliente-error {
  color: #ff5252;
  font-weight: 700;
  margin-top: 0.7rem;
  font-size: 1.05rem;
  text-align: center;
}
@media (max-width: 600px) {
  .menu-cliente-sidebar {
    width: 99vw;
    padding: 1rem 0.5rem 1rem 0.5rem;
    border-radius: 0;
    border-width: 0 0 0 3px;
  }
  .perfil-cliente-modal {
    padding: 1.2rem 0.3rem 1.2rem 0.3rem;
    border-radius: 1.1rem;
    max-width: 99vw;
  }
  .perfil-cliente-header {
    font-size: 1rem;
    gap: 0.5em;
    padding-bottom: 0.5rem;
  }
  .perfil-cliente-header i {
    font-size: 2.2rem;
    padding: 0.3em 0.4em;
  }
  .perfil-cliente-form input {
    font-size: 0.99rem;
    padding: 0.7rem 0.4rem 0.4rem 0.4rem;
  }
  .perfil-cliente-btn {
    font-size: 1.01rem;
    padding: 0.9rem 0;
  }
}
@media (max-width: 500px) {
  .menu-cliente-sidebar {
    width: 100vw;
    max-width: 100vw;
    min-width: 0;
    padding: 0.7rem 0.2rem 0.7rem 0.2rem;
    border-radius: 0;
    border-width: 0 0 0 2px;
    font-size: 0.98rem;
    overflow-y: auto;
  }
  .menu-cliente-header {
    font-size: 1rem;
    gap: 0.3em;
    margin-bottom: 1rem;
    padding-bottom: 0.2rem;
  }
  .menu-cliente-header i {
    font-size: 1.5rem;
    padding: 0.2em 0.3em;
    margin-bottom: 0.2rem;
  }
  .menu-cliente-nombre {
    font-size: 0.98rem;
  }
  .menu-cliente-close {
    font-size: 1.3rem;
    top: 0.5rem;
    right: 0.7rem;
    padding: 0.1em 0.3em;
  }
  .menu-cliente-body {
    gap: 0.7rem;
    margin-top: 0.1rem;
  }
  .menu-cliente-btn {
    font-size: 0.98rem;
    padding: 0.5rem 0.7rem;
    border-radius: 8px;
    gap: 0.4rem;
  }
  .menu-cliente-btn i {
    font-size: 0.98rem;
    padding: 0.08em 0.15em;
  }
  .menu-cliente-divider {
    margin: 0.7rem 0 0.5rem 0;
  }
}
</style>
