<template>
  <footer class="autoparts-footer">
    <div class="footer-gradient-bar"></div>
    <div class="footer-main">
      <div class="footer-logo-section glass">
        <i class="fas fa-tools footer-logo-icon"></i>
        <span class="footer-logo-text">AutoParts</span>
        <span class="footer-slogan">Soluciones en repuestos</span>
      </div>
      <div class="footer-links glass">
        <button type="button" class="footer-link" @click="$emit('show-parts')"><i class="fas fa-car"></i> Catálogo</button>
        <button type="button" class="footer-link" @click="$emit('go-contact')"><i class="fas fa-phone-alt"></i> Contacto</button>
        <button type="button" class="footer-link" @click="$emit('go-about')"><i class="fas fa-info-circle"></i> Sobre Nosotros</button>
        <button type="button" class="footer-link" @click="$emit('go-location')"><i class="fas fa-map-marker-alt"></i> Ubicación</button>
      </div>
      <div class="footer-contact glass">
        <div class="footer-contact-title"><i class="fas fa-headset"></i> Soporte</div>
        <div class="footer-contact-info">
          <span><i class="fas fa-envelope"></i> soporte@autoparts.com</span>
          <span><i class="fas fa-phone"></i> +504 9999-9999</span>
        </div>
        <div class="footer-social">
          <a
            href="https://facebook.com/"
            class="footer-social-link"
            title="Facebook"
            target="_blank"
            rel="noopener"
          ><i class="fab fa-facebook-f"></i></a>
          <a
            href="https://instagram.com/"
            class="footer-social-link"
            title="Instagram"
            target="_blank"
            rel="noopener"
          ><i class="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; {{ new Date().getFullYear() }} AutoParts. Todos los derechos reservados.</span>
      <span class="footer-powered"> <i class="fas fa-cogs"></i> Powered by AutoParts Team</span>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterAutoParts"
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

