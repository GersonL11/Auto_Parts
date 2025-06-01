<template>
  <section class="about-us-section">
    <div class="about-us-grid">
      <div class="about-us-gallery">
        <img :src="img1" class="about-img img1" />
        <img :src="img2" class="about-img img2" />
        <img :src="img3" class="about-img img3" />
        <img :src="img4" class="about-img img4" />
        <img :src="img5" class="about-img img5" />
        <div class="about-us-years">
          <span class="years-number">No. 1</span>
          <span class="years-label">En <span class="years-exp">Auto-partes</span></span>
        </div>
      </div>
      <div class="about-us-info">
        <div class="about-us-title">// SOBRE AUTOPARTS</div>
        <h2>
          AutoParts - Venta de Repuestos <span class="accent">.</span>
        </h2>
        <div class="about-us-desc about-us-desc1">
          <span class="desc-bar"></span>
          <span>
            Plataforma moderna para compra de piezas de autos.
          </span>
        </div>
        <div class="about-us-desc">
          Todos nuestros repuestos son originales o certificados, garantizando seguridad y durabilidad para tu vehículo. Encuentra fácilmente la pieza que buscas, para cualquier marca y modelo, en un solo lugar. Compra en línea de forma rápida, con métodos de pago seguros y soporte en cada paso.
        </div>
        <div class="about-us-contact">
          <span class="phone-icon"><i class="fas fa-headset"></i></span>
          <span>
            ¿Tienes dudas? Nuestro equipo te asesora para que elijas la pieza correcta y recibas el mejor servicio.<br>
            <span class="phone-number">+504 9999-9999</span>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AboutUsSection',
  data() {
    return {
      img1: require('../assets/staff1.jpg'),
      img2: require('../assets/staff2.jpg'),
      img3: require('../assets/staff3.jpg'),
      img4: require('../assets/staff4.png'),
      img5: require('../assets/staff1.jpg'),
    }
  }
}
</script>

<style scoped>
:root {
  --main-blue: #232b36;
  --main-blue2: #1e3c72;
  --main-orange: #ff9800;
  --main-green: #42b983;
  --main-gray: #e0e0e0;
  --main-metal: #b0bec5;
}

.about-us-section {
  width: 100%;
  background: #fff;
  padding: 3.5rem 0 2rem 0;
  display: flex;
  justify-content: center;
}
.about-us-grid {
  display: flex;
  gap: 2.5rem;
  max-width: 1200px;
  width: 95%;
  align-items: center;
  justify-content: center;
}
.about-us-gallery {
  position: relative;
  width: 400px;
  min-width: 320px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.about-img {
  position: absolute;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 8px 24px var(--main-blue)22;
}
.img1 { width: 120px; height: 120px; left: 0; top: 0; }
.img2 { width: 120px; height: 120px; right: 0; top: 0; }
.img3 { width: 90px; height: 90px; left: 10px; bottom: 0; }
.img4 { width: 120px; height: 90px; right: 0; bottom: 0; }
.img5 { width: 90px; height: 90px; left: 50%; bottom: 10px; transform: translateX(-50%);}
.about-us-years {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 250px;
  height: 220px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px var(--main-blue)22;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  z-index: 2;
}
.years-number {
  font-size: 4rem;
  color: var(--main-orange);
  font-weight: 900;
  line-height: 1;
}
.years-label {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--main-blue2);
  margin-top: 0.5rem;
  letter-spacing: 1px;
}
.years-exp {
  color: var(--main-blue);
  font-weight: 500;
  font-size: 1.1rem;
  margin-left: 0.4rem;
}

.about-us-info {
  flex: 1 1 340px;
  min-width: 320px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.about-us-title {
  color: var(--main-orange);
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 1.3px;
  margin-bottom: 0.6rem;
}
.about-us-info h2 {
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--main-blue);
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  margin-bottom: 0.7rem;
  line-height: 1.1;
}
.accent {
  color: var(--main-green);
}
.about-us-desc1 {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  color: var(--main-blue2);
  font-size: 1.08rem;
  margin-bottom: 0.3rem;
}
.desc-bar {
  display: inline-block;
  width: 3px;
  height: 36px;
  background: var(--main-green);
  border-radius: 2px;
  margin-right: 0.8rem;
  margin-top: 0.2rem;
}
.about-us-desc {
  color: var(--main-blue);
  font-size: 1.08rem;
  margin-bottom: 0.7rem;
}
.about-us-contact {
  border-top: 1px solid var(--main-gray);
  padding-top: 1.3rem;
  margin-top: 1.3rem;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  font-size: 1.1rem;
}
.phone-icon {
  color: var(--main-green);
  font-size: 2.4rem;
  background: #f5fcf8;
  border-radius: 50%;
  padding: 0.5rem 0.7rem;
  box-shadow: 0 2px 8px var(--main-green)22;
}
.phone-number {
  display: block;
  font-size: 1.6rem;
  color: var(--main-blue2);
  font-weight: 900;
  margin-top: 0.4rem;
  letter-spacing: 1.2px;
}
.about-us-contact a {
  color: var(--main-green);
  text-decoration: underline;
  font-weight: 600;
}
@media (max-width: 950px) {
  .about-us-grid {
    flex-direction: column;
    align-items: center;
  }
  .about-us-gallery { margin-bottom: 2.5rem; }
}
</style>
