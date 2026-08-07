import unittest

from calculator import CalculatorError, COIN_CONFIG, calculate_roi
from unit_converter import convert_hashrate


def make_form(coin, hashrate, hashrate_unit, network_hashrate, network_hashrate_unit, production, coin_price, quantity="1"):
    return {
        "miner_name": "Test Miner",
        "coin": coin,
        "hashrate": str(hashrate),
        "hashrate_unit": hashrate_unit,
        "network_hashrate": str(network_hashrate),
        "network_hashrate_unit": network_hashrate_unit,
        "quantity": str(quantity),
        "machine_price": "1000",
        "other_cost": "0",
        "power_consumption": "1000",
        "electricity_price": "0.08",
        "pool_fee": "0",
        "network_daily_coin_production": str(production),
        "coin_price": str(coin_price),
    }


class CalculatorTests(unittest.TestCase):
    def test_hashrate_units_convert_to_base_units(self):
        expected = {
            "H/s": 1, "kH/s": 10**3, "MH/s": 10**6,
            "GH/s": 10**9, "TH/s": 10**12, "PH/s": 10**15,
            "EH/s": 10**18, "Sol/s": 1, "kSol/s": 10**3,
            "MSol/s": 10**6, "GSol/s": 10**9,
        }
        for unit, factor in expected.items():
            with self.subTest(unit=unit):
                self.assertEqual(convert_hashrate(1, unit), factor)

    def test_btc_network_model(self):
        result = calculate_roi(make_form("BTC", 1, "TH/s", 1, "PH/s", 200, 65000))
        expected_share = 0.001 / 1.001
        self.assertAlmostEqual(result["hashrate_share"], expected_share)
        self.assertAlmostEqual(result["mining_share_percent"], expected_share * 100)
        self.assertAlmostEqual(result["single_miner_daily_coin"], 200 * expected_share)
        self.assertAlmostEqual(result["total_daily_coin"], 200 * expected_share)
        self.assertAlmostEqual(result["daily_revenue"], 200 * expected_share * 65000)

    def test_zec_network_model_and_quantity(self):
        result = calculate_roi(make_form("ZEC", 840, "kSol/s", 1, "MSol/s", 1440, 507, quantity="3"))
        self.assertAlmostEqual(result["hashrate_base"], 840000)
        self.assertAlmostEqual(result["network_hashrate_base"], 1000000)
        expected_share = 2.52 / 3.52
        self.assertAlmostEqual(result["hashrate_share"], expected_share)
        self.assertAlmostEqual(result["single_miner_daily_coin"], 1440 * expected_share / 3)
        self.assertAlmostEqual(result["total_daily_coin"], 1440 * expected_share)
        self.assertAlmostEqual(result["daily_revenue"], 1440 * expected_share * 507)

    def test_equivalent_hashrate_units_produce_same_revenue(self):
        first = calculate_roi(make_form("ZEC", 840, "kSol/s", 1, "MSol/s", 0.01, 50, quantity="3"))
        second = calculate_roi(make_form("ZEC", 0.84, "MSol/s", 1000, "kSol/s", 0.01, 50, quantity="3"))
        self.assertAlmostEqual(first["hashrate_share"], second["hashrate_share"])
        self.assertAlmostEqual(first["daily_revenue"], second["daily_revenue"])

    def test_all_supported_coins_use_hashrate_share(self):
        units = {
            "BTC": (500, "TH/s", 1, "PH/s"),
            "LTC": (500, "MH/s", 1, "GH/s"),
            "DOGE": (500, "MH/s", 1, "GH/s"),
            "DASH": (500, "GH/s", 1, "TH/s"),
            "KAS": (500, "TH/s", 1, "PH/s"),
            "ETC": (500, "MH/s", 1, "GH/s"),
            "ZEC": (500, "kSol/s", 1, "MSol/s"),
            "XMR": (500, "H/s", 1, "kH/s"),
            "RVN": (500, "MH/s", 1, "GH/s"),
            "ERG": (500, "MH/s", 1, "GH/s"),
            "ALPH": (500, "GH/s", 1, "TH/s"),
            "IRONFISH": (500, "MH/s", 1, "GH/s"),
        }
        for coin, values in units.items():
            with self.subTest(coin=coin):
                result = calculate_roi(make_form(coin, *values, 10, 2))
                self.assertAlmostEqual(result["hashrate_share"], 1 / 3)
                self.assertAlmostEqual(result["total_daily_coin"], 10 / 3)
                self.assertAlmostEqual(result["daily_revenue"], 20 / 3)
                self.assertEqual(result["algorithm"], COIN_CONFIG[coin]["algorithm"])

    def test_lowercase_coin_keys_are_accepted(self):
        for coin, settings in COIN_CONFIG.items():
            with self.subTest(coin=coin):
                self.assertEqual(settings["key"], coin.lower())
                self.assertEqual(settings["ticker"], coin)
                form = make_form(
                    settings["key"],
                    1,
                    settings["hash_unit"][0],
                    1,
                    settings["network_hash_unit"][0],
                    10,
                    2,
                )
                result = calculate_roi(form)
                self.assertEqual(result["coin"], coin)

    def test_hashrate_dilution_uses_total_miner_hashrate(self):
        form = make_form("BTC", 10, "PH/s", 100, "PH/s", 200, 65000, quantity="1")
        result = calculate_roi(form)

        expected_share = 10 / (100 + 10)
        self.assertAlmostEqual(result["hashrate_share"], expected_share)
        self.assertAlmostEqual(result["total_daily_coin"], 200 * expected_share)
        self.assertAlmostEqual(result["miner_total_hashrate_value"], 10)
        self.assertAlmostEqual(result["effective_network_hashrate_value"], 110)
        self.assertAlmostEqual(result["daily_revenue"], 200 * expected_share * 65000)

    def test_quantity_is_applied_once_to_diluted_share(self):
        form = make_form("DASH", 10, "GH/s", 100, "GH/s", 100, 50, quantity="3")
        result = calculate_roi(form)

        expected_share = 30 / (100 + 30)
        self.assertAlmostEqual(result["hashrate_share"], expected_share)
        self.assertAlmostEqual(result["total_daily_coin"], 100 * expected_share)
        self.assertAlmostEqual(result["single_miner_daily_coin"], 100 * expected_share / 3)

    def test_btc_eh_network_hashrate_conversion(self):
        form = make_form("BTC", 1, "PH/s", 900, "EH/s", 200, 65000)
        result = calculate_roi(form)
        self.assertEqual(result["network_hashrate_unit"], "EH/s")
        self.assertEqual(result["network_hashrate_base"], 900 * 10**18)
        self.assertAlmostEqual(result["effective_network_hashrate_value"], 900.001)
        self.assertAlmostEqual(result["hashrate_share"], 1 / (900000 + 1))

    def test_legacy_growth_model_is_removed(self):
        import calculator

        self.assertFalse(hasattr(calculator, "HASHRATE_GROWTH_RATE"))

    def test_payback_days_use_daily_profit(self):
        result = calculate_roi(make_form("BTC", 1, "TH/s", 1, "PH/s", 200, 65000))
        expected_payback_days = result["total_investment"] / result["daily_profit"]
        self.assertAlmostEqual(result["payback_days"], expected_payback_days)

    def test_dilution_is_supported_for_btc_dash_and_ltc(self):
        forms = {
            "BTC": make_form("btc", 1, "TH/s", 1, "PH/s", 200, 65000),
            "DASH": make_form("dash", 1, "GH/s", 1, "TH/s", 100, 50),
            "LTC": make_form("ltc", 1, "MH/s", 1, "GH/s", 100, 100),
        }
        for coin, form in forms.items():
            with self.subTest(coin=coin):
                result = calculate_roi(form)
                self.assertEqual(result["coin"], coin)
                self.assertIsInstance(result["monthly_profit"], float)
                self.assertIsInstance(result["annual_profit"], float)

    def test_old_daily_coin_output_field_is_not_used(self):
        form = make_form("BTC", 1, "TH/s", 1, "PH/s", 200, 65000)
        form["daily_coin_output"] = "999999"
        result = calculate_roi(form)
        expected_share = 0.001 / 1.001
        self.assertAlmostEqual(result["daily_revenue"], 200 * expected_share * 65000)
        self.assertNotIn("daily_coin_output", result)

    def test_network_daily_production_is_required(self):
        form = make_form("BTC", 1, "TH/s", 1, "PH/s", 200, 65000)
        form.pop("network_daily_coin_production")
        with self.assertRaises(CalculatorError):
            calculate_roi(form)

    def test_network_hashrate_must_be_positive(self):
        form = make_form("BTC", 1, "TH/s", 0, "PH/s", 200, 65000)
        with self.assertRaises(CalculatorError):
            calculate_roi(form)


if __name__ == "__main__":
    unittest.main()
