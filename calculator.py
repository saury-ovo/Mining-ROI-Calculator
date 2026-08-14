"""Pure calculation logic for the Mining Machine ROI Calculator."""

import logging
from math import isfinite

from unit_converter import (
    HASHRATE_UNIT_FACTORS,
    UnitConversionError,
    convert_hashrate as convert_hashrate_to_base,
)


logger = logging.getLogger(__name__)


class CalculatorError(ValueError):
    """Raised when calculator input cannot produce a meaningful result."""


COIN_CONFIG = {
    "CUSTOM": {
        "key": "custom",
        "ticker": "CUSTOM",
        "algorithm": "",
        "base_unit": "H/s",
        "hash_unit": ["H/s", "kH/s", "MH/s", "GH/s", "TH/s", "PH/s", "EH/s", "Sol/s", "kSol/s", "MSol/s", "GSol/s"],
        "network_hash_unit": ["H/s", "kH/s", "MH/s", "GH/s", "TH/s", "PH/s", "EH/s", "Sol/s", "kSol/s", "MSol/s", "GSol/s"],
    },
    "BTC": {
        "key": "btc",
        "ticker": "BTC",
        "algorithm": "SHA-256",
        "base_unit": "H/s",
        "hash_unit": ["TH/s", "GH/s", "PH/s"],
        "network_hash_unit": ["EH/s", "PH/s", "TH/s"],
    },
    "LTC": {
        "key": "ltc",
        "ticker": "LTC",
        "algorithm": "Scrypt",
        "base_unit": "H/s",
        "hash_unit": ["MH/s", "GH/s"],
        "network_hash_unit": ["MH/s", "GH/s", "TH/s"],
    },
    "DOGE": {
        "key": "doge",
        "ticker": "DOGE",
        "algorithm": "Scrypt",
        "base_unit": "H/s",
        "hash_unit": ["MH/s", "GH/s"],
        "network_hash_unit": ["MH/s", "GH/s", "TH/s"],
    },
    "DASH": {
        "key": "dash",
        "ticker": "DASH",
        "algorithm": "X11",
        "base_unit": "H/s",
        "hash_unit": ["GH/s", "TH/s", "PH/s"],
        "network_hash_unit": ["GH/s", "TH/s", "PH/s"],
    },
    "KAS": {
        "key": "kas",
        "ticker": "KAS",
        "algorithm": "kHeavyHash",
        "base_unit": "H/s",
        "hash_unit": ["GH/s", "TH/s", "PH/s"],
        "network_hash_unit": ["TH/s", "PH/s"],
    },
    "ETC": {
        "key": "etc",
        "ticker": "ETC",
        "algorithm": "Etchash",
        "base_unit": "H/s",
        "hash_unit": ["MH/s", "GH/s"],
        "network_hash_unit": ["MH/s", "GH/s", "TH/s"],
    },
    "ZEC": {
        "key": "zec",
        "ticker": "ZEC",
        "algorithm": "Equihash",
        "base_unit": "Sol/s",
        "hash_unit": ["Sol/s", "kSol/s", "MSol/s", "GSol/s"],
        "network_hash_unit": ["Sol/s", "kSol/s", "MSol/s", "GSol/s"],
    },
    "XMR": {
        "key": "xmr",
        "ticker": "XMR",
        "algorithm": "RandomX",
        "base_unit": "H/s",
        "hash_unit": ["H/s", "kH/s", "MH/s", "GH/s"],
        "network_hash_unit": ["H/s", "kH/s", "MH/s", "GH/s"],
    },
    "RVN": {
        "key": "rvn",
        "ticker": "RVN",
        "algorithm": "KawPow",
        "base_unit": "H/s",
        "hash_unit": ["MH/s", "GH/s", "TH/s"],
        "network_hash_unit": ["MH/s", "GH/s", "TH/s"],
    },
    "ERG": {
        "key": "erg",
        "ticker": "ERG",
        "algorithm": "Autolykos",
        "base_unit": "H/s",
        "hash_unit": ["MH/s", "GH/s", "TH/s"],
        "network_hash_unit": ["MH/s", "GH/s", "TH/s"],
    },
    "ALPH": {
        "key": "alph",
        "ticker": "ALPH",
        "algorithm": "Blake3",
        "base_unit": "H/s",
        "hash_unit": ["GH/s", "TH/s", "PH/s"],
        "network_hash_unit": ["GH/s", "TH/s", "PH/s"],
    },
    "IRONFISH": {
        "key": "ironfish",
        "ticker": "IRONFISH",
        "algorithm": "FishHash",
        "base_unit": "H/s",
        "hash_unit": ["MH/s", "GH/s", "TH/s"],
        "network_hash_unit": ["MH/s", "GH/s", "TH/s"],
    },
}

