"""Unit conversion helpers for mining hashrates.

Conversions normalize miner and network hashrates before calculating their
share. They do not derive coin production independently from that share.
"""

from math import isfinite


class UnitConversionError(ValueError):
    """Raised when a hashrate value or unit cannot be normalized."""


HASHRATE_UNIT_FACTORS = {
    "H/s": 1,
    "kH/s": 10**3,
    "MH/s": 10**6,
    "GH/s": 10**9,
    "TH/s": 10**12,
    "PH/s": 10**15,
    "EH/s": 10**18,
    "Sol/s": 1,
    "kSol/s": 10**3,
    "MSol/s": 10**6,
    "GSol/s": 10**9,
}


def convert_hashrate(value, unit):
    """Convert a displayed hashrate to its algorithm base unit per second."""
    if unit not in HASHRATE_UNIT_FACTORS:
        raise UnitConversionError(f"Hashrate unit is not supported: {unit}.")

    try:
        numeric_value = float(value)
    except (TypeError, ValueError) as error:
        raise UnitConversionError("Hashrate must be a valid number.") from error

    if not isfinite(numeric_value):
        raise UnitConversionError("Hashrate must be a finite number.")
    if numeric_value < 0:
        raise UnitConversionError("Hashrate must be at least 0.")
    return numeric_value * HASHRATE_UNIT_FACTORS[unit]
