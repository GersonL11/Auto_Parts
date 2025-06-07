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
    <div class="home-content-bg">
      <PageBreadcrumb title="Inicio" subtitle="Bienvenido a AutoParts" />
      <AboutUsSection />
      <PricingPlansSection @ver-piezas="handleVerPiezas" />
    </div>
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
  flex: 1 0 auto;
  width: 100%;
  background: linear-gradient(135deg, var(--main-blue) 0%, var(--main-blue2) 100%), url('../../assets/01.jpg') center center/cover no-repeat;
  display: flex;
  flex-direction: column;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  position: relative;
}

.home-content-bg {
  background: #fff;
  min-height: 100%;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

.home-hero::before {
  content: "";
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  top: -1px;
  height: 60px;
  background: #fff;
  border-bottom-left-radius: 100% 24px;
  border-bottom-right-radius: 100% 24px;
  z-index: 2;
  pointer-events: none;
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
  margin-top: 2rem;
  z-index: 1;
  padding-bottom: 2rem;
  animation: fadeInUp 1.1s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px);}
  to { opacity: 1; transform: translateY(0);}
}

.main-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff !important;
  letter-spacing: 1.2px;
  text-shadow: 0 2px 8px #232b36cc;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  text-transform: uppercase;
  background: rgba(35,43,54,0.92);
  border-radius: 12px;
  display: inline-block;
  box-shadow: 0 4px 16px #232b36cc;
  animation: subtle-shine 3.5s ease-in-out infinite;
  padding: 0.5rem 1.2rem;
}
@keyframes subtle-shine {
  0% { filter: brightness(1);}
  50% { filter: brightness(1.12);}
  100% { filter: brightness(1);}
}

.subtitle {
  font-size: 1rem;
  color: var(--main-gray);
  margin: 0.7rem 0 1.2rem 0;
  font-weight: 600;
  text-shadow: 0 2px 8px var(--main-blue2);
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  letter-spacing: 0.7px;
  opacity: 0.93;
  transition: color 0.3s;
}

.hero-details {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  color: var(--main-metal);
  font-size: 0.95rem;
  font-weight: 500;
  text-shadow: 0 2px 8px var(--main-blue2);
  margin-top: 1rem;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  opacity: 0.92;
  flex-wrap: wrap;
}

.features-section {
  width: 100%;
  background: linear-gradient(90deg, #fff 70%, #f5f5f5 100%);
  padding: 2rem 0 2.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0;
  position: relative;
  z-index: 3;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  box-shadow: 0 -2px 16px var(--main-blue)11;
  animation: fadeInUp 1.2s cubic-bezier(.4,0,.2,1);
}

.features-title {
  color: var(--main-blue2);
  font-size: 1.2rem;
  font-weight: 900;
  margin-bottom: 1.2rem;
  letter-spacing: 1px;
  text-align: center;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  text-transform: uppercase;
  transition: color 0.3s;
}

.features-cards {
  display: flex;
  gap: 0.7rem;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 100vw;
}

.feature-card {
  background: linear-gradient(120deg, #f8fafc 80%, #e0e0e0 100%);
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--main-blue2)12, 0 1px 4px var(--main-orange)33;
  padding: 1.2rem 0.7rem 1rem 0.7rem;
  flex: 1 1 140px;
  min-width: 140px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.3s, transform 0.3s, border 0.3s, background 0.3s;
  border-bottom: 3px solid var(--main-orange);
  border-top: 1px solid var(--main-blue2);
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
  box-shadow: 0 4px 16px var(--main-blue2)33, 0 2px 12px var(--main-orange)55;
  transform: translateY(-4px) scale(1.03) rotate(-1deg);
  border-bottom: 3px solid var(--main-blue2);
  border-top: 1px solid var(--main-orange);
  background: linear-gradient(120deg, #fff 80%, #ffe0b2 100%);
}

.feature-icon {
  font-size: 1.5rem;
  margin-bottom: 0.7rem;
  color: var(--main-green);
  text-shadow: 0 1px 4px var(--main-blue2)11;
  background: #fff;
  border-radius: 50%;
  padding: 0.4rem 0.7rem;
  box-shadow: 0 1px 4px var(--main-orange)33;
  border: 1px solid var(--main-orange);
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
  border: 1px solid var(--main-blue2);
  background: var(--main-green);
  box-shadow: 0 2px 8px var(--main-orange)44;
}

.feature-card h4 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--main-blue2);
  margin-bottom: 0.5rem;
  text-align: center;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  letter-spacing: 0.5px;
  transition: color 0.3s;
}

.feature-card p {
  color: #444;
  font-size: 0.95rem;
  text-align: center;
  margin: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
}

/* DESKTOP & TABLET QUERIES */
@media (min-width: 700px) {
  .home-hero {
    padding-top: 90px;
  }
  .home-hero::before {
    height: 90px;
    border-bottom-left-radius: 100% 40px;
    border-bottom-right-radius: 100% 40px;
  }
  .main-title {
    font-size: 2.8rem;
    padding: 0.7rem 2.5rem;
    border-radius: 18px;
  }
  .subtitle {
    font-size: 1.4rem;
  }
  .hero-details {
    font-size: 1.08rem;
    gap: 1.2rem;
  }
  .features-section {
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
    padding: 3rem 0 3.5rem 0;
  }
  .features-title {
    font-size: 2.1rem;
    margin-bottom: 2.5rem;
    letter-spacing: 2px;
  }
  .features-cards {
    gap: 2.2rem;
    max-width: 1200px;
  }
  .feature-card {
    padding: 2.2rem 2rem 1.8rem 2rem;
    min-width: 220px;
    max-width: 270px;
    border-radius: 18px;
    border-bottom: 5px solid var(--main-orange);
    border-top: 2px solid var(--main-blue2);
  }
  .feature-icon {
    font-size: 2.6rem;
    padding: 0.6rem 0.9rem;
    border: 2px solid var(--main-orange);
  }
  .feature-card h4 {
    font-size: 1.18rem;
    margin-bottom: 0.7rem;
    letter-spacing: 1px;
  }
  .feature-card p {
    font-size: 1rem;
  }
}
</style>