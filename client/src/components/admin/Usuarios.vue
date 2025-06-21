<template>
  <div class="admin-section">
    <div class="admin-header">
      <h1>Usuarios</h1>
      <button class="btn-agregar" @click="abrirModal()">Agregar</button>
    </div>
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>correo</th>
          <th>Usuario</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in usuarios" :key="user._id">
          <td>{{ user._id }}</td>
          <td>{{ user.nombre }}</td>
          <td>{{ user.correo }}</td>
          <td>{{ user.usuario }}</td>
          <td>
            <button class="btn-editar" @click="abrirModal(user)">Editar</button>
            <button class="btn-eliminar" @click="eliminar(user._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="showModal" class="modal-bg" @click.self="cerrarModal">
      <div class="modal-form">
        <h2>{{ editando ? 'Editar Usuario' : 'Agregar Usuario' }}</h2>
        <form @submit.prevent="guardar">
          <label>Nombre</label>
          <input v-model="form.nombre" required />
          <label>Correo</label>
          <input v-model="form.correo" type="email" required />
          <label>Usuario</label>
          <input v-model="form.usuario" required />
          <label v-if="!editando">Contraseña</label>
          <input v-if="!editando" v-model="form.password" type="password" required />
          <label>Rol</label>
          <select v-model="form.rol" required>
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
          </select>
          <div class="modal-actions">
            <button type="submit" class="btn-guardar">Guardar</button>
            <button type="button" class="btn-cancelar" @click="cerrarModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUsuarios',
  data() {
    return {
      usuarios: [],
      showModal: false,
      editando: false,
      form: { _id: null, nombre: '', correo: '', usuario: '', password: '', rol: 'cliente' }
    }
  },
  mounted() {
    this.cargarUsuarios();
  },
  methods: {
    async cargarUsuarios() {
      try {
        const res = await fetch('http://localhost:3000/api/usuarios');
        this.usuarios = await res.json();
      } catch (e) {
        alert('Error al cargar usuarios');
      }
    },
    abrirModal(user = null) {
      if (user) {
        this.editando = true;
        this.form = { ...user, password: '' }; // password vacío para no mostrarlo
      } else {
        this.editando = false;
        this.form = { _id: null, nombre: '', correo: '', usuario: '', password: '' };
      }
      this.showModal = true;
    },
    cerrarModal() {
      this.showModal = false;
    },
    async guardar() {
      try {
        if (this.editando) {
          await fetch(`http://localhost:3000/api/usuarios/${this.form._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.form)
          });
        } else {
          await fetch('http://localhost:3000/api/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.form)
          });
        }
        this.cerrarModal();
        this.cargarUsuarios();
      } catch (e) {
        alert('Error al guardar usuario');
      }
    },
    async eliminar(id) {
      if (confirm('¿Seguro que deseas eliminar este usuario?')) {
        try {
          await fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: 'DELETE'
          });
          this.cargarUsuarios();
        } catch (e) {
          alert('Error al eliminar usuario');
        }
      }
    }
  }
}
</script>

<style scoped>
.admin-section {
  padding: 2rem;
}
.admin-header {
  background: none !important;
  box-shadow: none !important;
  border: none !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0;
}
.admin-header h1 {
  border-bottom: 2.5px solid #ff9800;
  margin-bottom: 0;
  padding-bottom: 0.2rem;
  background: none !important;
}
.btn-agregar {
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px #42b98322;
}
.admin-table th, .admin-table td {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}
.admin-table th {
  background: #f5f7fa;
}
.btn-editar, .btn-eliminar {
  margin-right: 0.5rem;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.9rem;
  font-weight: bold;
  cursor: pointer;
}
.btn-editar {
  background: #00bcd4;
  color: #fff;
}
.btn-eliminar {
  background: #ff5252;
  color: #fff;
}
.modal-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30,60,114,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.modal-form {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px #42b98344;
  min-width: 320px;
  max-width: 95vw;
}
.modal-form label {
  display: block;
  margin-top: 1rem;
  margin-bottom: 0.3rem;
  font-weight: bold;
}
.modal-form input, .modal-form select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1.5px solid #42b983;
  margin-bottom: 0.7rem;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
}
.btn-guardar {
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
}
.btn-cancelar {
  background: #e0e0e0;
  color: #232b36;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
}
</style>