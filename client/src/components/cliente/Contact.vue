<template>
  <div class="contact-page fade-in">
    <AppHeader
      :usuario="usuario"
      :current="'contact'"
      @show-login="$emit('show-login')"
      @show-about="handleNav('show-about')"
      @go-home="handleNav('go-home')"
      @show-contact="handleNav('show-contact')"
      @show-parts="handleNav('show-parts')"
    />
    <PageBreadcrumb title="Contacto" subtitle="¿Tienes dudas? ¡Contáctanos!" />
    <div class="contact-main-container">
      <!-- Título y descripción del formulario de contacto -->
      <div class="contact-form-header">
        <h2 class="contact-form-title">Formulario de Contacto</h2>
        <p class="contact-form-desc">
          ¿Tienes alguna pregunta, comentario o necesitas una cotización?
        </p>
      </div>
      <form class="contact-form" @submit.prevent="enviarFormulario">
        <div class="contact-form-row">
          <div class="contact-form-group">
            <label>Nombre <span>*</span></label>
            <input v-model="nombre" type="text" placeholder="Tu nombre completo" required />
          </div>
          <div class="contact-form-group">
            <label>Correo electrónico <span>*</span></label>
            <input v-model="correo" type="email" placeholder="Tu correo electrónico" required />
          </div>
        </div>
        <div class="contact-form-row">
          <div class="contact-form-group">
            <label>Teléfono</label>
            <input v-model="telefono" type="text" placeholder="Tu teléfono o WhatsApp" />
          </div>
          <div class="contact-form-group">
            <label>Mensaje <span>*</span></label>
            <textarea v-model="mensaje" rows="4" placeholder="¿En qué podemos ayudarte? Por favor, proporciona detalles para poder asistirte mejor." required></textarea>
          </div>
        </div>
        <button class="contact-btn" type="submit" :disabled="enviando">{{ enviando ? 'Enviando...' : 'Enviar mensaje' }}</button>
      </form>
      <transition name="fade">
        <div v-if="toastMsg" class="toast-notification">
          {{ toastMsg }}
        </div>
      </transition>
      <div class="contact-info-row">
        <div class="contact-info-card">
          <div class="contact-info-icon">
            <i class="fas fa-phone"></i>
          </div>
          <div class="contact-info-title">Teléfono</div>
          <div class="contact-info-desc">
            Contáctanos para cotizaciones o consultas sobre autopartes.
          </div>
          <a href="tel:+50499999999" class="contact-info-link">+504 9999-9999</a>
        </div>
        <div class="contact-info-card">
          <div class="contact-info-icon">
            <i class="fas fa-envelope"></i>
          </div>
          <div class="contact-info-title">Correo electrónico</div>
          <div class="contact-info-desc">
            Escríbenos para recibir atención personalizada.
          </div>
          <a href="mailto:info@yonkerunderground.hn" class="contact-info-link">info@yonkerunderground.hn</a>
        </div>
        <div class="contact-info-card">
          <div class="contact-info-icon">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <div class="contact-info-title">Ubicación</div>
          <div class="contact-info-desc">
            Bulevar del Norte,<br />San Pedro Sula, Honduras
          </div>
          <a href="https://maps.google.com/?q=Bulevar+del+Norte,+San+Pedro+Sula,+Honduras" target="_blank" class="contact-info-link">
            Ver en Google Maps
          </a>
        </div>
      </div>
      <div class="contact-map-outer">
        <iframe
          class="contact-map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.019530403712!2d-88.0334066846909!3d15.505723989210073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f664f6b0e2e2b2d%3A0x7b7b7b7b7b7b7b7b!2sSan%20Pedro%20Sula%2C%20Honduras!5e0!3m2!1ses-419!2shn!4v1680000000000!5m2!1ses-419!2shn"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from './AppHeader.vue';
import PageBreadcrumb from './PageBreadcrumb.vue';
import axios from 'axios';

