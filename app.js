/* ============================================================
   relatorios.js — Módulo Relatórios · Nova Telecom
   Geração, visualização e exportação de relatórios
   ============================================================ */

import { showToast } from '../utils/helpers.js';
import { exportarPDF, exportarExcel } from '../utils/export.js';

let relatorioChart = null;

/* ── Dados mockados ── */
const DADOS_RELATORIO = [
  { data: '01/05/2025', tipo: 'Entrada', horario: '08:15', local: 'Escritório Central', status: 'OK',    metodo: 'GPS' },
  { data: '01/05/2025', tipo: 'Saída',   horario: '18:30', local: 'Escritório Central', status: 'OK',    metodo: 'GPS' },
  { data: '02/05/2025', tipo: 'Entrada', horario: '08:05', local: 'Escritório Central', status: 'OK',    metodo: 'Facial' },
  { data: '02/05/2025', tipo: 'Saída',   horario: '18:45', local: 'Escritório Central', status: 'Extra', metodo: 'GPS' },
  { data: '05/05/2025', tipo: 'Entrada', horario: '09:20', local: 'Home Office',        status: 'Atraso',metodo: 'Manual' },
];

/* ── Inicializa módulo ── */
export function initRelatorios() {
  document.getElementById('gerar-relatorio-btn')?.addEventListener('click', gerarRelatorio);
  document.getElementById('exportar-pdf-btn')?.addEventListener('click', () => exportarPDF('relatorio-resultado', 'relatorio-ponto.pdf'));
  document.getElementById('exportar-excel-btn')?.addEventListener('click', () => exportarExcel(DADOS_RELATORIO, 'relatorio-ponto.xlsx'));
  document.getElementById('imprimir-relatorio-btn')?.addEventListener('click', () => window.print());
}

/* ── Gera relatório ── */
function gerarRelatorio() {
  const tipo = document.getElementById('relatorio-tipo')?.value ?? 'mensal';

  preencherResumo(tipo);
  preencherTabela();
  renderizarGrafico();

  document.getElementById('relatorio-resultado').style.display = '';
  showToast('Relatório gerado com sucesso!', 'success');
}

/* ── Preenche resumo ── */
function preencherResumo(tipo) {
  const el = document.getElementById('relatorio-resumo');
  if (!el) return;

  el.innerHTML = `
    <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr)">
      <div class="stat-card c-purple">
        <div class="stat-icon"><i class="fas fa-clock"></i></div>
        <div><div class="stat-label">Total trabalhado</div><div class="stat-value">168.5h</div></div>
      </div>
      <div class="stat-card c-green">
        <div class="stat-icon"><i class="fas fa-plus-circle"></i></div>
        <div><div class="stat-label">Horas extras</div><div class="stat-value">+12.5h</div></div>
      </div>
      <div class="stat-card c-amber">
        <div class="stat-icon"><i class="fas fa-exclamation"></i></div>
        <div><div class="stat-label">Atrasos</div><div class="stat-value">2</div></div>
      </div>
    </div>`;
}

/* ── Preenche tabela detalhada ── */
function preencherTabela() {
  const tbody = document.querySelector('#relatorio-detalhes tbody');
  if (!tbody) return;

  tbody.innerHTML = DADOS_RELATORIO.map(r => `
    <tr>
      <td>${r.data}</td>
      <td>${r.tipo}</td>
      <td>${r.horario}</td>
      <td>${r.local}</td>
      <td><span class="badge ${badgeClass(r.status)}">${r.status}</span></td>
      <td>${r.metodo}</td>
    </tr>`).join('');
}

/* ── Renderiza gráfico ── */
function renderizarGrafico() {
  const canvas = document.getElementById('relatorio-chart');
  if (!canvas || !window.Chart) return;

  if (relatorioChart) relatorioChart.destroy();

  relatorioChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      datasets: [{
        label: 'Horas trabalhadas',
        data: [40, 42, 44, 42.5],
        borderColor: '#5b21f3',
        backgroundColor: 'rgba(91,33,243,0.08)',
        tension: 0.4, fill: true, borderWidth: 2,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        y: { beginAtZero: false, min: 35, grid: { color: 'rgba(91,33,243,0.05)' } },
        x: { grid: { display: false } },
      },
    },
  });
}

/* ── Helper de cor de badge ── */
function badgeClass(status) {
  const map = { OK: 'badge-success', Extra: 'badge-primary', Atraso: 'badge-warning', Falta: 'badge-error' };
  return map[status] ?? 'badge-primary';
}
