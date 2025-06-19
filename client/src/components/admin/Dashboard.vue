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

  <!-- Gráfico de pastel debajo de las cards -->
  <div style="max-width: 900px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 2px 8px #0001; padding: 2rem; min-height:320px; display:flex; align-items:center; justify-content:center;">
    <canvas v-if="hayDatosGrafico" id="ventasBarChart" height="300"></canvas>
    <div v-else style="width:100%;text-align:center;color:#b0bec5;font-size:1.3rem;font-weight:700;">
      No hay datos suficientes para mostrar el gráfico.
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      totalUsuarios: 0,
      totalRepuestos: 0,
      totalMovimientos: 0,
      totalVentas: 0,
      ventasChart: null,
      hayDatosGrafico: false,
      meses: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
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

    // Gráfico: cantidad de repuestos por mes/año de registro
    const res = await fetch('http://localhost:3000/api/repuestos/por-fecha');
    const data = await res.json();
    const labels = data.labels || [];
    const valores = data.valores || [];

    this.hayDatosGrafico = Array.isArray(valores) && valores.length > 0 && valores.some(v => v > 0);

    if (this.hayDatosGrafico) {
      this.ventasChart = new Chart(
        document.getElementById('ventasBarChart'),
        {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Cantidad de repuestos por mes de registro',
              data: valores,
              backgroundColor: '#42b983',
              borderColor: '#1e3c72',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        }
      );
    }
  },
  beforeUnmount() {
    if (this.ventasChart) {
      this.ventasChart.destroy();
    }
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