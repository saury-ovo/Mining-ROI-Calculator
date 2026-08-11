import json
import unittest
from unittest.mock import patch

from app import app
from market_data.chain_api import (
    calculate_daily_coin,
    calculate_daily_coin_from_blocks,
    fetch_blockchair_daily_coin,
    fetch_daily_coin_production,
    fetch_daily_coin_production_for_coin,
    fetch_whattomine_daily_coin,
)
from market_data.hashrate_api import (
    fetch_2miners_hashrate,
    fetch_alephium_hashrate,
    fetch_blockchair_hashrate,
    fetch_erg_hashrate,
    fetch_kaspa_hashrate,
    fetch_network_hashrate,
    fetch_network_hashrate_for_coin,
    fetch_whattomine_hashrate,
    fetch_xmrchain_hashrate,
)
from market_data.price_api import fetch_coin_price
from market_data.coin_config import get_market_config
from market_data.service import clear_cache, get_market_data


class FakeResponse:
    def __init__(self, payload):
        self.payload = payload

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return False

    def read(self):
        return json.dumps(self.payload).encode("utf-8")


class MarketDataProviderTests(unittest.TestCase):
    @patch("market_data.price_api.fetch_json")
    def test_price_api_parses_usd_price(self, fetch_json):
        fetch_json.return_value = {"bitcoin": {"usd": 65000.25}}

        result = fetch_coin_price("bitcoin")

        self.assertEqual(result, {"value": 65000.25, "unit": "USD", "source": "coingecko"})

    @patch("market_data.price_api.fetch_json")
    def test_price_api_returns_none_for_missing_price(self, fetch_json):
        fetch_json.return_value = {"bitcoin": {}}

        self.assertIsNone(fetch_coin_price("bitcoin"))

    @patch("market_data.price_api.fetch_json", side_effect=TimeoutError("price timeout"))
    def test_price_api_timeout_is_reported_to_the_service(self, fetch_json):
        with self.assertRaises(TimeoutError):
            fetch_coin_price("bitcoin")

    @patch("market_data.hashrate_api.fetch_json")
    def test_hashrate_api_normalizes_mempool_hashrate_to_h_per_second(self, fetch_json):
        fetch_json.return_value = {"currentHashrate": 9 * 10**20}

        result = fetch_network_hashrate("https://mempool.space/api/v1/mining/hashrate/1m")

        self.assertEqual(result["base_value"], 9 * 10**20)
        self.assertEqual(result["recommended_unit"], "EH/s")

    @patch("market_data.hashrate_api.fetch_json")
    def test_kaspa_hashrate_converts_th_per_second_to_h_per_second(self, fetch_json):
        fetch_json.return_value = {"hashrate": 299878.5}

        result = fetch_kaspa_hashrate("https://api.kaspa.org/info/hashrate", "PH/s")

        self.assertAlmostEqual(result["base_value"], 299878.5 * 10**12)
        self.assertEqual(result["recommended_unit"], "PH/s")
        self.assertEqual(result["source"], "kaspa")

    @patch("market_data.hashrate_api.fetch_json")
    def test_blockchair_hashrate_includes_provider_observation_time(self, fetch_json):
        fetch_json.return_value = {
            "data": {
                "hashrate_24h": "123456789",
                "best_block_time": "2026-08-11 03:10:04",
            }
        }

        result = fetch_blockchair_hashrate("https://api.blockchair.com/dogecoin/stats", "TH/s")

        self.assertEqual(result["base_value"], 123456789)
        self.assertEqual(result["recommended_unit"], "TH/s")
        self.assertEqual(result["observed_at"], "2026-08-11T03:10:04Z")
        self.assertEqual(result["source"], "blockchair")

    @patch("market_data.hashrate_api.fetch_json")
    def test_alephium_hashrate_uses_latest_chart_sample(self, fetch_json):
        fetch_json.return_value = [
            {"timestamp": 1000, "hashrate": "1000"},
            {"timestamp": 3000, "hashrate": "3000"},
            {"timestamp": 2000, "hashrate": "2000"},
        ]

        result = fetch_alephium_hashrate("https://backend.mainnet.alephium.org/charts/hashrates", "PH/s")

        self.assertEqual(result["base_value"], 3000)
        self.assertEqual(result["observed_at"], "1970-01-01T00:00:03Z")
        self.assertEqual(result["source"], "alephium")

    @patch("market_data.hashrate_api.fetch_json")
    def test_chain_and_pool_hashrate_adapters_parse_network_values(self, fetch_json):
        fetch_json.return_value = {"data": {"hash_rate": 6086994237}}
        xmr = fetch_xmrchain_hashrate("https://xmrchain.net/api/networkinfo", "GH/s")
        self.assertEqual(xmr["base_value"], 6086994237)

        fetch_json.return_value = {"hashRate": 515884691159}
        erg = fetch_erg_hashrate("https://api.ergoplatform.com/info", "TH/s")
        self.assertEqual(erg["base_value"], 515884691159)

        fetch_json.return_value = {"nodes": [{"networkhashps": "183829665452051"}]}
        etc = fetch_2miners_hashrate("https://etc.2miners.com/api/stats", "TH/s")
        self.assertEqual(etc["base_value"], 183829665452051)

    @patch("market_data.hashrate_api.fetch_json")
    def test_whattomine_hashrate_matches_coin_tag(self, fetch_json):
        fetch_json.return_value = {
            "coins": {
                "IronFish": {"tag": "IRON", "nethash": 281527318167}
            }
        }

        result = fetch_whattomine_hashrate(
            "https://whattomine.com/coins.json", "IronFish", "IRON", "TH/s"
        )

        self.assertEqual(result["base_value"], 281527318167)
        self.assertEqual(result["source"], "whattomine")

    @patch("market_data.hashrate_api.fetch_whattomine_hashrate")
    @patch("market_data.hashrate_api.fetch_2miners_hashrate", side_effect=TimeoutError("pool timeout"))
    def test_hashrate_provider_falls_back_after_primary_failure(self, fetch_pool, fetch_whattomine):
        fetch_whattomine.return_value = {
            "base_value": 32686898173,
            "recommended_unit": "TH/s",
            "source": "whattomine",
        }
        config = {
            "recommended_network_unit": "TH/s",
            "hashrate_providers": [
                {"provider": "2miners", "url": "https://rvn.2miners.com/api/stats"},
                {
                    "provider": "whattomine",
                    "url": "https://whattomine.com/coins.json",
                    "coin_id": "Ravencoin",
                    "coin_tag": "RVN",
                },
            ],
        }

        result = fetch_network_hashrate_for_coin("RVN", config)

        self.assertEqual(result["source"], "whattomine")
        fetch_pool.assert_called_once()
        fetch_whattomine.assert_called_once()

    def test_chain_api_calculates_daily_coin_production(self):
        self.assertAlmostEqual(calculate_daily_coin(3.125, 600), 450)

    def test_daily_coin_uses_blocks_reward_and_miner_ratio(self):
        self.assertAlmostEqual(calculate_daily_coin_from_blocks(144, 3.125, 0.8), 360)

        with self.assertRaises(ValueError):
            calculate_daily_coin_from_blocks(144, 3.125, 0)
        with self.assertRaises(ValueError):
            calculate_daily_coin_from_blocks(144, 3.125, 1.01)

    @patch("market_data.chain_api.fetch_json")
    def test_protocol_average_daily_coin_uses_configured_average(self, fetch_json):
        btc = fetch_daily_coin_production_for_coin("BTC", get_market_config("BTC"))
        ltc = fetch_daily_coin_production_for_coin("LTC", get_market_config("LTC"))
        zec = fetch_daily_coin_production_for_coin("ZEC", get_market_config("ZEC"))

        self.assertAlmostEqual(btc["value"], 450)
        self.assertAlmostEqual(ltc["value"], 3600)
        self.assertAlmostEqual(zec["value"], 1440)
        self.assertEqual(btc["source"], "protocol-average")
        self.assertEqual(btc["daily_blocks"], 144)
        self.assertEqual(btc["block_reward"], 3.125)
        self.assertEqual(zec["block_reward"], 1.5625)
        self.assertEqual(zec["mining_reward_ratio"], 0.8)
        fetch_json.assert_not_called()

    @patch("market_data.chain_api.fetch_json")
    def test_blockchair_daily_coin_derives_average_reward_from_24h_stats(self, fetch_json):
        fetch_json.return_value = {
            "data": {
                "blocks_24h": 144,
                "inflation_24h": 45_000_000_000,
                "best_block_time": "2026-08-11 03:10:04",
            }
        }

        result = fetch_blockchair_daily_coin(
            "https://api.blockchair.com/bitcoin/stats",
            "BTC/day",
            decimals=8,
            mining_reward_ratio=0.8,
        )

        self.assertAlmostEqual(result["value"], 360)
        self.assertEqual(result["daily_blocks"], 144)
        self.assertAlmostEqual(result["block_reward"], 3.125)
        self.assertEqual(result["mining_reward_ratio"], 0.8)
        self.assertEqual(result["source"], "blockchair-derived")
        self.assertEqual(result["observed_at"], "2026-08-11T03:10:04Z")

    @patch("market_data.chain_api.fetch_json")
    def test_whattomine_daily_coin_uses_block_time(self, fetch_json):
        fetch_json.return_value = {
            "coins": {
                "EthereumClassic": {
                    "tag": "ETC",
                    "block_time": 13.3333333333,
                    "block_reward": 1.5,
                }
            }
        }

        result = fetch_whattomine_daily_coin(
            "https://whattomine.com/coins.json",
            "EthereumClassic",
            "ETC",
            "ETC/day",
            mining_reward_ratio=1.0,
        )

        self.assertAlmostEqual(result["daily_blocks"], 6480)
        self.assertAlmostEqual(result["value"], 9720)
        self.assertEqual(result["source"], "whattomine-derived")

    def test_zec_ratio_without_reliable_chain_provider_stays_empty(self):
        self.assertIsNone(fetch_daily_coin_production_for_coin("ZEC", {
            "mining_reward_ratio": 0.8,
            "daily_coin_providers": [],
        }))

    @patch("market_data.chain_api.fetch_json")
    def test_chain_api_parses_reward_and_block_time(self, fetch_json):
        fetch_json.return_value = {"block_reward": 3.125, "block_time": 600}

        result = fetch_daily_coin_production("https://example.invalid/chain")

        self.assertEqual(result["value"], 450)
        self.assertEqual(result["unit"], "COIN/day")


