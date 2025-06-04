<template>
  <section class="pricing-section">
    <div class="pricing-header">
      <span class="pricing-label">// CATEGORÍAS DESTACADAS</span>
      <h2>
        <span class="emoji">🔧</span> Explora nuestras autopartes por categoría
      </h2>
    </div>
    <div class="pricing-cards one-row">
      <div class="pricing-card motor-card">
        <div class="category-icon motor-bg">
          <i class="fas fa-cogs"></i>
        </div>
        <div class="pricing-title">Motor y Transmisión</div>
        <div class="pricing-desc">
          Piezas esenciales para un rendimiento óptimo.<br />
          <span class="motor-detail">Incluye: alternadores, cajas, inyectores, sensores...</span>
        </div>
        <div class="btn-row">
          <button class="purchase-btn motor-btn" @click="$emit('ver-piezas', 'Motor y Transmisión')">Ver piezas</button>
        </div>
      </div>
      <div class="pricing-card suspension-card">
        <div class="category-icon suspension-bg">
          <i class="fas fa-car-side"></i>
        </div>
        <div class="pricing-title">Suspensión y Frenos</div>
        <div class="pricing-desc">
          Seguridad y control en cada viaje.<br />
          <span class="suspension-detail">Incluye: amortiguadores, discos, pastillas, rótulas...</span>
        </div>
        <div class="btn-row">
          <button class="purchase-btn suspension-btn" @click="$emit('ver-piezas', 'Suspensión y Frenos')">Ver piezas</button>
        </div>
      </div>
      <div class="pricing-card lights-card">
        <div class="category-icon lights-bg">
          <i class="fas fa-lightbulb"></i>
        </div>
        <div class="pricing-title">Luces y Carrocería</div>
        <div class="pricing-desc">
          Estilo, visibilidad y protección.<br />
          <span class="lights-detail">Incluye: faros, stops, espejos, defensas...</span>
        </div>
        <div class="btn-row">
          <button class="purchase-btn lights-btn" @click="$emit('ver-piezas', 'Luces')">Ver piezas</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default { name: 'PricingPlansSection' }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');

:root {
  --main-blue: #232b36;
  --main-blue2: #1e3c72;
  --main-orange: #ff9800;
  --main-green: #42b983;
  --main-cyan: #00eaff;
  --main-gray: #e0e0e0;
}

.pricing-section {
  width: 100%;
  background: #fff;
  padding: 3.5rem 0 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.pricing-header {
  text-align: center;
  margin-bottom: 2.5rem;
}
.pricing-label {
  color: var(--main-cyan);
  font-weight: 700;
  font-size: 1.18rem;
  letter-spacing: 1.3px;
  margin-bottom: 0.7rem;
  display: block;
}
.pricing-header h2 {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--main-blue);
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  margin-bottom: 0.7rem;
  line-height: 1.1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  letter-spacing: 1.5px;
}
.emoji {
  font-size: 2rem;
  margin-right: 0.5rem;
}
.pricing-cards.one-row {
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  max-width: 1200px;
  flex-wrap: nowrap;
}
.pricing-card {
  background: linear-gradient(135deg, #fafdff 60%, #e3f6ff 100%);
  border-radius: 28px;
  border: none;
  box-shadow: 0 8px 40px 0 #00eaff33, 0 2px 8px #1e3c7211;
  padding: 2.7rem 2.2rem 2.2rem 2.2rem;
  flex: 1 1 320px;
  max-width: 370px;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-bottom: 2rem;
  transition: box-shadow 0.3s, transform 0.3s, background 0.3s;
  overflow: hidden;
  text-align: center;
  border-bottom: 5px solid var(--main-cyan);
  border-top: 2px solid var(--main-blue2);
}
.pricing-card:hover {
  box-shadow: 0 16px 48px #00eaff66, 0 8px 32px #1e3c7233;
  transform: translateY(-10px) scale(1.04) rotate(-1deg);
  background: linear-gradient(120deg, #fff 80%, #e0f7fa 100%);
  border-bottom: 5px solid var(--main-blue2);
  border-top: 2px solid var(--main-cyan);
}
.category-icon {
  font-size: 3.3rem;
  margin-bottom: 1.2rem;
  border-radius: 50%;
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, #00eaff 60%, #42b983 100%);
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
@keyframes iconPop {
  0% { transform: scale(0.7);}
  60% { transform: scale(1.15);}
  100% { transform: scale(1);}
}
.motor-bg { background: linear-gradient(135deg, #00eaff 60%, #42b983 100%);}
.suspension-bg { background: linear-gradient(135deg, #42b983 60%, #1e3c72 100%);}
.lights-bg { background: linear-gradient(135deg, #ff9800 60%, #fff176 100%); color: #232b36; }
.pricing-title {
  font-size: 1.35rem;
  font-weight: 900;
  margin-bottom: 1.1rem;
  text-align: center;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  letter-spacing: 1px;
  color: var(--main-blue2);
  text-shadow: 0 2px 8px #00eaff22;
}
.motor-title { color: #00eaff;}
.suspension-title { color: #42b983;}
.lights-title { color: #ff9800;}
.pricing-desc {
  font-size: 1.13rem;
  color: var(--main-blue);
  margin-bottom: 1.5rem;
  text-align: center;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  font-weight: 400;
  line-height: 1.5;
}
.motor-detail,
.suspension-detail,
.lights-detail {
  font-size: 1rem;
  font-weight: 900;
  margin-top: 0.5rem;
  letter-spacing: 0.2px;
  display: block;
}
.motor-detail { color: var(--main-orange);}
.suspension-detail { color: var(--main-green);}
.lights-detail { color: var(--main-orange);}
.btn-row {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-top: auto;
}
.purchase-btn {
  background: linear-gradient(90deg, #269999 0%, #1b4e6b 60%, #00eaff 100%);
  color: #fff;
  border: none;
  padding: 0.95rem 2.7rem;
  border-radius: 30px;
  font-weight: 900;
  font-size: 1.13rem;
  cursor: pointer;
  box-shadow: 0 4px 24px #00eaff33, 0 2px 8px #1e3c7211;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  letter-spacing: 1.5px;
  margin-top: 1.2rem;
  opacity: 1;
  transition: 
    background 0.22s cubic-bezier(.4,0,.2,1),
    color 0.18s,
    box-shadow 0.18s,
    transform 0.13s,
    opacity 0.18s;
  outline: none;
  z-index: 1;
  position: relative;
  border-bottom: 3px solid #00eaff;
  text-shadow: 0 1px 4px #232b3688;
}
.purchase-btn:hover,
.motor-btn:hover,
.suspension-btn:hover,
.lights-btn:hover {
  background: linear-gradient(90deg, #00eaff 0%, #269999 100%);
  color: #fff;
  box-shadow: 0 8px 32px #00eaff55, 0 2px 8px #26999955;
  transform: translateY(-2px) scale(1.09);
  border-bottom: 3px solid #269999;
  text-shadow: 0 2px 8px #232b36cc;
  filter: brightness(1.08);
}
.purchase-btn:active {
  filter: brightness(0.95);
  transform: scale(0.98);
}
@media (max-width: 1100px) {
  .pricing-cards.one-row {
    gap: 1.2rem;
  }
}
@media (max-width: 900px) {
  .pricing-cards.one-row {
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
  }
  .pricing-card {
    max-width: 98vw;
    min-width: unset;
  }
}
</style>
