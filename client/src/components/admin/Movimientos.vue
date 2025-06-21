<template>
  <div class="admin-section">
    <div class="admin-header">
      <h1>Movimientos</h1>
      <button class="btn-agregar" @click="abrirModal()">Agregar</button>
    </div>
    <div class="admin-table-wrapper">
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
    </div>
    <div v-if="showModal" class="modal-bg" @click.self="cerrarModal">
      <div class="modal-form">
        <h2>{{ editando ? 'Editar Movimiento' : 'Agregar Movimiento' }}</h2>
        <form @submit.prevent="guardar">
          <label>Tipo</label>
          <select v-model="form.tipo" required>
            <option value="Entrada">Entrada</option>
            <option value="Salida">Salida</option>
          </select>
          <label>Repuesto</label>
          <select v-model="form.repuesto" required>
            <option v-for="r in repuestos" :key="r._id" :value="r._id">
              {{ r.nombre }} ({{ r.marca }} {{ r.modelo }})
            </option>
          </select>
          <label>Cantidad</label>
          <input v-model.number="form.cantidad" type="number" min="1" required />
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
      repuestos: [],
      showModal: false,
      editando: false,
      form: { _id: null, tipo: 'Entrada', repuesto: '', cantidad: 1, descripcion: '', fecha: '' }
    }
  },
  mounted() {
    this.cargarMovimientos();
    this.cargarRepuestos();
  },
  methods: {
    async cargarMovimientos() {
      const res = await fetch('http://localhost:3000/api/movimientos');
      this.movimientos = await res.json();
    },
    async cargarRepuestos() {
      const res = await fetch('http://localhost:3000/api/repuestos');
      this.repuestos = await res.json();
    },
    abrirModal(mov = null) {
      if (mov) {
        this.editando = true;
        this.form = { ...mov };
      } else {
        this.editando = false;
        this.form = { _id: null, tipo: 'Entrada', repuesto: '', cantidad: 1, descripcion: '', fecha: '' };
      }
      this.showModal = true;
    },
    cerrarModal() {
      this.showModal = false;
    },
    async guardar() {
      // Si es entrada, actualiza el stock del repuesto
      if (this.form.tipo === 'Entrada' && this.form.repuesto && this.form.cantidad > 0) {
        await fetch(`http://localhost:3000/api/repuestos/${this.form.repuesto}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ $inc: { cantidad: this.form.cantidad } })
        });
      }
      if (this.editando) {
        await fetch(`http://localhost:3000/api/movimientos/${this.form._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });
      } else {
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
  background: #f9f9f9;
  border-radius: 18px;
  box-shadow: 0 4px 18px #42b98322;
  margin-bottom: 2rem;
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
  transition: background 0.18s, box-shadow 0.18s;
}
.btn-agregar:hover {
  background: #1e3c72;
  box-shadow: 0 2px 8px #1e3c7244;
}
.admin-table-wrapper {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px #42b98322;
  padding: 1.2rem;
  margin-bottom: 2rem;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: transparent;
  border-radius: 12px;
  overflow: hidden;
}
.admin-table th, .admin-table td {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}
.admin-table th {
  background: #f5f7fa;
  color: #333;
  font-weight: 600;
}
.admin-table tr:hover {
  background-color: #f1f1f1;
}
.btn-editar, .btn-eliminar {
  margin-right: 0.5rem;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
}
.btn-editar {
  background: #00bcd4;
  color: #fff;
}
.btn-editar:hover {
  background: #0097a7;
  box-shadow: 0 2px 8px #00bcd444;
}
.btn-eliminar {
  background: #ff5252;
  color: #fff;
}
.btn-eliminar:hover {
  background: #c62828;
  box-shadow: 0 2px 8px #ff525244;
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
  border-radius: 24px;
  box-shadow: 0 8px 32px #42b98344;
  min-width: 340px;
  max-width: 95vw;
  border: 1.5px solid #42b98322;
  transition: box-shadow 0.18s, border 0.18s;
}
.modal-form h2 {
  text-align: center;
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  color: #232b36;
  letter-spacing: 1px;
}
form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.modal-form label {
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #1e3c72;
  letter-spacing: 0.5px;
}
.modal-form input, .modal-form select {
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: 1.5px solid #42b983;
  font-size: 1.05rem;
  background: #f8fafc;
  margin-bottom: 0.1rem;
  transition: border 0.18s, box-shadow 0.18s;
}
.modal-form input:focus, .modal-form select:focus {
  border: 1.5px solid #1e3c72;
  box-shadow: 0 2px 8px #42b98333;
  background: #fff;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.2rem;
  justify-content: flex-end;
}
.btn-guardar {
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.05rem;
  transition: background 0.18s, box-shadow 0.18s;
}
.btn-guardar:hover {
  background: #1e3c72;
  box-shadow: 0 2px 8px #1e3c7244;
}
.btn-cancelar {
  background: #e0e0e0;
  color: #232b36;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.05rem;
  transition: background 0.18s;
}
.btn-cancelar:hover {
  background: #ff5252;
  color: #fff;
}
@media (max-width: 700px) {
  .modal-form {
    padding: 1.2rem 0.5rem;
  }
}
</style>