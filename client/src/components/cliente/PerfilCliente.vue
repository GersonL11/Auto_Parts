<template>
  <transition name="perfil-modal-fade-soft">
    <div class="perfil-cliente-overlay" @click.self="$emit('close')">
      <div class="perfil-cliente-modal">
        <button class="perfil-cliente-close" @click="$emit('close')">&times;</button>
        <div class="perfil-cliente-avatar-wrapper">
          <div class="perfil-cliente-avatar" @click="ampliarFoto = true" style="cursor: pointer;">
            <img v-if="form.fotoPerfil" :src="form.fotoPerfil" alt="Foto de perfil" class="perfil-foto-img" />
            <i v-else class="fas fa-id-card"></i>
            <button type="button" class="perfil-foto-cambiar-btn-circular" @click.stop="abrirSelectorFoto" :disabled="subiendoFoto" title="Cambiar foto de perfil">
              <i class="fas fa-camera"></i>
            </button>
            <input ref="inputFoto" type="file" accept="image/*" @change="onFileChange" class="perfil-foto-input-real" :disabled="subiendoFoto" />
            <span v-if="subiendoFoto" class="perfil-foto-cargando"><i class="fas fa-spinner fa-spin"></i> Subiendo...</span>
          </div>
        </div>
        <!-- Modal para ampliar foto -->
        <transition name="perfil-modal-fade-soft">
          <div v-if="ampliarFoto && form.fotoPerfil" class="perfil-foto-modal-bg" @click.self="ampliarFoto = false">
            <div class="perfil-foto-modal-content">
              <button class="perfil-foto-modal-close" @click="ampliarFoto = false">&times;</button>
              <img :src="form.fotoPerfil" alt="Foto de perfil ampliada" class="perfil-foto-modal-img" />
            </div>
          </div>
        </transition>
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
          <button class="perfil-cliente-btn" type="submit" :disabled="guardando || subiendoFoto">Guardar cambios</button>
          <div v-if="errorFoto" class="perfil-foto-error">{{ errorFoto }}</div>
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
  </transition>
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
        usuario: '',
        fotoPerfil: ''
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
      errorReset: '',
      subiendoFoto: false,
      errorFoto: '',
      ampliarFoto: false,
    }
  },
  mounted() {
    if (this.usuario) {
      this.form.nombre = this.usuario.nombre;
      this.form.correo = this.usuario.correo;
      this.form.usuario = this.usuario.usuario;
      this.form.fotoPerfil = this.usuario.fotoPerfil || '';
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
    abrirSelectorFoto() {
      this.$refs.inputFoto.click();
    },
    async onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.subiendoFoto = true;
      this.errorFoto = '';
      if (!file.type.startsWith('image/')) {
        this.errorFoto = 'Solo se permiten imágenes.';
        this.subiendoFoto = false;
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB
        this.errorFoto = 'La imagen no debe superar los 2MB.';
        this.subiendoFoto = false;
        return;
      }
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'autoparts_perfil'); 
      formData.append('folder', 'fotosPerfil');
      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dwqtxkizy/image/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.secure_url) {
          this.form.fotoPerfil = data.secure_url;
          this.errorFoto = '';
        } else {
          throw new Error(data.error?.message || 'Error al subir la imagen');
        }
      } catch (err) {
        this.errorFoto = err.message || 'Error al subir la imagen';
      }
      this.subiendoFoto = false;
    },
    async guardarCambios() {
      this.error = '';
      this.exito = false;
      this.guardando = true;
      try {
        let body = {
          nombre: this.form.nombre,
          correo: this.form.correo,
          usuario: this.form.usuario,
          fotoPerfil: this.form.fotoPerfil
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
  background: rgba(20, 40, 80, 0.32);
  z-index: 30000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(24px) saturate(1.7);
  -webkit-backdrop-filter: blur(24px) saturate(1.7);
}
.perfil-cliente-modal {
  background: rgba(255,255,255,0.45);
  border-radius: 2.2rem;
  box-shadow: 0 16px 48px 0 #1e3c7260, 0 2px 12px #42b98333;
  padding: 3.2rem 2.2rem 2.2rem 2.2rem;
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
  backdrop-filter: blur(32px) saturate(1.6); /* Blur más intenso */
  overflow: visible;
  box-sizing: border-box;
}
.perfil-cliente-avatar-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -44px;
  margin-bottom: 0.7rem;
  position: relative;
  z-index: 3;
}
.perfil-cliente-avatar {
  background: linear-gradient(135deg, #42b983 60%, #1e3c72 100%);
  border-radius: 50%;
  width: 88px;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px #42b98355, 0 1.5px 0 #fff4 inset;
  border: 4px solid #fff;
  z-index: 2;
  overflow: visible;
  position: relative;
}
.perfil-foto-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #42b983;
  box-shadow: 0 2px 8px #42b98333;
}
.perfil-foto-cambiar-btn-circular {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 32px;
  height: 32px;
  background: #fff;
  color: #42b983;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px #42b98333;
  cursor: pointer;
  z-index: 10;
  font-size: 1.2rem;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.13s;
  outline: none;
}
.perfil-foto-cambiar-btn-circular:hover {
  background: #f8fafc;
  color: #1e3c72;
  transform: scale(1.08);
  box-shadow: 0 4px 16px #1e3c7244;
}
.perfil-foto-cambiar-btn-circular i {
  margin: 0;
}
.perfil-foto-input-real {
  display: none;
}
.perfil-foto-cargando {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255,255,255,0.9);
  color: #1e3c72;
  font-size: 0.95rem;
  padding: 4px 12px;
  border-radius: 10px;
  z-index: 10;
  font-weight: 600;
  box-shadow: 0 2px 8px #42b98333;
  display: flex;
  align-items: center;
  gap: 0.5em;
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
  margin-top: 0.7rem;
  margin-bottom: 2.1rem;
  font-size: 1.7rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 2px 8px #1e3c7260;
  text-align: center;
  letter-spacing: 1.2px;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
}
.perfil-cliente-form,
.perfil-codigo-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 1.1rem;
  align-items: center;
}
.perfil-cliente-form-group {
  position: relative;
  width: 96%;
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: visible;
}
.perfil-cliente-form input,
.perfil-codigo-form input {
  width: 100%;
  padding: 1.25rem 1.1rem 0.55rem 1.1rem;
  border-radius: 12px;
  border: 1.5px solid #e0e7ef;
  background: #fff;
  font-size: 1.08rem;
  font-weight: 500;
  color: #1e3c72;
  outline: none;
  box-shadow: 0 2px 8px #1e3c7211;
  transition: border-color 0.22s, box-shadow 0.22s, background 0.18s;
  text-align: left;
  margin-top: 0.1rem;
}
.perfil-cliente-form input:focus,
.perfil-codigo-form input:focus {
  border-color: #42b983;
  box-shadow: 0 4px 16px #42b98322;
  background: #f8fafc;
}
.perfil-cliente-form label,
.perfil-codigo-form label {
  position: absolute;
  left: 1.2rem;
  top: 1.25rem;
  color: #7a8ca3;
  font-size: 1.01rem;
  font-weight: 600;
  pointer-events: none;
  transition: 0.22s cubic-bezier(.4,0,.2,1);
  background: transparent;
  padding: 0 0.3em;
  border-radius: 6px;
  z-index: 2;
  box-shadow: none;
  letter-spacing: 0.01em;
}
.perfil-cliente-form input:focus + label,
.perfil-cliente-form input:not(:placeholder-shown) + label,
.perfil-codigo-form input:focus + label,
.perfil-codigo-form input:not(:placeholder-shown) + label {
  top: -0.95rem;
  left: 0.9rem;
  font-size: 0.82rem;
  color: #fff;
  background: linear-gradient(90deg, #42b983 60%, #1e3c72 100%);
  box-shadow: 0 2px 8px #42b98333;
  padding: 0.13em 0.7em;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.perfil-cliente-form input:focus + label,
.perfil-codigo-form input:focus + label {
  color: #fff;
  background: linear-gradient(90deg, #1e3c72 60%, #42b983 100%);
  box-shadow: 0 4px 16px #1e3c7244;
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
.perfil-modal-fade-soft-enter-active, .perfil-modal-fade-soft-leave-active {
  transition: opacity 0.55s cubic-bezier(.4,0,.2,1), transform 0.55s cubic-bezier(.4,0,.2,1);
}
.perfil-modal-fade-soft-enter-from, .perfil-modal-fade-soft-leave-to {
  opacity: 0;
  transform: translateY(48px) scale(0.97);
}
@keyframes perfil-snackbar-pop {
  from { opacity: 0; transform: translateY(32px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@media (max-width: 500px) {
  .perfil-cliente-modal {
    max-width: 99vw;
    width: 99vw;
    padding: 1.2rem 0.3rem 1.2rem 0.3rem;
    border-radius: 1.1rem;
  }
  .perfil-cliente-avatar-wrapper {
    margin-top: -22px;
    margin-bottom: 0.3rem;
  }
  .perfil-cliente-avatar {
    width: 54px;
    height: 54px;
    top: 0;
    border-width: 2px;
  }
  .perfil-cliente-avatar i {
    font-size: 1.1rem;
  }
  .perfil-foto-cambiar-btn-circular {
    width: 22px;
    height: 22px;
    font-size: 0.9rem;
    top: 2px;
    right: 2px;
  }
  .perfil-cliente-title {
    margin-top: 0.3rem;
    margin-bottom: 0.7rem;
    font-size: 1rem;
  }
  .perfil-cliente-form,
  .perfil-codigo-form {
    gap: 0.3rem;
    margin-bottom: 0.5rem;
  }
  .perfil-cliente-form-group {
    width: 99%;
  }
  .perfil-cliente-form input,
  .perfil-codigo-form input {
    font-size: 0.97rem;
    padding: 1rem 0.7rem 0.3rem 0.7rem;
    border-radius: 8px;
  }
  .perfil-cliente-form label,
  .perfil-codigo-form label {
    font-size: 0.91rem;
    left: 0.7rem;
    top: 1rem;
    padding: 0 0.2em;
  }
  .perfil-cliente-form input:focus + label,
  .perfil-cliente-form input:not(:placeholder-shown) + label,
  .perfil-codigo-form input:focus + label,
  .perfil-codigo-form input:not(:placeholder-shown) + label {
    top: -0.7rem;
    left: 0.5rem;
    font-size: 0.75rem;
    padding: 0.11em 0.5em;
  }
  .perfil-cliente-btn,
  .perfil-codigo-form .perfil-cliente-btn {
    font-size: 0.95rem;
    padding: 0.3rem 0;
    border-radius: 7px;
    margin: 0.3rem auto 0.2rem auto;
    width: 99%;
  }
  .perfil-cliente-btn.restablecer {
    font-size: 0.93rem;
    margin-top: 0.5rem;
    margin-bottom: 0.1rem;
    border-radius: 7px;
    padding: 0.3rem 0;
    width: 99%;
  }
  .perfil-restablecer, .perfil-codigo-form {
    gap: 0.3rem;
    margin: 0.3rem auto 0.1rem auto;
    width: 99%;
  }
  .perfil-cliente-snackbar {
    min-width: 120px;
    max-width: 90vw;
    font-size: 0.93rem;
    border-radius: 10px;
    padding: 0.5em 1em 0.5em 0.7em;
    right: 10px;
    bottom: 10px;
    left: 10px;
    margin: 0 auto;
  }
}
.perfil-foto-modal-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(20, 40, 80, 0.32);
  z-index: 40000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(24px) saturate(1.7);
  -webkit-backdrop-filter: blur(24px) saturate(1.7);
  animation: fadeInSoft 0.3s;
}
.perfil-foto-modal-content {
  background: rgba(255,255,255,0.18);
  border-radius: 2.2rem;
  box-shadow: 0 16px 48px 0 #1e3c7260, 0 2px 12px #42b98333;
  padding: 1.5rem 1.5rem 1.2rem 1.5rem;
  max-width: 98vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  animation: fadeInPerfil 0.5s cubic-bezier(.4,0,.2,1);
}
.perfil-foto-modal-img {
  max-width: 70vw;
  max-height: 70vh;
  border-radius: 2rem;
  box-shadow: 0 8px 32px #42b98355, 0 1.5px 0 #fff4 inset;
  object-fit: contain;
  background: #fff;
}
.perfil-foto-modal-close {
  position: absolute;
  top: 1.1rem;
  right: 1.3rem;
  background: rgba(255,255,255,0.8);
  border: none;
  font-size: 2.1rem;
  color: #ff5252;
  cursor: pointer;
  border-radius: 50%;
  padding: 0.18em 0.5em;
  box-shadow: 0 2px 8px #ff525222;
  z-index: 2;
  transition: color 0.18s, background 0.18s, transform 0.18s;
}
.perfil-foto-modal-close:hover {
  color: #fff;
  background: #ff5252;
  transform: scale(1.12) rotate(8deg);
}
@media (max-width: 700px) {
  .perfil-foto-modal-content {
    padding: 0.7rem 0.2rem 0.7rem 0.2rem;
    border-radius: 1.1rem;
  }
  .perfil-foto-modal-img {
    max-width: 95vw;
    max-height: 60vh;
    border-radius: 1.1rem;
  }
  .perfil-foto-modal-close {
    font-size: 1.5rem;
    top: 0.5rem;
    right: 0.7rem;
  }
}
</style>
