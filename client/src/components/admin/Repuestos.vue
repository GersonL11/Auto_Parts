<template>
  <div class="admin-section">
    <div class="admin-header">
      <h1>Repuestos</h1>
      <button class="btn-agregar" @click="abrirModal()">Agregar</button>
    </div>
    <table class="admin-table">
      <thead>
        <tr>
          <th>Imagen</th>
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
          <td>
            <img v-if="rep.imagen" :src="rep.imagen" alt="Imagen" style="width:48px;height:48px;object-fit:cover;border-radius:8px;" />
          </td>
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
      <div class="modal-form modal-form-grid">
        <h2>{{ editando ? 'Editar Repuesto' : 'Agregar Repuesto' }}</h2>
        <form @submit.prevent="guardar">
          <div class="form-row form-row-img">
            <label>Imagen</label>
            <div class="custom-file-input-wrapper">
              <input id="fileInput" type="file" accept="image/*" @change="onFileChange" />
              <label for="fileInput" class="custom-file-label">
                {{ fileName || 'Selecciona una imagen...' }}
              </label>
            </div>
            <div v-if="previewImg" class="img-preview-wrapper">
              <img :src="previewImg" alt="Previsualización" class="img-preview" />
            </div>
          </div>
          <div class="form-row-pair">
            <div class="form-row">
              <label>Nombre</label>
              <input v-model="form.nombre" required />
            </div>
            <div class="form-row">
              <label>Marca</label>
              <input v-model="form.marca" />
            </div>
          </div>
          <div class="form-row-pair">
            <div class="form-row">
              <label>Modelo</label>
              <input v-model="form.modelo" />
            </div>
            <div class="form-row">
              <label>Año</label>
              <input v-model="form.año" type="number" />
            </div>
          </div>
          <div class="form-row-pair">
            <div class="form-row">
              <label>Estado</label>
              <input v-model="form.estado" />
            </div>
            <div class="form-row">
              <label>Cantidad</label>
              <input v-model="form.cantidad" type="number" />
            </div>
          </div>
          <div class="form-row-pair">
            <div class="form-row">
              <label>Precio</label>
              <input v-model="form.precio" type="number" />
            </div>
            <div class="form-row">
              <label>Ubicación</label>
              <input v-model="form.ubicacion" />
            </div>
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn-guardar" :disabled="subiendoImagen">Guardar</button>
            <button type="button" class="btn-cancelar" @click="cerrarModal">Cancelar</button>
            <span v-if="subiendoImagen" style="margin-left:1rem;color:#007bff;font-weight:bold;">Subiendo imagen...</span>
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
      previewImg: '',
      subiendoImagen: false,
      fileName: '',
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
    abrirModal(rep = null) {
      if (rep) {
        this.editando = true;
        this.form = { ...rep };
        this.previewImg = rep.imagen || '';
        this.fileName = '';
        if (!this.form.imagen && rep.imagen) {
          this.form.imagen = rep.imagen;
        }
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
          imagen: ''
        };
        this.previewImg = '';
        this.fileName = '';
      }
      this.showModal = true;
    },
    cerrarModal() {
      this.showModal = false;
    },
    async onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.fileName = file.name;
      this.subiendoImagen = true;
      this.previewImg = URL.createObjectURL(file);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'autoparts_repuestos'); 
      try {
        const res = await fetch('https://api.cloudinary.com/v1_1/dwqtxkizy/image/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.secure_url) {
          this.form.imagen = data.secure_url;
        } else {
          alert('Error al subir la imagen.');
        }
      } catch (error) {
        alert('Error de red al subir la imagen.');
      }
      this.subiendoImagen = false;
    },
    async guardar() {
      const repuestoData = {
        nombre: this.form.nombre,
        marca: this.form.marca,
        modelo: this.form.modelo,
        año: this.form.año,
        estado: this.form.estado,
        cantidad: this.form.cantidad,
        precio: this.form.precio,
        ubicacion: this.form.ubicacion,
        imagen: this.form.imagen || ''
      };
      if (this.editando) {
        // UPDATE
        await fetch(`http://localhost:3000/api/repuestos/${this.form._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(repuestoData)
        });
      } else {
        // CREATE
        await fetch('http://localhost:3000/api/repuestos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(repuestoData)
        });
      }
      this.cerrarModal();
      this.cargarRepuestos();
    },
    async eliminar(id) {
      if (confirm('¿Estás seguro de eliminar este repuesto?')) {
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
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.admin-header h1 {
  font-size: 24px;
  margin: 0;
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
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
.form-row-pair {
  display: flex;
  gap: 1.2rem;
}
.form-row {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
}
.form-row label {
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #1e3c72;
  letter-spacing: 0.5px;
}
.form-row input {
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: 1.5px solid #42b983;
  font-size: 1.05rem;
  background: #f8fafc;
  margin-bottom: 0.1rem;
  transition: border 0.18s, box-shadow 0.18s;
}
.form-row input:focus {
  border: 1.5px solid #1e3c72;
  box-shadow: 0 2px 8px #42b98333;
  background: #fff;
}
.form-row-img {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}
.form-row-img label {
  font-weight: 700;
  color: #1e3c72;
  margin-bottom: 0.3rem;
}
.img-preview-wrapper {
  margin-top: 0.5rem;
}
.img-preview {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px;
  border: 1.5px solid #42b98344;
  box-shadow: 0 2px 8px #42b98322;
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
.custom-file-input-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}
.custom-file-input-wrapper input[type="file"] {
  opacity: 0;
  width: 100%;
  height: 40px;
  position: absolute;
  left: 0;
  top: 0;
  cursor: pointer;
  z-index: 2;
}
.custom-file-label {
  display: block;
  width: 100%;
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: 1.5px solid #42b983;
  background: #f8fafc;
  color: #1e3c72;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  transition: border 0.18s, box-shadow 0.18s, background 0.18s;
  z-index: 1;
  text-align: left;
}
.custom-file-input-wrapper input[type="file"]:focus + .custom-file-label,
.custom-file-label:active {
  border: 1.5px solid #1e3c72;
  box-shadow: 0 2px 8px #42b98333;
  background: #fff;
}
@media (max-width: 700px) {
  .modal-form {
    padding: 1.2rem 0.5rem;
  }
  .form-row-pair {
    flex-direction: column;
    gap: 0.7rem;
  }
}
</style>