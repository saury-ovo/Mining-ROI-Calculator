"""Chain metrics adapter used to derive network daily coin production."""

import math
from datetime import datetime, timezone
from statistics import mean

from .http_client import fetch_json


def _reward_ratio(value):
    try:
        value = float(value)
    except (TypeError, ValueError):
        raise ValueError("Mining reward ratio must be numeric.") from None
    if not math.isfinite(value) or value <= 0 or value > 1:
        raise ValueError("Mining reward ratio must be between 0 and 1.")
    return value


def calculate_daily_coin_from_blocks(daily_blocks, block_reward, mining_reward_ratio=1.0):
    """Calculate miner-available daily coins from blocks and protocol reward share."""
    blocks = float(daily_blocks)
    reward = float(block_reward)
    ratio = _reward_ratio(mining_reward_ratio)
    if not math.isfinite(blocks) or blocks <= 0:
        raise ValueError("Daily blocks must be positive and finite.")
    if not math.isfinite(reward) or reward <= 0:
        raise ValueError("Block reward must be positive and finite.")
    return blocks * reward * ratio


def calculate_daily_coin(block_reward, block_time, mining_reward_ratio=1.0):
    """Convert reward-per-block and seconds-per-block into coins per day."""
    interval = float(block_time)
    if not math.isfinite(interval) or interval <= 0:
        raise ValueError("Block time must be positive and finite.")
    return calculate_daily_coin_from_blocks(86400 / interval, block_reward, mining_reward_ratio)


def calculate_protocol_average_daily_coin(config, unit):
    """Calculate average miner coins from fixed protocol parameters.

    This intentionally does not query a chain or market API.  The configured
    block interval and reward represent the protocol average used for the
    calculator's default input value.
    """
    if not isinstance(config, dict):
        return None
    block_time = _number(config.get("average_block_time"))
    block_reward = _number(config.get("average_block_reward"))
    ratio = config.get("mining_reward_ratio")
    if block_time is None or block_reward is None or block_time <= 0 or block_reward <= 0:
        return None
    try:
        ratio = _reward_ratio(ratio)
    except ValueError:
        return None
    return _daily_result(
        86400 / block_time,
        block_reward,
        ratio,
        unit,
        "protocol-average",
    )


def _number(value):
    try:
        value = float(value)
    except (TypeError, ValueError):
        return None
    return value if math.isfinite(value) else None


def _timestamp_to_iso(value):
    if value is None:
        return None
    if isinstance(value, (int, float)):
        number = float(value)
        if not math.isfinite(number) or number <= 0:
            return None
        if number > 10**11:
            number /= 1000
        return datetime.fromtimestamp(number, timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")
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


def _coin_entry(payload, coin_id, coin_tag):
    coins = payload.get("coins") if isinstance(payload, dict) else None
    if not isinstance(coins, dict):
        return None
    entry = coins.get(coin_id)
    if isinstance(entry, dict):
        return entry
    return next(
        (
            value
            for value in coins.values()
            if isinstance(value, dict) and str(value.get("tag", "")).upper() == str(coin_tag).upper()
        ),
        None,
    )


def _daily_result(daily_blocks, block_reward, mining_reward_ratio, unit, source, observed_at=None):
    value = calculate_daily_coin_from_blocks(daily_blocks, block_reward, mining_reward_ratio)
    result = {
        "value": value,
        "unit": unit,
        "source": source,
        "daily_blocks": float(daily_blocks),
        "block_reward": float(block_reward),
        "mining_reward_ratio": float(mining_reward_ratio),
    }
    if observed_at:
        result["observed_at"] = observed_at
    return result


def fetch_blockchair_daily_coin(url, unit, decimals, mining_reward_ratio):
    """Derive daily miner coins from Blockchair's 24-hour issuance statistics."""
    payload = fetch_json(url)
    data = payload.get("data") if isinstance(payload, dict) else None
    if not isinstance(data, dict):
        return None
    daily_blocks = _number(data.get("blocks_24h"))
    inflation_base = _number(data.get("inflation_24h"))
    decimals = _number(decimals)
    if daily_blocks is None or inflation_base is None or inflation_base <= 0:
        return None
    if decimals is None or decimals < 0 or not decimals.is_integer():
        return None
    block_reward = inflation_base / (daily_blocks * 10 ** int(decimals))
    return _daily_result(
        daily_blocks,
        block_reward,
        mining_reward_ratio,
        unit,
        "blockchair-derived",
        _timestamp_to_iso(data.get("best_block_time")),
    )


def fetch_whattomine_daily_coin(url, coin_id, coin_tag, unit, mining_reward_ratio):
    """Derive daily miner coins from WhatToMine block interval statistics."""
    payload = fetch_json(url)
    entry = _coin_entry(payload, coin_id, coin_tag)
    if entry is None:
        return None
    block_time = _number(entry.get("block_time"))
    block_reward = _number(entry.get("block_reward"))
    if block_time is None or block_reward is None or block_time <= 0 or block_reward <= 0:
        return None
    return _daily_result(
        86400 / block_time,
        block_reward,
        mining_reward_ratio,
        unit,
        "whattomine-derived",
    )


def fetch_daily_coin_production_for_coin(coin, config):
    """Return a configured protocol-average value without external requests."""
    return calculate_protocol_average_daily_coin(config, f"{coin}/day")


def _extract_metrics(payload):
    if isinstance(payload, dict):
        direct_reward = _number(payload.get("block_reward"))
        direct_time = _number(payload.get("block_time"))
        if direct_reward is not None and direct_time is not None:
            return direct_reward, direct_time
        blocks = payload.get("blocks", [])
    elif isinstance(payload, list):
        blocks = payload
    else:
        blocks = []

    if not isinstance(blocks, list):
        return None, None

    rewards = []
    timestamps = []
    for block in blocks:
        if not isinstance(block, dict):
            continue
        extras = block.get("extras") if isinstance(block.get("extras"), dict) else {}
        raw_reward = block.get("block_reward", block.get("reward", extras.get("reward")))
        reward = _number(raw_reward)
        if reward is not None:
            # Bitcoin block endpoints commonly report satoshis for reward.
            rewards.append(reward / 10**8 if reward > 1_000_000 else reward)
        timestamp = _number(block.get("timestamp", block.get("time")))
        if timestamp is not None:
            timestamps.append(timestamp)

    if len(rewards) == 0 or len(timestamps) < 2:
        return None, None
    timestamps.sort()
    intervals = [later - earlier for earlier, later in zip(timestamps, timestamps[1:])]
    intervals = [interval for interval in intervals if interval > 0]
    if not intervals:
        return None, None
    return mean(rewards), mean(intervals)


def fetch_daily_coin_production(url, unit="COIN/day"):
    """Fetch chain metrics and return a derived daily production field."""
    if not url:
        return None
    payload = fetch_json(url)
    reward, block_time = _extract_metrics(payload)
    if reward is None or block_time is None:
        return None
    value = calculate_daily_coin(reward, block_time)
    return {"value": value, "unit": unit, "source": "chain-derived"}
