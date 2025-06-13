// Cotações (API Fictícia ou Mock)
async function fetchQuotes(){
    // Ações Fictícias - você quer usar uma API real? coloque suas chaves depois
    return {
      PETR4: (Math.random() * (30 - 20) + 20).toFixed(2),
      VALE3: (Math.random() * (100 - 80) + 80).toFixed(2),
      IBOVESPA: (Math.random() * (130000 - 100000) + 100000).toFixed(0)
    };
}

async function atualizarCotacoes(){
    const quotes = await fetchQuotes();

    document.getElementById('petr4').innerText = `R$ ${quotes.PETR4}`;
    document.getElementById('vale3').innerText = `R$ ${quotes.VALE3}`;
    document.getElementById('ibov').innerText = `${quotes.IBOVESPA} pts`;
}

function criarGrafico(){
    new Chart(document.getElementById("priceChart"), {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "June"],
        datasets: [{
          label: "PETR4",
          data: [20, 21, 23, 26, 27, 29],
          borderColor: "#ffcc5b",
          backgroundColor: "rgba(255,204,91,0.5)"
        },
        {
          label: "VALE3",
          data: [80, 83, 85, 87, 90, 95],
          borderColor: "#ffcc5b",
          backgroundColor: "rgba(255,204,91,0.5)"
        }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: "#fff"
            }
          }
        },
        scales: {
          x: {
            ticks: { color: "#fff" },
            grid: { color: "#fff5cc" },
          },
          y: {
            ticks: { color: "#fff" },
            grid: { color: "#fff5cc" },
          },
        },
      },
    });
}

async function fetchNews(){
    // Mock de noticias
    return [
      { title: "Petrobras sobe 5% na bolsa!", link: "#" },
      { title: "Ibovespa bate recorde histórico.", link: "#" },
      { title: "Dados de inflação serão divulgados hoje.", link: "#" },
    ]
}

async function atualizarNoticias(){
    const noticias = await fetchNews();
    const ul = document.getElementById("news-list");

    ul.innerHTML = '';
    noticias.forEach((noticia) => {
      ul.innerHTML += `<li><a href="${noticia.link}" target="_blank">${noticia.title}</a></li>`;
    });
}

function calcularPoupanca(){
    const valor = parseFloat(document.getElementById("valor").value);
    const taxa = parseFloat(document.getElementById("taxa").value);
    const meses = parseInt(document.getElementById("meses").value);

    if (isNaN(valor) ||
        isNaN(taxa) ||
        isNaN(meses)) {
      alert("Informe todos os números!");
      return;
    }

    let montante = valor;
    for (let i = 0; i < meses; i++) {
      montante *= 1 + taxa/100;
      montante += valor;
    }

    document.getElementById("valorFinal").innerText = `R$ ${montante.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarCotacoes();
    criarGrafico();
    atualizarNoticias();

    document.getElementById("calcular").addEventListener("click", calcularPoupanca);
});
