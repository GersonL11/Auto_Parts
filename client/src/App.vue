<template>
  <div id="app" :class="{ 'modal-open': showLogin }">
    <HomePage
      v-if="currentPage === 'home' && !usuario && !showLogin"
      @show-login="showLogin = true"
      @show-about="goTo('about')"
      @go-home="goTo('home')"
      @show-contact="goTo('contact')"
      @show-parts="goToParts"
      @set-categoria="setCategoriaPiezas"
    />
    <LoginForm v-if="showLogin && !usuario" @login-success="handleLoginSuccess" @close="showLogin = false" />
    <AboutUs
      v-if="currentPage === 'about' && !usuario && !showLogin"
      @show-login="showLogin = true"
      @show-about="goTo('about')"
      @go-home="goTo('home')"
      @show-contact="goTo('contact')"
      @show-parts="goTo('parts')"
    />
    <Contact
      v-if="currentPage === 'contact' && !usuario && !showLogin"
      @show-login="showLogin = true"
      @show-about="goTo('about')"
      @go-home="goTo('home')"
      @show-contact="goTo('contact')"
      @show-parts="goTo('parts')"
    />
    <CatalogoPiezas
      v-if="currentPage === 'parts' && !usuario && !showLogin"
      @show-login="showLogin = true"
      @show-about="goTo('about')"
      @go-home="goTo('home')"
      @show-contact="goTo('contact')"
      @show-parts="goTo('parts')"
      :categoria-inicial="categoriaInicialPiezas"
    />
    <!-- Menú lateral solo si el usuario está autenticado -->
    <AdminLayout v-if="usuario" @navigate="handleSidebarNav" />
    <FooterAutoParts
    v-if="!usuario"
      @show-parts="handleFooterNav('parts')"
      @go-contact="handleFooterNav('contact')"
      @go-about="handleFooterNav('about')"
      @go-location="handleFooterNav('location')"
    />
    <ScrollToTop />
  </div>
</template>

<script>
import HomePage from './components/Home.vue'
import LoginForm from './components/LoginForm.vue'
import AboutUs from './components/AboutUs.vue'
import Contact from './components/Contact.vue'
import CatalogoPiezas from './components/Piezas.vue'
import FooterAutoParts from './components/FooterAutoParts.vue'
import ScrollToTop from './components/ScrollToTop.vue'
import AdminLayout from './components/admin/AdminLayout.vue'

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
    AdminLayout
  },
  data() {
    return {
      usuario: null,
      showLogin: false,
      currentPage: 'home',
      categoriaInicialPiezas: ''
    }
  },
  methods: {
    handleLoginSuccess(usuario) {
      this.usuario = usuario
      this.showLogin = false
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
      // Aquí puedes cambiar la vista según la opción seleccionada del menú lateral
      this.currentPage = page;
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
#app {
  width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden !important;
  box-sizing: border-box;
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

/* Elimina margen derecho global en botones para evitar overflow */
button, .btn-login, .btn-iniciar-sesion {
  margin-right: 0 !important;
}
</style>