def convert_hashrate(value, unit):
    """Backward-compatible wrapper around the independent converter."""
    try:
        return convert_hashrate_to_base(value, unit)
    except UnitConversionError as error:
        raise CalculatorError(str(error)) from error


HASH_UNIT_FACTORS = HASHRATE_UNIT_FACTORS


def _text(form_data, field):
    """Read form values consistently from Flask forms and plain test dicts."""
    value = form_data.get(field, "")
    return "" if value is None else str(value).strip()


def _number(form_data, field, label, minimum=0.0, required=True):
    raw_value = _text(form_data, field)
    if not raw_value and not required:
        return 0.0
    if not raw_value:
        raise CalculatorError(f"{label} is required.")

    try:
        value = float(raw_value)
    except (TypeError, ValueError) as error:
        raise CalculatorError(f"{label} must be a valid number.") from error

    if not isfinite(value):
        raise CalculatorError(f"{label} must be a finite number.")
    if value < minimum:
        raise CalculatorError(f"{label} must be at least {minimum:g}.")
    return value


def _hashrate(form_data, field, label, supported_units, required=True):
    """Parse a displayed hashrate and normalize it to its base unit."""
    raw_value = _text(form_data, field)
    selected_unit = _text(form_data, f"{field}_unit")
    if selected_unit and selected_unit not in supported_units:
        raise CalculatorError(f"{label} unit is not supported for this coin.")
    if not raw_value and required:
        raise CalculatorError(f"{label} is required.")
    if not raw_value:
        return {"value": None, "unit": selected_unit or supported_units[0], "base": None}

    try:
        value = float(raw_value)
    except (TypeError, ValueError) as error:
        raise CalculatorError(f"{label} must be a valid number.") from error
    if not isfinite(value):
        raise CalculatorError(f"{label} must be a finite number.")
    if value < 0:
        raise CalculatorError(f"{label} must be at least 0.")
    return {
        "value": value,
        "unit": selected_unit,
        "base": convert_hashrate(value, selected_unit),
    }


def calculate_hashrate_share(miner_hashrate_base, network_hashrate_base):
    """Return the miner's share of normalized network hashrate."""
    if network_hashrate_base <= 0:
        raise CalculatorError("Network Hashrate must be greater than 0.")
    return miner_hashrate_base / network_hashrate_base


def calculate_daily_revenue(total_daily_coin, coin_price):
    """Calculate USD/day from the total estimated coin production."""
    return total_daily_coin * coin_price


def _convert_base_to_unit(value, unit):
    """Convert a normalized hashrate back to a selected display unit."""
    return value / HASH_UNIT_FACTORS[unit]


