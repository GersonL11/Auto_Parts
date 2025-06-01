<template>
  <section class="breadcrumb-hero">
    <div class="breadcrumb-bg">
      <video
        class="breadcrumb-video"
        autoplay
        muted
        loop
        playsinline
        :poster="require('../../public/images/02.jpg')"
        preload="auto"
      >
        <source src="/images/background.mp4#t=0" type="video/mp4" />
      </video>
      <div class="breadcrumb-overlay"></div>
      <svg class="breadcrumb-curve" viewBox="0 0 1440 140" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0,70 C480,180 960,0 1440,110 L1440,140 L0,140 Z" fill="#fff"/>
      </svg>
    </div>
    <div class="breadcrumb-content">
      <span class="breadcrumb-subtitle">{{ subtitle }}</span>
      <h1 class="breadcrumb-title">{{ title }}</h1>
    </div>
  </section>
</template>

<script>
export default {
  name: "PageBreadcrumb",
  props: {
    title: {
      type: String,
      default: "Sobre Nosotros"
    },
    subtitle: {
      type: String,
      default: "Conoce más sobre nuestro sitio"
    }
  }
};
</script>

<style scoped>
.breadcrumb-hero {
  position: relative;
  width: 100%; /* antes 100vw */
  min-height: 520px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 1;
  margin-top: 0;
  margin-bottom: 0;
  padding-bottom: 0;
}
.breadcrumb-bg {
  position: absolute;
  top: 0; left: 0; right: 0; height: 100%;
  z-index: 1;
  overflow: hidden;
}
.breadcrumb-video {
  width: 100%; /* antes 100vw */
  height: 100%;
  object-fit: cover; /* Cubre todo el contenedor sin dejar barras */
  object-position: center center;
  filter: grayscale(0.05) brightness(0.85);
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 1;
  pointer-events: none;
  display: block;
  background: #232b36;
}
.breadcrumb-img {
  display: none;
}
.breadcrumb-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; height: 100%;
  background: linear-gradient(120deg, #232b36ee 60%, #232b36cc 100%);
  z-index: 2;
}
.breadcrumb-curve {
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  width: 100%; /* antes 100vw */
  height: 140px;
  z-index: 3;
  pointer-events: none;
  display: block;
}
.breadcrumb-bottom-fix {
  display: none !important;
}
.breadcrumb-content {
  position: relative;
  z-index: 4;
  text-align: center;
  margin-bottom: 0;
  margin-top: 0;
  width: 100%; /* antes 100vw */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.breadcrumb-subtitle {
  display: block;
  color: #b0b8c9;
  font-size: 1.18rem;
  margin-bottom: 0.2rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.breadcrumb-title {
  color: #fff;
  font-size: 2.7rem;
  font-weight: 900;
  letter-spacing: 1px;
  margin: 0;
  text-shadow: 0 2px 16px #232b36cc;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
@media (max-width: 900px) {
  .breadcrumb-hero {
    min-height: 180px;
  }
  .breadcrumb-title {
    font-size: 1.5rem;
  }
  .breadcrumb-content {
    margin-bottom: 0;
    margin-top: 0;
  }
}
</style>
