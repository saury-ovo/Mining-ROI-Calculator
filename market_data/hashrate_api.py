"""Network hashrate provider adapters and unit normalization."""

import math
import time
from datetime import datetime, timezone
from urllib.parse import urlencode

from .http_client import fetch_json


HASHRATE_FACTORS = {
    "H/s": 1,
    "kH/s": 10**3,
    "MH/s": 10**6,
    "GH/s": 10**9,
    "TH/s": 10**12,
    "PH/s": 10**15,
    "EH/s": 10**18,
}


def _positive_number(value):
    try:
        value = float(value)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(value) or value <= 0:
        return None
    return value


def _timestamp_to_iso(value):
    if value is None:
        return None
    if isinstance(value, (int, float)):
        numeric = float(value)
        if not math.isfinite(numeric) or numeric <= 0:
            return None
        if numeric > 10**11:
            numeric /= 1000
        return datetime.fromtimestamp(numeric, timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
    text = str(value).strip()
    if not text:
        return None
    try:
        parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
    except ValueError:
        try:
            parsed = datetime.strptime(text, "%Y-%m-%d %H:%M:%S").replace(tzinfo=timezone.utc)
        except ValueError:
            return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def _result(value, source_unit, recommended_unit, source, observed_at=None):
    number = _positive_number(value)
    factor = HASHRATE_FACTORS.get(source_unit)
    if number is None or factor is None:
        return None
    result = {
        "base_value": number * factor,
        "recommended_unit": recommended_unit,
        "source": source,
    }
    if observed_at:
        result["observed_at"] = observed_at
    return result


def fetch_network_hashrate(url, recommended_unit="EH/s"):
    """Read Mempool's current hashrate, already expressed in H/s."""
    if not url:
        return None
    payload = fetch_json(url)
    try:
        value = payload["currentHashrate"]
    except (KeyError, TypeError):
        return None
    return _result(value, "H/s", recommended_unit, "mempool")


def fetch_kaspa_hashrate(url, recommended_unit="PH/s"):
    """Read Kaspa's official hashrate endpoint, which reports TH/s."""
    payload = fetch_json(url)
    if not isinstance(payload, dict):
        return None
    return _result(payload.get("hashrate"), "TH/s", recommended_unit, "kaspa")


def fetch_blockchair_hashrate(url, recommended_unit="TH/s"):
    """Read Blockchair's 24-hour network hashrate estimate in H/s."""
    payload = fetch_json(url)
    data = payload.get("data") if isinstance(payload, dict) else None
    if not isinstance(data, dict):
        return None
    return _result(
        data.get("hashrate_24h"),
        "H/s",
        recommended_unit,
        "blockchair",
        _timestamp_to_iso(data.get("best_block_time")),
    )


def fetch_xmrchain_hashrate(url, recommended_unit="GH/s"):
    """Read Monero's networkinfo hashrate estimate in H/s."""
    payload = fetch_json(url)
    data = payload.get("data") if isinstance(payload, dict) else None
    if not isinstance(data, dict):
        return None
    return _result(data.get("hash_rate"), "H/s", recommended_unit, "xmrchain")


def fetch_erg_hashrate(url, recommended_unit="TH/s"):
    """Read Ergo node info's network hashrate in H/s."""
    payload = fetch_json(url)
    if not isinstance(payload, dict):
        return None
    return _result(payload.get("hashRate"), "H/s", recommended_unit, "ergo")


def fetch_alephium_hashrate(url, recommended_unit="PH/s"):
    """Read the latest hourly Alephium explorer hashrate sample in H/s."""
    if not url:
        return None
    now_ms = int(time.time() * 1000)
    query = urlencode({"fromTs": now_ms - 86400000, "toTs": now_ms, "interval-type": "hourly"})
    payload = fetch_json(f"{url}?{query}")
    samples = payload.get("data", payload) if isinstance(payload, dict) else payload
    if not isinstance(samples, list):
        return None
    valid_samples = []
    for sample in samples:
        if not isinstance(sample, dict):
            continue
        timestamp = _positive_number(sample.get("timestamp"))
        value = _positive_number(sample.get("hashrate", sample.get("value")))
        if timestamp is not None and value is not None:
            valid_samples.append((timestamp, value))
    if not valid_samples:
        return None
    timestamp, value = max(valid_samples, key=lambda item: item[0])
    return _result(value, "H/s", recommended_unit, "alephium", _timestamp_to_iso(timestamp / 1000))


def fetch_2miners_hashrate(url, recommended_unit="TH/s"):
    """Read a 2Miners node's networkhashps estimate in H/s."""
    payload = fetch_json(url)
    nodes = payload.get("nodes", []) if isinstance(payload, dict) else []
    if not isinstance(nodes, list):
        return None
    candidates = [
        node for node in nodes
        if isinstance(node, dict) and _positive_number(node.get("networkhashps")) is not None
    ]
    if not candidates:
        return None
    node = candidates[0]
    observed_at = _timestamp_to_iso(payload.get("now")) if isinstance(payload, dict) else None
    return _result(node.get("networkhashps"), "H/s", recommended_unit, "2miners", observed_at)


def fetch_whattomine_hashrate(url, coin_id, coin_tag, recommended_unit="TH/s"):
    """Read WhatToMine's aggregate nethash value in H/s."""
    payload = fetch_json(url)
    coins = payload.get("coins") if isinstance(payload, dict) else None
    if not isinstance(coins, dict):
        return None
    entry = coins.get(coin_id)
    if not isinstance(entry, dict):
        entry = next(
            (
                value
                for value in coins.values()
                if isinstance(value, dict) and str(value.get("tag", "")).upper() == str(coin_tag).upper()
            ),
            None,
        )
    if not isinstance(entry, dict):
        return None
    return _result(entry.get("nethash"), "H/s", recommended_unit, "whattomine")


def fetch_network_hashrate_for_coin(coin, config):
    """Try configured hashrate providers in order and return the first valid value."""
    providers = config.get("hashrate_providers", [])
    if not providers and config.get("hashrate_url"):
        providers = [{"provider": "mempool", "url": config["hashrate_url"]}]
    for provider in providers:
        kind = provider.get("provider")
        url = provider.get("url")
        unit = config.get("recommended_network_unit", "EH/s")
        try:
            if kind == "mempool":
                result = fetch_network_hashrate(url, unit)
            elif kind == "kaspa":
                result = fetch_kaspa_hashrate(url, unit)
            elif kind == "blockchair":
                result = fetch_blockchair_hashrate(url, unit)
            elif kind == "xmrchain":
                result = fetch_xmrchain_hashrate(url, unit)
            elif kind == "ergo":
                result = fetch_erg_hashrate(url, unit)
            elif kind == "alephium":
                result = fetch_alephium_hashrate(url, unit)
            elif kind == "2miners":
                result = fetch_2miners_hashrate(url, unit)
            elif kind == "whattomine":
                result = fetch_whattomine_hashrate(
                    url,
                    provider.get("coin_id", coin),
                    provider.get("coin_tag", coin),
                    unit,
                )
            else:
                result = None
            if result is not None:
                return result
        except Exception:
            continue
    return None
