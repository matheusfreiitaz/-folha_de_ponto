/* ============================================================
   registro-ponto.js — Módulo Registro de Ponto · Nova Telecom
   Registro tradicional com GPS e reconhecimento facial
   ============================================================ */

import { getCurrentLocation } from '../utils/geolocation.js';
import { showToast }          from '../utils/helpers.js';

/* ── Registro tradicional ── */
export function initRegistroPonto() {
  const btn        = document.getElementById('registrar-ponto-btn');
  const statusEl   = document.getElementById('registro-status');
  const locationEl = document.getElementById('location-info');

  // Obtém localização assim que o módulo inicia
  getCurrentLocation()
    .then(({ latitude, longitude, address }) => {
      if (locationEl) {
        locationEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${address ?? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}`;
      }
      if (btn) btn.disabled = false;
    })
    .catch(() => {
      if (locationEl) {
        locationEl.innerHTML = '<span style="color:var(--error)"><i class="fas fa-exclamation-triangle"></i> Localização indisponível</span>';
      }
    });

  btn?.addEventListener('click', () => {
    const tipo = document.getElementById('tipo-registro')?.value ?? 'entrada';
    const now  = new Date();

    const registro = {
      tipo,
      timestamp: now.toISOString(),
      hora: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    // Persiste localmente
    const registros = JSON.parse(localStorage.getItem('nova_telecom_registros') ?? '[]');
    registros.push(registro);
    localStorage.setItem('nova_telecom_registros', JSON.stringify(registros));

    if (statusEl) {
      statusEl.innerHTML = `
        <div class="mt-2 text-success">
          <i class="fas fa-check-circle"></i>
          Ponto registrado às <strong>${registro.hora}</strong>
        </div>`;
    }

    showToast(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} registrada com sucesso!`, 'success');
  });
}

/* ── Reconhecimento facial ── */
export function initFaceRecognition() {
  const video    = document.getElementById('videoElement');
  const startBtn = document.getElementById('start-face-recognition');
  const statusEl = document.getElementById('face-recognition-status');
  const overlay  = document.getElementById('face-recognition-overlay');

  startBtn?.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (video) {
        video.srcObject = stream;
        video.style.display = 'block';
      }

      if (overlay) overlay.style.display = 'flex';

      // Simula processamento (integrar com API real aqui)
      setTimeout(() => {
        if (overlay) overlay.style.display = 'none';
        if (statusEl) {
          statusEl.innerHTML = '<span class="text-success"><i class="fas fa-check-circle"></i> Reconhecimento bem-sucedido!</span>';
        }
        showToast('Identidade verificada com sucesso!', 'success');
      }, 2500);

    } catch {
      if (statusEl) {
        statusEl.innerHTML = '<span class="text-error"><i class="fas fa-times-circle"></i> Câmera não disponível.</span>';
      }
    }
  });
}
