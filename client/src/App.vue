<template>
  <div id="app" class="app-layout" :class="{ 'modal-open': showLogin || mostrarCarrito || mostrarPerfilCliente || mostrarComprasCliente }">
    <HomePage
      v-if="currentPage === 'home' && !showLogin"
      :usuario="usuario"
      @show-login="showLogin = true"
      @show-about="goTo('about')"
      @go-home="goTo('home')"
      @show-contact="goTo('contact')"
      @show-parts="goToParts"
      @set-categoria="setCategoriaPiezas"
    />
    <LoginForm v-if="showLogin && !usuario" @login-success="handleLoginSuccess" @close="showLogin = false" />
    <AboutUs
      v-if="currentPage === 'about' && !showLogin"
      :usuario="usuario"
      @show-login="showLogin = true"
      @show-about="goTo('about')"
      @go-home="goTo('home')"
      @show-contact="goTo('contact')"
      @show-parts="goTo('parts')"
    />
    <Contact
      v-if="currentPage === 'contact' && !showLogin"
      :usuario="usuario"
      @show-login="showLogin = true"
      @show-about="goTo('about')"
      @go-home="goTo('home')"
      @show-contact="goTo('contact')"
      @show-parts="goTo('parts')"
    />
    <CatalogoPiezas
      v-if="currentPage === 'parts' && !showLogin"
      ref="catalogoPiezas"
      :usuario="usuario"
      @show-login="showLogin = true"
      @show-about="goTo('about')"
      @go-home="goTo('home')"
      @show-contact="goTo('contact')"
      @show-parts="goTo('parts')"
      :categoria-inicial="categoriaInicialPiezas"
    />
    <AdminLayout v-if="usuario && usuario.rol === 'admin' && currentPage === 'admin'" @navigate="handleSidebarNav" />
    <AppHeader
      v-if="!showLogin"
      :current="currentPage"
      :usuario="usuario"
      @show-login="showLogin = true"
      @go-home="goTo('home')"
      @show-about="goTo('about')"
      @show-contact="goTo('contact')"
      @show-parts="goTo('parts')"
      @logout="logout"
      @abrir-menu-cliente="mostrarMenuCliente = true"
    />
    <MenuCliente
      v-if="mostrarMenuCliente"
      :usuario="usuario"
      :show="mostrarMenuCliente"
      @close="mostrarMenuCliente = false"
      @ver-perfil="abrirPerfilCliente"
      @ver-compras="abrirComprasCliente"
      @ver-carrito="mostrarCarrito = true"
      @logout="logout"
    />
    <PerfilCliente
      v-if="mostrarPerfilCliente"
      :usuario="usuario"
      @close="mostrarPerfilCliente = false"
      @usuario-actualizado="handleUsuarioActualizado"
    />
    <ComprasCliente
      v-if="mostrarComprasCliente"
      :usuario="usuario"
      @close="mostrarComprasCliente = false"
    />
    <FooterAutoParts
      v-if="!usuario || (usuario && usuario.rol !== 'admin')"
      @show-parts="handleFooterNav('parts')"
      @go-contact="handleFooterNav('contact')"
      @go-about="handleFooterNav('about')"
      @go-location="handleFooterNav('location')"
    />
    <ScrollToTop />
    <CarritoFloatBtn
      v-if="usuario && usuario.rol === 'cliente' && !showLogin && currentPage !== 'admin'"
      @open-cart="mostrarCarrito = true"
      :totalArticulos="totalCarrito"
    />
    <CarritoModal
      v-if="mostrarCarrito"
      @close="mostrarCarrito = false"
      @ir-a-pagar="irAPagar"
    />
    <Pagar
      v-if="mostrarPagar"
      :carrito="carritoParaPagar"
      :usuario="usuario"
      @pago-completado="pagoCompletado"
      @cancelar="cancelarPago"
    />
  </div>
</template>

