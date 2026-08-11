"""CoinGecko price adapter."""

import math
from urllib.parse import quote

from .http_client import fetch_json


COINGECKO_PRICE_URL = "https://api.coingecko.com/api/v3/simple/price?ids={}&vs_currencies=usd"


def fetch_coin_price(coingecko_id):
    """Return a validated USD price or None when the provider has no value."""
    if not coingecko_id:
        return None
    payload = fetch_json(COINGECKO_PRICE_URL.format(quote(coingecko_id, safe="")))
    try:
        value = float(payload[coingecko_id]["usd"])
    except (KeyError, TypeError, ValueError):
        return None
    if not math.isfinite(value) or value <= 0:
        return None
    return {"value": value, "unit": "USD", "source": "coingecko"}
