<template>
  <div class="home-hero fade-in">
    <AppHeader
      :usuario="usuario"
      current="home"
      @show-login="$emit('show-login')"
      @show-about="handleNav('show-about')"
      @go-home="handleNav('go-home')"
      @show-contact="handleNav('show-contact')"
      @show-parts="handleNav('show-parts')"
    />
    <PageBreadcrumb title="Inicio" subtitle="Bienvenido a AutoParts" />
    <AboutUsSection />
    <PricingPlansSection @ver-piezas="handleVerPiezas" />
  </div>
</template>

<script>
import AppHeader from './AppHeader.vue'
import PageBreadcrumb from './PageBreadcrumb.vue'
import AboutUsSection from './AboutUsSection.vue'
import PricingPlansSection from './PricingPlansSection.vue'

export default {
  name: 'HomePage',
  components: { AppHeader, PageBreadcrumb, AboutUsSection, PricingPlansSection },
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
    handleVerPiezas(categoria) {
      // Pasa la categoría como argumento al evento show-parts
      this.$emit('show-parts', categoria);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

:root {
  --main-blue: #232b36;
  --main-blue2: #1e3c72;
  --main-orange: #ff9800;
  --main-green: #42b983;
  --main-gray: #e0e0e0;
  --main-metal: #b0bec5;
}

.home-hero {
  min-height: 100vh;
  width: 100%; /* cambia de 100vw a 100% */
  /* Fondo original restaurado */
  background: linear-gradient(135deg, var(--main-blue) 0%, var(--main-blue2) 100%), url('../../assets/01.jpg') center center/cover no-repeat;
  display: flex;
  flex-direction: column;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  /* Ajuste para header fijo */
  padding-top: 90px;
  position: relative; /* Necesario para el pseudo-elemento */
}

/* Corte curvo superior */
.home-hero::before {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: -1px;
  height: 90px;
  background: #fff;
  border-bottom-left-radius: 100% 40px;
  border-bottom-right-radius: 100% 40px;
  z-index: 2;
  pointer-events: none;
}

/* Asegura que el contenido no se superponga al corte */
.features-section {
  width: 100%;
  background: linear-gradient(90deg, #fff 70%, #f5f5f5 100%);
  padding: 3rem 0 3.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;
  position: relative;
  z-index: 3;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  box-shadow: 0 -4px 32px var(--main-blue)11;
  animation: fadeInUp 1.2s cubic-bezier(.4,0,.2,1);
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

.hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 4rem;
  z-index: 1;
  padding-bottom: 5rem;
  animation: fadeInUp 1.1s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px);}
  to { opacity: 1; transform: translateY(0);}
}

.main-title {
  font-size: 2.8rem;
  font-weight: 900;
  color: #fff !important;
  letter-spacing: 2.5px;
  text-shadow:
    0 4px 24px #232b36,
    0 2px 0 #1e3c72,
    2px 2px 0 #232b36,
    -2px -2px 0 #232b36,
    2px -2px 0 #232b36,
    -2px 2px 0 #232b36;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  text-transform: uppercase;
  background: none !important;
  -webkit-background-clip: unset !important;
  -webkit-text-fill-color: unset !important;
  position: relative;
  z-index: 2;
  padding: 0.7rem 2.5rem;
  border-radius: 18px;
  background: rgba(35,43,54,0.92);
  display: inline-block;
  box-shadow: 0 8px 32px #232b36cc;
  animation: subtle-shine 3.5s ease-in-out infinite;
}
@keyframes subtle-shine {
  0% { filter: brightness(1);}
  50% { filter: brightness(1.12);}
  100% { filter: brightness(1);}
}

.subtitle {
  font-size: 1.4rem;
  color: var(--main-gray);
  margin: 1.2rem 0 2.2rem 0;
  font-weight: 600;
  text-shadow: 0 2px 8px var(--main-blue2);
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  letter-spacing: 1.2px;
  opacity: 0.93;
  transition: color 0.3s;
}

.hero-details {
  display: flex;
  gap: 1.2rem;
  justify-content: center;
  color: var(--main-metal);
  font-size: 1.08rem;
  font-weight: 500;
  text-shadow: 0 2px 8px var(--main-blue2);
  margin-top: 1.5rem;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  opacity: 0.92;
}

.hero-details span:not(:nth-child(2)):not(:nth-child(4)) {
  animation: subtle-pulse 2.8s ease-in-out infinite;
  display: inline-block;
}
.hero-details span:nth-child(1) { animation-delay: 0s; }
.hero-details span:nth-child(3) { animation-delay: 0.7s; }
.hero-details span:nth-child(5) { animation-delay: 1.4s; }
@keyframes subtle-pulse {
  0% { opacity: 1; transform: scale(1);}
  50% { opacity: 0.85; transform: scale(1.04);}
  100% { opacity: 1; transform: scale(1);}
}

.features-section {
  width: 100%;
  background: linear-gradient(90deg, #fff 70%, #f5f5f5 100%);
  padding: 3rem 0 3.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;
  position: relative;
  z-index: 3;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  box-shadow: 0 -4px 32px var(--main-blue)11;
  animation: fadeInUp 1.2s cubic-bezier(.4,0,.2,1);
}

.features-title {
  color: var(--main-blue2);
  font-size: 2.1rem;
  font-weight: 900;
  margin-bottom: 2.5rem;
  letter-spacing: 2px;
  text-align: center;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  text-transform: uppercase;
  transition: color 0.3s;
}

.features-cards {
  display: flex;
  gap: 2.2rem;
  justify-content: center;
  flex-wrap: wrap;
  width: 90%;
  max-width: 1200px;
}

.feature-card {
  background: linear-gradient(120deg, #f8fafc 80%, #e0e0e0 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px var(--main-blue2)12, 0 2px 8px var(--main-orange)33;
  padding: 2.2rem 2rem 1.8rem 2rem;
  flex: 1 1 220px;
  min-width: 220px;
  max-width: 270px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.3s, transform 0.3s, border 0.3s, background 0.3s;
  border-bottom: 5px solid var(--main-orange);
  border-top: 2px solid var(--main-blue2);
  position: relative;
  opacity: 0;
  animation: cardFadeIn 0.8s cubic-bezier(.4,0,.2,1) forwards, floaty 6s ease-in-out infinite;
}
.feature-card:nth-child(1) { animation-delay: 0.2s;}
.feature-card:nth-child(2) { animation-delay: 0.4s;}
.feature-card:nth-child(3) { animation-delay: 0.6s;}
.feature-card:nth-child(4) { animation-delay: 0.8s;}
@keyframes cardFadeIn {
  from { opacity: 0; transform: translateY(40px);}
  to { opacity: 1; transform: translateY(0);}
}
@keyframes floaty {
  0% { transform: translateY(0);}
  50% { transform: translateY(-8px);}
  100% { transform: translateY(0);}
}

.feature-card:hover {
  box-shadow: 0 8px 32px var(--main-blue2)33, 0 4px 24px var(--main-orange)55;
  transform: translateY(-8px) scale(1.06) rotate(-1deg);
  border-bottom: 5px solid var(--main-blue2);
  border-top: 2px solid var(--main-orange);
  background: linear-gradient(120deg, #fff 80%, #ffe0b2 100%);
}

.feature-icon {
  font-size: 2.6rem;
  margin-bottom: 1.1rem;
  color: var(--main-green);
  text-shadow: 0 2px 8px var(--main-blue2)11;
  background: #fff;
  border-radius: 50%;
  padding: 0.6rem 0.9rem;
  box-shadow: 0 2px 8px var(--main-orange)33;
  border: 2px solid var(--main-orange);
  transition: color 0.3s, border 0.3s, box-shadow 0.3s, background 0.3s;
  animation: iconPop 1.2s cubic-bezier(.4,0,.2,1);
}
@keyframes iconPop {
  0% { transform: scale(0.7);}
  60% { transform: scale(1.15);}
  100% { transform: scale(1);}
}

.feature-card:hover .feature-icon {
  color: var(--main-orange);
  border: 2px solid var(--main-blue2);
  background: var(--main-green);
  box-shadow: 0 4px 16px var(--main-orange)44;
}

.feature-card h4 {
  font-size: 1.18rem;
  font-weight: 700;
  color: var(--main-blue2);
  margin-bottom: 0.7rem;
  text-align: center;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  letter-spacing: 1px;
  transition: color 0.3s;
}

.feature-card p {
  color: #444;
  font-size: 1rem;
  text-align: center;
  margin: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
}

@media (max-width: 1200px) {
  .features-cards {
    gap: 1.2rem;
    margin-right: 1rem;
  }
  .features-title {
    margin-right: 1.2rem;
  }
}
@media (max-width: 900px) {
  .main-title {
    font-size: 1.7rem;
  }
  .features-cards {
    gap: 0.7rem;
    margin-right: 0.5rem;
  }
  .feature-card {
    padding: 1.5rem 1rem 1.2rem 1rem;
    min-width: 160px;
    max-width: 220px;
  }
}
@media (max-width: 700px) {
  .features-cards {
    flex-direction: column;
    align-items: center;
  }
  .main-title {
    font-size: 1.1rem;
  }
  .subtitle {
    font-size: 0.95rem;
  }
  .hero-details {
    font-size: 0.95rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>