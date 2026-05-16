/* ============================================================
   calendario.js — Calendário & Banco de Horas · Nova Telecom
   ============================================================ */

let calendarInstance = null;

/* ── Dados de exemplo ── */
const CALENDAR_EVENTS = [
  { title: 'Entrada 08:15', date: '2025-05-12', color: '#5b21f3' },
  { title: 'Saída 18:30',   date: '2025-05-12', color: '#06d6a0' },
  { title: 'Falta',         date: '2025-05-08', color: '#ef4444' },
  { title: 'Férias',        start: '2025-05-20', end: '2025-05-25', color: '#f59e0b' },
];

/* ── Inicializa calendário completo ── */
export function initCalendario() {
  const el = document.getElementById('calendar');
  if (!el || !window.FullCalendar) return;

  calendarInstance = new FullCalendar.Calendar(el, {
    initialView:  'dayGridMonth',
    locale:       'pt-br',
    headerToolbar: {
      left:   'prev,next today',
      center: 'title',
      right:  'dayGridMonth,listWeek',
    },
    events: CALENDAR_EVENTS,
    eventClick: ({ event }) => {
      alert(`Evento: ${event.title}\nData: ${event.startStr}`);
    },
    height: 'auto',
  });

  calendarInstance.render();
  initBancoHorasChart();
}

/* ── Gráfico de banco de horas ── */
function initBancoHorasChart() {
  const el = document.getElementById('banco-horas-chart');
  if (!el || !window.Chart) return;

  new Chart(el, {
    type: 'doughnut',
    data: {
      labels: ['Utilizado', 'Disponível'],
      datasets: [{
        data: [12.5, 7.5],
        backgroundColor: ['#5b21f3', 'rgba(91,33,243,0.1)'],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      cutout: '75%',
      plugins: { legend: { display: false } },
    },
  });
}
