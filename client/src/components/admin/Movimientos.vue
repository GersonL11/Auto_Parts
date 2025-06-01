<template>
  <div class="admin-section">
    <div class="admin-header">
      <h1>Movimientos</h1>
      <button class="btn-agregar" @click="abrirModal()">Agregar</button>
    </div>
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Descripción</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mov in movimientos" :key="mov._id">
          <td>{{ mov._id }}</td>
          <td>{{ mov.descripcion }}</td>
          <td>{{ mov.fecha }}</td>
          <td>
            <button class="btn-editar" @click="abrirModal(mov)">Editar</button>
            <button class="btn-eliminar" @click="eliminar(mov._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="showModal" class="modal-bg" @click.self="cerrarModal">
      <div class="modal-form">
        <h2>{{ editando ? 'Editar Movimiento' : 'Agregar Movimiento' }}</h2>
        <form @submit.prevent="guardar">
          <label>Descripción</label>
          <input v-model="form.descripcion" required />
          <label>Fecha</label>
          <input v-model="form.fecha" type="date" required />
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
  name: 'AdminMovimientos',
  data() {
    return {
      movimientos: [],
      showModal: false,
      editando: false,
      form: { _id: null, descripcion: '', fecha: '' }
    }
  },
  mounted() {
    this.cargarMovimientos();
  },
  methods: {
    async cargarMovimientos() {
      const res = await fetch('http://localhost:3000/api/movimientos');
      this.movimientos = await res.json();
    },
    abrirModal(mov = null) {
      if (mov) {
        this.editando = true;
        this.form = { ...mov };
      } else {
        this.editando = false;
        this.form = { _id: null, descripcion: '', fecha: '' };
      }
      this.showModal = true;
    },
    cerrarModal() {
      this.showModal = false;
    },
    async guardar() {
      if (this.editando) {
        // UPDATE
        await fetch(`http://localhost:3000/api/movimientos/${this.form._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });
      } else {
        // CREATE
        await fetch('http://localhost:3000/api/movimientos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });
      }
      this.cerrarModal();
      this.cargarMovimientos();
    },
    async eliminar(id) {
      if (confirm('¿Seguro que deseas eliminar este movimiento?')) {
        await fetch(`http://localhost:3000/api/movimientos/${id}`, {
          method: 'DELETE'
        });
        this.cargarMovimientos();
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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
.modal-form input {
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