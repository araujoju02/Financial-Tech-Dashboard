/* ------------- CONFIG ------------- */
const FX_URL = "https://api.exchangerate.host/latest?base=USD&symbols=BRL";
const FORECAST_JSON = "data/forecast.json";
const REFRESH_MS = 60_000;                    // 1 minuto

/* ---------- Cotação USD/BRL -------- */
async function updateDollar() {
  try{
    const r = await fetch(FX_URL);
    const data = await r.json();
    const price = data.rates.BRL.toFixed(4);
    document.getElementById("usdbrl").textContent = price;
    document.getElementById("lastUpdate").textContent =
      new Date().toLocaleTimeString("pt-BR");
  }catch(err){
    console.error("FX error", err);
  }
}
updateDollar();
setInterval(updateDollar, REFRESH_MS);

/* ------------- Previsão ------------ */
async function drawForecast(){
  const ctx = document.getElementById("forecastChart").getContext("2d");
  const res = await fetch(FORECAST_JSON + `?t=${Date.now()}`); // cache‑buster
  const json = await res.json();

  const labels = json.map(pt => pt.ds || pt.date);
  const yhat   = json.map(pt => pt.yhat);
  const upper  = json.map(pt => pt.yhat_upper);
  const lower  = json.map(pt => pt.yhat_lower);

  new Chart(ctx,{
    type:"line",
    data:{
      labels,
      datasets:[
        {
          label:"Previsão",
          data:yhat,
          borderWidth:2,
          fill:false
        },
        {
          label:"Limite superior",
          data:upper,
          borderDash:[4,4],
          borderWidth:1,
          fill:false
        },
        {
          label:"Limite inferior",
          data:lower,
          borderDash:[4,4],
          borderWidth:1,
          fill:false
        },
      ]
    },
    options:{
      responsive:true,
      interaction:{mode:"index",intersect:false},
      scales:{
        x:{display:false},
        y:{ticks:{callback:v=>v.toLocaleString("pt-BR")}}
      }
    }
  });
}
drawForecast();
