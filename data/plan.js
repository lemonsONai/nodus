/*
  Plano semanal do Nodus.
  "schedule" mapeia o dia da semana (0=Domingo ... 6=Sábado, como
  Date.getDay() em JS) à letra do treino desse dia ("A", "B", "C"...),
  ou "rest" para dia de descanso.

  Isto controla o calendário mensal dentro da app e a secção
  "Esta semana" no Início. Podes editar aqui ou pelo Admin Panel.
*/
window.NODUS_DATA = window.NODUS_DATA || {};
window.NODUS_DATA.plan = {
  schedule: {
    0: "rest", // Domingo
    1: "A",    // Segunda
    2: "B",    // Terça
    3: "rest", // Quarta
    4: "C",    // Quinta
    5: "D",    // Sexta
    6: "E"     // Sábado
  }
};
