<template>
  <div style="position:relative;display:inline-block;">
    <button class="admin-header-icon-btn" title="Configuración" @click="toggleConfigMenu">
      <i class="fas fa-cog"></i>
    </button>
    <div v-if="showConfigMenu" class="config-dropdown">
      <ul>
        <li @click="openEditProfile"><i class="fas fa-user-edit"></i> Editar perfil</li>
        <li @click="openChangePassword"><i class="fas fa-key"></i> Cambiar contraseña</li>
      </ul>
    </div>
    <!-- Modal Editar Perfil -->
    <transition name="perfil-modal-fade-soft">
      <div v-if="showEditProfile" class="perfil-cliente-overlay" @click.self="closeEditProfile">
        <div class="perfil-cliente-modal">
          <button class="perfil-cliente-close" @click="closeEditProfile">&times;</button>
          <div class="perfil-cliente-avatar-wrapper">
            <div class="perfil-cliente-avatar" @click="ampliarFoto = true" style="cursor: pointer;">
              <img v-if="editProfileData.fotoPreview" :src="editProfileData.fotoPreview" alt="Foto de perfil" class="perfil-foto-img" />
              <i v-else class="fas fa-id-card"></i>
              <button type="button" class="perfil-foto-cambiar-btn-circular" @click.stop="abrirSelectorFoto" :disabled="subiendoFoto" title="Cambiar foto de perfil">
                <i class="fas fa-camera"></i>
              </button>
              <input ref="inputFoto" type="file" accept="image/*" @change="onProfilePicChange" class="perfil-foto-input-real" :disabled="subiendoFoto" style="display:none;" />
              <span v-if="subiendoFoto" class="perfil-foto-cargando"><i class="fas fa-spinner fa-spin"></i> Subiendo...</span>
            </div>
          </div>
          <div class="perfil-cliente-title">Editar perfil</div>
          <form class="perfil-cliente-form" @submit.prevent="saveProfile">
            <div class="perfil-cliente-form-group">
              <input v-model="editProfileData.nombre" type="text" required placeholder=" " />
              <label>Nombre</label>
            </div>
            <div class="perfil-cliente-form-group">
              <input v-model="editProfileData.email" type="email" required placeholder=" " />
              <label>Email</label>
            </div>
            <button class="perfil-cliente-btn" type="submit" :disabled="subiendoFoto || guardando">Guardar</button>
            <div v-if="errorFoto" class="perfil-foto-error">{{ errorFoto }}</div>
          </form>
        </div>
      </div>
    </transition>
    <!-- Snackbar global fuera del modal -->
    <transition name="perfil-snackbar-fade">
      <div v-if="error || exito" class="perfil-cliente-snackbar" @click="error = ''; exito = false;">
        <span v-if="error" class="snackbar-error">{{ error }}</span>
        <span v-if="exito" class="snackbar-exito">Datos actualizados correctamente</span>
      </div>
    </transition>
    <!-- Modal Cambiar Contraseña -->
    <transition name="perfil-modal-fade-soft">
      <div v-if="showChangePassword" class="perfil-cliente-overlay" @click.self="showChangePassword=false">
        <div class="perfil-cliente-modal">
          <button class="perfil-cliente-close" @click="showChangePassword=false">&times;</button>
          <div class="perfil-cliente-title">Cambiar contraseña</div>
          <form class="perfil-cliente-form" @submit.prevent="savePassword">
            <div class="perfil-cliente-form-group">
              <div style="position: relative; width: 100%;">
                <input v-model="passwordData.actual" :type="showPasswordActual ? 'text' : 'password'" required placeholder=" " />
                <label>Contraseña actual</label>
                <button type="button" @click="showPasswordActual = !showPasswordActual" class="perfil-password-eye-btn" tabindex="-1" :aria-label="showPasswordActual ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                  <i :class="showPasswordActual ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
            <div class="perfil-cliente-form-group">
              <div style="position: relative; width: 100%;">
                <input v-model="passwordData.nueva" :type="showPasswordNueva ? 'text' : 'password'" required placeholder=" " />
                <label>Nueva contraseña</label>
                <button type="button" @click="showPasswordNueva = !showPasswordNueva" class="perfil-password-eye-btn" tabindex="-1" :aria-label="showPasswordNueva ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                  <i :class="showPasswordNueva ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
            <div class="perfil-cliente-form-group">
              <input v-model="passwordData.confirmar" :type="showPasswordNueva ? 'text' : 'password'" required placeholder=" " />
              <label>Confirmar nueva contraseña</label>
            </div>
            <button class="perfil-cliente-btn" type="submit" :disabled="guardando">
              <span v-if="guardando"><i class="fas fa-spinner fa-spin"></i> Guardando...</span>
              <span v-else>Guardar</span>
            </button>
            <div v-if="errorPassword" class="perfil-foto-error">{{ errorPassword }}</div>
            <div v-if="exitoPassword" class="snackbar-exito">Contraseña actualizada correctamente</div>
          </form>
        </div>
      </div>
    </transition>
  </div>
  <transition name="perfil-modal-fade-soft">
    <div v-if="ampliarFoto && editProfileData.fotoPreview" class="perfil-foto-modal-bg" @click.self="ampliarFoto = false">
      <div class="perfil-foto-modal-content" style="max-width: 350px; max-height: 350px;">
        <button class="perfil-foto-modal-close" @click="ampliarFoto = false">&times;</button>
        <img :src="editProfileData.fotoPreview" alt="Foto de perfil ampliada" class="perfil-foto-modal-img" style="max-width: 320px; max-height: 320px; border-radius: 2rem; object-fit: contain; background: #fff;" />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AdminConfigMenu',
  props: {
    usuario: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showConfigMenu: false,
      showEditProfile: false,
      showChangePassword: false,
      editProfileData: {
        nombre: '',
        email: '',
        foto: null,
        fotoPreview: ''
      },
      passwordData: {
        actual: '',
        nueva: '',
        confirmar: ''
      },
      showPasswordActual: false,
      showPasswordNueva: false,
      subiendoFoto: false,
      errorFoto: '',
      error: '',
      exito: false,
      guardando: false,
      ampliarFoto: false,
      errorPassword: '',
      exitoPassword: false
    }
  },
  mounted() {
    if (this.usuario) {
      this.editProfileData.nombre = this.usuario.nombre || '';
      this.editProfileData.email = this.usuario.email || '';
      this.editProfileData.fotoPreview = this.usuario.fotoPerfil || '';
    }
  },
  watch: {
    error(val) {
      if (val) setTimeout(() => { this.error = '' }, 4000);
    },
    exito(val) {
      if (val) setTimeout(() => { this.exito = false }, 4000);
    },
    errorFoto(val) {
      if (val) setTimeout(() => { this.errorFoto = '' }, 4000);
    }
  },
  methods: {
    toggleConfigMenu() {
      this.showConfigMenu = !this.showConfigMenu;
    },
    openEditProfile() {
      this.showConfigMenu = false;
      // Obtener usuario desde props o localStorage
      let usuario = this.usuario;
      if (!usuario || !usuario._id) {
        const userStr = localStorage.getItem('autoparts_user');
        if (userStr) {
          usuario = JSON.parse(userStr);
        }
      }
      this.editProfileData.nombre = usuario?.nombre || '';
      this.editProfileData.email = usuario?.correo || usuario?.email || '';
      this.editProfileData.fotoPreview = usuario?.fotoPerfil || '';
      this.editProfileData.foto = null;
      this.showEditProfile = true;
    },
    closeEditProfile() {
      this.showEditProfile = false;
      this.error = '';
      this.exito = false;
      this.errorFoto = '';
    },
    abrirSelectorFoto() {
      this.$refs.inputFoto.click();
    },
    async onProfilePicChange(e) {
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
          this.editProfileData.fotoPreview = data.secure_url;
          this.editProfileData.foto = data.secure_url;
          this.errorFoto = '';
        } else {
          throw new Error(data.error?.message || 'Error al subir la imagen');
        }
      } catch (err) {
        this.errorFoto = err.message || 'Error al subir la imagen';
      }
      this.subiendoFoto = false;
    },
    async saveProfile() {
      this.error = '';
      this.exito = false;
      this.guardando = true;
      try {
        // Obtener usuario desde localStorage si no está en props
        let usuario = this.usuario;
        if (!usuario || !usuario._id) {
          const userStr = localStorage.getItem('autoparts_user');
          if (userStr) {
            usuario = JSON.parse(userStr);
          }
        }
        if (!usuario || !usuario._id) {
          throw new Error('No se encontró el usuario actual.');
        }
        let body = {
          nombre: this.editProfileData.nombre,
          correo: this.editProfileData.email,
          fotoPerfil: this.editProfileData.fotoPreview
        };
        const res = await fetch(`http://localhost:3000/api/usuarios/${usuario._id}`, {
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
        localStorage.setItem('autoparts_user', JSON.stringify(updatedUser));
        this.$emit('usuario-actualizado', updatedUser);
        setTimeout(() => {
          this.exito = false;
          this.closeEditProfile();
        }, 2500);
      } catch (e) {
        this.error = e.message;
      }
      this.guardando = false;
    },
    async savePassword() {
      this.errorPassword = '';
      this.exitoPassword = false;
      this.guardando = true;
      if (!this.passwordData.actual || !this.passwordData.nueva || !this.passwordData.confirmar) {
        this.errorPassword = 'Completa todos los campos.';
        this.guardando = false;
        return;
      }
      if (this.passwordData.nueva !== this.passwordData.confirmar) {
        this.errorPassword = 'Las contraseñas no coinciden.';
        this.guardando = false;
        return;
      }
      try {
        let usuario = this.usuario;
        if (!usuario || !usuario._id) {
          const userStr = localStorage.getItem('autoparts_user');
          if (userStr) {
            usuario = JSON.parse(userStr);
          }
        }
        if (!usuario || !usuario._id) {
          throw new Error('No se encontró el usuario actual.');
        }
        const body = {
          passwordActual: this.passwordData.actual,
          nuevaPassword: this.passwordData.nueva
        };
        const res = await fetch(`http://localhost:3000/api/usuarios/${usuario._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al cambiar la contraseña');
        }
        this.exitoPassword = true;
        setTimeout(() => {
          this.exitoPassword = false;
          this.showChangePassword = false;
        }, 2000);
        this.passwordData.actual = '';
        this.passwordData.nueva = '';
        this.passwordData.confirmar = '';
      } catch (e) {
        this.errorPassword = e.message;
      }
      this.guardando = false;
    },
    openChangePassword() {
      this.showConfigMenu = false;
      this.showChangePassword = true;
      this.passwordData.actual = '';
      this.passwordData.nueva = '';
      this.passwordData.confirmar = '';
      this.errorPassword = '';
      this.exitoPassword = false;
      this.showPasswordActual = false;
      this.showPasswordNueva = false;
    }
  }
}
</script>

<style scoped>
.config-dropdown {
  position: absolute;
  right: 0;
  top: 2.5rem;
  background: #181c22; /* más oscuro */
  color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 12px #232b3622;
  min-width: 180px;
  z-index: 2000;
  padding: 0.5rem 0;
}
.config-dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.config-dropdown li {
  padding: 0.7rem 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.08rem;
  transition: background 0.18s;
}
.config-dropdown li:hover {
  background: #ff9800;
  color: #fff;
}
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
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  backdrop-filter: blur(32px) saturate(1.6);
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
.perfil-cliente-form {
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
.perfil-cliente-form-group input {
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
.perfil-cliente-form-group input:focus {
  border-color: #42b983;
  box-shadow: 0 4px 16px #42b98322;
  background: #f8fafc;
}
.perfil-cliente-form-group label {
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
.perfil-cliente-form-group input:focus + label,
.perfil-cliente-form-group input:not(:placeholder-shown) + label {
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
.perfil-cliente-form-group input:focus + label {
  color: #fff;
  background: linear-gradient(90deg, #1e3c72 60%, #42b983 100%);
  box-shadow: 0 4px 16px #1e3c7244;
}
.perfil-cliente-btn {
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
.perfil-cliente-btn:hover {
  background: linear-gradient(90deg, #1e3c72 0%, #42b983 100%);
  color: #fff;
  box-shadow: 0 6px 16px #1e3c7244;
  transform: translateY(-1px) scale(1.02);
}
.btn-cancelar {
  background: #232b36;
  color: #e0e0e0;
  border: 1.5px solid #e0e0e0;
  border-radius: 0.5rem;
  padding: 0.6rem 1.5rem;
  font-weight: 700;
  cursor: pointer;
  font-size: 1.08rem;
  transition: background 0.18s, color 0.18s, border 0.18s;
}
.btn-cancelar:hover {
  background: #ff5252;
  color: #fff;
  border-color: #ff5252;
}
.admin-header-icon-btn {
  background: none;
  border: none;
  color: #e0e0e0;
  font-size: 1.35rem;
  cursor: pointer;
  margin: 0 0.1rem;
  position: relative;
  transition: color 0.18s, background 0.18s;
  border-radius: 50%;
  padding: 0.4rem;
}
.admin-header-icon-btn:hover {
  color: #ff9800;
  background: #232b36;
}
.admin-dark-mode .modal-bg {
  background: rgba(24,28,34,0.45);
  backdrop-filter: blur(7px) saturate(1.2);
  -webkit-backdrop-filter: blur(7px) saturate(1.2);
}
.admin-dark-mode .modal-form {
  background: #232b36;
  color: #e0e0e0;
  border: 1.5px solid #42e08f44;
  box-shadow: 0 8px 32px #000a;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.custom-file-input-wrapper {
  position: relative;
  width: 100%;
  margin-bottom: 0.7rem;
}
.custom-file-input-wrapper input[type="file"] {
  opacity: 0;
  width: 100%;
  height: 2.2rem;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  z-index: 2;
}
.custom-file-label {
  display: block;
  width: 100%;
  height: 2.2rem;
  background: #181c22; /* más oscuro */
  color: #e0e0e0;
  border: 1.5px solid #2e3a4a;
  border-radius: 0.4rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  line-height: 1.2rem;
  cursor: pointer;
  transition: border 0.18s, background 0.18s;
  z-index: 1;
  position: relative;
}
.custom-file-label:hover {
  background: #232b36;
}
.perfil-cliente-snackbar {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 4000;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.9rem;
  transition: opacity 0.3s ease;
}
.snackbar-error {
  color: #ff5252;
}
.snackbar-exito {
  color: #42e08f;
}
.perfil-snackbar-fade-enter-active, .perfil-snackbar-fade-leave-active {
  transition: opacity 0.3s ease;
}
.perfil-snackbar-fade-enter, .perfil-snackbar-fade-leave-to {
  opacity: 0;
}
.perfil-foto-modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 40, 80, 0.32);
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
  z-index: 41000;
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
.perfil-password-eye-btn {
  position: absolute;
  top: 50%;
  right: 0.7em;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #7a8ca3;
  font-size: 1.18em;
  cursor: pointer;
  z-index: 5;
  padding: 0 0.4em;
  outline: none;
  transition: color 0.18s;
}
.perfil-password-eye-btn:hover {
  color: #ff9800;
}
</style>
