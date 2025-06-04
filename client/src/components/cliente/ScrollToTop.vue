<template>
  <button
    v-show="visible"
    class="scroll-to-top-btn"
    @click="scrollToTop"
    aria-label="Volver arriba"
  >
    <i class="fas fa-arrow-up"></i>
  </button>
</template>

<script>
export default {
  name: 'ScrollToTop',
  data() {
    return { visible: false }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.visible = window.scrollY > 200
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
.scroll-to-top-btn {
  position: fixed;
  right: 2.2rem;
  bottom: 2.2rem;
  z-index: 9999;
  background: linear-gradient(135deg, #00eaff 60%, #42b983 100%);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 54px;
  height: 54px;
  font-size: 2rem;
  box-shadow: 0 4px 24px #00eaff55, 0 2px 8px #1e3c7211;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.92;
  transition: background 0.18s, box-shadow 0.18s, transform 0.13s, opacity 0.18s;
  outline: none;
  border-bottom: 3px solid #42b983;
  border-top: 2px solid #00eaff;
  animation: iconPop 1.2s cubic-bezier(.4,0,.2,1);
}
.scroll-to-top-btn:hover {
  background: linear-gradient(135deg, #42b983 0%, #00eaff 100%);
  color: #fff;
  box-shadow: 0 8px 32px #00eaff88, 0 2px 8px #42b98355;
  transform: translateY(-4px) scale(1.09);
  opacity: 1;
}
@keyframes iconPop {
  0% { transform: scale(0.7);}
  60% { transform: scale(1.15);}
  100% { transform: scale(1);}
}
</style>
