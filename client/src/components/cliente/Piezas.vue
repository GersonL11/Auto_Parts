<template>
  <div class="piezas-page fade-in">
    <AppHeader
      :current="'parts'"
      :usuario="usuario"
      @show-login="$emit('show-login')"
      @show-about="$emit('show-about')"
      @go-home="$emit('go-home')"
      @show-contact="$emit('show-contact')"
      @show-parts="$emit('show-parts')"
    />
    <PageBreadcrumb
      title="Catálogo de Piezas"
      :subtitle="categoria ? 'Categoría: ' + categoria : 'Explora todas las piezas disponibles'"
    />
    <section class="piezas-hero">
      <h2 class="piezas-title">Catálogo de Piezas</h2>
      <div class="piezas-search-bar">
        <input
          v-model="search"
          type="text"
          placeholder="Buscar pieza, marca, modelo, año, ubicación..."
          class="piezas-search-input"
          @keyup.enter="buscar"
        />
        <button class="piezas-search-btn" @click="buscar"><i class="fas fa-search"></i></button>
      </div>
      <div class="piezas-categorias">
        <button
          v-for="cat in categorias"
          :key="cat.nombre"
          :class="['piezas-categoria-btn', { active: categoria === cat.nombre }]"
          @click="setCategoria(cat.nombre)"
        >
          <i :class="cat.icon"></i>
          {{ cat.nombre }}
        </button>
        <button
          class="piezas-categoria-btn"
          :class="{ active: categoria === '' }"
          @click="setCategoria('')"
        >
          <i class="fas fa-th-large"></i>
          Todas
        </button>
      </div>
    </section>
    <section class="piezas-cards-section">
      <div v-if="loading" class="piezas-loading">
        <i class="fas fa-cog fa-spin"></i> Cargando piezas...
      </div>
      <div v-else :class="{ 'blurred-bg': piezaSeleccionada }">
        <div v-if="filteredPiezas.length === 0" class="piezas-no-results">
          No se encontraron piezas.
        </div>
        <div class="amazon-style-cards">
          <div
            v-for="pieza in paginatedPiezas"
            :key="pieza._id"
            class="amazon-card"
            @click="showDetalle(pieza)"
            tabindex="0"
            @keyup.enter="showDetalle(pieza)"
          >
            <div class="amazon-card-img-wrap">
              <img :src="pieza.imagen || require('../../assets/Piezas/alternador.jpg')" :alt="pieza.nombre" class="amazon-card-img" />
            </div>
            <div class="amazon-card-body">
              <div class="amazon-card-title-row">
                <h3 class="amazon-card-title">{{ pieza.nombre }}</h3>
                <button
                  class="amazon-card-eye-btn"
                  @click.stop="showDetalle(pieza)"
                  title="Ver detalle"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </div>
              <div class="amazon-card-brand">
                <span v-if="pieza.marca">{{ pieza.marca }}</span>
                <span v-if="pieza.modelo">/ {{ pieza.modelo }}</span>
                <span v-if="pieza.año">/ {{ pieza.año }}</span>
              </div>
              <div class="amazon-card-desc">
                <span v-if="pieza.ubicacion"><i class="fas fa-map-marker-alt"></i> {{ pieza.ubicacion }}</span>
                <span v-if="pieza.cantidad">| <i class="fas fa-boxes"></i> {{ pieza.cantidad }} disp.</span>
              </div>
              <div class="amazon-card-cart-row">
                <button class="amazon-card-btn" @click.stop="agregarAlCarrito(pieza)">
                  <i class="fas fa-cart-plus"></i> Agregar al carrito
                </button>
              </div>
              <div class="amazon-card-price-row">
                <span class="amazon-card-price">L {{ pieza.precio ? pieza.precio.toLocaleString() : '0' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="totalPages > 1" class="piezas-pagination">
          <button :disabled="pagina === 1" @click="pagina--">&lt;</button>
          <span>Página {{ pagina }} de {{ totalPages }}</span>
          <button :disabled="pagina === totalPages" @click="pagina++">&gt;</button>
        </div>
      </div>
    </section>
    <div v-if="piezaSeleccionada" class="pieza-modal-bg" @click.self="piezaSeleccionada = null">
      <div class="pieza-modal">
        <button class="pieza-modal-close" @click="piezaSeleccionada = null"><i class="fas fa-times"></i></button>
        <img :src="piezaSeleccionada.imagen || require('../../assets/Piezas/alternador.jpg')" :alt="piezaSeleccionada.nombre" class="pieza-modal-img" />
        <h3><i class="fas fa-tools"></i> {{ piezaSeleccionada.nombre }}</h3>
        <div class="pieza-modal-cat">
          <i class="fas fa-industry"></i> {{ piezaSeleccionada.marca }}
          <span v-if="piezaSeleccionada.modelo"><i class="fas fa-car"></i> {{ piezaSeleccionada.modelo }}</span>
          <span v-if="piezaSeleccionada.año"><i class="fas fa-calendar"></i> {{ piezaSeleccionada.año }}</span>
        </div>
        <div class="pieza-modal-desc">
          <div><i class="fas fa-boxes"></i> <b>Cantidad:</b> {{ piezaSeleccionada.cantidad }}</div>
          <div><i class="fas fa-map-marker-alt"></i> <b>Ubicación:</b> {{ piezaSeleccionada.ubicacion }}</div>
        </div>
        <div class="pieza-modal-precio">
          <i class="fas fa-money-bill-wave"></i> Precio: <b>L {{ piezaSeleccionada.precio ? piezaSeleccionada.precio.toLocaleString() : '0' }}</b>
        </div>
        <button class="pieza-btn pieza-modal-btn" @click="agregarAlCarrito(piezaSeleccionada)">
          <i class="fas fa-cart-plus"></i> Agregar al carrito
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from './AppHeader.vue'
import PageBreadcrumb from './PageBreadcrumb.vue'

export default {
  name: 'CatalogoPiezas',
  components: { AppHeader, PageBreadcrumb },
  props: {
    categoriaInicial: {
      type: String,
      default: ''
    },
    usuario: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      search: '',
      categoria: '',
      pagina: 1,
      piezasPorPagina: 6,
      piezaSeleccionada: null,
      loading: true,
      categorias: [
        { nombre: 'Motor y Transmisión', icon: 'fas fa-cogs' },
        { nombre: 'Suspensión y Frenos', icon: 'fas fa-car-side' },
        { nombre: 'Luces', icon: 'fas fa-lightbulb' },
        { nombre: 'Eléctrico', icon: 'fas fa-bolt' },
        { nombre: 'Interior', icon: 'fas fa-chair' },
      ],
      piezas: []
    }
  },
  computed: {
    filteredPiezas() {
      let piezas = this.piezas
      if (this.categoria) {
        piezas = piezas.filter(p => p.categoria === this.categoria)
      }
      if (this.search.trim()) {
        const s = this.search.trim().toLowerCase()
        piezas = piezas.filter(
          p =>
            (p.nombre && p.nombre.toLowerCase().includes(s)) ||
            (p.marca && p.marca.toLowerCase().includes(s)) ||
            (p.modelo && p.modelo.toString().toLowerCase().includes(s)) ||
            (p.año && p.año.toString().includes(s)) ||
            (p.estado && p.estado.toLowerCase().includes(s)) ||
            (p.ubicacion && p.ubicacion.toLowerCase().includes(s))
        )
      }
      return piezas
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredPiezas.length / this.piezasPorPagina))
    },
    paginatedPiezas() {
      const start = (this.pagina - 1) * this.piezasPorPagina
      return this.filteredPiezas.slice(start, start + this.piezasPorPagina)
    }
  },
  watch: {
    categoriaInicial: {
      immediate: true,
      handler(val) {
        if (val) {
          this.categoria = val;
        }
      }
    },
    categoria() {
      this.pagina = 1
    },
    search() {
      this.pagina = 1
    }
  },
  methods: {
    setCategoria(cat) {
      this.categoria = cat
    },
    buscar() {
      this.pagina = 1
    },
    showDetalle(pieza) {
      this.piezaSeleccionada = pieza
    },
    categoriaIcono(cat) {
      const c = this.categorias.find(c => c.nombre === cat)
      return c ? c.icon : 'fas fa-cube'
    },
    solicitarPieza(pieza) {
      alert(`¡Solicitud enviada para: ${pieza.nombre}!`)
      this.piezaSeleccionada = null
    },
    agregarAlCarrito(pieza) {
      if (!this.usuario) {
        this.$emit('show-login');
        return;
      }
      let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
      const idx = carrito.findIndex(item => item._id === pieza._id);
      if (idx !== -1) {
        if (carrito[idx].cantidad < pieza.cantidad) {
          carrito[idx].cantidad += 1;
        }
      } else {
        carrito.push({
          _id: pieza._id,
          nombre: pieza.nombre,
          precio: pieza.precio,
          img: pieza.imagen,
          cantidad: 1,
          maxCantidad: pieza.cantidad,
        });
      }
      localStorage.setItem('carrito', JSON.stringify(carrito));
      // Emite el carrito completo, no solo el total
      this.$emit('carrito-actualizado', carrito);
      // Notifica a toda la app para actualizar el badge en tiempo real
      window.dispatchEvent(new Event('carrito-actualizado'));
      alert(`"${pieza.nombre}" agregado al carrito`);
    },
    async cargarPiezas() {
      this.loading = true
      try {
        const res = await fetch('http://localhost:3000/api/repuestos')
        const data = await res.json()
        this.piezas = data
      } catch (e) {
        this.piezas = []
      }
      this.loading = false
    }
  },
  mounted() {
    this.cargarPiezas()
  }
}
</script>

