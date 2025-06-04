<template>
  <div class="compras-cliente-overlay" @click.self="$emit('close')">
    <div class="compras-cliente-modal">
      <div class="compras-cliente-header">
        <span class="compras-header-icon"><i class="fas fa-shopping-bag"></i></span>
        <span class="compras-header-title">Mis compras</span>
        <button class="compras-cliente-close" @click="$emit('close')">&times;</button>
      </div>
      <div class="compras-cliente-filtros">
        <div class="filtros-row">
          <label class="filtro-label">
            <span class="filtro-label-title">Desde</span>
            <input type="date" v-model="filtros.fechaInicio" />
          </label>
          <label class="filtro-label">
            <span class="filtro-label-title">Hasta</span>
            <input type="date" v-model="filtros.fechaFin" />
          </label>
          <label class="filtro-label">
            <span class="filtro-label-title">Mes</span>
            <select v-model="filtros.mes">
              <option value="">Todos</option>
              <option v-for="m in meses" :key="m.value" :value="m.value">{{ m.text }}</option>
            </select>
          </label>
          <label class="filtro-label">
            <span class="filtro-label-title">Año</span>
            <select v-model="filtros.anio">
              <option value="">Todos</option>
              <option v-for="a in aniosDisponibles" :key="a" :value="a">{{ a }}</option>
            </select>
          </label>
          <button class="filtro-btn" @click="aplicarFiltro"><i class="fas fa-filter"></i> Filtrar</button>
          <button class="filtro-btn limpiar" @click="limpiarFiltro"><i class="fas fa-times"></i></button>
        </div>
      </div>
      <div class="compras-cliente-body compras-scroll">
        <div v-if="loading" class="compras-cliente-loading">Cargando compras...</div>
        <div v-else-if="comprasFiltradas.length === 0" class="compras-cliente-empty">No tienes compras registradas en este periodo.</div>
        <ul v-else class="compras-cliente-list">
          <li v-for="compra in comprasFiltradas" :key="compra._id" class="compras-cliente-item">
            <div class="compra-card-header">
              <span class="compra-fecha"><i class="fas fa-calendar-alt"></i> {{ formatFecha(compra.fecha) }}</span>
              <span class="compra-total"><i class="fas fa-money-bill-wave"></i> <span class="compra-total-label">Total:</span> <span class="compra-total-valor">L {{ compra.total?.toLocaleString() }}</span></span>
            </div>
            <ul class="compra-detalle">
              <li v-for="item in compra.carrito" :key="item._id" class="compra-producto">
                <img
                  class="compra-producto-img"
                  :src="item.img || require('../../assets/Piezas/alternador.jpg')"
                  :alt="item.nombre"
                />
                <div class="compra-producto-info">
                  <span class="compra-producto-nombre">{{ item.nombre }}</span>
                  <span class="compra-producto-cantidad">x{{ item.cantidad }}</span>
                  <span class="compra-producto-precio">L {{ (item.precio * item.cantidad).toLocaleString() }}</span>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComprasCliente',
  props: {
    usuario: { type: Object, default: null }
  },
  data() {
    return {
      compras: [],
      loading: true,
      filtros: {
        fechaInicio: '',
        fechaFin: '',
        mes: '',
        anio: ''
      },
      meses: [
        { value: '01', text: 'Enero' },
        { value: '02', text: 'Febrero' },
        { value: '03', text: 'Marzo' },
        { value: '04', text: 'Abril' },
        { value: '05', text: 'Mayo' },
        { value: '06', text: 'Junio' },
        { value: '07', text: 'Julio' },
        { value: '08', text: 'Agosto' },
        { value: '09', text: 'Septiembre' },
        { value: '10', text: 'Octubre' },
        { value: '11', text: 'Noviembre' },
        { value: '12', text: 'Diciembre' }
      ]
    }
  },
  computed: {
    aniosDisponibles() {
      // Extrae años únicos de las compras
      const anios = this.compras.map(c => new Date(c.fecha).getFullYear());
      return [...new Set(anios)].sort((a, b) => b - a);
    },
    comprasFiltradas() {
      let arr = this.compras;
      // Filtro por año
      if (this.filtros.anio) {
        arr = arr.filter(c => new Date(c.fecha).getFullYear().toString() === this.filtros.anio);
      }
      // Filtro por mes
      if (this.filtros.mes) {
        arr = arr.filter(c => (new Date(c.fecha).getMonth() + 1).toString().padStart(2, '0') === this.filtros.mes);
      }
      // Filtro por rango de fechas
      if (this.filtros.fechaInicio) {
        const inicio = new Date(this.filtros.fechaInicio);
        arr = arr.filter(c => new Date(c.fecha) >= inicio);
      }
      if (this.filtros.fechaFin) {
        const fin = new Date(this.filtros.fechaFin);
        arr = arr.filter(c => new Date(c.fecha) <= fin);
      }
      return arr;
    }
  },
  methods: {
    async cargarCompras() {
      this.loading = true;
      try {
        const res = await fetch(`http://localhost:3000/api/ventas?email=${this.usuario?.correo}`);
        this.compras = await res.json();
      } catch (e) {
        this.compras = [];
      }
      this.loading = false;
    },
    formatFecha(fecha) {
      if (!fecha) return '';
      return new Date(fecha).toLocaleDateString('es-HN', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    aplicarFiltro() {
      // No hace falta nada, el filtro es reactivo
    },
    limpiarFiltro() {
      this.filtros = { fechaInicio: '', fechaFin: '', mes: '', anio: '' };
    }
  },
  mounted() {
    this.cargarCompras();
  }
}
</script>

<style scoped>
.compras-cliente-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(30, 60, 114, 0.10);
  z-index: 30000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(16px) saturate(1.5);
}
.compras-cliente-modal {
  background: rgba(255,255,255,0.18);
  border-radius: 2.5rem;
  box-shadow: 0 16px 64px 0 #1e3c7260, 0 2px 12px #42b98333;
  border: 1.5px solid rgba(66,185,131,0.18);
  padding: 2.7rem 2.2rem 2.2rem 2.2rem;
  max-width: 650px;
  width: 99vw;
  min-height: 540px;
  max-height: 92vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  position: relative;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  animation: fadeInModal 0.5s cubic-bezier(.4,0,.2,1);
  overflow: hidden;
}
.compras-scroll {
  overflow-y: auto;
  max-height: 60vh;
  padding-right: 0.2em;
}
@keyframes fadeInModal {
  from { opacity: 0; transform: scale(0.98);}
  to { opacity: 1; transform: scale(1);}
}
.compras-cliente-header {
  display: flex;
  align-items: center;
  gap: 0.7em;
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 1.2rem;
  letter-spacing: 1px;
}
.compras-header-icon {
  background: linear-gradient(135deg, #42b983 60%, #1e3c72 100%);
  border-radius: 50%;
  padding: 0.45em 0.55em;
  box-shadow: 0 4px 24px #42b98355, 0 1.5px 0 #fff4 inset;
  border: 3.5px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.7em;
}
.compras-header-icon i {
  font-size: 2.1rem;
  color: #fff;
  filter: drop-shadow(0 2px 8px #1e3c7260);
}
.compras-header-title {
  font-size: 1.45rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 1px;
  margin-right: auto;
  text-shadow: 0 2px 8px #1e3c7260;
}
.compras-cliente-close {
  background: rgba(255,255,255,0.7);
  border: none;
  font-size: 2.1rem;
  color: #ff5252;
  cursor: pointer;
  margin-left: auto;
  transition: color 0.18s, background 0.18s, transform 0.18s;
  border-radius: 50%;
  padding: 0.18em 0.5em;
  box-shadow: 0 2px 8px #ff525222;
  z-index: 2;
}
.compras-cliente-close:hover {
  color: #fff;
  background: #ff5252;
  transform: scale(1.12) rotate(8deg);
}
.compras-cliente-filtros {
  margin-bottom: 1.1rem;
  background: rgba(255,255,255,0.13);
  border-radius: 1.2rem;
  box-shadow: 0 2px 8px #42b98322;
  padding: 1rem 1.2rem 0.5rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.filtros-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  align-items: flex-end;
  justify-content: space-between;
}
.filtro-label {
  display: flex;
  flex-direction: column;
  font-size: 1.08em;
  color: #1e3c72;
  font-weight: 800;
  gap: 0.2em;
  min-width: 110px;
}
.filtro-label-title {
  color: #fff;
  font-size: 1.08em;
  font-weight: 900;
  margin-bottom: 0.1em;
  letter-spacing: 0.2px;
  text-shadow: 0 1px 4px #1e3c7260;
}
.filtros-row input[type="date"],
.filtros-row select {
  border-radius: 12px;
  border: 1.5px solid #42b983;
  padding: 0.3em 0.7em;
  font-size: 1em;
  font-family: inherit;
  outline: none;
  margin-top: 0.1em;
  background: #fafdff;
  color: #1e3c72;
  font-weight: 700;
  transition: border 0.18s;
}
.filtros-row input[type="date"]:focus,
.filtros-row select:focus {
  border: 1.5px solid #00eaff;
}
.filtro-btn {
  background: linear-gradient(90deg, #42b983 0%, #00eaff 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 0.5em 1.2em;
  font-size: 1em;
  font-weight: 900;
  cursor: pointer;
  margin-left: 0.2em;
  transition: background 0.18s, box-shadow 0.18s, transform 0.13s;
  box-shadow: 0 2px 8px #42b98322;
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.filtro-btn.limpiar {
  background: #ff5252;
  color: #fff;
  box-shadow: 0 2px 8px #ff525222;
}
.filtro-btn.limpiar:hover {
  background: #fff;
  color: #ff5252;
  border: 1.5px solid #ff5252;
}
.filtro-btn:hover {
  background: linear-gradient(90deg, #00eaff 0%, #42b983 100%);
  color: #fff;
  box-shadow: 0 8px 32px #00eaff55, 0 2px 8px #26999955;
  transform: translateY(-2px) scale(1.09);
}
.compras-cliente-body {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  color: #232b36;
  font-size: 1.08em;
}
.compras-cliente-loading,
.compras-cliente-empty {
  color: #888;
  text-align: center;
  font-size: 1.1rem;
  margin: 2rem 0;
}
.compras-cliente-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}
.compras-cliente-item {
  background: linear-gradient(120deg, #fafdff 80%, #e6f9f3 100%);
  border-radius: 18px;
  box-shadow: 0 4px 24px #00eaff11, 0 1px 4px #42b98311;
  padding: 1.1em 1.1em 0.7em 1.1em;
  border: 2.5px solid #42b98333;
  display: flex;
  flex-direction: column;
  gap: 0.7em;
  margin-bottom: 1.2em;
  transition: box-shadow 0.18s, border 0.18s, transform 0.13s;
  position: relative;
}
.compras-cliente-item:hover {
  box-shadow: 0 12px 36px #00eaff33, 0 2px 8px #1e3c7211;
  border: 2.5px solid #42b983;
  transform: translateY(-2px) scale(1.01);
}
.compra-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.7em;
  gap: 1em;
  border-bottom: 1.5px solid #e0e0e0;
  padding-bottom: 0.4em;
}
.compra-fecha {
  font-size: 1.13em;
  color: #1e3c72;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.5em;
  text-shadow: 0 1px 4px #fff8;
}
.compra-total {
  color: #42b983;
  font-weight: 900;
  font-size: 1.13em;
  display: flex;
  align-items: center;
  gap: 0.5em;
  background: #fafdff;
  border-radius: 8px;
  padding: 0.2em 0.7em;
  box-shadow: 0 1px 4px #42b98311;
}
.compra-total-label {
  color: #1e3c72;
  font-weight: 700;
  margin-right: 0.2em;
}
.compra-total-valor {
  color: #30c16c;
  font-weight: 900;
  font-size: 1.13em;
  margin-left: 0.2em;
  letter-spacing: 0.5px;
}
.compra-detalle {
  list-style: none;
  color: #232b36;
  font-size: 1.01em;
  margin-left: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7em;
}
.compra-producto {
  display: flex;
  align-items: center;
  gap: 0.9em;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 8px #42b98311;
  padding: 0.7em 1em;
  margin-bottom: 0.2em;
  border: 1.5px solid #e0e0e0;
  transition: box-shadow 0.15s, border 0.15s;
}
.compra-producto:not(:last-child) {
  margin-bottom: 0.5em;
}
.compra-producto-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 8px;
  background: #f5f5f5;
  box-shadow: 0 1px 4px #00eaff11;
  border: 1px solid #e0e0e0;
}
.compra-producto-info {
  display: flex;
  flex-direction: column;
  gap: 0.1em;
}
.compra-producto-nombre {
  font-weight: 800;
  color: #1e3c72;
  font-size: 1.08em;
  margin-bottom: 0.1em;
}
.compra-producto-cantidad {
  color: #42b983;
  font-weight: 700;
  font-size: 0.98em;
}
.compra-producto-precio {
  color: #30c16c;
  font-weight: 900;
  font-size: 1.01em;
}
@media (max-width: 900px) {
  .compras-cliente-modal {
    max-width: 99vw;
    min-width: unset;
    padding: 1.2rem 0.5rem 1rem 0.5rem;
  }
  .compras-scroll {
    max-height: 55vh;
  }
}
@media (max-width: 600px) {
  .compras-cliente-modal {
    padding: 1.2rem 0.2rem 1rem 0.2rem;
    max-width: 99vw;
  }
  .compras-cliente-filtros {
    padding: 0.7rem 0.3rem 0.3rem 0.3rem;
  }
  .filtros-row {
    gap: 0.4rem;
  }
  .compras-scroll {
    max-height: 45vh;
  }
}
</style>
