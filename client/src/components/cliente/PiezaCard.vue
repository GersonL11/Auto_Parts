<template>
  <div class="pieza-card">
    <!-- ...existing code... -->
    <button class="btn-carrito" @click="$emit('agregar-al-carrito')">
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="11" fill="#42b983"/>
        <path d="M6 7h1l1.5 6.5a1.5 1.5 0 0 0 1.5 1.2h5.5a1.5 1.5 0 0 0 1.5-1.1l1-4.5a0.7 0.7 0 0 0-0.7-0.9H8.5" stroke="#fff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="9.5" cy="16" r="1" fill="#fff"/>
        <circle cx="15" cy="16" r="1" fill="#fff"/>
      </svg>
      Agregar al carrito
    </button>
  </div>
</template>

<script>
export default {
  name: 'PiezaCard',
  // ...existing code...
}
</script>

<style scoped>
.pieza-card {
  /* ...existing styles... */
}
.btn-carrito {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn-carrito:hover {
  background-color: #369a6a;
}
.btn-carrito svg {
  margin-right: 5px;
}
</style>