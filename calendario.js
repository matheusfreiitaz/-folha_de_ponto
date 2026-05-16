/* ============================================================
   app.config.js — Configurações Centrais · Nova Telecom
   Edite este arquivo para ajustar o comportamento da aplicação
   ============================================================ */

const AppConfig = {
  app: {
    name:     'Nova Telecom | Sistema de Gestão de Ponto',
    version:  '1.0.0',
    locale:   'pt-BR',
    timezone: 'America/Sao_Paulo',
  },

  api: {
    baseUrl: '',       // Ex: 'https://api.novatelec.com.br/v1'
    timeout: 10000,
  },

  geolocation: {
    enableHighAccuracy: true,
    timeout:            10000,
    maximumAge:         60000,
  },

  workSchedule: {
    hoursPerDay:        8,
    hoursPerMonth:      176,
    maxOvertimeMonth:   20,
  },

  storage: {
    prefix: 'nova_telecom_',
  },
};

export default AppConfig;