export default {
  name: "ContactPage",
  components: {
    AppHeader,
    PageBreadcrumb
  },
  props: {
    usuario: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      nombre: '',
      correo: '',
      telefono: '',
      mensaje: '',
      enviando: false,
      toastMsg: ''
    };
  },
  methods: {
    handleNav(event) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      this.$emit(event);
    },
    async enviarFormulario() {
      this.enviando = true;
      this.toastMsg = '';
      try {
        await axios.post('http://localhost:3000/api/contacto', {
          nombre: this.nombre,
          correo: this.correo,
          telefono: this.telefono,
          mensaje: this.mensaje
        });
        this.toastMsg = '¡Mensaje enviado correctamente!';
        this.nombre = '';
        this.correo = '';
        this.telefono = '';
        this.mensaje = '';
      } catch (err) {
        this.toastMsg = err.response?.data?.error || 'Error al enviar el mensaje. Intenta de nuevo.';
      }
      setTimeout(() => {
        this.toastMsg = '';
      }, 4000);
      this.enviando = false;
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.contact-page {
  min-height: 100vh;
  background: #fff;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  display: flex;
  flex-direction: column;
}

.contact-main-container {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 3.5rem 2vw 2.5rem 2vw;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
}

.contact-form-header {
  width: 100%;
  max-width: 900px;
  margin-bottom: 1.5rem;
  text-align: center;
}
.contact-form-title {
  font-size: 2rem;
  font-weight: 900;
  color: #232b36;
  margin-bottom: 0.5rem;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.contact-form-desc {
  color: #7a8ca3;
  font-size: 1.13rem;
  margin-bottom: 0.2rem;
}

.contact-form {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 32px #42b98311;
  padding: 2.7rem 2.7rem 2.2rem 2.7rem;
  margin-bottom: 3.5rem;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 2.2rem; /* Más espacio entre bloques del formulario */
  border: 1.5px solid #f3f7fa;
}

.contact-form-row {
  display: flex;
  gap: 2.2rem;
  width: 100%;
  margin-bottom: 1.2rem; /* Añade espacio entre filas */
}
.contact-form-group {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  margin-bottom: 0.8rem; /* Más espacio entre grupos */
}
.contact-form-group label {
  font-weight: 700;
  color: #232b36;
  font-size: 1.13rem;
  margin-bottom: 0.6rem; /* Más espacio debajo del label */
  letter-spacing: 0.2px;
}
.contact-form-group label span {
  color: #00bfff;
  margin-left: 0.1rem;
}
.contact-form-group input,
.contact-form-group textarea {
  border: 1.5px solid #f3f7fa;
  border-radius: 10px;
  padding: 1rem 1.2rem;
  font-size: 1.13rem;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  background: #fcfdff;
  color: #232b36;
  margin-bottom: 0.2rem; /* Un poco más de espacio debajo del input */
  transition: border 0.18s, box-shadow 0.18s;
  outline: none;
  resize: none;
}
.contact-form-group input:focus,
.contact-form-group textarea:focus {
  border: 1.5px solid #00bfff;
  box-shadow: 0 0 0 2px #00bfff22;
  background: #fff;
}
.contact-btn {
  background: #22c1fa;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 1.1rem 0;
  font-size: 1.18rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 1.2rem;
  transition: background 0.18s, box-shadow 0.18s, transform 0.13s;
  box-shadow: 0 2px 8px #22c1fa22;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.contact-btn:hover {
  background: #00bfff;
  box-shadow: 0 6px 24px #22c1fa33;
  transform: translateY(-2px) scale(1.03);
}

.contact-info-row {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 2.5rem;
  width: 100%;
  margin-top: 3.5rem;
  margin-bottom: 3.5rem;
  flex-wrap: wrap;
}
.contact-info-card {
  background: #f8fafc;
  border-radius: 18px;
  padding: 2.2rem 1.5rem 1.5rem 1.5rem;
  min-width: 260px;
  max-width: 420px;
  flex: 1 1 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 16px #22c1fa11;
  border: 1.5px solid #eaf6ff;
  text-align: center;
  animation: floatCard 2.8s ease-in-out infinite alternate;
}
.contact-info-icon {
  background: #f5fcff;
  border-radius: 50%;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #22c1fa;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 16px #22c1fa11;
}
.contact-info-title {
  font-size: 1.22rem;
  font-weight: 900;
  color: #232b36;
  margin-bottom: 0.6rem;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.contact-info-desc {
  color: #7a8ca3;
  font-size: 1.08rem;
  margin-bottom: 0.8rem;
}
.contact-info-link {
  color: #22c1fa;
  font-size: 1.13rem;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.18s;
  word-break: break-all;
}
.contact-info-link:hover {
  color: #00bfff;
  text-decoration: underline;
}

/* Animación para las cards de contacto */
@keyframes floatCard {
  0% {
    transform: translateY(0) scale(1);
    box-shadow: 0 2px 16px #22c1fa11;
  }
  50% {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 8px 32px #22c1fa22;
  }
  100% {
    transform: translateY(0) scale(1);
    box-shadow: 0 2px 16px #22c1fa11;
  }
}

.contact-map-outer {
  width: 100%;
  margin: 0;
  margin-top: 3.5rem;
  background: #f8fafc;
  box-shadow: 0 2px 24px #42b98322;
  border-radius: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
}
.contact-map {
  width: 100%;
  max-width: 1600px;
  height: 400px;
  border: none;
  display: block;
}

.fade-in {
  animation: fadeInSoft 0.7s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeInSoft {
  from {
    opacity: 0;
    transform: translateY(32px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 1200px) {
  .contact-main-container {
    max-width: 100%;
    padding: 2.2rem 1vw 1.5rem 1vw;
  }
  .contact-form {
    max-width: 98vw;
    padding: 1.5rem 0.7rem 1.2rem 0.7rem;
  }
  .contact-info-row {
    gap: 1.2rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  .contact-info-card {
    min-width: 180px;
    max-width: 98vw;
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
  }
  .contact-map {
    height: 260px;
  }
}
@media (max-width: 700px) {
  .contact-main-container {
    padding: 1.2rem 0.5rem 1rem 0.5rem;
  }
  .contact-form {
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    max-width: 100vw;
  }
  .contact-info-row {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }
  .contact-map-outer {
    margin: 1.2rem 0 0 0;
    border-radius: 0;
  }
  .contact-map {
    height: 180px;
    min-width: 100%;
  }
}

.toast-notification {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #22c1fa;
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
