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
      <div class="modal-form repuesto-modal-glass">
        <div class="modal-header">
          <h2>{{ editando ? 'Editar Repuesto' : 'Agregar Repuesto' }}</h2>
          <button class="modal-close" @click="cerrarModal">&times;</button>
        </div>
        <form @submit.prevent="guardar">
          <div class="repuesto-form-grid-3">
            <div>
              <label>Nombre</label>
              <input v-model="form.nombre" required />
            </div>
            <div>
              <label>Marca</label>
              <input v-model="form.marca" />
            </div>
            <div>
              <label>Modelo</label>
              <input v-model="form.modelo" />
            </div>
            <div>
              <label>Año</label>
              <input v-model="form.año" type="number" />
            </div>
            <div>
              <label>Estado</label>
              <input v-model="form.estado" />
            </div>
            <div>
              <label>Cantidad</label>
              <input v-model="form.cantidad" type="number" />
            </div>
            <div>
              <label>Precio</label>
              <input v-model="form.precio" type="number" />
            </div>
            <div>
              <label>Ubicación</label>
              <input v-model="form.ubicacion" />
            </div>
            <div>
              <label>Categoría</label>
              <input v-model="form.categoria" />
            </div>
            <div>
              <label>País de fabricación</label>
              <input v-model="form.paisFabricacion" />
            </div>
            <div class="repuesto-img-upload">
              <label>Imagen</label>
              <input type="file" accept="image/*" @change="onFileChange" />
              <div v-if="subiendoFoto" class="repuesto-img-cargando"><i class="fas fa-spinner fa-spin"></i> Subiendo...</div>
              <div v-if="form.imagen" class="repuesto-img-preview">
                <img :src="form.imagen" alt="Imagen repuesto" />
              </div>
            </div>
          </div>
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
      subiendoFoto: false,
      form: {
        _id: null,
        nombre: '',
        marca: '',
        modelo: '',
        año: '',
        estado: '',
        cantidad: '',
        precio: '',
        ubicacion: '',
        categoria: '',
        paisFabricacion: '',
        fechaRegistro: '',
        imagen: ''
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
    async onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.subiendoFoto = true;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'autoparts_perfil'); // Usa tu preset de Cloudinary
      formData.append('folder', 'repuestos');
      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dwqtxkizy/image/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.secure_url) {
          this.form.imagen = data.secure_url;
        } else {
          alert('Error al subir la imagen');
        }
      } catch (err) {
        alert('Error al subir la imagen');
      }
      this.subiendoFoto = false;
    },
    abrirModal(rep = null) {
      if (rep) {
        this.editando = true;
        this.form = {
          ...rep,
          fechaRegistro: rep.fechaRegistro ? rep.fechaRegistro.substr(0, 10) : ''
        };
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
          ubicacion: '',
          categoria: '',
          paisFabricacion: '',
          fechaRegistro: new Date().toISOString().substr(0, 10),
          imagen: ''
        };
      }
      this.showModal = true;
    },
    cerrarModal() {
      this.showModal = false;
    },
    async guardar() {
      try {
        const body = { ...this.form };
        if (!this.editando) delete body._id;
        // No enviar fechaRegistro
        delete body.fechaRegistro;
        const url = this.editando
          ? `http://localhost:3000/api/repuestos/${this.form._id}`
          : 'http://localhost:3000/api/repuestos';
        const method = this.editando ? 'PUT' : 'POST';
        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        this.cerrarModal();
        this.cargarRepuestos();
      } catch (e) {
        alert('Error al guardar repuesto');
      }
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
  inset: 0;
  background: rgba(30, 41, 59, 0.35);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.repuesto-modal-glass {
  width: 700px;
  max-width: 96vw;
  background: rgba(255,255,255,0.55);
  box-shadow: 0 8px 32px 0 rgba(31,38,135,0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 28px;
  padding: 2.2rem 2.2rem 1.5rem 2.2rem;
  position: relative;
  margin: 2rem 0;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
}
.modal-header h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
}
.modal-close {
  background: #fff;
  border: none;
  font-size: 2rem;
  color: #e74c3c;
  cursor: pointer;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.modal-close:hover {
  background: #ffeaea;
}
.repuesto-form-grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.1rem 1.5rem;
  margin-bottom: 1.2rem;
}
.repuesto-form-grid-3 > div {
  display: flex;
  flex-direction: column;
}
.repuesto-form-grid-3 label {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #222;
}
.repuesto-form-grid-3 input[type="text"],
.repuesto-form-grid-3 input[type="number"],
.repuesto-form-grid-3 input[type="file"] {
  border: 1.5px solid #1ecab8;
  border-radius: 8px;
  padding: 0.4rem 0.7rem;
  font-size: 1rem;
  outline: none;
  background: #f8fafd;
  transition: border 0.2s;
}
.repuesto-form-grid-3 input:focus {
  border-color: #6c63ff;
}
.repuesto-img-upload {
  grid-column: span 3;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}
.repuesto-img-preview img {
  max-width: 120px;
  max-height: 120px;
  border-radius: 12px;
  box-shadow: 0 2px 12px #42b98322;
  margin-top: 0.5rem;
}
.repuesto-img-cargando {
  color: #42b983;
  font-weight: bold;
}
.modal-actions {
  display: flex;
  gap: 1.2rem;
  justify-content: flex-end;
  margin-top: 1.2rem;
}
.btn-guardar {
  background: linear-gradient(90deg, #1ecab8 60%, #6c63ff 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.5rem;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-guardar:hover {
  background: linear-gradient(90deg, #1cc8ee 60%, #6c63ff 100%);
}
.btn-cancelar {
  background: #eee;
  color: #222;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.5rem;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-cancelar:hover {
  background: #e0e0e0;
}
@media (max-width: 900px) {
  .repuesto-modal-glass { width: 99vw; padding: 1.2rem 0.5rem; }
  .repuesto-form-grid-3 { grid-template-columns: 1fr; }
  .repuesto-img-upload { grid-column: span 1; }
}
</style>