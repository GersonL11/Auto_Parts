<template>
  <div class="dashboard-cards">
    <div class="dashboard-card visits">
      <div class="card-title">DAILY VISITS</div>
      <div class="card-value">8,652</div>
      <div class="card-desc"><span class="down">▼ 2.97%</span> Since last month</div>
    </div>
    <div class="dashboard-card revenue">
      <div class="card-title">REVENUE</div>
      <div class="card-value">$9,254.62</div>
      <div class="card-desc"><span class="up">▲ 18.25%</span> Since last month</div>
    </div>
    <div class="dashboard-card orders">
      <div class="card-title">ORDERS</div>
      <div class="card-value">753</div>
      <div class="card-desc"><span class="down">▼ 5.75%</span> Since last month</div>
    </div>
    <div class="dashboard-card users">
      <div class="card-title">USERS</div>
      <div class="card-value">63,154</div>
      <div class="card-desc"><span class="up">▲ 8.21%</span> Since last month</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard'
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
.dashboard-card.visits { background: #ff5a8a; color: #fff; }
.dashboard-card.revenue { background: #6c63ff; color: #fff; }
.dashboard-card.orders { background: #1cc8ee; color: #fff; }
.dashboard-card.users { background: #1ecab8; color: #fff; }
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
.card-desc .up { color: #00e676; font-weight: bold; }
.card-desc .down { color: #ff5252; font-weight: bold; }
@media (max-width: 900px) {
  .dashboard-cards { flex-direction: column; gap: 1.2rem; }
  .sidebar { width: 70vw; }
}
/* Copia aquí los estilos de .dashboard-cards y .dashboard-card de tu AdminLayout.vue */
</style>