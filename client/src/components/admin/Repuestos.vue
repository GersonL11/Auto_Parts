<template>
  <div class="admin-section">
    <div class="admin-header">
      <h1>Repuestos</h1>
      <button class="btn-agregar" @click="abrirModal()">Agregar</button>
    </div>
    <table class="admin-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th>Estado</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>Ubicación</th>
          <th>Fecha Registro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rep in repuestos" :key="rep._id">
          <td>{{ rep.nombre }}</td>
          <td>{{ rep.marca }}</td>
          <td>{{ rep.modelo }}</td>
          <td>{{ rep.año }}</td>
          <td>{{ rep.estado }}</td>
          <td>{{ rep.cantidad }}</td>
          <td>{{ rep.precio }}</td>
          <td>{{ rep.ubicacion }}</td>
          <td>{{ rep.fechaRegistro ? (new Date(rep.fechaRegistro)).toLocaleDateString() : '' }}</td>
          <td>
            <button class="btn-editar" @click="abrirModal(rep)">Editar</button>
            <button class="btn-eliminar" @click="eliminar(rep._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div v-if="showModal" class="modal-bg" @click.self="cerrarModal">
      <div class="modal-form">
        <h2>{{ editando ? 'Editar Repuesto' : 'Agregar Repuesto' }}</h2>
        <form @submit.prevent="guardar">
          <label>Nombre</label>
          <input v-model="form.nombre" required />
          <label>Marca</label>
          <input v-model="form.marca" />
          <label>Modelo</label>
          <input v-model="form.modelo" />
          <label>Año</label>
          <input v-model="form.año" type="number" />
          <label>Estado</label>
          <input v-model="form.estado" />
          <label>Cantidad</label>
          <input v-model="form.cantidad" type="number" />
          <label>Precio</label>
          <input v-model="form.precio" type="number" />
          <label>Ubicación</label>
          <input v-model="form.ubicacion" />
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
  name: 'AdminRepuestos',
  data() {
    return {
      repuestos: [],
      showModal: false,
      editando: false,
      form: {
        _id: null,
        nombre: '',
        marca: '',
        modelo: '',
        año: '',
        estado: '',
        cantidad: '',
        precio: '',
        ubicacion: ''
      }
    }
  },
  mounted() {
    this.cargarRepuestos();
  },
  methods: {
    async cargarRepuestos() {
      const res = await fetch('http://localhost:3000/api/repuestos');
      this.repuestos = await res.json();
    },
    abrirModal(rep = null) {
      if (rep) {
        this.editando = true;
        this.form = { ...rep };
      } else {
        this.editando = false;
        this.form = {
          _id: null,
          nombre: '',
          marca: '',
          modelo: '',
          año: '',
          estado: '',
          cantidad: '',
          precio: '',
          ubicacion: ''
        };
      }
      this.showModal = true;
    },
    cerrarModal() {
      this.showModal = false;
    },
    async guardar() {
      if (this.editando) {
        // UPDATE
        await fetch(`http://localhost:3000/api/repuestos/${this.form._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });
      } else {
        // CREATE
        await fetch('http://localhost:3000/api/repuestos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });
      }
      this.cerrarModal();
      this.cargarRepuestos();
    },
    async eliminar(id) {
      if (confirm('¿Seguro que deseas eliminar este repuesto?')) {
        await fetch(`http://localhost:3000/api/repuestos/${id}`, {
          method: 'DELETE'
        });
        this.cargarRepuestos();
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