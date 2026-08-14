import re
import unittest
from html import unescape
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from app import app


def make_form():
    return {
        "miner_name": "Test Miner",
        "coin": "BTC",
        "hashrate": "100",
        "hashrate_unit": "TH/s",
        "network_hashrate": "10",
        "network_hashrate_unit": "PH/s",
        "quantity": "2",
        "machine_price": "1000",
        "other_cost": "25",
        "power_consumption": "1000",
        "electricity_price": "0.08",
        "pool_fee": "1.5",
        "network_daily_coin_production": "200",
        "coin_price": "65000",
    }


class AppFlowTests(unittest.TestCase):
    def setUp(self):
        app.config.update(TESTING=True)
        self.client = app.test_client()

    def test_edit_assumptions_query_restores_form_values(self):
        form = make_form()
        response = self.client.get("/", query_string=form)
        html = response.get_data(as_text=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn('value="Test Miner"', html)
        self.assertIn('data-selected-coin="BTC"', html)
        self.assertIn('value="100"', html)
        self.assertIn('data-selected-unit="TH/s"', html)
        self.assertIn('value="25"', html)
        self.assertIn('value="65000"', html)

    def test_result_edit_link_carries_submitted_form_values(self):
        response = self.client.post("/", data=make_form())
        html = response.get_data(as_text=True)
        match = re.search(r'href="([^"]+)"[^>]*class="btn btn-outline-light edit-btn"', html)

        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(match)
        query = parse_qs(urlparse(unescape(match.group(1))).query)
        self.assertEqual(query["miner_name"], ["Test Miner"])
        self.assertEqual(query["quantity"], ["2"])
        self.assertEqual(query["coin"], ["BTC"])
        self.assertEqual(query["pool_fee"], ["1.5"])

    def test_result_calculation_detail_labels_have_translations(self):
        response = self.client.post("/", data=make_form())
        html = response.get_data(as_text=True)
        translations = (Path(__file__).parent / "static" / "translations.js").read_text(encoding="utf-8")

        self.assertEqual(response.status_code, 200)
        for key in (
            "originalNetworkHashrate",
            "minerTotalHashrate",
            "effectiveNetworkHashrate",
            "actualMinerShare",
        ):
            self.assertIn(f'data-i18n="result.{key}"', html)
            self.assertEqual(translations.count(f"{key}:"), 5)


if __name__ == "__main__":
    unittest.main()
