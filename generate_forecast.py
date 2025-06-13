"""
Gera forecast.json (30 dias) do índice IBOVESPA (^BVSP) usando Prophet.
Executa localmente ou no GitHub Actions.
"""
import json, pandas as pd, yfinance as yf
from prophet import Prophet
from pathlib import Path

OUT = Path(__file__).parent.parent / "data" / "forecast.json"
OUT.parent.mkdir(exist_ok=True)

# 3 anos de histórico
hist = yf.download("^BVSP", period="3y", progress=False)["Close"]
df = hist.reset_index().rename(columns={"Date": "ds", "Close": "y"})

m = Prophet(daily_seasonality=True, weekly_seasonality=True)
m.fit(df)

future = m.make_future_dataframe(periods=30)
fcst = m.predict(future)[["ds","yhat","yhat_lower","yhat_upper"]].tail(30)
fcst["ds"] = fcst["ds"].dt.strftime("%Y-%m-%d")

OUT.write_text(fcst.to_json(orient="records"), encoding="utf-8")
print(f"✅ Forecast salvo em {OUT.relative_to(Path.cwd())}")
