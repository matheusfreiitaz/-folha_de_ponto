/* ============================================================
   dashboard.js — Módulo Dashboard · Nova Telecom
   Gráfico semanal e mini-calendário da tela inicial
   ============================================================ */

import { formatDate } from '../utils/helpers.js';

let dashboardChart = null;

/* ── Dados mockados da semana ── */
const WEEKLY_DATA = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  horas:  [8.5, 8.0, 9.0, 7.5, 8.5, 0, 0],
  extras: [0.5, 0, 1.0, 0, 0.5, 0, 0],
};

/* ── Inicializa gráfico do dashboard ── */
export function initDashboardChart() {
  const canvas = document.getElementById('dashboard-chart');
  if (!canvas || !window.Chart) return;

  if (dashboardChart) dashboardChart.destroy();

  dashboardChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: WEEKLY_DATA.labels,
      datasets: [
        {
          label: 'Horas trabalhadas',
          data: WEEKLY_DATA.horas,
          backgroundColor: 'rgba(91, 33, 243, 0.15)',
          borderColor: '#5b21f3',
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: 'Horas extras',
          data: WEEKLY_DATA.extras,
          backgroundColor: 'rgba(6, 214, 160, 0.15)',
          borderColor: '#06d6a0',
          borderWidth: 2,
          borderRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'DM Sans', size: 12 } } },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 12,
          ticks: { font: { family: 'DM Sans' } },
          grid: { color: 'rgba(91,33,243,0.05)' },
        },
        x: {
          ticks: { font: { family: 'DM Sans' } },
          grid: { display: false },
        },
      },
    },
  });
}

/* ── Inicializa mini-calendário ── */
export function initMiniCalendar() {
  const el = document.getElementById('mini-calendar');
  if (!el || !window.FullCalendar) return;

  const calendar = new FullCalendar.Calendar(el, {
    initialView: 'dayGridMonth',
    locale: 'pt-br',
    headerToolbar: { left: 'prev', center: 'title', right: 'next' },
    height: 320,
    events: [
      { title: 'Entrada', date: formatDate(new Date()), color: '#5b21f3' },
    ],
  });

  calendar.render();
}

/* ── Inicialização do módulo ── */
export function initDashboard() {
  initDashboardChart();
  initMiniCalendar();
}