def calculate_roi(form_data):
    """Calculate investment, operating performance, and ROI metrics.

    The function accepts a mapping such as Flask's request.form and returns
    serializable values for the result template and client-side chart.
    """
    miner_name = _text(form_data, "miner_name")
    coin = _text(form_data, "coin")
    coin = coin.upper()
    if not miner_name or not coin:
        raise CalculatorError("Miner Name and Coin are required.")
    if coin not in COIN_CONFIG:
        raise CalculatorError("Please select a supported coin.")

    coin_settings = COIN_CONFIG[coin]
    is_custom_coin = coin == "CUSTOM"
    algorithm = _text(form_data, "algorithm") if is_custom_coin else coin_settings["algorithm"]
    custom_name = _text(form_data, "custom_name") if is_custom_coin else ""
    if is_custom_coin and not custom_name:
        custom_name = "CUSTOM"
    hashrate = _hashrate(form_data, "hashrate", "Hashrate", coin_settings["hash_unit"])
    network_hashrate = _hashrate(
        form_data,
        "network_hashrate",
        "Network Hashrate",
        coin_settings["network_hash_unit"],
    )

    quantity = _number(form_data, "quantity", "Quantity", minimum=1)
    if not quantity.is_integer():
        raise CalculatorError("Quantity must be a whole number.")
    quantity = int(quantity)

    machine_price = _number(form_data, "machine_price", "Machine Price")
    other_cost = _number(form_data, "other_cost", "Other Cost", required=False)
    power = _number(form_data, "power_consumption", "Power Consumption")
    electricity_price = _number(form_data, "electricity_price", "Electricity Price")
    pool_fee_percent = _number(form_data, "pool_fee", "Pool Fee", minimum=0, required=False)
    if pool_fee_percent > 100:
        raise CalculatorError("Pool Fee cannot exceed 100%.")
    network_daily_coin_production = _number(
        form_data,
        "network_daily_coin_production",
        "Network Daily Coin Production",
    )
    coin_price = _number(form_data, "coin_price", "Coin Price")

    miner_total_hashrate_base = hashrate["base"] * quantity
    original_network_hashrate_base = network_hashrate["base"]
    if original_network_hashrate_base <= 0:
        raise CalculatorError("Network Hashrate must be greater than 0.")
    effective_network_hashrate_base = original_network_hashrate_base + miner_total_hashrate_base
    hashrate_share = calculate_hashrate_share(
        miner_total_hashrate_base,
        effective_network_hashrate_base,
    )
    total_daily_coin = network_daily_coin_production * hashrate_share
    single_miner_daily_coin = total_daily_coin / quantity

    total_investment = machine_price * quantity + other_cost
    daily_energy = (power / 1000) * 24 * quantity
    daily_electricity_cost = daily_energy * electricity_price
    daily_revenue = calculate_daily_revenue(total_daily_coin, coin_price)
    pool_fee = daily_revenue * (pool_fee_percent / 100)
    daily_profit = daily_revenue - daily_electricity_cost - pool_fee
    monthly_profit = daily_profit * 30
    profit_30_days = monthly_profit
    profit_90_days = daily_profit * 90
    annual_profit = daily_profit * 365
    profit_365_days = annual_profit
    roi_days = total_investment / daily_profit if daily_profit > 0 else None
    payback_days = roi_days
    annual_roi = (annual_profit / total_investment) * 100 if total_investment > 0 else 0
    break_even_electricity_price = daily_revenue / daily_energy if daily_energy > 0 else None
    recovery_progress = min(100, (365 / payback_days) * 100) if payback_days else 0
    unrealistic_input = daily_revenue > total_investment * 10
    logger.info(
        "ROI calculation\n"
        "INPUT:\n"
        "coin_input_key: %s\n"
        "coin_config_key: %s\n"
        "hashrate: %s\n"
        "unit: %s\n"
        "network_hashrate: %s\n"
        "network_hashrate_unit: %s\n"
        "network_daily_coin_production: %s\n"
        "coin_price: %s\n"
        "quantity: %s\n"
        "CALCULATION:\n"
        "miner_total_hashrate = hashrate * quantity\n"
        "effective_network_hashrate = network_hashrate + miner_total_hashrate\n"
        "hashrate_share = miner_total_hashrate / effective_network_hashrate\n"
        "total_daily_coin = network_daily_coin_production * hashrate_share\n"
        "single_miner_daily_coin = total_daily_coin / quantity\n"
        "revenue = total_daily_coin * coin_price\n"
        "result:\n"
        "daily_revenue: %s",
        _text(form_data, "coin"),
        coin,
        hashrate["value"],
        hashrate["unit"],
        network_hashrate["value"],
        network_hashrate["unit"],
        network_daily_coin_production,
        coin_price,
        quantity,
        daily_revenue,
    )

    return {
        "coin": coin,
        "custom_name": custom_name,
        "algorithm": algorithm,
        "hashrate_value": hashrate["value"],
        "hashrate_unit": hashrate["unit"],
        "hashrate_base": hashrate["base"],
        "network_hashrate_value": network_hashrate["value"],
        "network_hashrate_unit": network_hashrate["unit"],
        "network_hashrate_base": network_hashrate["base"],
        "hashrate_base_unit": coin_settings["base_unit"],
        "original_network_hashrate_value": network_hashrate["value"],
        "original_network_hashrate_unit": network_hashrate["unit"],
        "miner_total_hashrate_value": hashrate["value"] * quantity,
        "miner_total_hashrate_unit": hashrate["unit"],
        "effective_network_hashrate_value": _convert_base_to_unit(
            effective_network_hashrate_base,
            network_hashrate["unit"],
        ),
        "effective_network_hashrate_unit": network_hashrate["unit"],
        "network_daily_coin_production": network_daily_coin_production,
        "hashrate_share": hashrate_share,
        "mining_share_percent": hashrate_share * 100,
        "single_miner_daily_coin": single_miner_daily_coin,
        "total_daily_coin": total_daily_coin,
        "estimated_daily_coin": total_daily_coin,
        "coin_price": coin_price,
        "total_investment": total_investment,
        "daily_energy": daily_energy,
        "daily_electricity_cost": daily_electricity_cost,
        "daily_revenue": daily_revenue,
        "pool_fee": pool_fee,
        "daily_profit": daily_profit,
        "monthly_profit": monthly_profit,
        "annual_profit": annual_profit,
        "profit_30_days": profit_30_days,
        "profit_90_days": profit_90_days,
        "profit_365_days": profit_365_days,
        "roi_days": roi_days,
        "payback_days": payback_days,
        "annual_roi": annual_roi,
        "break_even_electricity_price": break_even_electricity_price,
        "recovery_progress": recovery_progress,
        "unrealistic_input": unrealistic_input,
        "profit_status": "PROFITABLE" if daily_profit > 0 else "LOSS",
        "pool_fee_percent": pool_fee_percent,
    }
