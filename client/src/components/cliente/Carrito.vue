<template>
  <button
    class="carrito-float-btn"
    @click="$emit('open-cart')"
    @mousedown="bump = true"
    @animationend="bump = false"
    :class="{ bump }"
  >
    <span class="carrito-svg">
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
        <circle cx="17" cy="17" r="17" fill="#fff" />
        <g>
          <path d="M9 10h2l2.2 10.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.5l1.3-6.2a1 1 0 0 0-1-1.3H13.1" stroke="#42b983" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          <circle cx="15.5" cy="25" r="1.5" fill="#42b983"/>
          <circle cx="23" cy="25" r="1.5" fill="#42b983"/>
        </g>
      </svg>
    </span>
    <span class="carrito-badge">{{ totalArticulos }}</span>
  </button>
</template>

<script>
export default {
  name: 'CarritoFloatBtn',
  props: {
    totalArticulos: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      bump: false
    }
  }
}
</script>

<style scoped>
.carrito-float-btn {
  position: fixed;
  bottom: 160px; /* Más arriba para no tapar otros elementos */
  right: 32px;
  z-index: 10002;
  background: transparent;
  border: none;
  border-radius: 50%;
  width: 62px;
  height: 62px;
  box-shadow: 0 4px 18px #1e3c7220, 0 1.5px 6px #42b98322;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: box-shadow 0.18s, transform 0.13s, border 0.18s;
  outline: none;
  overflow: visible;
  padding: 0;
}
.carrito-float-btn:hover,
.carrito-float-btn:focus {
  box-shadow: 0 8px 28px #42b98333, 0 2px 12px #42b98322;
  transform: scale(1.06);
}
.carrito-float-btn.bump {
  animation: carrito-bump 0.22s;
}
@keyframes carrito-bump {
  0% { transform: scale(1);}
  20% { transform: scale(1.10);}
  50% { transform: scale(0.97);}
  100% { transform: scale(1);}
}
.carrito-svg {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
}
.carrito-badge {
  position: absolute;
  top: 7px;
  right: 7px;
  background: linear-gradient(135deg, #ff9800 0%, #ff5252 100%);
  color: #fff;
  font-size: 0.92em;
  font-weight: 700;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  box-shadow: 0 2px 8px #ff525233;
  border: 2px solid #fff;
  z-index: 2;
  pointer-events: none;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s;
}
.carrito-float-btn:active .carrito-badge {
  background: #d32f2f;
}
</style>
