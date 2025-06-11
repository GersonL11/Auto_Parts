<template>
  <div class="dashboard-cards">
    <div class="dashboard-card users">
      <div class="card-title">USUARIOS</div>
      <div class="card-value">{{ totalUsuarios }}</div>
      <div class="card-desc">Total registrados</div>
    </div>
    <div class="dashboard-card repuestos">
      <div class="card-title">REPUESTOS</div>
      <div class="card-value">{{ totalRepuestos }}</div>
      <div class="card-desc">Total en inventario</div>
    </div>
    <div class="dashboard-card movimientos">
      <div class="card-title">MOVIMIENTOS</div>
      <div class="card-value">{{ totalMovimientos }}</div>
      <div class="card-desc">Entradas y salidas</div>
    </div>
    <div class="dashboard-card revenue">
      <div class="card-title">VENTAS</div>
      <div class="card-value">L {{ totalVentas.toLocaleString() }}</div>
      <div class="card-desc">Total vendido</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',
  data() {
    return {
      totalUsuarios: 0,
      totalRepuestos: 0,
      totalMovimientos: 0,
      totalVentas: 0
    }
  },
  async mounted() {
    // Usuarios
    const usuariosRes = await fetch('http://localhost:3000/api/usuarios');
    const usuarios = await usuariosRes.json();
    this.totalUsuarios = usuarios.length;

    // Repuestos
    const repuestosRes = await fetch('http://localhost:3000/api/repuestos');
    const repuestos = await repuestosRes.json();
    this.totalRepuestos = repuestos.length;

    // Movimientos
    const movimientosRes = await fetch('http://localhost:3000/api/movimientos');
    const movimientos = await movimientosRes.json();
    this.totalMovimientos = movimientos.length;

    // Ventas
    const ventasRes = await fetch('http://localhost:3000/api/ventas');
    const ventas = await ventasRes.json();
    this.totalVentas = ventas.reduce((sum, v) => sum + (Number(v.total) || 0), 0);
  }
}
</script>

<style scoped>
.dashboard-cards {
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}
.dashboard-card {
  flex: 1 1 220px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px #42b98322;
  padding: 2rem 1.5rem 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 220px;
  max-width: 320px;
}
.dashboard-card.users { background: #1ecab8; color: #fff; }
.dashboard-card.repuestos { background: #ffb300; color: #fff; }
.dashboard-card.movimientos { background: #1cc8ee; color: #fff; }
.dashboard-card.revenue { background: #6c63ff; color: #fff; }
.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  opacity: 0.85;
  margin-bottom: 0.7rem;
  letter-spacing: 1px;
}
.card-value {
  font-size: 2.2rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}
.card-desc {
  font-size: 1rem;
  opacity: 0.95;
}
@media (max-width: 900px) {
  .dashboard-cards { flex-direction: column; gap: 1.2rem; }
  .sidebar { width: 70vw; }
}
</style>