<style scoped>
.piezas-page {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  font-family: 'Orbitron', 'Segoe UI', Arial, sans-serif;
  overflow-x: hidden;
}
/* --- efecto de aparición --- */
.fade-in {
  animation: fadeInSoft 0.7s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeInSoft {
  from {
    opacity: 0;
    transform: translateY(32px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.piezas-hero {
  padding-top: 90px;
  padding-bottom: 1.5rem;
  background: linear-gradient(90deg, #00eaff11 0%, #42b98311 100%);
  text-align: center;
}
.piezas-title {
  font-size: 2.2rem;
  font-weight: 900;
  color: #232b36;
  margin-bottom: 1.2rem;
  letter-spacing: 1.5px;
}
.piezas-search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
}
.piezas-search-input {
  width: 320px;
  max-width: 100%; /* antes: 90vw */
  padding: 0.7rem 1.2rem;
  border-radius: 18px;
  border: 1.5px solid #00eaff;
  font-size: 1.08rem;
  font-family: inherit;
  outline: none;
  transition: border 0.18s;
}
.piezas-search-input:focus {
  border: 1.5px solid #42b983;
}
.piezas-search-btn {
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 18px;
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 8px #42b98333;
}
.piezas-search-btn:hover {
  background: #00eaff;
}
.piezas-categorias {
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.piezas-categoria-btn {
  background: linear-gradient(90deg, #232b36 0%, #3a4250 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 0.5rem 1.5rem;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.13s;
  box-shadow: 0 2px 8px #42b98322;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.piezas-categoria-btn.active,
.piezas-categoria-btn:hover {
  background: linear-gradient(90deg, #3a4250 0%, #42b983 100%);
  color: #fff;
  box-shadow: 0 4px 16px #42b98333;
  transform: translateY(-1px) scale(1.03);
}
.piezas-cards-section {
  flex: 1 1 auto;
  padding: 2rem 0 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.piezas-loading {
  color: #42b983;
  font-size: 1.3rem;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.piezas-no-results {
  color: #b0bec5;
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
.piezas-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  /* Asegura que las tarjetas estén alineadas */
  align-items: stretch;
}
.pieza-card {
  background: linear-gradient(135deg, #fafdff 60%, #e3f6ff 100%);
  border-radius: 22px;
  box-shadow: 0 4px 24px #00eaff22, 0 2px 8px #1e3c7211;
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  width: 260px;
  min-width: 260px;
  max-width: 260px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  height: 370px; /* Alto fijo para todas las tarjetas */
  min-height: 370px;
  max-height: 370px;
  transition: box-shadow 0.2s, transform 0.2s;
  border-bottom: 4px solid #00eaff;
  border-top: none;
  text-align: center;
  cursor: pointer;
  position: relative;
  /* Para que el botón quede abajo */
  box-sizing: border-box;
}
.pieza-card:hover {
  box-shadow: 0 8px 32px #00eaff44, 0 4px 16px #42b98333;
  transform: translateY(-6px) scale(1.04);
  border-bottom: 4px solid #42b983;
}
.pieza-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: #fff;
  box-shadow: 0 2px 8px #00eaff22;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.pieza-info {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.4rem;
  width: 100%;
  flex: 1 1 auto;
  justify-content: flex-end;
  min-height: 120px;
  /* Para empujar el botón hacia abajo */
  flex-grow: 1;
}
.pieza-nombre {
  font-size: 1.18rem;
  font-weight: 900;
  color: #232b36;
  margin-bottom: 0.2rem;
}
.pieza-categoria {
  font-size: 0.97rem;
  color: #42b983;
  font-weight: 700;
  margin-bottom: 0.2rem;
}
.pieza-desc {
  color: #7a8ca3;
  font-size: 0.98rem;
  margin-bottom: 0.2rem;
}
.pieza-precio {
  color: #00bcd4;
  font-size: 1.13rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}
.pieza-btn {
  background: linear-gradient(90deg, #232b36 0%, #42b983 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 0.5rem 1.5rem;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  margin-top: auto;
  /* El botón siempre abajo */
  width: 100%;
  text-align: center;
  display: block;
  box-sizing: border-box;
  box-shadow: 0 2px 8px #42b98322;
  margin-left: auto;
  margin-right: auto;
}
.pieza-btn:hover,
.pieza-modal-btn:hover {
  background: linear-gradient(90deg, #42b983 0%, #00eaff 100%);
  color: #fff;
  box-shadow: 0 4px 16px #42b98333;
}
.piezas-pagination {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  justify-content: center;
  margin: 2rem 0 0 0;
}
.piezas-pagination button {
  background: #eaf6ff;
  color: #232b36;
  border: none;
  border-radius: 10px;
  padding: 0.4rem 1.2rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
.piezas-pagination button:disabled {
  background: #e0e0e0;
  color: #b0bec5;
  cursor: not-allowed;
}
.pieza-modal-bg {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(35,43,54,0.55);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInSoft 0.3s;
}
.pieza-modal {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 8px 32px #00eaff44, 0 2px 8px #1e3c7211;
  padding: 2.2rem 2.2rem 1.5rem 2.2rem;
  min-width: 320px;
  max-width: 100%; /* antes: 95vw */
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  animation: fadeInSoft 0.3s;
}
.pieza-modal-close {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #b0bec5;
  cursor: pointer;
  transition: color 0.18s;
}
.pieza-modal-close:hover {
  color: #ff9800;
}
.pieza-modal-img {
  width: 160px;
  height: 160px;
  object-fit: contain;
  border-radius: 14px;
  margin-bottom: 1.2rem;
  background: #fff;
  box-shadow: 0 2px 8px #00eaff22;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.pieza-modal-cat {
  color: #42b983;
  font-size: 1.08rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}
.pieza-modal-desc {
  color: #7a8ca3;
  font-size: 1.08rem;
  margin-bottom: 0.7rem;
  text-align: center;
}
.pieza-modal-precio {
  color: #00bcd4;
  font-size: 1.18rem;
  font-weight: 900;
  margin-bottom: 1.2rem;
  text-align: center;
}
.pieza-modal-btn {
  margin-top: 0.7rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}
.pieza-icon-row {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  color: #42b983;
}
.pieza-nombre i,
.pieza-categoria i,
.pieza-precio i,
.pieza-desc i,
.pieza-modal-cat i,
.pieza-modal-desc i,
.pieza-modal-precio i {
  margin-right: 0.3em;
  color: #00bcd4;
}
.pieza-btn i,
.pieza-modal-btn i {
  margin-right: 0.5em;
}
.amazon-style-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 2.2rem;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  max-width: 1200px;
}
.amazon-card {
  background: #fff;
  border-radius: 18px;
  border: 1.5px solid #e0e0e0;
  box-shadow: 0 4px 24px #00eaff22, 0 2px 8px #1e3c7211;
  width: 260px;
  min-width: 260px;
  max-width: 260px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  transition: box-shadow 0.2s, transform 0.2s, border 0.2s;
  cursor: pointer;
  position: relative;
  margin-bottom: 1.5rem;
  overflow: hidden;
  border-bottom: 4px solid #00eaff;
}
.amazon-card:hover {
  box-shadow: 0 8px 32px #00eaff44, 0 4px 16px #42b98333;
  transform: translateY(-6px) scale(1.04);
  border-bottom: 4px solid #42b983;
  border-color: #42b983;
}
.amazon-card-img-wrap {
  width: 100%;
  background: linear-gradient(135deg, #fafdff 60%, #e3f6ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem 0.5rem 0.5rem 0.5rem;
  min-height: 140px;
}
.amazon-card-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px #00eaff22;
  display: block;
  margin: 0 auto;
}
.amazon-card-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.7rem 1rem 1.2rem 1rem;
  flex: 1 1 auto;
  justify-content: flex-end;
}
.amazon-card-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5em;
}
.amazon-card-title {
  font-size: 1.13rem;
  font-weight: 900;
  color: #232b36;
  margin-bottom: 0.2rem;
  text-align: left;
  min-height: 2.2em;
  display: flex;
  align-items: center;
  gap: 0.5em;
  flex: 1 1 auto;
}
.amazon-card-eye-btn {
  background: #f5f5f5;
  color: #42b983;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 2px 8px #42b98322;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  z-index: 2;
  margin-left: 0.5em;
}
.amazon-card-eye-btn:hover {
  background: #42b983;
  color: #fff;
  box-shadow: 0 4px 16px #42b98333;
}
.amazon-card-brand {
  font-size: 0.97rem;
  color: #42b983;
  font-weight: 700;
  margin-bottom: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.5em;
  flex-wrap: wrap;
}
.amazon-card-desc {
  color: #7a8ca3;
  font-size: 0.98rem;
  margin-bottom: 0.2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  align-items: center;
}
.amazon-card-desc i {
  color: #ff9800;
  margin-right: 0.2em;
}
.amazon-card-cart-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.7rem;
}
.amazon-card-btn {
  background: linear-gradient(90deg, #42b983 0%, #00eaff 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 0.5rem 1.2rem;
  font-size: 1.01rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 8px #42b98322;
  display: flex;
  align-items: center;
  gap: 0.5em;
  width: 100%;
  justify-content: center;
}
.amazon-card-btn:hover {
  background: linear-gradient(90deg, #00eaff 0%, #42b983 100%);
  color: #fff;
  box-shadow: 0 4px 16px #42b98333;
}
.amazon-card-price-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;
}
.amazon-card-price {
  color: #00bcd4;
  font-size: 1.18rem;
  font-weight: 900;
  letter-spacing: 1px;
  background: #f5f5f5;
  border-radius: 10px;
  padding: 0.3em 1em;
  display: inline-block;
}
@media (max-width: 1200px) {
  .amazon-style-cards {
    gap: 1.2rem;
    max-width: 100%;
  }
  .amazon-card {
    width: 220px;
    min-width: 220px;
    max-width: 220px;
  }
}
@media (max-width: 900px) {
  .amazon-style-cards {
    gap: 1rem;
    max-width: 100%;
  }
  .amazon-card {
    width: 180px;
    min-width: 180px;
    max-width: 180px;
  }
}
@media (max-width: 700px) {
  .amazon-style-cards {
    flex-direction: column;
    align-items: center;
    gap: 0.7rem;
    max-width: 100%;
  }
  .amazon-card {
    width: 98vw;
    min-width: 98vw;
    max-width: 98vw;
  }
  .amazon-card-img {
    width: 80px;
    height: 80px;
  }
}
.modern-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  justify-items: center;
}
.modern-card {
  background: #fff;
  border-radius: 18px;
  border: 1.5px solid #e0e0e0;
  box-shadow: 0 4px 24px #00eaff22, 0 2px 8px #1e3c7211;
  width: 100%;
  max-width: 260px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transition: box-shadow 0.2s, transform 0.2s, border 0.2s;
  cursor: pointer;
  position: relative;
  margin-bottom: 1.5rem;
  overflow: hidden;
  border-bottom: 4px solid #00eaff;
}
.modern-card:hover {
  box-shadow: 0 8px 32px #00eaff44, 0 4px 16px #42b98333;
  transform: translateY(-6px) scale(1.04);
  border-bottom: 4px solid #42b983;
  border-color: #42b983;
}
.modern-card-img-wrap {
  width: 100%;
  background: linear-gradient(135deg, #fafdff 60%, #e3f6ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem 0.5rem 0.5rem 0.5rem;
  min-height: 140px;
  position: relative;
}
.modern-card-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px #00eaff22;
  display: block;
  margin: 0 auto;
}
.modern-card-eye-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #fff;
  color: #42b983;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: 0 2px 8px #42b98322;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  z-index: 2;
}
.modern-card-eye-btn:hover {
  background: #42b983;
  color: #fff;
  box-shadow: 0 4px 16px #42b98333;
}
.modern-card-price-cart-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.7rem;
  gap: 0.7em;
}
.modern-card-price {
  color: #00bcd4;
  font-size: 1.18rem;
  font-weight: 900;
  letter-spacing: 1px;
}
.modern-card-cart-btn {
  background: linear-gradient(90deg, #42b983 0%, #00eaff 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 0.5rem 1.2rem;
  font-size: 1.01rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 8px #42b98322;
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.modern-card-cart-btn:hover {
  background: linear-gradient(90deg, #00eaff 0%, #42b983 100%);
  color: #fff;
  box-shadow: 0 4px 16px #42b98333;
}
@media (max-width: 1200px) {
  .modern-grid {
    gap: 1.2rem;
    max-width: 100%;
  }
  .modern-card {
    max-width: 220px;
  }
}
@media (max-width: 900px) {
  .modern-grid {
    gap: 1rem;
    max-width: 100%;
  }
  .modern-card {
    max-width: 180px;
  }
}
@media (max-width: 700px) {
  .modern-grid {
    grid-template-columns: 1fr;
    gap: 0.7rem;
    max-width: 100%;
  }
  .modern-card {
    max-width: 98vw;
  }
  .modern-card-img {
    width: 80px;
    height: 80px;
  }
}
.info-btn {
  background: linear-gradient(90deg, #00eaff 0%, #42b983 100%);
  color: #fff !important;
  margin-left: 0.5em;
  font-weight: 700;
}
.info-btn:hover {
  background: linear-gradient(90deg, #42b983 0%, #00eaff 100%);
  color: #fff !important;
}
.ia-loading {
  margin-top: 1rem;
  color: #00bcd4;
  font-weight: bold;
  text-align: center;
}
.ia-info {
  margin-top: 1rem;
  background: #e0f7fa;
  color: #232b36;
  border-radius: 10px;
  padding: 1rem;
  font-size: 1.01rem;
  text-align: left;
  box-shadow: 0 2px 8px #00eaff22;
  max-height: 220px;
  overflow-y: auto;
}
.modern-card-badge,
.modern-card-badge.ia-badge {
  display: none !important;
}
.blurred-bg {
  filter: blur(6px) brightness(0.93);
  pointer-events: none;
  user-select: none;
  transition: filter 0.25s;
}
</style>
