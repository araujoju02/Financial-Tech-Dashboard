/* eslint-disable no-console */
// script.js — módulo ES6

// =====================
// Configurações gerais
// =====================
const API_KEYS = {
  ALPHA_VANTAGE: "COLE_SUA_CHAVE_AQUI",
  GNEWS: "COLE_SUA_CHAVE_AQUI",
};

const STATE = {
  assets: ["PETR4.SAO", "VALE3.SAO"],
  chart: null,
};

// =====================
// Utilidades
// =====================
const $ = (sel) => document.querySelector(sel);
const formatBRL = (n, dec = 2) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: dec,
  }).format(n);

// =====================
// Tema (light/dark)
// =====================
(() => {
  const root = document.documentElement;
  const btn = $("#themeToggle");
  const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = preferDark ? "dark" : "light";
  btn.textContent = preferDark ? "☀️" : "🌙";
  btn.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    btn.textContent = root.dataset.theme === "light" ? "🌙" : "☀️";
  });
})();

// =====================
// Cotações
// =====================
async function fetchQuotes() {
  try {
    // Demonstração usando dados fictícios; troque pela API se desejar
    const mock = STATE.assets.reduce((acc, asset) => {
      const price = (Math.random() * (100 - 20) + 20).toFixed(2);
      acc[asset.split(".")[0]] = price;
      return acc;
    }, {});
    return mock;
  } catch (e) {
    console.error(e);
    throw new Error("Erro ao obter cotações");
  }
}

async function renderQuotes() {
  const ul = $("#quotesList");
  ul.innerHTML = "";

  // Skeletons enquanto faz fetch
  for (let i = 0; i < STATE.assets.length; i++) {
    ul.appendChild($("#quoteSkeleton").content.cloneNode(true));
  }

  try {
    const data = await fetchQuotes();
    ul.innerHTML = "";
    Object.entries(data).forEach(([ticker, price]) => {
      const li = document.createElement("li");
      li.innerHTML = `${ticker}<span>${formatBRL(price)}</span>`;
      ul.appendChild(li);
    });
  } catch {
    $("#quotesError").hidden = false;
  }
}

// =====================
// Gráfico
// =====================
function renderChart() {
  const ctx = $("#priceChart");
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  if (STATE.chart) STATE.chart.destroy();
  STATE.chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "PETR4",
          data: [20, 22, 23, 25, 28, 30],
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: "VALE3",
          data: [80, 82, 85, 88, 90, 94],
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
      },
    },
  });
}

// =====================
// Notícias
// =====================
async function fetchNews() {
  try {
    // Mock de notícias
    return [
      { title: "Petrobras sobe 5% na B3", link: "#" },
      { title: "Ibovespa renova máxima histórica", link: "#" },
      { title: "Copom decide nova meta de juros", link: "#" },
    ];
  } catch (e) {
    console.error(e);
    throw new Error("Erro ao obter notícias");
  }
}

async function renderNews() {
  const ul = $("#newsList");
  ul.innerHTML = "<li class=\"skeleton\">Carregando…</li>";
  try {
    const news = await fetchNews();
    ul.innerHTML = "";
    news.forEach(({ title, link }) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${link}" target="_blank" rel="noopener">${title}</a>`;
      ul.appendChild(li);
    });
  } catch {
    $("#newsError").hidden = false;
  }
}

// =====================
// Simulador de Poupança
// =====================
function calcularPoupanca(valor, taxa, meses) {
  let montante = 0;
  for (let i = 1; i <= meses; i++) {
    montante = (montante + valor) * (1 + taxa / 100);
  }
  return montante;
}

$("#calcForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const valor = Number($("#valor").value);
  const taxa = Number($("#taxa").value);
  const meses = Number($("#meses").value);

  if (!valor || !taxa || !meses) return;
  const total = calcularPoupanca(valor, taxa, meses);
  $("#valorFinal").textContent = `Valor final: ${formatBRL(total)}`;
});

// =====================
// Inicialização
// =====================
window.addEventListener("DOMContentLoaded", () => {
  renderQuotes();
  renderChart();
  renderNews();
});
