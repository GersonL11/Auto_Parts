<template>
  <section class="login-hero">
    <div
      class="bg-overlay image-wrap"
      :style="{
        backgroundImage: 'url(' + require('../../assets/01.jpg') + ')',
        backgroundPosition: 'center',
      }"
    ></div>
    <div class="bg-overlay bg-gradient-overlay"></div>
    <div class="login-container">
      <!-- Toast notification -->
      <transition name="fade">
        <div v-if="toastMsg" :class="['cart-toast', 'toast-bottom-right', toastType]">
          <i v-if="toastType==='success'" class="fas fa-check-circle toast-check"></i>
          <i v-else-if="toastType==='error'" class="fas fa-times-circle toast-error-icon"></i>
          {{ toastMsg }}
        </div>
      </transition>
      <div class="login-card ultra-glass premium-shadow">
        <button class="btn-back-icon" type="button" @click="handleBack" aria-label="Volver atrás">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#ffffffee"/>
            <path d="M19 24L13 16L19 8" stroke="#1e3c72" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <!-- Transición para el formulario -->
        <transition name="fade-slide" mode="out-in">
          <form
            v-if="isLogin && !showForgot"
            key="login"
            @submit.prevent="handleSubmit"
            autocomplete="off"
          >
            <img
              src="../../assets/logopart.png"
              class="login-logo premium-logo"
              alt="AutoParts"
            />
            <h2 class="login-title premium-title">{{ isLogin ? 'Iniciar sesión' : 'Crear cuenta' }}</h2>
            <div class="form-floating">
              <input
                v-model="correo"
                type="email"
                class="form-control"
                id="floatingInput"
                placeholder=" "
                required
                autocomplete="username"
              />
              <label for="floatingInput" class="floating-label">Correo electrónico</label>
            </div>
            <div class="form-floating">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                id="floatingPassword"
                placeholder=" "
                required
                autocomplete="current-password"
              />
              <label for="floatingPassword" class="floating-label">Contraseña</label>
              <span class="toggle-password" @click="showPassword = !showPassword">
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#1e3c72" stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3.5" stroke="#1e3c72" stroke-width="2"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#1e3c72" stroke-width="2" d="M3 3l18 18M10.7 10.7A3.5 3.5 0 0 1 12 8.5c1.93 0 3.5 1.57 3.5 3.5 0 .46-.09.9-.25 1.3M7.11 7.11C5.07 8.44 3.5 10.5 3.5 10.5S7 17.5 12 17.5c1.61 0 3.09-.37 4.36-1.01"/><path stroke="#1e3c72" stroke-width="2" d="M17.94 17.94C19.93 16.56 21.5 14.5 21.5 14.5S18 7.5 12 7.5c-.61 0-1.2.04-1.77.12"/></svg>
              </span>
            </div>
            <div class="login-actions">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                  v-model="remember"
                />
                <label class="form-check-label login-actions-label" for="rememberMe">
                  Recordarme
                </label>
              </div>
              <span class="forgot-pass login-actions-label">
                <a href="#" @click.prevent="showForgot = true">¿Olvidaste tu contraseña?</a>
              </span>
            </div>
            <button class="btn-login premium-btn login-actions-label" type="submit">
              Ingresar
            </button>
            <p v-if="error" class="error">{{ error }}</p>
            <div class="login-register improved-register vertical-register">
              <span class="login-register-text">
                ¿No tienes una cuenta?
              </span>
              <button
                type="button"
                class="toggle-link-btn improved-toggle"
                @click="toggleForm"
              >
                Regístrate
              </button>
            </div>
          </form>
          <!-- Formulario de recuperación de contraseña -->
          <form
            v-else-if="showForgot && !showReset"
            key="forgot"
            @submit.prevent="handleForgot"
            autocomplete="off"
          >
            <img
              src="../../assets/logopart.png"
              class="login-logo premium-logo"
              alt="AutoParts"
            />
            <h2 class="login-title premium-title">Recuperar contraseña</h2>
            <div class="form-floating">
              <input
                v-model="correo"
                type="email"
                class="form-control"
                id="forgotEmail"
                placeholder=" "
                required
                autocomplete="username"
              />
              <label for="forgotEmail" class="floating-label">Correo electrónico</label>
            </div>
            <button class="btn-login premium-btn login-actions-label" type="submit">
              Enviar enlace
            </button>
            <p v-if="error" class="error">{{ error }}</p>
            <div class="login-register improved-register vertical-register">
              <button
                type="button"
                class="toggle-link-btn improved-toggle"
                @click="showForgot = false"
              >
                Volver
              </button>
            </div>
          </form>
          <!-- Formulario para ingresar código y nueva contraseña -->
          <form
            v-else-if="showReset"
            key="reset"
            @submit.prevent="handleReset"
            autocomplete="off"
          >
            <img
              src="../../assets/logopart.png"
              class="login-logo premium-logo"
              alt="AutoParts"
            />
            <h2 class="login-title premium-title">Restablecer contraseña</h2>
            <div class="form-floating">
              <input
                v-model="codigo"
                type="text"
                class="form-control"
                id="codigoRecuperacion"
                placeholder=" "
                required
              />
              <label for="codigoRecuperacion" class="floating-label">Código recibido</label>
            </div>
            <div class="form-floating">
              <input
                v-model="nuevaPassword"
                :type="showPasswordReset ? 'text' : 'password'"
                class="form-control"
                id="nuevaPassword"
                placeholder=" "
                required
              />
              <label for="nuevaPassword" class="floating-label">Nueva contraseña</label>
              <span class="toggle-password" @click="showPasswordReset = !showPasswordReset">
                <svg v-if="showPasswordReset" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#1e3c72" stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3.5" stroke="#1e3c72" stroke-width="2"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#1e3c72" stroke-width="2" d="M3 3l18 18M10.7 10.7A3.5 3.5 0 0 1 12 8.5c1.93 0 3.5 1.57 3.5 3.5 0 .46-.09.9-.25 1.3M7.11 7.11C5.07 8.44 3.5 10.5 3.5 10.5S7 17.5 12 17.5c1.61 0 3.09-.37 4.36-1.01"/><path stroke="#1e3c72" stroke-width="2" d="M17.94 17.94C19.93 16.56 21.5 14.5 21.5 14.5S18 7.5 12 7.5c-.61 0-1.2.04-1.77.12"/></svg>
              </span>
            </div>
            <button class="btn-login premium-btn login-actions-label" type="submit">
              Restablecer contraseña
            </button>
            <p v-if="error" class="error">{{ error }}</p>
            <div class="login-register improved-register vertical-register">
              <button
                type="button"
                class="toggle-link-btn improved-toggle"
                @click="cancelarReset"
              >
                Cancelar
              </button>
            </div>
          </form>
          <form
            v-else
            key="register"
            @submit.prevent="handleSubmit"
            autocomplete="off"
          >
            <img
              src="../../assets/logopart.png"
              class="login-logo premium-logo"
              alt="AutoParts"
            />
            <h2 class="login-title premium-title">Crear cuenta</h2>
            <div class="form-floating">
              <input
                v-model="nombre"
                type="text"
                class="form-control"
                id="floatingNombre"
                placeholder=" "
                required
                autocomplete="name"
              />
              <label for="floatingNombre" class="floating-label">Nombre completo</label>
            </div>
            <div class="form-floating">
              <input
                v-model="correo"
                type="email"
                class="form-control"
                id="floatingInput"
                placeholder=" "
                required
                autocomplete="username"
              />
              <label for="floatingInput" class="floating-label">Correo electrónico</label>
            </div>
            <div class="form-floating">
              <input
                v-model="usuario"
                type="text"
                class="form-control"
                id="floatingUsuario"
                placeholder=" "
                required
                autocomplete="username"
              />
              <label for="floatingUsuario" class="floating-label">Usuario</label>
            </div>
            <div class="form-floating">
              <input
                v-model="password"
                :type="showPasswordRegister ? 'text' : 'password'"
                class="form-control"
                id="floatingPassword"
                placeholder=" "
                required
                autocomplete="current-password"
              />
              <label for="floatingPassword" class="floating-label">Contraseña</label>
              <span class="toggle-password" @click="showPasswordRegister = !showPasswordRegister">
                <svg v-if="showPasswordRegister" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#1e3c72" stroke-width="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3.5" stroke="#1e3c72" stroke-width="2"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#1e3c72" stroke-width="2" d="M3 3l18 18M10.7 10.7A3.5 3.5 0 0 1 12 8.5c1.93 0 3.5 1.57 3.5 3.5 0 .46-.09.9-.25 1.3M7.11 7.11C5.07 8.44 3.5 10.5 3.5 10.5S7 17.5 12 17.5c1.61 0 3.09-.37 4.36-1.01"/><path stroke="#1e3c72" stroke-width="2" d="M17.94 17.94C19.93 16.56 21.5 14.5 21.5 14.5S18 7.5 12 7.5c-.61 0-1.2.04-1.77.12"/></svg>
              </span>
            </div>
            <button class="btn-login premium-btn login-actions-label" type="submit">
              Registrarme
            </button>
            <p v-if="error" class="error">{{ error }}</p>
            <div class="login-register improved-register vertical-register">
              <span class="login-register-text">
                ¿Ya tienes una cuenta?
              </span>
              <button
                type="button"
                class="toggle-link-btn improved-toggle"
                @click="toggleForm"
              >
                Inicia sesión
              </button>
            </div>
          </form>
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginForm',
  data() {
    return {
      isLogin: true,
      correo: '',
      password: '',
      remember: false,
      error: '',
      nombre: '',
      usuario: '',
      showForgot: false,
      forgotMsg: '',
      toastMsg: '',
      toastType: 'success', // 'success' | 'error'
      showReset: false,
      codigo: '',
      nuevaPassword: '',
      showPassword: false,
      showPasswordRegister: false,
      showPasswordReset: false,
      usuarioCliente: null, // Nuevo: para guardar info del cliente si es necesario
    };
  },
  mounted() {
    // Autologin si hay usuario guardado
    const saved = localStorage.getItem('autoparts_user');
    if (saved) {
      try {
        const usuario = JSON.parse(saved);
        this.$emit('login-success', usuario);
      } catch (e) {
        // Ignorar errores de parseo
      }
    }
  },
  methods: {
    async handleSubmit() {
      this.error = '';
      this.forgotMsg = '';
      if (this.isLogin) {
        // Login
        try {
          const res = await axios.post('http://localhost:3000/api/login', {
            correo: this.correo,
            password: this.password
          });
          if (this.remember) {
            localStorage.setItem('autoparts_user', JSON.stringify(res.data.usuario));
          } else {
            localStorage.removeItem('autoparts_user');
          }
          if (res.data.usuario && res.data.usuario.rol === 'cliente') {
            this.toastType = 'success';
            this.toastMsg = '¡Inicio de sesión exitoso!';
            setTimeout(() => {
              this.toastMsg = '';
              this.$emit('login-success', res.data.usuario);
            }, 5000);
          } else {
            this.$emit('login-success', res.data.usuario);
          }
        } catch (err) {
          this.toastType = 'error';
          this.toastMsg = 'Credenciales inválidas';
          setTimeout(() => {
            this.toastMsg = '';
          }, 5000);
        }
      } else {
        // Registro
        try {
          await axios.post('http://localhost:3000/api/usuarios', {
            nombre: this.nombre,
            correo: this.correo,
            usuario: this.usuario,
            password: this.password
          });
          this.isLogin = true;
          this.error = '';
          this.password = '';
          this.toastType = 'success';
          this.toastMsg = '¡Cuenta creada correctamente!';
          setTimeout(() => {
            this.toastMsg = '';
          }, 5000);
        } catch (err) {
          this.toastType = 'error';
          this.toastMsg = err.response?.data?.error || 'Error al registrar usuario';
          setTimeout(() => {
            this.toastMsg = '';
          }, 5000);
        }
      }
    },
    async handleForgot() {
      this.error = '';
      this.forgotMsg = '';
      try {
        await axios.post('http://localhost:3000/api/recuperar-clave', {
          correo: this.correo
        });
        this.toastType = 'success';
        this.toastMsg = 'Revisa tu correo para restablecer tu contraseña.';
        setTimeout(() => {
          this.toastMsg = '';
        }, 5000);
        this.showReset = true;
      } catch (err) {
        this.toastType = 'error';
        this.toastMsg = err.response?.data?.error || 'Error al enviar el correo de recuperación';
        setTimeout(() => {
          this.toastMsg = '';
        }, 5000);
      }
    },
    async handleReset() {
      this.error = '';
      try {
        await axios.post('http://localhost:3000/api/restablecer-clave', {
          correo: this.correo,
          codigo: this.codigo,
          nuevaPassword: this.nuevaPassword
        });
        this.toastType = 'success';
        this.toastMsg = 'Contraseña restablecida correctamente. Ahora puedes iniciar sesión.';
        setTimeout(() => {
          this.toastMsg = '';
        }, 5000);
        this.showReset = false;
        this.showForgot = false;
        this.codigo = '';
        this.nuevaPassword = '';
        this.password = '';
        if (this.$route && this.$route.path === '/recuperar-clave') {
          this.$router.replace('/');
        }
      } catch (err) {
        this.toastType = 'error';
        this.toastMsg = err.response?.data?.error || 'Error al restablecer la contraseña';
        setTimeout(() => {
          this.toastMsg = '';
        }, 5000);
      }
    },
    cancelarReset() {
      this.showReset = false;
      this.codigo = '';
      this.nuevaPassword = '';
      this.error = '';
      // Si la ruta es /recuperar-clave, vuelve a la raíz
      if (this.$route && this.$route.path === '/recuperar-clave') {
        this.$router.replace('/');
      }
    },
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.error = '';
      this.password = '';
      this.showForgot = false;
      this.forgotMsg = '';
      this.showReset = false;
      this.codigo = '';
      this.nuevaPassword = '';
      // Si la ruta es /recuperar-clave, vuelve a la raíz
      if (this.$route && this.$route.path === '/recuperar-clave') {
        this.$router.replace('/');
      }
    },
    handleBack() {
      // Si ya hay usuarioCliente (login exitoso), emitir login-success
      if (this.usuarioCliente) {
        this.$emit('login-success', this.usuarioCliente);
      }
      this.$emit('close');
    },
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');

