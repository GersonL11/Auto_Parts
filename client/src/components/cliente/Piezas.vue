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
              <img v-if="pieza.imagen" :src="pieza.imagen" :alt="pieza.nombre" class="amazon-card-img" />
              <img v-else src="/images/placeholder.png" alt="Sin imagen" class="amazon-card-img" />
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
      <div class="pieza-modal pieza-modal-elegante pieza-modal-masiso">
        <button class="pieza-modal-close" @click="piezaSeleccionada = null"><i class="fas fa-times"></i></button>
        <div class="pieza-modal-img-wrap-masiso">
          <img v-if="piezaSeleccionada.imagen" :src="piezaSeleccionada.imagen" :alt="piezaSeleccionada.nombre" class="pieza-modal-img" />
          <img v-else src="/images/placeholder.png" alt="Sin imagen" class="pieza-modal-img" />
        </div>
        <h3 class="pieza-modal-title masiso-title"><i class="fas fa-tools"></i> {{ piezaSeleccionada.nombre }}</h3>
        <div class="pieza-modal-cat elegante-cat masiso-cat">
          <span><i class="fas fa-industry"></i> {{ piezaSeleccionada.marca }}</span>
          <span v-if="piezaSeleccionada.modelo"><i class="fas fa-car"></i> {{ piezaSeleccionada.modelo }}</span>
          <span v-if="piezaSeleccionada.año"><i class="fas fa-calendar"></i> {{ piezaSeleccionada.año }}</span>
        </div>
        <div class="pieza-modal-desc elegante-desc masiso-desc">
          <div><i class="fas fa-boxes"></i> <b>Stock:</b> {{ piezaSeleccionada.cantidad }}</div>
          <div><i class="fas fa-globe"></i> <b>País de fabricación:</b> {{ piezaSeleccionada.paisFabricacion }}</div>
        </div>
        <div class="pieza-modal-precio-row masiso-precio-row">
          <div class="pieza-modal-precio elegante-precio masiso-precio">
            <i class="fas fa-money-bill-wave"></i> <span>Precio unitario:</span> <b>L {{ piezaSeleccionada.precio ? piezaSeleccionada.precio.toLocaleString() : '0' }}</b>
          </div>
          <div class="pieza-modal-cantidad-row masiso-cantidad-row">
            <button class="cantidad-btn masiso-cantidad-btn" @click="cambiarCantidad(-1)" :disabled="cantidadAgregar <= 1"><i class="fas fa-minus"></i></button>
            <span class="cantidad-num masiso-cantidad-num">{{ cantidadAgregar }}</span>
            <button class="cantidad-btn masiso-cantidad-btn" @click="cambiarCantidad(1)" :disabled="cantidadAgregar >= piezaSeleccionada.cantidad"><i class="fas fa-plus"></i></button>
          </div>
          <div class="pieza-modal-total-precio masiso-total-precio">
            <i class="fas fa-calculator"></i> <span>Total:</span> <b>L {{ totalAgregar.toLocaleString() }}</b>
          </div>
        </div>
        <div class="pieza-modal-btn-row masiso-btn-row">
          <button class="pieza-btn pieza-modal-btn elegante-btn masiso-btn" @click="agregarAlCarrito(piezaSeleccionada, cantidadAgregar)">
            <i class="fas fa-cart-plus"></i> Agregar al carrito
          </button>
        </div>
      </div>
    </div>
    <!-- Toasts apilados -->
    <transition-group name="toast-stack-fade" tag="div" class="toast-stack-bottom-right">
      <div v-for="toast in toasts" :key="toast.id" :class="['toast-stack-snackbar', 'toast-blur', toast.type === 'error' ? 'toast-error' : '']" @click="removeToast(toast.id)">
        <span class="toast-check" v-if="toast.type !== 'error'" aria-hidden="true">✔</span>
        <span class="toast-error-icon" v-else aria-hidden="true">✖</span>
        <span>{{ toast.msg }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script>
import AppHeader from './AppHeader.vue'
import PageBreadcrumb from './PageBreadcrumb.vue'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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
      piezasPorPagina: 12,
      piezaSeleccionada: null,
      loading: true,
      cantidadAgregar: 1,
      toastMsg: '',
      categorias: [
        { nombre: 'Motor y Transmisión', icon: 'fas fa-cogs' },
        { nombre: 'Suspensión y Frenos', icon: 'fas fa-car-side' },
        { nombre: 'Luces', icon: 'fas fa-lightbulb' },
        { nombre: 'Eléctrico', icon: 'fas fa-bolt' },
        { nombre: 'Interior', icon: 'fas fa-chair' },
      ],
      piezas: [],
      toasts: [], // array de toasts apilados
      nextToastId: 1, // ID para el siguiente toast
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
            (p.paisFabricacion && p.paisFabricacion.toLowerCase().includes(s))
        )
      }
      // Filtrar piezas con stock mayor a 0
      piezas = piezas.filter(p => Number(p.cantidad) > 0)
      return piezas
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredPiezas.length / this.piezasPorPagina))
    },
    paginatedPiezas() {
      const start = (this.pagina - 1) * this.piezasPorPagina
      return this.filteredPiezas.slice(start, start + this.piezasPorPagina)
    },
    totalAgregar() {
      return this.piezaSeleccionada ? (this.piezaSeleccionada.precio || 0) * this.cantidadAgregar : 0;
    },
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
    cambiarCantidad(delta) {
      if (!this.piezaSeleccionada) return;
      const max = this.piezaSeleccionada.cantidad || 1;
      let nueva = this.cantidadAgregar + delta;
      if (nueva < 1) nueva = 1;
      if (nueva > max) nueva = max;
      this.cantidadAgregar = nueva;
    },
    agregarAlCarrito(pieza, cantidad = 1) {
      if (!this.usuario) {
        this.$emit('show-login');
        return;
      }
      let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
      const idx = carrito.findIndex(item => item._id === pieza._id);
      let cantidadActual = idx !== -1 ? carrito[idx].cantidad : 0;
      if (cantidadActual >= pieza.cantidad) {
        this.addToast(`Ya tienes el máximo permitido de "${pieza.nombre}" en el carrito.`, 'error');
        return;
      }
      let cantidadAgregar = Math.min(cantidad, pieza.cantidad - cantidadActual);
      if (idx !== -1) {
        carrito[idx].cantidad += cantidadAgregar;
      } else {
        carrito.push({
          _id: pieza._id,
          nombre: pieza.nombre,
          precio: pieza.precio,
          img: pieza.imagen,
          cantidad: cantidadAgregar,
          maxCantidad: pieza.cantidad,
        });
      }
      localStorage.setItem('carrito', JSON.stringify(carrito));
      this.$emit('carrito-actualizado', carrito);
      window.dispatchEvent(new Event('carrito-actualizado'));
      this.piezaSeleccionada = null;
      this.cantidadAgregar = 1;
      this.addToast(`"${pieza.nombre}" agregado al carrito`, 'success');
    },
    addToast(msg, type = 'success') {
      const id = uuidv4();
      this.toasts.unshift({ id, msg, type }); // el más nuevo arriba
      setTimeout(() => {
        this.removeToast(id);
      }, 4000);
    },
    removeToast(id) {
      this.toasts = this.toasts.filter(t => t.id !== id);
    },
    showDetalle(pieza) {
      this.piezaSeleccionada = pieza;
      this.cantidadAgregar = 1;
    },
    categoriaIcono(cat) {
      const c = this.categorias.find(c => c.nombre === cat)
      return c ? c.icon : 'fas fa-cube'
    },
    solicitarPieza(pieza) {
      alert(`¡Solicitud enviada para: ${pieza.nombre}!`)
      this.piezaSeleccionada = null
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
    },
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
/* --- ESTILO MODAL ELEGANTE --- */
.pieza-modal-elegante {
  background: linear-gradient(135deg, #fafdff 60%, #e3f6ff 100%);
  border-radius: 32px;
  box-shadow: 0 12px 48px #00eaff44, 0 2px 8px #1e3c7211;
  padding: 2.7rem 2.7rem 2.2rem 2.7rem;
  min-width: 340px;
  max-width: 98vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  animation: fadeInSoft 0.3s;
  border: 2.5px solid #00eaff33;
}
.elegante-img {
  width: 180px;
  height: 180px;
  border-radius: 18px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 24px #00eaff22;
  background: #fff;
}
.pieza-modal-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: #232b36;
  margin-bottom: 0.7rem;
  letter-spacing: 1.2px;
  text-align: center;
}
.elegante-cat {
  color: #42b983;
  font-size: 1.08rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  justify-content: center;
}
.elegante-desc {
  color: #7a8ca3;
  font-size: 1.08rem;
  margin-bottom: 1.1rem;
  text-align: center;
}
.pieza-modal-precio-row {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
}
.elegante-precio {
  color: #00bcd4;
  font-size: 1.18rem;
  font-weight: 900;
  margin-bottom: 0.2rem;
  text-align: center;
}
.pieza-modal-cantidad-row {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 0.2rem;
}
.cantidad-btn {
  background: #eaf6ff;
  color: #42b983;
  border: none;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  font-size: 1.3rem;
  font-weight: 900;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 8px #42b98322;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cantidad-btn:disabled {
  background: #e0e0e0;
  color: #b0bec5;
  cursor: not-allowed;
}
.cantidad-num {
  font-size: 1.25rem;
  font-weight: 900;
  color: #232b36;
  min-width: 2.5em;
  text-align: center;
  display: inline-block;
}
.pieza-modal-total-precio {
  color: #269999;
  font-size: 1.13rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
  text-align: center;
}
.pieza-modal-btn-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 1.2rem;
  justify-content: center;
  margin-top: 0.7rem;
}
.elegante-btn {
  background: linear-gradient(90deg, #232b36 0%, #42b983 100%);
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 0.7rem 2.2rem;
  font-size: 1.13rem;
  font-weight: 900;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  box-shadow: 0 2px 8px #42b98322;
  text-align: center;
  display: block;
}
.elegante-btn:hover {
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
/* --- CARD DETALLES MASISO --- */
.pieza-modal-masiso {
  background: linear-gradient(120deg, #fff 60%, #e0f7fa 100%);
  border-radius: 38px;
  box-shadow: 0 16px 64px #00eaff55, 0 4px 24px #42b98333, 0 1.5px 0 #fff4 inset;
  padding: 2.2rem 2.2rem 2rem 2.2rem;
  min-width: 340px;
  max-width: 410px;
  width: 100%;
  border: 3.5px solid #00eaff44;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeInSoft 0.3s;
}
@media (max-width: 700px) {
  .pieza-modal-masiso {
    min-width: 98vw;
    max-width: 98vw;
    padding: 1rem 0.2rem 0.7rem 0.2rem;
  }
  .pieza-modal-img-wrap-masiso {
    width: 70px;
    height: 70px;
    margin-bottom: 0.5rem;
  }
  .masiso-img {
    width: 50px;
    height: 50px;
  }
  .masiso-title {
    font-size: 1rem;
  }
}
.toast-bottom-right {
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
.toast-bottom-right .snackbar-exito:before {
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
@media (max-width: 500px) {
  .toast-bottom-right {
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
.toast-stack-bottom-right {
  position: fixed;
  right: 36px;
  bottom: 36px;
  z-index: 50000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
  pointer-events: none;
}
.toast-stack-snackbar {
  background: rgba(34, 40, 60, 0.38); /* Fondo semitransparente neutro */
  color: #fff;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 1.08rem;
  font-weight: 600;
  border-radius: 16px;
  box-shadow: 0 4px 24px #00eaff33, 0 2px 8px #1e3c7211;
  padding: 1rem 2rem;
  margin: 0;
  min-width: 240px;
  max-width: 350px;
  text-align: left;
  pointer-events: auto;
  cursor: pointer;
  transition: box-shadow 0.18s, background 0.18s;
  user-select: none;
  opacity: 0.97;
  letter-spacing: 0.5px;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  backdrop-filter: blur(18px) saturate(1.7);
  /* Elimina gradientes o imágenes de fondo */
}
.toast-blur {
  backdrop-filter: blur(18px) saturate(1.7);
}
.toast-stack-snackbar:hover {
  box-shadow: 0 8px 32px #00eaff55, 0 4px 16px #42b98344;
  opacity: 1;
}
.toast-stack-fade-enter-active,
.toast-stack-fade-leave-active {
  transition: all 0.42s cubic-bezier(.4,0,.2,1);
}
.toast-stack-fade-enter-from {
  opacity: 0;
  transform: translateY(32px) scale(0.98);
}
.toast-stack-fade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.toast-stack-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
.toast-stack-fade-leave-to {
  opacity: 0;
  transform: translateY(32px) scale(0.98);
}
@media (max-width: 500px) {
  .toast-stack-bottom-right {
    right: 10px;
    bottom: 10px;
    left: 10px;
    align-items: center;
    gap: 8px;
  }
  .toast-stack-snackbar {
    min-width: 0;
    max-width: 98vw;
    padding: 0.8rem 1rem;
    font-size: 0.98rem;
  }
}
.toast-check {
  color: #42e6a4;
  font-size: 1.35em;
  font-weight: bold;
  margin-right: 0.7em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.3em;
  text-align: center;
  filter: drop-shadow(0 1px 2px #42b98388);
}
.toast-error {
  background: rgba(220, 38, 38, 0.38) !important;
  color: #fff !important;
}
.toast-error-icon {
  color: #ff5a5a;
  font-size: 1.35em;
  font-weight: bold;
  margin-right: 0.7em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.3em;
  text-align: center;
  filter: drop-shadow(0 1px 2px #ff5a5a88);
}
</style>