<script>
import HomePage from './components/cliente/Home.vue'
import LoginForm from './components/cliente/LoginForm.vue'
import AboutUs from './components/cliente/AboutUs.vue'
import Contact from './components/cliente/Contact.vue'
import CatalogoPiezas from './components/cliente/Piezas.vue'
import FooterAutoParts from './components/cliente/FooterAutoParts.vue'
import ScrollToTop from './components/cliente/ScrollToTop.vue'
import AdminLayout from './components/admin/AdminLayout.vue'
import CarritoFloatBtn from './components/cliente/Carrito.vue'
import CarritoModal from './components/cliente/CarritoModal.vue'
import Pagar from './components/cliente/Pagar.vue'
import AppHeader from './components/cliente/AppHeader.vue'
import MenuCliente from './components/cliente/MenuCliente.vue'
import ComprasCliente from './components/cliente/ComprasCliente.vue'
import PerfilCliente from './components/cliente/PerfilCliente.vue'

export default {
  name: 'App',
  components: {
    HomePage,
    LoginForm,
    AboutUs,
    Contact,
    CatalogoPiezas,
    FooterAutoParts,
    ScrollToTop,
    AdminLayout,
    CarritoFloatBtn,
    CarritoModal,
    Pagar,
    AppHeader,
    MenuCliente,
    ComprasCliente,
    PerfilCliente
  },
  data() {
    return {
      usuario: null,
      showLogin: false,
      currentPage: 'home',
      categoriaInicialPiezas: '',
      mostrarCarrito: false,
      totalCarrito: 0,
      mostrarPagar: false,
      carritoParaPagar: [],
      mostrarMenuCliente: false,
      mostrarPerfilCliente: false,
      mostrarComprasCliente: false
    }
  },
  created() {
    const savedUser = localStorage.getItem('autoparts_user');
    if (savedUser) {
      try {
        this.usuario = JSON.parse(savedUser);
        if (this.usuario && this.usuario.rol === 'admin') {
          this.currentPage = 'admin';
        } else if (this.usuario && this.usuario.rol === 'cliente') {
          this.currentPage = 'parts';
        }
      } catch (e) {
        this.usuario = null;
      }
    }
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.totalCarrito = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    window.addEventListener('carrito-actualizado', this._actualizarTotalCarritoDesdeStorage);
  },
  beforeUnmount() {
    window.removeEventListener('carrito-actualizado', this._actualizarTotalCarritoDesdeStorage);
  },
  methods: {
    handleLoginSuccess(usuario) {
      this.usuario = usuario
      this.showLogin = false
      localStorage.setItem('autoparts_user', JSON.stringify(usuario));
      if (usuario && usuario.rol === 'admin') {
        this.currentPage = 'admin'
      } else if (usuario && usuario.rol === 'cliente' && this.currentPage === 'home') {
        this.currentPage = 'parts'
      }
    },
    logout() {
      this.usuario = null
      localStorage.removeItem('autoparts_user')
      this.currentPage = 'home'
    },
    goTo(page) {
      this.showLogin = false;
      this.currentPage = page;
      if (page !== 'parts') {
        this.categoriaInicialPiezas = '';
      }
    },
    setCategoriaPiezas(categoria) {
      this.categoriaInicialPiezas = categoria;
    },
    goToParts(categoria) {
      if (typeof categoria === 'string' && categoria) {
        this.categoriaInicialPiezas = categoria;
      }
      this.currentPage = 'parts';
    },
    scrollToLocation() {
      if (this.currentPage !== 'contact') {
        this.goTo('contact');
        this.$nextTick(() => {
          setTimeout(() => {
            const map = document.querySelector('.contact-map-outer');
            if (map) map.scrollIntoView({ behavior: 'smooth' });
          }, 400);
        });
      } else {
        const map = document.querySelector('.contact-map-outer');
        if (map) map.scrollIntoView({ behavior: 'smooth' });
      }
    },
    handleFooterNav(page) {
      this.showLogin = false;
      if (page === 'parts') {
        this.currentPage = 'parts';
        this.$nextTick(() => {
          setTimeout(() => {
            const el = document.querySelector('.piezas-page');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 400);
        });
      } else if (page === 'contact') {
        this.currentPage = 'contact';
        this.$nextTick(() => {
          setTimeout(() => {
            const el = document.querySelector('.contact-form');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 400);
        });
      } else if (page === 'about') {
        this.currentPage = 'about';
        this.$nextTick(() => {
          setTimeout(() => {
            const el = document.querySelector('.aboutus-page');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 400);
        });
      } else if (page === 'location') {
        this.scrollToLocation();
      } else {
        this.currentPage = page;
      }
    },
    handleSidebarNav(page) {
      this.currentPage = page;
    },
    mostrarCarritoModal() {
      this.mostrarCarrito = true;
    },
    ocultarCarritoModal() {
      this.mostrarCarrito = false;
    },
    irAPagar() {
      // Obtiene el carrito actual y muestra la página de pago
      const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
      this.carritoParaPagar = carrito;
      this.mostrarCarrito = false;
      this.mostrarPagar = true;
    },
    pagoCompletado() {
      this.mostrarPagar = false;
      localStorage.setItem('carrito', '[]');
      this._actualizarTotalCarritoDesdeStorage();
      if (this.currentPage === 'parts' && this.$refs.catalogoPiezas) {
        this.$refs.catalogoPiezas.cargarPiezas();
      }
      alert('¡Pago realizado con éxito!');
      this.currentPage = 'home';
    },
    cancelarPago() {
      this.mostrarPagar = false;
    },
    actualizarTotalCarrito(nuevoTotal) {
      this.totalCarrito = nuevoTotal;
    },
    _actualizarTotalCarritoDesdeStorage: function() {
      const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
      this.totalCarrito = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    },
    handleUsuarioActualizado(usuario) {
      this.usuario = usuario;
      localStorage.setItem('autoparts_user', JSON.stringify(usuario));
    },
    abrirPerfilCliente() {
      this.mostrarMenuCliente = false;
      this.$nextTick(() => {
        this.mostrarPerfilCliente = true;
      });
    },
    abrirComprasCliente() {
      this.mostrarMenuCliente = false;
      this.$nextTick(() => {
        this.mostrarComprasCliente = true;
      });
    }
  }
}
</script>

<style>
body {
  background: linear-gradient(135deg, #42b983 0%, #1e3c72 100%);
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden !important;
  max-width: 100vw;
  box-sizing: border-box;
}
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
#app {
  width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden !important;
  box-sizing: border-box;
}
.router-view, .home-hero {
  flex: 1 0 auto;
}
*,
*::before,
*::after {
  box-sizing: border-box !important;
}
html {
  overflow-x: hidden !important;
  width: 100vw;
  max-width: 100vw;
}
.modal-open {
  overflow: hidden;
  height: 100vh;
}
.login-container {
  padding: 2vw 2vw;
  box-sizing: border-box;
}
@media (max-width: 600px) {
  .login-container {
    padding: 5vw 2vw;
  }
}
.bienvenida-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #42b983 0%, #1e3c72 100%);
}
.bienvenida-card {
  background: rgba(255,255,255,0.97);
  padding: 2.5rem 3rem;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(30,60,114,0.18);
  text-align: center;
  min-width: 320px;
  animation: fadeIn 1s;
}
.bienvenida-card h2 {
  font-size: 2rem;
  color: #1e3c72;
  margin-bottom: 0;
  letter-spacing: 1px;
  font-weight: 700;
}
.capitalize {
  text-transform: capitalize;
  color: #42b983;
  margin-left: 6px;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-30px);}
  to { opacity: 1; transform: translateY(0);}
}
button, .btn-login, .btn-iniciar-sesion {
  margin-right: 0 !important;
}
.cliente-toast {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #42b983;
  color: #fff;
  padding: 1.1rem 2.5rem;
  border-radius: 18px;
  font-size: 1.18rem;
  font-weight: 800;
  box-shadow: 0 4px 24px #1e3c7240;
  z-index: 9999;
  text-align: center;
  opacity: 0.97;
  letter-spacing: 0.5px;
}
</style>