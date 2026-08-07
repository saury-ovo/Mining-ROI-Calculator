/* English-only mining metadata. These values intentionally bypass i18n. */
window.COIN_CONFIG = {
    BTC: {
        ticker: 'BTC', key: 'btc', name: 'Bitcoin', icon: '/static/images/coins/btc.svg', algorithm: 'SHA-256',
        hash_unit: ['TH/s', 'GH/s', 'PH/s'], network_hash_unit: ['EH/s', 'PH/s', 'TH/s'],
    },
    LTC: {
        ticker: 'LTC', key: 'ltc', name: 'Litecoin', icon: '/static/images/coins/ltc.svg', algorithm: 'Scrypt',
        hash_unit: ['MH/s', 'GH/s'], network_hash_unit: ['MH/s', 'GH/s', 'TH/s'],
    },
    DOGE: {
        ticker: 'DOGE', key: 'doge', name: 'Dogecoin', icon: '/static/images/coins/doge.svg', algorithm: 'Scrypt',
        hash_unit: ['MH/s', 'GH/s'], network_hash_unit: ['MH/s', 'GH/s', 'TH/s'],
    },
    KAS: {
        ticker: 'KAS', key: 'kas', name: 'Kaspa', icon: '/static/images/coins/kas.svg', algorithm: 'kHeavyHash',
        hash_unit: ['GH/s', 'TH/s', 'PH/s'], network_hash_unit: ['TH/s', 'PH/s'],
    },
    ETC: {
        ticker: 'ETC', key: 'etc', name: 'Ethereum Classic', icon: '/static/images/coins/etc.svg', algorithm: 'Ethash',
        hash_unit: ['MH/s', 'GH/s'], network_hash_unit: ['MH/s', 'GH/s', 'TH/s'],
    },
    ZEC: {
        ticker: 'ZEC', key: 'zec', name: 'Zcash', icon: '/static/images/coins/zec.svg', algorithm: 'Equihash',
        hash_unit: ['Sol/s', 'kSol/s', 'MSol/s', 'GSol/s'], network_hash_unit: ['Sol/s', 'kSol/s', 'MSol/s', 'GSol/s'],
    },
    DASH: {
        ticker: 'DASH', key: 'dash', name: 'Dash', icon: '/static/images/coins/dash.svg', algorithm: 'X11',
        hash_unit: ['GH/s', 'TH/s', 'PH/s'], network_hash_unit: ['GH/s', 'TH/s', 'PH/s'],
    },
    XMR: {
        ticker: 'XMR', key: 'xmr', name: 'Monero', icon: '/static/images/coins/xmr.svg', algorithm: 'RandomX',
        hash_unit: ['H/s', 'kH/s', 'MH/s', 'GH/s'], network_hash_unit: ['H/s', 'kH/s', 'MH/s', 'GH/s'],
    },
    RVN: {
        ticker: 'RVN', key: 'rvn', name: 'Ravencoin', icon: '/static/images/coins/rvn.svg', algorithm: 'KawPow',
        hash_unit: ['MH/s', 'GH/s', 'TH/s'], network_hash_unit: ['MH/s', 'GH/s', 'TH/s'],
    },
    ERG: {
        ticker: 'ERG', key: 'erg', name: 'Ergo', icon: '/static/images/coins/erg.svg', algorithm: 'Autolykos',
        hash_unit: ['MH/s', 'GH/s', 'TH/s'], network_hash_unit: ['MH/s', 'GH/s', 'TH/s'],
    },
    ALPH: {
        ticker: 'ALPH', key: 'alph', name: 'ALEPHIUM', icon: '', algorithm: 'Blake3',
        hash_unit: ['GH/s', 'TH/s', 'PH/s'], network_hash_unit: ['GH/s', 'TH/s', 'PH/s'],
    },
    IRONFISH: {
        ticker: 'IRONFISH', key: 'ironfish', name: 'IRONFISH', icon: '', algorithm: 'FishHash',
        hash_unit: ['MH/s', 'GH/s', 'TH/s'], network_hash_unit: ['MH/s', 'GH/s', 'TH/s'],
    },
};

window.CoinConfig = window.COIN_CONFIG;
