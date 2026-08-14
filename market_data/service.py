"""Field-level orchestration for optional market data."""

import logging
import threading
import time
from datetime import datetime, timezone

from .chain_api import fetch_daily_coin_production_for_coin
from .coin_config import get_market_config
from .hashrate_api import fetch_network_hashrate_for_coin
from .price_api import fetch_coin_price


logger = logging.getLogger(__name__)
MARKET_CACHE_SECONDS = 60
_cache = {}
_cache_lock = threading.Lock()


def clear_cache():
    """Clear process-local market data, primarily for tests."""
    with _cache_lock:
        _cache.clear()


def _cached(coin):
    with _cache_lock:
        cached = _cache.get(coin)
        if cached and time.monotonic() - cached[0] < MARKET_CACHE_SECONDS:
            return cached[1]
    return None


def _store(coin, payload):
    with _cache_lock:
        _cache[coin] = (time.monotonic(), payload)


def _fetched_at():
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def _load_field(fields, warnings, name, loader):
    try:
        value = loader()
    except Exception as error:  # External providers are intentionally best effort.
        logger.warning("Market data field %s unavailable: %s", name, error)
        warnings.append(f"{name}: unavailable")
        return
    if value is None:
        warnings.append(f"{name}: unavailable")
        return
    fields[name] = value


def get_market_data(coin):
    """Return a stable JSON-ready payload for a supported ticker."""
    ticker = str(coin or "").strip().upper()
    if ticker == "CUSTOM":
        return {
            "coin": ticker,
            "fields": {},
            "warnings": ["custom coin: enter market data manually"],
            "fetched_at": _fetched_at(),
        }
    config = get_market_config(ticker)
    if config is None:
        return {"coin": ticker, "fields": {}, "warnings": ["unsupported coin"], "fetched_at": _fetched_at()}

    cached = _cached(ticker)
    if cached is not None:
        return cached

    fields = {}
    warnings = []
    _load_field(
        fields,
        warnings,
        "coin_price",
        lambda: fetch_coin_price(config.get("coingecko_id")),
    )
    _load_field(
        fields,
        warnings,
        "network_hashrate",
        lambda: fetch_network_hashrate_for_coin(ticker, config),
    )
    _load_field(
        fields,
        warnings,
        "network_daily_coin_production",
        lambda: fetch_daily_coin_production_for_coin(ticker, config),
    )

    payload = {"coin": ticker, "fields": fields, "warnings": warnings, "fetched_at": _fetched_at()}
    _store(ticker, payload)
    return payload
