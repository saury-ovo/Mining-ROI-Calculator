"""Small standard-library JSON client with bounded network behavior."""

import json
from urllib.request import Request, urlopen


DEFAULT_TIMEOUT_SECONDS = 4
USER_AGENT = "ASIC-ROI-Analyzer/1.1"


def fetch_json(url, timeout=DEFAULT_TIMEOUT_SECONDS):
    """Fetch a JSON document without leaking provider errors to callers."""
    request = Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": USER_AGENT,
        },
    )
    with urlopen(request, timeout=timeout) as response:
        status = getattr(response, "status", None)
        if status is not None and status >= 400:
            raise RuntimeError(f"Market data provider returned HTTP {status}.")
        payload = json.loads(response.read().decode("utf-8"))
    if not isinstance(payload, (dict, list)):
        raise ValueError("Market data provider returned an invalid JSON shape.")
    return payload