.login-hero {
  min-height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0; left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  overflow: auto;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
.bg-overlay.image-wrap {
  position: absolute;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: 1;
  filter: blur(2px) brightness(0.82);
}
.bg-gradient-overlay {
  position: absolute;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: linear-gradient(120deg, #1e3c72ee 0%, #42b983ee 100%);
  z-index: 2;
  opacity: 0.92;
}
.login-container {
  position: relative;
  z-index: 3;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.login-card {
  max-width: 410px;
  width: 100%;
  margin: 0 auto;
  padding: 2.7rem 2.5rem 2.2rem 2.2rem;
  border-radius: 32px;
  box-shadow: 0 12px 48px #1e3c7215, 0 0 32px #42b98322;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadeIn 1s;
  position: relative;
  background: rgba(255,255,255,0.28);
  backdrop-filter: blur(16px) saturate(1.3);
  -webkit-backdrop-filter: blur(16px) saturate(1.3);
  border: 2px solid rgba(255,255,255,0.32);
  transition: box-shadow 0.2s;
}
.improved-register {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin-top: 1.2rem;
  font-size: 1.08rem;
  color: #fff;
  font-weight: 500;
  letter-spacing: 0.2px;
}
.vertical-register {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 0.6rem;
  margin-top: 1.2rem;
  width: 100%;
  padding-left: 2px;
  padding-right: 2px;
}
.vertical-register .login-register-text {
  flex: 1 1 auto;
  text-align: left;
  font-size: 1.08rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0;
  margin-left: 0.1rem;
  margin-right: 0.5rem;
  min-width: 120px;
  white-space: nowrap;
}
.vertical-register .toggle-link-btn,
.vertical-register .improved-toggle {
  flex: 0 0 140px;
  width: 140px;
  min-width: 100px;
  max-width: 160px;
  margin: 0;
  padding: 0.7em 0;
  font-size: 1.08rem;
  font-weight: 800;
  border-radius: 20px;
  background: linear-gradient(90deg, #43e697 0%, #42b983 60%, #1e3c72 100%);
  box-shadow: 0 2px 12px #42b98333, 0 1px 4px #1e3c7211;
  text-align: center;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.13s;
  border: none;
  color: #fff;
  letter-spacing: 0.5px;
  display: inline-block;
}
.vertical-register .toggle-link-btn:hover,
.vertical-register .improved-toggle:hover {
  background: linear-gradient(90deg, #1e3c72 0%, #42b983 100%);
  color: #fff;
  box-shadow: 0 6px 24px #42b98355;
  transform: translateY(-2px) scale(1.06);
}
@media (min-width: 400px) {
  .improved-register {
    flex-direction: row;
    gap: 0.7rem;
  }
  .toggle-link-btn,
  .improved-toggle {
    width: 180px;
    min-width: 180px;
    display: inline-block;
  }
  .btn-login,
  .premium-btn {
    width: 180px;
    min-width: 180px;
    display: inline-block;
  }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-30px);}
  to { opacity: 1; transform: translateY(0);}
}
.btn-back-icon {
  position: absolute;
  top: 18px;
  left: 18px;
  background: none;
  border: none;
  padding: 0;
  z-index: 2;
  cursor: pointer;
  transition: transform 0.15s;
}
.btn-back-icon:hover {
  transform: scale(1.12) translateX(-2px);
}
.btn-back-icon svg {
  display: block;
  filter: drop-shadow(0 2px 8px #1e3c7222);
}
.login-logo {
  width: 80px;
  height: 80px;
  display: block;
  margin: 0 auto 1.2rem auto;
  filter: drop-shadow(0 2px 16px #42b98388);
  border-radius: 50%;
  background: #fff;
  padding: 0.7rem;
  box-shadow: 0 2px 16px #42b98344;
  transition: box-shadow 0.2s;
}
.premium-logo {
  border: 2.5px solid #42b983;
  box-shadow: 0 0 0 6px #42b98322, 0 2px 16px #1e3c7244;
}
.login-title {
  text-align: center;
  margin-bottom: 1.7rem;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-weight: 900;
  color: #1e3c72;
  letter-spacing: 1.2px;
  font-size: 1.55rem;
  text-shadow: 0 2px 12px #fff8, 0 1px 0 #42b98322;
}
.premium-title {
  background: linear-gradient(90deg, #1e3c72 30%, #42b983 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.form-floating {
  position: relative;
  margin-bottom: 1.3rem;
  width: 100%;
  max-width: 340px;
  margin-left: auto;
  margin-right: auto;
}
.form-control {
  width: 100%;
  min-height: 54px;
  padding: 1.3rem 1.2rem 0.7rem 1.2rem;
  border: 1.7px solid #b0bec5;
  border-radius: 16px;
  font-size: 1.13rem;
  background: rgba(255,255,255,0.93);
  color: #1e3c72;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-weight: 700;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
  outline: none;
  box-shadow: 0 2px 8px #42b98311;
  box-sizing: border-box;
  letter-spacing: 0.02em;
}
.form-control:focus {
  border: 1.7px solid #42b983;
  box-shadow: 0 0 0 2px #42b98333;
  background: #fff;
  color: #1e3c72;
}
.form-control::placeholder {
  color: #8ca0b3;
  opacity: 1;
  font-style: italic;
  font-size: 1rem;
  font-weight: 500;
}
.floating-label {
  position: absolute;
  top: 1.2rem;
  left: 1.2rem;
  color: #1e3c72;
  font-size: 1rem;
  pointer-events: none;
  transition: 0.18s cubic-bezier(.4,0,.2,1);
  background: transparent;
  font-weight: 700;
  letter-spacing: 0.2px;
  z-index: 2;
  padding: 0 0.2rem;
  text-shadow: 0 1px 4px #fff8;
}
.form-control:focus + .floating-label,
.form-control:not(:placeholder-shown) + .floating-label,
.form-control:-webkit-autofill + .floating-label {
  top: -1.05rem;
  left: 0.8rem;
  font-size: 0.93rem;
  color: #42b983;
  background: #fff;
  padding: 0 0.6rem;
  border-radius: 7px;
  font-weight: 800;
  box-shadow: 0 2px 8px #42b98311;
}
.form-control:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
  -webkit-text-fill-color: #1e3c72 !important;
}
.toggle-password {
  position: absolute;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
  cursor: pointer;
  z-index: 4;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  height: 32px;
  width: 32px;
  /* Prevent overlap with label */
  pointer-events: auto;
}
.form-floating .toggle-password {
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 4;
}
.login-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  width: 100%;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
.form-check {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.form-check-input {
  accent-color: #42b983;
  width: 1.1em;
  height: 1.1em;
  border-radius: 4px;
  border: 1.5px solid #b0bec5;
}
.form-check-label {
  color: #666;
  font-size: 0.98rem;
}
.forgot-pass {
  font-size: 0.97rem;
}
.forgot-pass a {
  color: #1e3c72;
  text-decoration: underline;
  transition: color 0.2s;
}
.forgot-pass a:hover {
  color: #42b983;
}
.btn-login,
.premium-btn,
.toggle-link-btn,
.improved-toggle {
  width: 100%;
  min-width: 180px;
  padding: 0.65rem 0;
  background: linear-gradient(90deg, #42b983 60%, #1e3c72 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.03rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.18s, transform 0.13s, box-shadow 0.18s;
  box-shadow: 0 4px 16px rgba(66,185,131,0.13);
  margin-bottom: 0.8rem;
  margin-top: 0.3rem;
  letter-spacing: 1.1px;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  text-shadow: 0 2px 8px #1e3c7211;
}
.btn-login:hover,
.premium-btn:hover,
.btn-login:active,
.premium-btn:active {
  background: linear-gradient(90deg, #1e3c72 0%, #42b983 100%);
  color: #fff;
  box-shadow: 0 8px 24px #42b98344;
  transform: translateY(-2px) scale(1.04);
}
.improved-toggle, .toggle-link-btn {
  padding: 0.28em 0.9em;
  border: none;
  border-radius: 18px;
  background: linear-gradient(90deg, #43e697 0%, #42b983 60%, #1e3c72 100%);
  color: #fff;
  font-weight: 800;
  font-size: 0.98rem;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px #1e3c7240, 0 1px 4px #42b98322;
  cursor: pointer;
  outline: none;
  text-shadow: 0 2px 8px #1e3c7211;
  display: inline-block;
  vertical-align: middle;
  transition: none;
}
.improved-toggle:hover, .toggle-link-btn:hover {
  background: linear-gradient(90deg, #43e697 0%, #42b983 60%, #1e3c72 100%);
  color: #fff;
  box-shadow: 0 2px 8px #1e3c7240, 0 1px 4px #42b98322;
  transform: none;
}
.login-register-text {
  color: #fff;
  font-weight: 600;
  font-size: 1.08rem;
  letter-spacing: 0.2px;
  margin: 0;
  padding: 0;
}
.toggle-link-btn {
  margin-left: 0.7rem;
  padding: 0.45em 1.5em;
  border: none;
  border-radius: 18px;
  background: linear-gradient(90deg, #43e697 0%, #42b983 60%, #1e3c72 100%);
  color: #fff;
  font-weight: 800;
  font-size: 1.08rem;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 12px #42b98333, 0 1px 4px #1e3c7211;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.13s;
  outline: none;
  text-shadow: 0 2px 8px #1e3c7211;
  display: inline-block;
  vertical-align: middle;
}
.toggle-link-btn:hover {
  background: linear-gradient(90deg, #1e3c72 0%, #42b983 100%);
  color: #fff;
  box-shadow: 0 6px 24px #42b98355;
  transform: translateY(-2px) scale(1.06);
}
.login-actions-label,
.btn-login.login-actions-label {
  color: #fff !important;
}
.login-actions .form-check-label {
  color: #fff !important;
}
.forgot-pass.login-actions-label a {
  color: #fff !important;
}
.btn-login.login-actions-label {
  color: #fff !important;
}
.btn-login.login-actions-label:hover {
  color: #fff !important;
}
@media (max-width: 600px) {
  .login-container {
    min-height: 100vh;
    padding: 0;
    justify-content: center;
    align-items: center;
  }
  .login-card {
    padding: 1.2rem 0.7rem 1.2rem 0.7rem;
    max-width: 98vw;
    min-height: unset;
    justify-content: center;
  }
  .btn-back-icon {
    top: 10px;
    left: 10px;
  }
  .login-logo {
    width: 60px;
    height: 60px;
    padding: 0.3rem;
  }
  .form-floating {
    max-width: 100%;
  }
}

/* Transiciones personalizadas */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(24px) scale(0.98);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.toast-notification { display: none; }
.cart-toast.toast-bottom-right {
  position: fixed;
  right: 36px;
  bottom: 36px;
  min-width: 220px;
  max-width: 380px;
  background: rgba(34, 40, 60, 0.38);
  color: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(30,60,114,0.22), 0 2px 12px rgba(66,185,131,0.13);
  padding: 1.2em 2.1em 1.2em 1.5em;
  font-size: 1.09rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 1.05em;
  z-index: 50000;
  user-select: none;
  border: none;
  opacity: 0.98;
  animation: perfil-snackbar-pop 0.42s cubic-bezier(.4,0,.2,1);
  transition: background 0.22s, color 0.22s, opacity 0.22s, box-shadow 0.22s;
  pointer-events: auto;
  backdrop-filter: blur(18px) saturate(1.7);
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  text-align: left;
  letter-spacing: 0.5px;
}
.toast-check {
  color: #42e6a4;
  font-size: 1.35em;
  font-weight: bold;
  margin-right: 0.7em;
  display: inline-flex;
  align-items: center;
  filter: drop-shadow(0 1px 2px #42b98388);
  min-width: 1.3em;
  text-align: center;
}
.toast-error-icon {
  color: #ff5a5a;
  font-size: 1.35em;
  font-weight: bold;
  margin-right: 0.7em;
  display: inline-flex;
  align-items: center;
  filter: drop-shadow(0 1px 2px #ff5a5a88);
  min-width: 1.3em;
  text-align: center;
}
@keyframes perfil-snackbar-pop {
  0% { opacity: 0; transform: translateY(32px) scale(0.98); }
  100% { opacity: 0.98; transform: translateY(0) scale(1); }
}
@media (max-width: 700px) {
  .cart-toast.toast-bottom-right {
    right: 10px;
    bottom: 10px;
    left: 10px;
    min-width: 120px;
    max-width: 90vw;
    font-size: 0.93rem;
    border-radius: 10px;
    padding: 0.5em 1em 0.5em 0.7em;
    margin: 0 auto;
  }
}
</style>