class MarketDataServiceTests(unittest.TestCase):
    def setUp(self):
        clear_cache()

    @patch("market_data.service.fetch_daily_coin_production_for_coin")
    @patch("market_data.service.fetch_network_hashrate_for_coin")
    @patch("market_data.service.fetch_coin_price")
    def test_one_field_failure_does_not_remove_other_fields(
        self,
        fetch_price,
        fetch_hashrate,
        fetch_daily_coin,
    ):
        fetch_price.return_value = {"value": 65000, "unit": "USD", "source": "coingecko"}
        fetch_hashrate.return_value = {"base_value": 9 * 10**20, "recommended_unit": "EH/s", "source": "mempool"}
        fetch_daily_coin.side_effect = TimeoutError("chain timeout")

        result = get_market_data("BTC")

        self.assertIn("coin_price", result["fields"])
        self.assertIn("network_hashrate", result["fields"])
        self.assertNotIn("network_daily_coin_production", result["fields"])
        self.assertTrue(result["warnings"])
        self.assertIn("fetched_at", result)

    def test_unsupported_coin_returns_empty_success_payload(self):
        result = get_market_data("UNKNOWN")

        self.assertEqual(result["coin"], "UNKNOWN")
        self.assertEqual(result["fields"], {})
        self.assertTrue(result["warnings"])


class MarketDataRouteTests(unittest.TestCase):
    def setUp(self):
        app.config.update(TESTING=True)
        self.client = app.test_client()

    @patch("market_data.service.fetch_coin_price", return_value=None)
    @patch("market_data.service.fetch_network_hashrate_for_coin", return_value=None)
    @patch("market_data.service.fetch_daily_coin_production_for_coin", return_value=None)
    def test_market_data_route_returns_json_for_missing_coin_data(self, fetch_daily, fetch_hashrate, fetch_price):
        response = self.client.get("/api/market-data?coin=IRONFISH")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["coin"], "IRONFISH")
        self.assertIn("fields", response.json)

    def test_market_data_route_returns_json_for_unknown_coin(self):
        response = self.client.get("/api/market-data?coin=UNKNOWN")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["fields"], {})

    @patch("app.get_market_data", side_effect=RuntimeError("market service offline"))
    def test_index_remains_available_when_market_service_is_unavailable(self, get_market_data):
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)


if __name__ == "__main__":
    unittest.main()
