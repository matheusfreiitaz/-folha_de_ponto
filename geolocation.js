/* ============================================================
   ferias.js — Módulo Férias · Nova Telecom
   Solicitação, histórico e upload de documentos de férias
   ============================================================ */

import { showToast } from '../utils/helpers.js';

/* ── Inicializa módulo de férias ── */
export function initFerias() {
  initFeriasForm();
  initFeriasDropzone();
}

/* ── Formulário de solicitação ── */
function initFeriasForm() {
  const form = document.getElementById('ferias-form');

  form?.addEventListener('submit', e => {
    e.preventDefault();

    const inicio = document.getElementById('ferias-inicio')?.value;
    const fim    = document.getElementById('ferias-fim')?.value;
    const obs    = document.getElementById('ferias-obs')?.value ?? '';

    if (!inicio || !fim) {
      showToast('Preencha as datas de início e término.', 'error');
      return;
    }

    const diffMs   = new Date(fim) - new Date(inicio);
    const dias     = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;

    if (dias <= 0) {
      showToast('A data de término deve ser após a data de início.', 'error');
      return;
    }

    const solicitacao = {
      id:       Date.now(),
      inicio,
      fim,
      dias,
      obs,
      status:   'Pendente',
      criadoEm: new Date().toISOString(),
    };

    // Salva localmente
    const lista = JSON.parse(localStorage.getItem('nova_telecom_ferias') ?? '[]');
    lista.push(solicitacao);
    localStorage.setItem('nova_telecom_ferias', JSON.stringify(lista));

    // Adiciona linha na tabela
    adicionarLinhaTabela(solicitacao);
    form.reset();
    showToast(`Férias solicitadas — ${dias} dias. Aguardando aprovação.`, 'success');
  });
}

/* ── Adiciona linha na tabela de histórico ── */
function adicionarLinhaTabela({ inicio, fim, dias, status }) {
  const tbody = document.querySelector('#ferias-items');
  if (!tbody) return;

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${formatarData(inicio)} - ${formatarData(fim)}</td>
    <td>${dias}</td>
    <td><span class="badge badge-warning">${status}</span></td>
    <td><span class="badge badge-primary">0</span></td>
    <td>
      <button class="btn btn-outline btn-sm"><i class="fas fa-edit"></i></button>
      <button class="btn btn-outline btn-sm" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button>
    </td>`;
  tbody.prepend(tr);
}

/* ── Dropzone para documentos de férias ── */
function initFeriasDropzone() {
  const el = document.getElementById('ferias-document-dropzone');
  if (!el || !window.Dropzone) return;

  Dropzone.autoDiscover = false;
  new Dropzone(el, {
    url: '/upload',  // Substituir pela URL real da API
    maxFilesize: 10,
    acceptedFiles: '.pdf,.jpg,.jpeg,.png',
    dictDefaultMessage: '<i class="fas fa-upload"></i> Arraste arquivos ou clique para selecionar',
    init() {
      this.on('success', () => showToast('Documento anexado com sucesso!', 'success'));
      this.on('error',   () => showToast('Erro ao anexar documento.', 'error'));
    },
  });
}

/* ── Utilitário local ── */
function formatarData(str) {
  const [y, m, d] = str.split('-');
  return `${d}/${m}/${y}`;
}
