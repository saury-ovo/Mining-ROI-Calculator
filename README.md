# ASIC ROI Analyzer

A professional mining investment analysis dashboard for miners and cryptocurrency investors.

ASIC ROI Analyzer helps users evaluate mining machine profitability based on equipment, hashrate, network conditions, electricity costs, and market assumptions.

## Highlights

- Financial terminal-style dashboard with a dark professional interface
- Instant network hashrate dilution analysis when new mining equipment joins the network
- Automatic conversion for H/s, kH/s, MH/s, GH/s, TH/s, PH/s, EH/s, and Sol/s units
- Real cryptocurrency logo selector with automatic algorithm and unit mapping
- Live operating monitor for input readiness, total power load, daily power cost, selected coin, and algorithm
- Optional automatic market data retrieval for coin price, network hashrate, and network daily coin production
- Clear separation between current daily performance and investment recovery analysis
- Multi-language interface for international users
- No database and no permanent user data storage

## Features

- Mining machine investment analysis
- Daily revenue and electricity cost estimation
- Daily and monthly profit analysis
- Annual ROI estimation
- Payback period calculation
- Network hashrate and miner share analysis
- Revenue versus electricity cost chart
- Profit status indicator
- Live input readiness and operating monitor
- Automatic market data retrieval
- Fallback market data providers
- Field-level warnings when market data is unavailable
- Responsive layout for desktop and mobile devices

## Supported Coins

BTC, LTC, DOGE, DASH, KAS, ETC, ZEC, XMR, RVN, ERG, ALPH, and IRONFISH.

## Input Parameters

The calculator accepts:

- Miner name
- Coin
- Miner hashrate
- Network hashrate
- Quantity
- Machine price
- Other costs
- Power consumption
- Electricity price
- Pool fee
- Network daily coin production
- Coin price

## Dashboard Results

The result dashboard provides:

- Initial Investment
- Daily Revenue
- Daily Electricity Cost
- Daily Profit
- Monthly Profit
- Annual Profit
- Payback Period
- Annual ROI
- Mining Share
- Original Network Hashrate
- Total Miner Hashrate
- Effective Network Hashrate
- Profit Status

## Technology Stack

- Python
- Flask
- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- Chart.js

## Project Structure

```text
Mining_ROI_Calculator/
├── app.py
├── calculator.py
├── unit_converter.py
├── market_data/
│   ├── chain_api.py
│   ├── coin_config.py
│   ├── hashrate_api.py
│   ├── http_client.py
│   ├── price_api.py
│   └── service.py
├── test_calculator.py
├── test_market_data.py
├── requirements.txt
├── .gitignore
├── templates/
└── static/
```

## Installation

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run

```powershell
python app.py
```

If the default port is unavailable:

```powershell
python -m flask --app app run --host 127.0.0.1 --port 8080 --no-debugger --no-reload
```

## Test

```powershell
python -B -m unittest -v test_calculator.py
```

```powershell
python -B -m unittest -v test_market_data.py
```

```powershell
python -B -m unittest discover -v
```

## Data and Privacy

- No database is required
- User input is used only for the current calculation
- No user data is permanently stored
- Market data retrieval is optional
- Market data is temporarily cached in process memory
- Public market data providers may be unavailable or return incomplete data
- Users can enter market data manually when automatic retrieval is unavailable
- No API keys, wallet keys, or external credentials are required

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.