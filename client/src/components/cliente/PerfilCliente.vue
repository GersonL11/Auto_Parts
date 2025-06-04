<template>
  <div class="perfil-cliente-overlay" @click.self="$emit('close')">
    <div class="perfil-cliente-modal">
      <div class="perfil-cliente-avatar">
        <i class="fas fa-id-card"></i>
      </div>
      <button class="perfil-cliente-close" @click="$emit('close')">&times;</button>
      <div class="perfil-cliente-title">Mi perfil</div>
      <form class="perfil-cliente-form" @submit.prevent="guardarCambios">
        <div class="perfil-cliente-form-group">
          <input v-model="form.nombre" type="text" required placeholder=" " />
          <label>Nombre</label>
        </div>
        <div class="perfil-cliente-form-group">
          <input v-model="form.correo" type="email" required placeholder=" " />
          <label>Correo</label>
        </div>
        <div class="perfil-cliente-form-group">
          <input v-model="form.usuario" type="text" required placeholder=" " />
          <label>Usuario</label>
        </div>
        <div class="perfil-cliente-form-group" v-if="nuevaPassword">
          <input v-model="passwordActual" type="password" placeholder=" " required />
          <label>Confirma tu contraseña actual</label>
        </div>
        <button class="perfil-cliente-btn" type="submit" :disabled="guardando">Guardar cambios</button>
      </form>
      <div class="perfil-restablecer">
        <button class="perfil-cliente-btn restablecer" @click="mostrarRestablecer = true" v-if="!mostrarRestablecer && !codigoEnviado">¿Restablecer contraseña?</button>
        <form v-if="mostrarRestablecer && !codigoEnviado" @submit.prevent="enviarRestablecer" class="perfil-cliente-form perfil-restablecer-form">
          <div class="perfil-cliente-form-group">
            <input v-model="correoRestablecer" type="email" required placeholder=" " readonly tabindex="-1" style="background:#f8fafc; color:#1e3c72; opacity:0.85; cursor:not-allowed;" />
            <label>Correo</label>
          </div>
          <button class="perfil-cliente-btn" type="submit">Enviar enlace de restablecimiento</button>
        </form>
        <form v-if="codigoEnviado" @submit.prevent="restablecerConCodigo" class="perfil-codigo-form">
          <div class="perfil-cliente-form-group">
            <input v-model="codigo" type="text" required placeholder=" " />
            <label>Código recibido</label>
          </div>
          <div class="perfil-cliente-form-group">
            <input v-model="nuevaPasswordReset" type="password" required placeholder=" " />
            <label>Nueva contraseña</label>
          </div>
          <button class="perfil-cliente-btn" type="submit">Restablecer contraseña</button>
        </form>
      </div>
    </div>
  </div>
  <!-- Snackbar global fuera del modal -->
  <transition name="perfil-snackbar-fade">
    <div v-if="error || exito || errorReset || msgResetExito || msgRestablecer" class="perfil-cliente-snackbar" @click="error = ''; exito = false; errorReset = ''; msgResetExito = ''; msgRestablecer = ''">
      <span v-if="error || errorReset" class="snackbar-error">{{ error || errorReset }}</span>
      <span v-if="exito || msgResetExito || msgRestablecer" class="snackbar-exito">{{ exito ? 'Datos actualizados correctamente' : (msgResetExito || msgRestablecer) }}</span>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PerfilCliente',
  props: {
    usuario: { type: Object, default: null }
  },
  data() {
    return {
      form: {
        nombre: '',
        correo: '',
        usuario: ''
      },
      nuevaPassword: '',
      passwordActual: '',
      guardando: false,
      error: '',
      exito: false,
      mostrarRestablecer: false,
      correoRestablecer: '',
      msgRestablecer: '',
      codigoEnviado: false,
      codigo: '',
      nuevaPasswordReset: '',
      msgResetExito: '',
      errorReset: ''
    }
  },
  mounted() {
    if (this.usuario) {
      this.form.nombre = this.usuario.nombre;
      this.form.correo = this.usuario.correo;
      this.form.usuario = this.usuario.usuario;
      this.correoRestablecer = this.usuario.correo;
    }
  },
  watch: {
    error(val) {
      if (val) setTimeout(() => { this.error = '' }, 4000);
    },
    exito(val) {
      if (val) setTimeout(() => { this.exito = false }, 4000);
    },
    errorReset(val) {
      if (val) setTimeout(() => { this.errorReset = '' }, 4000);
    },
    msgResetExito(val) {
      if (val) setTimeout(() => { this.msgResetExito = '' }, 4000);
    },
    msgRestablecer(val) {
      if (val) setTimeout(() => { this.msgRestablecer = '' }, 4000);
    }
  },
  methods: {
    async guardarCambios() {
      this.error = '';
      this.exito = false;
      this.guardando = true;
      try {
        let body = {
          nombre: this.form.nombre,
          correo: this.form.correo,
          usuario: this.form.usuario
        };
        if (this.nuevaPassword) {
          body.nuevaPassword = this.nuevaPassword;
          body.passwordActual = this.passwordActual;
        }
        const res = await fetch(`http://localhost:3000/api/usuarios/${this.usuario._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al actualizar');
        }
        const updatedUser = await res.json();
        this.exito = true;
        this.nuevaPassword = '';
        this.passwordActual = '';
        // Actualiza localStorage y notifica al padre
        localStorage.setItem('autoparts_user', JSON.stringify(updatedUser));
        this.$emit('usuario-actualizado', updatedUser);
        setTimeout(() => {
          this.exito = false;
          this.$emit('close'); // Cierra el modal después de mostrar éxito
        }, 2500);
      } catch (e) {
        this.error = e.message;
      }
      this.guardando = false;
    },
    async enviarRestablecer() {
      this.msgRestablecer = '';
      this.error = '';
      this.codigoEnviado = false;
      try {
        const res = await fetch('http://localhost:3000/api/recuperar-clave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: this.correoRestablecer })
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al enviar correo');
        }
        this.msgRestablecer = 'Revisa tu correo para restablecer la contraseña.';
        this.codigoEnviado = true;
      } catch (e) {
        this.error = e.message;
      }
    },
    async restablecerConCodigo() {
      this.errorReset = '';
      this.msgResetExito = '';
      try {
        const res = await fetch('http://localhost:3000/api/restablecer-clave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            correo: this.correoRestablecer,
            codigo: this.codigo,
            nuevaPassword: this.nuevaPasswordReset
          })
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al restablecer contraseña');
        }
        this.msgResetExito = '¡Contraseña restablecida correctamente!';
        setTimeout(() => {
          this.codigoEnviado = false;
          this.mostrarRestablecer = false;
          this.msgRestablecer = '';
          this.msgResetExito = '';
          this.codigo = '';
          this.nuevaPasswordReset = '';
          this.$emit('close'); // Cierra el modal después de éxito en restablecimiento
        }, 2500);
      } catch (e) {
        this.errorReset = e.message;
      }
    }
  }
}
</script>

<style scoped>
.perfil-cliente-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30, 60, 114, 0.18);
  z-index: 30000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}
.perfil-cliente-modal {
  background: rgba(255,255,255,0.45);
  border-radius: 2.2rem;
  box-shadow: 0 16px 48px 0 #1e3c7260, 0 2px 12px #42b98333;
  padding: 5.2rem 2.2rem 2.2rem 2.2rem;
  max-width: 420px;
  width: 98vw;
  margin: 0 auto;
  border: 1.5px solid rgba(66,185,131,0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  animation: fadeInPerfil 0.5s cubic-bezier(.4,0,.2,1);
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  backdrop-filter: blur(22px) saturate(1.6);
  overflow: visible; /* Permite que el toast sobresalga */
}
@keyframes fadeInPerfil {
  from { opacity: 0; transform: translateY(32px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.perfil-cliente-avatar {
  position: absolute;
  top: -24px; /* más abajo para que no se corte */
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #42b983 60%, #1e3c72 100%);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px #42b98355, 0 1.5px 0 #fff4 inset;
  border: 4px solid #fff;
  z-index: 2;
}
.perfil-cliente-avatar i {
  font-size: 2.2rem;
  color: #fff;
}
.perfil-cliente-close {
  background: rgba(255,255,255,0.8);
  border: none;
  font-size: 1.7rem;
  color: #ff5252;
  cursor: pointer;
  position: absolute;
  top: 1.1rem;
  right: 1.3rem;
  transition: color 0.18s, background 0.18s, transform 0.18s;
  border-radius: 50%;
  padding: 0.12em 0.4em;
  box-shadow: 0 2px 8px #ff525222;
  z-index: 2;
}
.perfil-cliente-close:hover {
  color: #fff;
  background: #ff5252;
  transform: scale(1.12) rotate(8deg);
}
.perfil-cliente-title {
  margin-top: 44px;
  margin-bottom: 2.1rem;
  font-size: 1.7rem;
  font-weight: 900;
  color: #1e3c72;
  text-align: center;
  letter-spacing: 1.2px;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.perfil-cliente-form,
.perfil-codigo-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1.1rem;
  align-items: center;
}
.perfil-cliente-form-group {
  position: relative;
  width: 96%;
  margin-bottom: 0.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.perfil-cliente-form input,
.perfil-codigo-form input {
  width: 100%;
  padding: 0.55rem 1rem 0.55rem 1rem;
  border-radius: 10px;
  border: none;
  background: #f8fafc;
  font-size: 1.01rem;
  font-weight: 500;
  color: #1e3c72;
  outline: none;
  box-shadow: 0 1px 4px #1e3c7211;
  border-bottom: 2px solid #d1d5db;
  transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  text-align: left;
}
.perfil-cliente-form input:focus,
.perfil-codigo-form input:focus {
  border-bottom: 2px solid #42b983;
  background: #fff;
  box-shadow: 0 2px 8px #42b98322;
}
.perfil-cliente-form label,
.perfil-codigo-form label {
  position: absolute;
  left: 1.1rem;
  top: 0.65rem;
  color: #1e3c72;
  font-size: 0.93rem;
  font-weight: 600;
  pointer-events: none;
  transition: 0.18s cubic-bezier(.4,0,.2,1);
  background: #f8fafc;
  padding: 0 0.2em;
  border-radius: 4px;
  z-index: 1;
}
.perfil-cliente-form input:focus + label,
.perfil-cliente-form input:not(:placeholder-shown) + label,
.perfil-codigo-form input:focus + label,
.perfil-codigo-form input:not(:placeholder-shown) + label {
  top: -1.05rem;
  left: 0.8rem;
  font-size: 0.81rem;
  color: #42b983;
  background: #fff;
  padding: 0 0.3em;
  border-radius: 6px;
}
.perfil-cliente-btn,
.perfil-codigo-form .perfil-cliente-btn {
  width: 96%;
  margin: 0.7rem auto 0.4rem auto;
  padding: 0.62rem 0;
  border-radius: 10px;
  font-size: 1.04rem;
  font-weight: 700;
  letter-spacing: 0.1px;
  background: linear-gradient(90deg, #42b983 0%, #1e3c72 100%);
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px #42b98322, 0 1.5px 0 #fff4 inset;
  font-family: inherit;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.13s;
  backdrop-filter: blur(2px);
  display: block;
}
.perfil-cliente-btn:hover,
.perfil-codigo-form .perfil-cliente-btn:hover {
  background: linear-gradient(90deg, #1e3c72 0%, #42b983 100%);
  color: #fff;
  box-shadow: 0 6px 16px #1e3c7244;
  transform: translateY(-1px) scale(1.02);
}
.perfil-cliente-btn.restablecer {
  background: #fff;
  color: #1e3c72;
  font-size: 1rem;
  font-weight: 700;
  margin-top: 1.1rem;
  margin-bottom: 0.1rem;
  box-shadow: 0 1px 6px #1e3c7211;
  border: 1.5px solid #42b98344;
  transition: background 0.18s, color 0.18s, border 0.18s;
  padding: 0.62rem 0;
  border-radius: 10px;
  width: 96%;
  display: block;
}
.perfil-cliente-btn.restablecer:hover {
  background: #f8fafc;
  color: #42b983;
  border: 1.5px solid #42b983;
}
.perfil-restablecer {
  width: 96%;
  margin: 0.7rem auto 0.2rem auto;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.perfil-codigo-form {
  width: 96%;
  margin: 0.7rem auto 0.2rem auto;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.perfil-cliente-snackbar {
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
  cursor: pointer;
  user-select: none;
  border: none;
  opacity: 0.98;
  animation: perfil-snackbar-pop 0.42s cubic-bezier(.4,0,.2,1);
  transition: background 0.22s, color 0.22s, opacity 0.22s, box-shadow 0.22s;
  pointer-events: auto;
  backdrop-filter: blur(18px) saturate(1.7);
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}
.perfil-cliente-snackbar .snackbar-error:before {
  content: '\f06a';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: 0.7em;
  color: #ff5252;
  font-size: 1.35em;
  vertical-align: middle;
  filter: drop-shadow(0 1px 2px #ff525288);
  display: inline-block;
  min-width: 1.3em;
  text-align: center;
}
.perfil-cliente-snackbar .snackbar-exito:before {
  content: '\f058';
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  margin-right: 0.7em;
  color: #42e6a4;
  font-size: 1.35em;
  vertical-align: middle;
  filter: drop-shadow(0 1px 2px #42b98388);
  display: inline-block;
  min-width: 1.3em;
  text-align: center;
}
.snackbar-error, .snackbar-exito {
  color: #fff;
  background: transparent;
  border-radius: 8px;
  padding: 0.18em 0 0.18em 0;
  font-weight: 600;
  font-size: 1.07rem;
  display: flex;
  align-items: center;
  letter-spacing: 0.01em;
  box-shadow: none;
}
.perfil-snackbar-fade-enter-active, .perfil-snackbar-fade-leave-active {
  transition: opacity 0.42s, transform 0.42s;
}
.perfil-snackbar-fade-enter-from, .perfil-snackbar-fade-leave-to {
  opacity: 0;
  transform: translateY(32px) scale(0.97);
}
@keyframes perfil-snackbar-pop {
  from { opacity: 0; transform: translateY(32px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
