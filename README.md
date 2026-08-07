# Mining ROI Calculator

A professional mining investment analysis dashboard for miners and cryptocurrency investors.

Mining ROI Calculator helps users evaluate mining machine profitability based on equipment, hashrate, network conditions, electricity costs, and market assumptions.

## Highlights

- Financial terminal-style dashboard with a dark professional interface
- Instant network hashrate dilution analysis when new mining equipment joins the network
- Automatic conversion for H/s, kH/s, MH/s, GH/s, TH/s, PH/s, EH/s, and Sol/s units
- Real cryptocurrency logo selector with automatic algorithm and unit mapping
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
├── test_calculator.py
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

## Data and Privacy

- No database is required
- User input is used only for the current calculation
- No user data is permanently stored
- No API keys, wallet keys, or external credentials are required

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