:root {
  --footer-bg-gradient: linear-gradient(135deg, #181d23 0%, #232b3a 60%, #0f2027 100%);
  --footer-accent: #00eaff;
  --footer-accent-glow: #00eaff88;
  --footer-steel: #f5faff;
  --footer-dark: #10131a;
  --footer-link: #f5faff;
  --footer-glass-bg: rgba(24,29,35,0.65);
  --footer-glass-border: rgba(0,234,255,0.18);
  --footer-shadow: 0 8px 32px 0 #00eaff22;
  --footer-separator: rgba(0,234,255,0.12);
}

/* Sutil barra animada */
.footer-gradient-bar {
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #00eaff 0%, #232b3a 50%, #00eaff 100%);
  background-size: 200% 100%;
  animation: gradient-move 4s linear infinite;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 24px #00eaff22;
}
@keyframes gradient-move {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.autoparts-footer {
  /* Fondo degradado oscuro tipo card */
  background: linear-gradient(120deg, #269999 0%, #1b4e6b 100%);
  color: var(--footer-link);
  padding: 0 0 1.5rem 0;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  box-shadow: 0 -4px 32px #00eaff22;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  margin-top: 3rem;
  overflow: hidden;
  position: relative;
}

.footer-main {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto 2rem auto;
  padding: 0 2rem;
  gap: 2.5rem;
}

/* Fondo sólido para las tarjetas del footer */
.glass {
  background: transparent;
  border: 1.5px solid var(--footer-glass-border);
  border-radius: 18px;
  box-shadow: var(--footer-shadow);
  backdrop-filter: none;
  padding: 1.2rem 1.5rem;
  margin-bottom: 0.5rem;
}

.footer-logo-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 200px;
  gap: 0.5rem;
}
.footer-logo-icon {
  font-size: 2.7rem;
  color: var(--footer-accent);
  margin-bottom: 0.3rem;
  text-shadow: 0 0 16px var(--footer-accent-glow), 0 0 2px #fff;
  animation: neon-flicker 2.5s infinite alternate;
}
@keyframes neon-flicker {
  0%, 100% { text-shadow: 0 0 16px var(--footer-accent-glow), 0 0 2px #fff; }
  45% { text-shadow: 0 0 24px var(--footer-accent), 0 0 8px #fff; }
  50% { text-shadow: 0 0 8px var(--footer-accent-glow), 0 0 2px #fff; }
  55% { text-shadow: 0 0 24px var(--footer-accent), 0 0 8px #fff; }
}
.footer-logo-text {
  font-size: 1.7rem;
  font-weight: 900;
  letter-spacing: 2.5px;
  color: #fff;
  text-shadow: 0 2px 12px #00eaff33;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.footer-slogan {
  font-size: 1.08rem;
  color: #b2f7ff;
  font-weight: 600;
  margin-top: 0.2rem;
  letter-spacing: 0.7px;
  text-shadow: 0 1px 8px #00eaff22;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 180px;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.footer-link {
  color: #fff;
  text-decoration: none;
  font-size: 1.13rem;
  font-weight: 700;
  letter-spacing: 0.7px;
  transition: color 0.18s, text-shadow 0.18s;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  text-shadow: 0 1px 8px #00eaff22;
  border-radius: 8px;
  padding: 0.2rem 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.footer-link:focus {
  outline: 2px solid var(--footer-accent);
}
.footer-link i {
  color: var(--footer-accent);
  font-size: 1.25rem;
  text-shadow: 0 0 8px var(--footer-accent-glow);
  transition: color 0.18s, text-shadow 0.18s;
}
.footer-link:hover {
  color: var(--footer-accent);
  background: rgba(0,234,255,0.08);
  text-shadow: 0 0 8px var(--footer-accent-glow);
}
.footer-link:hover i {
  color: #fff;
  text-shadow: 0 0 12px #fff;
}

.footer-contact {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
  min-width: 220px;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.footer-contact-title {
  font-size: 1.18rem;
  font-weight: 800;
  color: #fff; /* blanco puro */
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  text-shadow: 0 0 8px var(--footer-accent-glow);
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.footer-contact-title i {
  color: #fff; /* icono blanco */
  text-shadow: 0 0 8px var(--footer-accent-glow);
}
.footer-contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 1.07rem;
  color: #fff;
  text-shadow: 0 1px 8px #00eaff22;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.footer-contact-info i {
  color: var(--footer-accent);
  margin-right: 0.5rem;
  text-shadow: 0 0 8px var(--footer-accent-glow);
}
.footer-social {
  display: flex;
  gap: 1.3rem;
  align-items: center;
  margin-top: 0.7rem;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.footer-social-link {
  color: #fff;
  font-size: 1.5rem;
  background: rgba(0,234,255,0.13);
  border-radius: 50%;
  width: 2.6rem;
  height: 2.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s;
  box-shadow: 0 2px 16px #00eaff33, 0 0 0 #00eaff00;
  border: 1.5px solid var(--footer-accent-glow);
  position: relative;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.footer-social-link:hover {
  background: var(--footer-accent);
  color: #181d23;
  box-shadow: 0 0 24px var(--footer-accent), 0 0 8px #fff;
  transform: scale(1.15) rotate(-8deg);
}
.footer-social-link i {
  color: inherit;
  transition: color 0.18s;
}

.footer-bottom {
  border-top: 1.5px solid var(--footer-separator);
  padding-top: 1.3rem;
  text-align: center;
  font-size: 1.07rem;
  color: #b2f7ff;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;
  text-shadow: 0 1px 8px #00eaff22;
  margin-top: 1.2rem;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.footer-powered {
  font-size: 1.01rem;
  color: var(--footer-accent);
  font-weight: 700;
  letter-spacing: 0.7px;
  margin-top: 0.2rem;
  text-shadow: 0 0 8px var(--footer-accent-glow);
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.footer-powered i {
  color: var(--footer-accent);
  margin-right: 0.4rem;
  text-shadow: 0 0 8px var(--footer-accent-glow);
}

@media (max-width: 900px) {
  .footer-main {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 0 1rem;
  }
  .footer-logo-section, .footer-links, .footer-contact {
    align-items: center;
    text-align: center;
    min-width: unset;
    width: 100%;
  }
  .glass {
    width: 100%;
    padding: 1.2rem 0.5rem;
  }
}

@media (max-width: 500px) {
  .autoparts-footer {
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    margin-top: 1.2rem;
    padding: 0 0 0.7rem 0;
  }
  .footer-gradient-bar {
    margin-bottom: 0.7rem;
    border-top-left-radius: 18px;
    border-top-right-radius: 18px;
    height: 3px;
  }
  .footer-main {
    flex-direction: column;
    gap: 1rem;
    padding: 0 0.2rem;
    margin-bottom: 1rem;
  }
  .glass {
    padding: 0.7rem 0.2rem;
    border-radius: 10px;
    margin-bottom: 0.2rem;
  }
  .footer-logo-section, .footer-links, .footer-contact {
    align-items: center;
    text-align: center;
    min-width: unset;
    width: 100%;
    gap: 0.2rem;
  }
  .footer-logo-icon {
    font-size: 1.3rem;
    margin-bottom: 0.1rem;
  }
  .footer-logo-text {
    font-size: 1.1rem;
  }
  .footer-slogan {
    font-size: 0.95rem;
    margin-top: 0.1rem;
  }
  .footer-link {
    font-size: 0.98rem;
    gap: 0.3rem;
    padding: 0.1rem 0.2rem;
    border-radius: 6px;
  }
  .footer-link i {
    font-size: 1rem;
  }
  .footer-contact-title {
    font-size: 0.98rem;
    gap: 0.3rem;
    margin-bottom: 0.1rem;
  }
  .footer-contact-info {
    font-size: 0.95rem;
    gap: 0.1rem;
  }
  .footer-social {
    gap: 0.5rem;
    margin-top: 0.2rem;
  }
  .footer-social-link {
    font-size: 1rem;
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 50%;
  }
  .footer-bottom {
    font-size: 0.95rem;
    gap: 0.1rem;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }
  .footer-powered {
    font-size: 0.91rem;
    margin-top: 0.1rem;
  }
  .footer-powered i {
    margin-right: 0.2rem;
  }
}
</style>
