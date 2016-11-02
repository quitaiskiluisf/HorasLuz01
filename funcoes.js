// Ligação dos eventos
document.querySelector("#localizacao").addEventListener("keyup", persisteLatitude, false);
window.onload = carregaLatitude;


// Verifica se o ano informado como parâmetro é bissexto ou não
function anoBissexto(ano) {
  var d4 = (ano % 4 == 0);
  var d100 = (ano % 100 == 0);
  var d400 = (ano % 400 == 0);
  return ((d4 && d100 && d400) || (d4 && !d100));
}

// Para uma determinada data, calcula qual é o dia do ano.
// Ex: 2016-02-01 é o 32º dia do ano, pois 2016-01-31 é o 31º
function diaDoAno(data) {
  var qtde = 0;

  // O switch irá escolher a posição de entrada. Como não existe "break" e os meses
  // são testados de trás para frente, o algoritmo seguirá somando os dias do ponto
  // de entrada até o final da estrutura. O "default" somará a quantidade de dias
  // transcorridos no mês.
  switch (data.getMonth()) {
    case 11: // Dezembro
      qtde += 30;
    case 10: // Novembro
      qtde += 31;
    case 9: // Outubro
      qtde += 30;
    case 8: // Setembro
      qtde += 31;
    case 7: // Agosto
      qtde += 31;
    case 6: // Julho
      qtde += 30;
    case 5: // Junho
      qtde += 31;
    case 4: // Maio
      qtde += 30;
    case 3: // Abril
      qtde += 31;
    case 2: // Março
      qtde += anoBissexto(data.getFullYear()) ? 29 : 28;
    case 1: // Fevereiro
      qtde += 31;
    case 0: // Janeiro
    default:
      qtde += data.getDate();
      break;
  }
  return qtde;
}

// Converte um ângulo, de graus para radianos
function grauParaRadiano(angulo) {
  return angulo * Math.PI / 180;
}

// COnverte um ângulo, de radianos para graus
function radianoParaGrau(angulo) {
  return angulo * 180 / Math.PI;
}

// Cálculo da tangente, recebendo, como parâmetro, um ângulo em graus
function tang(angulo) {
  return Math.tan(grauParaRadiano(angulo));
}

// Cálculo do seno, recebendo, como parâmetro, um ângulo em graus
function sing(angulo) {
  return Math.sin(grauParaRadiano(angulo));
}

// Cálculo do arcocosseno, retornando o ângulo em graus
function acosg(valor) {
  return radianoParaGrau(Math.acos(valor));
}

function horasLuz(latitude, data) {
  var w = -tang(latitude) * tang(23.45 * sing(360 * (284 + diaDoAno(data)) / 365));

  // Garante que a variável não ultrapasse os limites
  if (w > 1)
    w = 1;

  if (w < -1)
    w = -1;

  // Converte os valores obtidos para horas de luz
  return 2 * acosg(w) / 15;
}

// Converte uma string, no formato YYYY-MM-DD para um objeto data
// Retorna null em caso de erro
function strToDate(valor) {
  var x = valor.split("-");

  var data = null;
  if (x.length == 3) {
    try {
      data = new Date(x[0], x[1] - 1, x[2]);
    } catch (e) {}
  }

  return data;
}

function calculaHorasLuz() {
  var latitude = document.querySelector("#localizacao").value;
  var data = document.querySelector("#data").value;
  data = strToDate(data);
  var horas_luz = horasLuz(latitude, data);
  horas = Math.floor(horas_luz);
  minutos = Math.floor((horas_luz - horas) * 60);
  document.querySelector("#resultado").innerHTML = "Duração do dia = " + horas + " horas " + minutos + " minutos.";
}

// Se existir, carrega o valor da última latitude informada
// no campo destinado à ela
function carregaLatitude() {
  var valor = localStorage.getItem("HorasLuz_Latitude");

  if (valor != null)
    document.querySelector("#localizacao").value = valor;
}

// Ao alterar a latitude, armazena-a no localstorage para que
// ela possa ser recuperada quando o aplicativo for aberto novamente
function persisteLatitude() {
  localStorage.setItem("HorasLuz_Latitude", this.value);
}
