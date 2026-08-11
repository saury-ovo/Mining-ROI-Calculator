"""External data-source metadata, separate from ROI calculation settings."""


WHAT_TO_MINE_URL = "https://whattomine.com/coins.json"


MARKET_COIN_CONFIG = {
    "BTC": {
        "coingecko_id": "bitcoin",
        "recommended_network_unit": "EH/s",
        "average_block_time": 600,
        "average_block_reward": 3.125,
        "mining_reward_ratio": 1.0,
        "hashrate_providers": [
            {"provider": "mempool", "url": "https://mempool.space/api/v1/mining/hashrate/1m"},
        ],
    },
    "LTC": {
        "coingecko_id": "litecoin",
        "recommended_network_unit": "TH/s",
        "average_block_time": 150,
        "average_block_reward": 6.25,
        "mining_reward_ratio": 1.0,
        "hashrate_providers": [{"provider": "blockchair", "url": "https://api.blockchair.com/litecoin/stats"}],
    },
    "DOGE": {
        "coingecko_id": "dogecoin",
        "recommended_network_unit": "TH/s",
        "average_block_time": 60,
        "average_block_reward": 10000,
        "mining_reward_ratio": 1.0,
        "hashrate_providers": [{"provider": "blockchair", "url": "https://api.blockchair.com/dogecoin/stats"}],
    },
    "KAS": {
        "coingecko_id": "kaspa",
        "recommended_network_unit": "PH/s",
        "hashrate_providers": [{"provider": "kaspa", "url": "https://api.kaspa.org/info/hashrate"}],
    },
    "ETC": {
        "coingecko_id": "ethereum-classic",
        "recommended_network_unit": "TH/s",
        "average_block_time": 13.3333333333,
        "average_block_reward": 1.5,
        "mining_reward_ratio": 1.0,
        "hashrate_providers": [
            {"provider": "2miners", "url": "https://etc.2miners.com/api/stats"},
            {"provider": "whattomine", "url": WHAT_TO_MINE_URL, "coin_id": "EthereumClassic", "coin_tag": "ETC"},
        ],
    },
    "ZEC": {
        "coingecko_id": "zcash",
        "recommended_network_unit": "GSol/s",
        "average_block_time": 75,
        "average_block_reward": 1.5625,
        "mining_reward_ratio": 0.8,
        "hashrate_providers": [
            {"provider": "blockchair", "url": "https://api.blockchair.com/zcash/stats"},
            {"provider": "2miners", "url": "https://zec.2miners.com/api/stats"},
        ],
    },
    "DASH": {
        "coingecko_id": "dash",
        "recommended_network_unit": "TH/s",
        "hashrate_providers": [{"provider": "blockchair", "url": "https://api.blockchair.com/dash/stats"}],
    },
    "XMR": {
        "coingecko_id": "monero",
        "recommended_network_unit": "GH/s",
        "average_block_time": 120,
        "average_block_reward": 0.6,
        "mining_reward_ratio": 1.0,
        "hashrate_providers": [{"provider": "xmrchain", "url": "https://xmrchain.net/api/networkinfo"}],
    },
    "RVN": {
        "coingecko_id": "ravencoin",
        "recommended_network_unit": "TH/s",
        "average_block_time": 60,
        "average_block_reward": 1250,
        "mining_reward_ratio": 1.0,
        "hashrate_providers": [
            {"provider": "2miners", "url": "https://rvn.2miners.com/api/stats"},
            {"provider": "whattomine", "url": WHAT_TO_MINE_URL, "coin_id": "Ravencoin", "coin_tag": "RVN"},
        ],
    },
    "ERG": {
        "coingecko_id": "ergo",
        "recommended_network_unit": "TH/s",
        "average_block_time": 120,
        "average_block_reward": 3,
        "mining_reward_ratio": 1.0,
        "hashrate_providers": [
            {"provider": "ergo", "url": "https://api.ergoplatform.com/info"},
            {"provider": "whattomine", "url": WHAT_TO_MINE_URL, "coin_id": "Ergo", "coin_tag": "ERG"},
        ],
    },
    "ALPH": {
        "coingecko_id": "alephium",
        "recommended_network_unit": "PH/s",
        "hashrate_providers": [{"provider": "alephium", "url": "https://backend.mainnet.alephium.org/charts/hashrates"}],
    },
    "IRONFISH": {
        "coingecko_id": "iron-fish",
        "recommended_network_unit": "TH/s",
        "average_block_time": 60,
        "average_block_reward": 17.25,
        "mining_reward_ratio": 1.0,
        "hashrate_providers": [
            {"provider": "whattomine", "url": WHAT_TO_MINE_URL, "coin_id": "IronFish", "coin_tag": "IRON"},
        ],
    },
}


def get_market_config(coin):
    """Return source metadata for a ticker, or None for unsupported input."""
    return MARKET_COIN_CONFIG.get(str(coin or "").strip().upper())
