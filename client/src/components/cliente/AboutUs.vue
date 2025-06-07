<template>
  <div class="aboutus-page fade-in">
    <AppHeader
      :usuario="usuario"
      :current="'about'"
      @show-login="$emit('show-login')"
      @show-about="handleNav('show-about')"
      @go-home="handleNav('go-home')"
      @show-contact="handleNav('show-contact')"
      @show-parts="handleNav('show-parts')"
    />
    <PageBreadcrumb title="Sobre Nosotros" subtitle="Conoce más sobre nuestro sitio" />
    <div class="aboutus-main-container">
      <section class="aboutus-hero">
        <div class="aboutus-hero-img-col">
          <div class="aboutus-img-main-wrap">
            <img class="aboutus-img-main" :src="require('../../assets/sobreNosotros.png')" alt="Autopartes" />
            <div class="aboutus-img-overlay">
              <img :src="require('../../assets/sobreNosotros2.png')" alt="Rueda y repuestos" />
            </div>
          </div>
        </div>
        <div class="aboutus-hero-text-col">
          <span class="aboutus-history-label">Nuestra historia</span>
          <h2 class="aboutus-history-title">
            Rapidez.<br />
            Confianza. Ahorro.
          </h2>
          <p class="aboutus-history-desc">
            Somos un <b>yonker</b> comprometido en ofrecer repuestos usados en excelente estado, a precios accesibles y con atención confiable. Contamos con un amplio inventario para distintas marcas y modelos, seleccionando cada pieza con cuidado para garantizar su funcionalidad. Aquí encuentras lo que tu vehículo necesita, sin rodeos ni intermediarios. Repuestos que cumplen, precios que ayudan.
          </p>
        </div>
      </section>
      <section class="aboutus-how">
        <h3 class="aboutus-how-title">¿Cómo funciona?</h3>
        <p class="aboutus-how-desc">
          Compra tus autopartes de forma sencilla, rápida y segura en <b>Yonker Underground</b>.
        </p>
        <div class="aboutus-how-steps">
          <div class="aboutus-step">
            <div class="aboutus-step-icon">
              <i class="fas fa-search"></i>
            </div>
            <div class="aboutus-step-title">Busca tu autoparte</div>
            <div class="aboutus-step-desc">
              Utiliza nuestro buscador o explora las categorías para encontrar la pieza que necesitas para tu vehículo.
            </div>
          </div>
          <div class="aboutus-step">
            <div class="aboutus-step-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="aboutus-step-title">Solicita cotización o compra</div>
            <div class="aboutus-step-desc">
              Solicita una cotización rápida o realiza tu pedido directamente. Te confirmamos disponibilidad y precio.
            </div>
          </div>
          <div class="aboutus-step">
            <div class="aboutus-step-icon">
              <i class="fas fa-box"></i>
            </div>
            <div class="aboutus-step-title">Recibe o recoge tu pieza</div>
            <div class="aboutus-step-desc">
              Elige entre recoger en tienda en San Pedro Sula o recibir tu autoparte a domicilio de forma segura.
            </div>
          </div>
        </div>
      </section>
      <section class="aboutus-features">
        <h3 class="aboutus-features-title">¿Por qué elegir AutoParts?</h3>
        <div class="aboutus-features-cards">
          <div class="aboutus-feature-card styled-feature-card">
            <div class="aboutus-feature-icon styled-feature-icon"><i class="fas fa-certificate"></i></div>
            <h4>Piezas de Alta Calidad</h4>
            <p>Todos nuestros repuestos son originales o certificados, garantizando seguridad y durabilidad para tu vehículo.</p>
          </div>
          <div class="aboutus-feature-card styled-feature-card">
            <div class="aboutus-feature-icon styled-feature-icon"><i class="fas fa-th-list"></i></div>
            <h4>Gran Variedad</h4>
            <p>Encuentra fácilmente la pieza que buscas, para cualquier marca y modelo, en un solo lugar.</p>
          </div>
          <div class="aboutus-feature-card styled-feature-card">
            <div class="aboutus-feature-icon styled-feature-icon"><i class="fas fa-shield-alt"></i></div>
            <h4>Compra Segura y Fácil</h4>
            <p>Compra en línea de forma rápida, con métodos de pago seguros y soporte en cada paso.</p>
          </div>
          <div class="aboutus-feature-card styled-feature-card">
            <div class="aboutus-feature-icon styled-feature-icon"><i class="fas fa-headset"></i></div>
            <h4>Atención Personalizada</h4>
            <p>¿Tienes dudas? Nuestro equipo te asesora para que elijas la pieza correcta y recibas el mejor servicio.</p>
          </div>
        </div>
      </section>
      <section class="aboutus-contact">
        <h3>¿Tienes preguntas? ¡Contáctanos!</h3>
        <p>Autopartes usadas disponibles fácil, rápido y directo.</p>
        <button class="aboutus-contact-btn" @click="goToContact">
          <i class="fas fa-envelope"></i> Contáctanos
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import AppHeader from './AppHeader.vue';
import PageBreadcrumb from './PageBreadcrumb.vue';

export default {
  name: "AboutUsPage",
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
  methods: {
    handleNav(event) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      this.$emit(event);
    },
    goToContact() {
      window.scrollTo({ top: 0, behavior: 'auto' });
      this.$emit('show-contact');
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
.aboutus-page {
  min-height: 100vh;
  background: #fff;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}

/* Añade espacio entre el header fijo y el breadcrumb */
.PageBreadcrumb,
.page-breadcrumb,
.breadcrumb-hero {
  margin-top: 84px;
}

.aboutus-main-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 3.5rem 1.5rem 2rem 1.5rem;
  flex: 1 1 auto;
  margin-top: 0;
}

.aboutus-hero {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 3.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.aboutus-hero-img-col {
  flex: 1 1 340px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 260px;
}

.aboutus-img-main-wrap {
  position: relative;
  width: 320px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.aboutus-img-main {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
  background: #f8fafc;
  box-shadow: 0 2px 16px #00eaff11;
  border: 2px solid #eaf6ff;
}

.aboutus-img-overlay {
  position: absolute;
  right: 18px;
  bottom: 18px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px #00eaff22;
  padding: 0.5rem;
  width: 140px;
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.aboutus-img-overlay img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.aboutus-hero-text-col {
  flex: 1 1 340px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  justify-content: center;
}

.aboutus-history-label {
  color: #00bcd4;
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.5px;
  margin-bottom: 0.2rem;
  display: block;
}

.aboutus-history-title {
  color: #232b36;
  font-size: 2.1rem;
  font-weight: 900;
  margin: 0.2rem 0 1.1rem 0;
  line-height: 1.2;
}

.aboutus-history-desc {
  color: #4a5568;
  font-size: 1.13rem;
  line-height: 1.7;
  margin-bottom: 0;
}

.aboutus-how {
  margin-bottom: 3.5rem;
  text-align: center;
}

.aboutus-how-title {
  color: #232b36;
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.aboutus-how-desc {
  color: #7a8ca3;
  font-size: 1.08rem;
  margin-bottom: 2.2rem;
}

.aboutus-how-steps {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  flex-wrap: wrap;
  align-items: flex-end;
  position: relative;
  overflow: visible;
}

.aboutus-step {
  background: #fff;
  border-radius: 22px;
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  min-width: 260px;
  max-width: 340px;
  flex: 1 1 260px;
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 16px #00eaff11, 0 0 16px #00eaff11;
  border: 2px solid #b2f7ff;
  transition: 
    box-shadow 0.22s cubic-bezier(.4,0,.2,1),
    border-color 0.18s,
    transform 0.18s;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  animation: aboutus-breeze 6s cubic-bezier(.4,0,.2,1) infinite;
  will-change: transform, border-radius;
}
.aboutus-step:nth-child(1) { animation-delay: 0s; }
.aboutus-step:nth-child(2) { animation-delay: 1s; }
.aboutus-step:nth-child(3) { animation-delay: 2s; }

@keyframes aboutus-breeze {
  0% {
    transform: translateY(0) scale(1) rotateZ(0deg);
    border-radius: 22px;
  }
  10% {
    transform: translateY(-3px) scale(1.01) rotateZ(-0.5deg);
    border-radius: 23px 22px 22px 23px;
  }
  20% {
    transform: translateY(-6px) scale(1.015) rotateZ(-1deg);
    border-radius: 24px 22px 22px 24px;
  }
  35% {
    transform: translateY(-9px) scale(1.02) rotateZ(-1.5deg);
    border-radius: 25px 22px 22px 25px;
  }
  50% {
    transform: translateY(-6px) scale(1.015) rotateZ(-1deg);
    border-radius: 24px 22px 22px 24px;
  }
  65% {
    transform: translateY(-3px) scale(1.01) rotateZ(-0.5deg);
    border-radius: 23px 22px 22px 23px;
  }
  70% {
    transform: translateY(0) scale(1) rotateZ(0deg);
    border-radius: 22px;
  }
  80% {
    transform: translateY(2px) scale(0.99) rotateZ(0.5deg);
    border-radius: 21px 22px 22px 21px;
  }
  90% {
    transform: translateY(4px) scale(0.98) rotateZ(1deg);
    border-radius: 20px 22px 22px 20px;
  }
  100% {
    transform: translateY(0) scale(1) rotateZ(0deg);
    border-radius: 22px;
  }
}

/* ...existing code... */

.aboutus-step-icon {
  background: linear-gradient(135deg, #00eaff 40%, #42b983 100%);
  color: #fff;
  border-radius: 50%;
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.3rem;
  margin-bottom: 1.1rem;
  box-shadow: 0 2px 16px #00eaff33;
  transition: box-shadow 0.18s, transform 0.18s;
  position: relative;
  z-index: 2;
  animation: aboutus-icon-pop 0.7s cubic-bezier(.4,0,.2,1);
}
.aboutus-step:hover .aboutus-step-icon {
  box-shadow: 0 0 24px #00eaff88, 0 0 0 #00eaff00;
  animation: aboutus-icon-pulse 0.7s;
  transform: scale(1.13) rotate(-4deg);
}
@keyframes aboutus-icon-pop {
  0% { transform: scale(0.7);}
  80% { transform: scale(1.08);}
  100% { transform: scale(1);}
}
@keyframes aboutus-icon-pulse {
  0% { box-shadow: 0 0 0 #00eaff00;}
  60% { box-shadow: 0 0 32px #00eaff88;}
  100% { box-shadow: 0 0 24px #00eaff88;}
}

.aboutus-step-title {
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  font-size: 1.18rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  text-align: center;
  background: linear-gradient(90deg, #00eaff 0%, #00eaff 60%, #232b36 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
}

.aboutus-step-desc {
  color: #7a8ca3;
  font-size: 1.08rem;
  text-align: center;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  font-weight: 400;
  margin-top: 0.3rem;
}

.aboutus-contact {
  text-align: center;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
}

.aboutus-contact h3 {
  color: #232b36;
  font-size: 1.18rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.aboutus-contact p {
  color: #7a8ca3;
  font-size: 1.05rem;
  margin-bottom: 1.2rem;
}

.aboutus-contact-btn {
  background: #00bcd4;
  color: #fff;
  border: none;
  border-radius: 18px;
  padding: 0.7rem 2.2rem;
  font-size: 1.08rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.13s;
  box-shadow: 0 2px 8px #00eaff33;
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
}
.aboutus-contact-btn:hover {
  background: #232b36;
  color: #fff;
  box-shadow: 0 6px 24px #00eaff33;
  transform: translateY(-2px) scale(1.06);
}

.aboutus-contact-btn i {
  font-size: 1.2rem;
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

.aboutus-features {
  width: 100%;
  background: #fff;
  padding: 2.5rem 0 2.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
}
.aboutus-features-title {
  color: #232b36;
  font-size: 2.1rem;
  font-weight: 900;
  margin-bottom: 2.5rem;
  letter-spacing: 2px;
  text-align: center;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  text-transform: none;
}
.aboutus-features-cards {
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  justify-content: center;
  align-items: stretch;
  flex-wrap: wrap;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Card estilo igual a PricingPlansSection */
.aboutus-feature-card {
  background: linear-gradient(135deg, #fafdff 60%, #e3f6ff 100%);
  border-radius: 28px;
  border: none;
  box-shadow: 0 8px 40px 0 #00eaff22, 0 2px 8px #1e3c7211;
  padding: 2.7rem 2.2rem 2.2rem 2.2rem;
  flex: 1 1 260px;
  max-width: 350px;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-bottom: 2rem;
  transition: box-shadow 0.3s, transform 0.3s, background 0.3s;
  overflow: hidden;
  text-align: center;
  border-bottom: 5px solid #00eaff;
  border-top: none;
  box-sizing: border-box;
}
.aboutus-feature-card:hover {
  box-shadow: 0 16px 48px #00eaff66, 0 8px 32px #1e3c7233;
  transform: translateY(-10px) scale(1.04) rotate(-1deg);
  background: linear-gradient(120deg, #fff 80%, #e0f7fa 100%);
  border-bottom: 5px solid #269999;
}
.aboutus-feature-icon {
  font-size: 3.3rem;
  margin-bottom: 1.2rem;
  border-radius: 50%;
  padding: 1.2rem 1.5rem;
  background: #00eaff;
  color: #fff;
  box-shadow: 0 4px 24px #00eaff44, 0 2px 8px #1e3c7211;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -2.5rem;
  margin-bottom: 1.5rem;
  border: 4px solid #fff;
  transition: box-shadow 0.3s, border 0.3s, background 0.3s, color 0.3s;
  animation: iconPop 1.2s cubic-bezier(.4,0,.2,1);
}
.aboutus-feature-card:nth-child(2) .aboutus-feature-icon {
  background: #42b983;
}
.aboutus-feature-card:nth-child(3) .aboutus-feature-icon {
  background: #ff9800;
}
.aboutus-feature-card:nth-child(4) .aboutus-feature-icon {
  background: #1e3c72;
}
.aboutus-feature-card h4 {
  font-size: 1.35rem;
  font-weight: 900;
  color: #232b36;
  margin-bottom: 0.7rem;
  text-align: center;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  letter-spacing: 1px;
  text-shadow: none;
}
.aboutus-feature-card p {
  color: #232b36;
  font-size: 1.08rem;
  text-align: center;
  margin: 0;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  font-weight: 400;
  line-height: 1.5;
}

@media (max-width: 1200px) {
  .aboutus-features-cards {
    gap: 1.2rem;
  }
}
@media (max-width: 900px) {
  .aboutus-features-cards {
    flex-direction: column;
    align-items: center;
    gap: 0.7rem;
  }
  .aboutus-feature-card {
    padding: 1.5rem 1rem 1.2rem 1rem;
    min-width: 160px;
    max-width: 98vw;
  }
}
@media (max-width: 700px) {
  .aboutus-main-container {
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    max-width: 100vw;
  }
  .aboutus-hero {
    flex-direction: column;
    gap: 1.2rem;
    margin-bottom: 1.2rem;
    align-items: stretch;
  }
  .aboutus-hero-img-col, .aboutus-hero-text-col {
    min-width: 0;
    width: 100%;
    flex: 1 1 100%;
    padding: 0;
  }
  .aboutus-img-main-wrap {
    width: 180px;
    height: 180px;
  }
  .aboutus-img-overlay {
    width: 80px;
    height: 60px;
    right: 6px;
    bottom: 6px;
    padding: 0.2rem;
  }
  .aboutus-history-title {
    font-size: 1.1rem;
    margin: 0.1rem 0 0.5rem 0;
  }
  .aboutus-history-desc {
    font-size: 0.98rem;
  }
  .aboutus-how {
    margin-bottom: 1.2rem;
  }
  .aboutus-how-title {
    font-size: 1.1rem;
    margin-bottom: 0.2rem;
  }
  .aboutus-how-desc {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }
  .aboutus-how-steps {
    flex-direction: column;
    gap: 1.2rem;
    align-items: stretch;
  }
  .aboutus-step {
    min-width: 0;
    max-width: 100vw;
    padding: 1.2rem 0.7rem 1rem 0.7rem;
    border-radius: 12px;
    margin-bottom: 0.7rem;
  }
  .aboutus-step-icon {
    width: 38px;
    height: 38px;
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
  }
  .aboutus-step-title {
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }
  .aboutus-step-desc {
    font-size: 0.95rem;
    margin-top: 0.1rem;
  }
  .aboutus-contact {
    margin-top: 1.2rem;
    margin-bottom: 0.7rem;
  }
  .aboutus-contact h3 {
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }
  .aboutus-contact p {
    font-size: 0.95rem;
    margin-bottom: 0.7rem;
  }
  .aboutus-contact-btn {
    font-size: 0.98rem;
    padding: 0.5rem 1.2rem;
    border-radius: 10px;
    gap: 0.4rem;
  }
  .aboutus-features {
    padding: 1.2rem 0 1.2rem 0;
    margin-bottom: 1.2rem;
  }
  .aboutus-features-title {
    font-size: 1.1rem;
    margin-bottom: 1.2rem;
  }
  .aboutus-features-cards {
    flex-direction: column;
    gap: 1.2rem;
    max-width: 100vw;
  }
  .aboutus-feature-card {
    min-width: 0;
    max-width: 100vw;
    padding: 1.2rem 0.7rem 1rem 0.7rem;
    border-radius: 12px;
    margin-bottom: 0.7rem;
  }
  .aboutus-feature-icon {
    font-size: 1.5rem;
    padding: 0.5rem 0.7rem;
    margin-top: -1rem;
    margin-bottom: 0.7rem;
    border-radius: 10px;
  }
  .aboutus-feature-card h4 {
    font-size: 1rem;
    margin-bottom: 0.2rem;
  }
  .aboutus-feature-card p {
    font-size: 0.95rem;
  }
}
</style>
