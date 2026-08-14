document.addEventListener('DOMContentLoaded', () => {
    const translate = (key) => window.MiningI18n ? window.MiningI18n.t(key) : key;
    const coinConfig = window.COIN_CONFIG || window.CoinConfig || {};

    console.log('coin selector initialized');
    console.log(window.COIN_CONFIG);

    const coinSelect = document.getElementById('coin');
    const coinDropdown = document.querySelector('[data-coin-dropdown]');
    const coinDropdownButton = document.getElementById('coinDropdownButton');
    const coinDropdownValue = document.getElementById('coinDropdownValue');
    const coinDropdownMenu = document.getElementById('coinDropdownMenu');
    const algorithmInput = document.getElementById('algorithm');
    const customNameInput = document.getElementById('custom_name');
    const customNameField = document.getElementById('custom-name-field');
    const hashrateUnitSelect = document.getElementById('hashrate_unit');
    const networkHashrateUnitSelect = document.getElementById('network_hashrate_unit');

    const getCoinId = (submittedValue) => {
        const value = String(submittedValue || '');
        if (coinConfig[value]) return value;
        return Object.keys(coinConfig).find((coin) => {
            const settings = coinConfig[coin];
            return (settings.key || coin.toLowerCase()) === value.toLowerCase()
                || (settings.ticker || coin).toUpperCase() === value.toUpperCase();
        }) || '';
    };

    const getCoinSettings = () => {
        const coinId = getCoinId(coinSelect?.value);
        return coinId ? coinConfig[coinId] : null;
    };

    const populateUnitSelect = (select, units) => {
        if (!select) return;
        const previousValue = select.value || select.dataset.selectedUnit;
        select.replaceChildren();
        units.forEach((unit) => {
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = unit;
            select.appendChild(option);
        });
        select.disabled = units.length === 0;
        if (units.length > 0) select.value = units.includes(previousValue) ? previousValue : units[0];
    };

    const createCoinIcon = (coin, settings) => {
        const icon = document.createElement('span');
        icon.className = 'coin-icon is-fallback';
        icon.textContent = (settings.ticker || coin).slice(0, 2);
        if (!settings.icon) return icon;

        const image = document.createElement('img');
        image.src = settings.icon;
        image.alt = '';
        image.addEventListener('load', () => {
            icon.classList.remove('is-fallback');
        });
        image.addEventListener('error', () => {
            image.remove();
            icon.textContent = (settings.ticker || coin).slice(0, 2);
        });
        icon.replaceChildren(image);
        return icon;
    };

    const createCoinContent = (coin, settings) => {
        const content = document.createElement('span');
        content.className = 'coin-option-content';
        content.appendChild(createCoinIcon(coin, settings));

        const ticker = document.createElement('span');
        ticker.className = 'coin-ticker';
        ticker.textContent = settings.labelKey ? translate(settings.labelKey) : (settings.ticker || coin);
        content.appendChild(ticker);

        return content;
    };

    const renderSelectedCoin = () => {
        if (!coinDropdownValue || !coinSelect) return;
        const coin = getCoinId(coinSelect.value);
        const settings = coin ? coinConfig[coin] : null;
        coinDropdownValue.replaceChildren();
        if (!settings) {
            const emptyLabel = document.createElement('span');
            emptyLabel.className = 'coin-empty-label';
            emptyLabel.textContent = translate('coin.selectPrompt');
            coinDropdownValue.appendChild(emptyLabel);
            return;
        }
        coinDropdownValue.appendChild(createCoinContent(coin, settings));
    };

    const renderCoinOptions = () => {
        if (!coinDropdownMenu || !coinSelect) return;
        coinDropdownMenu.replaceChildren();
        Object.keys(coinConfig).forEach((coin) => {
            const option = document.createElement('button');
            option.type = 'button';
            option.className = 'coin-option';
            option.setAttribute('role', 'option');
            option.dataset.coin = coin;
            option.setAttribute('aria-selected', getCoinId(coinSelect.value) === coin ? 'true' : 'false');
            option.appendChild(createCoinContent(coin, coinConfig[coin]));
            option.addEventListener('click', () => {
                coinSelect.value = coinConfig[coin].key || coin.toLowerCase();
                coinSelect.dispatchEvent(new Event('change', { bubbles: true }));
                setDropdownOpen(false);
            });
            coinDropdownMenu.appendChild(option);
        });
    };

    const setDropdownOpen = (isOpen) => {
        if (!coinDropdown || !coinDropdownButton || !coinDropdownMenu) return;
        coinDropdown.classList.toggle('is-open', isOpen);
        coinDropdownButton.setAttribute('aria-expanded', String(isOpen));
        coinDropdownMenu.hidden = !isOpen;
    };

    const syncCoinFields = () => {
        const settings = getCoinSettings();
        if (!settings) {
            if (algorithmInput) algorithmInput.value = '';
            populateUnitSelect(hashrateUnitSelect, []);
            populateUnitSelect(networkHashrateUnitSelect, []);
            return;
        }
        const isCustom = Boolean(settings.isCustom);
        if (algorithmInput) {
            if (!isCustom) algorithmInput.value = settings.algorithm;
            algorithmInput.readOnly = !isCustom;
            algorithmInput.setAttribute('aria-readonly', String(!isCustom));
            algorithmInput.classList.toggle('readonly-control', !isCustom);
        }
        if (customNameField) customNameField.hidden = !isCustom;
        populateUnitSelect(hashrateUnitSelect, settings.hash_unit || []);
        populateUnitSelect(networkHashrateUnitSelect, settings.network_hash_unit || settings.hash_unit || []);
    };

    const syncResultCoinLabel = () => {
        document.querySelectorAll('.custom-coin-label').forEach((resultCoin) => {
            if (resultCoin.dataset.defaultCoin !== 'CUSTOM') return;
            resultCoin.textContent = resultCoin.dataset.customName || translate('coin.custom');
        });
    };

    if (coinSelect) {
        const selectedCoin = coinSelect.dataset.selectedCoin;
        const selectedCoinId = getCoinId(selectedCoin);
        if (selectedCoinId) {
            coinSelect.value = coinConfig[selectedCoinId].key || selectedCoinId.toLowerCase();
        }
        renderCoinOptions();
        renderSelectedCoin();
        syncCoinFields();
        syncResultCoinLabel();
        networkHashrateUnitSelect?.setAttribute(
            'data-market-unit-source',
            networkHashrateUnitSelect.dataset.selectedUnit ? 'manual' : 'auto',
        );
        let previousCoinId = selectedCoinId;
        coinSelect.addEventListener('change', () => {
            const nextCoinId = getCoinId(coinSelect.value);
            if (previousCoinId === 'CUSTOM' && nextCoinId !== 'CUSTOM') {
                marketFieldIds.forEach((field) => {
                    const input = marketInput(field);
                    if (input?.dataset.marketSource === 'manual') {
                        input.value = '';
                        input.dataset.marketSource = 'empty';
                    }
                });
            }
            if (nextCoinId === 'CUSTOM' && previousCoinId !== 'CUSTOM' && algorithmInput) {
                algorithmInput.value = '';
            }
            networkHashrateUnitSelect?.setAttribute('data-market-unit-source', 'auto');
            syncCoinFields();
            renderSelectedCoin();
            renderCoinOptions();
            resetMarketApiValues();
            updateInputMonitor();
            requestMarketData();
            previousCoinId = nextCoinId;
        });
        coinDropdownButton?.addEventListener('click', () => {
            setDropdownOpen(coinDropdownButton.getAttribute('aria-expanded') !== 'true');
        });
        document.addEventListener('click', (event) => {
            if (coinDropdown && !coinDropdown.contains(event.target)) setDropdownOpen(false);
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setDropdownOpen(false);
        });
        window.addEventListener('languagechange', () => {
            renderSelectedCoin();
            renderCoinOptions();
        });
    }

    // Keep the user's in-progress string intact. In particular, "0." is a
    // valid intermediate state and must not be coerced during input.
    const decimalInputs = document.querySelectorAll('[data-number-mode="decimal"]');
    const sanitizeDecimal = (rawValue) => {
        let value = String(rawValue ?? '').replace(/[^0-9.]/g, '');
        const decimalIndex = value.indexOf('.');
        if (decimalIndex !== -1) {
            value = value.slice(0, decimalIndex + 1) + value.slice(decimalIndex + 1).replace(/\./g, '');
        }
        if (value.startsWith('.')) value = `0${value}`;
        return value;
    };
    const normalizeOnBlur = (input) => {
        let value = sanitizeDecimal(input.value);
        const maximumText = input.dataset.max;
        if (value !== '' && value !== '.' && value !== '0.' && maximumText) {
            const numericValue = Number(value);
            const maximum = Number(maximumText);
            if (Number.isFinite(numericValue) && Number.isFinite(maximum) && numericValue > maximum) {
                value = maximumText;
            }
        }
        input.value = value;
    };

    const monitorRequiredFields = [
        'miner_name',
        'coin',
        'hashrate',
        'network_hashrate',
        'quantity',
        'machine_price',
        'power_consumption',
        'electricity_price',
        'network_daily_coin_production',
        'coin_price',
    ];

    const readMonitorNumber = (id) => {
        const input = document.getElementById(id);
        if (!input) return null;
        const rawValue = input.value.trim();
        if (!rawValue || rawValue === '.' || rawValue.endsWith('.')) return null;
        const numericValue = Number(rawValue);
        return Number.isFinite(numericValue) ? numericValue : null;
    };

    const isMonitorFieldReady = (id) => {
        if (id === 'miner_name') return Boolean(document.getElementById(id)?.value.trim());
        if (id === 'coin') return Boolean(getCoinSettings());
        const input = document.getElementById(id);
        const value = readMonitorNumber(id);
        if (!input || value === null) return false;
        if (id === 'quantity') return Number.isInteger(value);
        return value >= 0;
    };

    const formatMonitorValue = (value, digits = 2) => (
        Number.isFinite(value) ? value.toFixed(digits) : '--'
    );

    const updateInputMonitor = () => {
        const readiness = document.getElementById('live-input-readiness');
        const totalPower = document.getElementById('live-total-power');
        const machinePowerCost = document.getElementById('live-machine-power-cost');
        const selectedCoin = document.getElementById('live-selected-coin');
        const selectedAlgorithm = document.getElementById('live-selected-algorithm');

        if (readiness) {
            const readyCount = monitorRequiredFields.reduce(
                (count, field) => count + (isMonitorFieldReady(field) ? 1 : 0),
                0,
            );
            readiness.textContent = `${readyCount} / ${monitorRequiredFields.length}`;
        }

        const power = readMonitorNumber('power_consumption');
        const quantity = readMonitorNumber('quantity');
        const electricityPrice = readMonitorNumber('electricity_price');

        if (totalPower) {
            const totalPowerKw = power !== null && quantity !== null
                ? power * quantity / 1000
                : null;
            totalPower.textContent = formatMonitorValue(totalPowerKw);
        }

        if (machinePowerCost) {
            const dailyCost = power !== null && electricityPrice !== null
                ? power / 1000 * 24 * electricityPrice
                : null;
            machinePowerCost.textContent = dailyCost === null
                ? '--'
                : `$${formatMonitorValue(dailyCost)}`;
        }

        const settings = getCoinSettings();
        if (selectedCoin) {
            selectedCoin.textContent = settings
                ? (settings.isCustom ? (customNameInput?.value.trim() || translate('coin.custom')) : (settings.ticker || getCoinId(coinSelect.value)))
                : '--';
        }
        if (selectedAlgorithm) {
            selectedAlgorithm.textContent = settings?.isCustom
                ? (algorithmInput?.value.trim() || '--')
                : (settings?.algorithm || '--');
        }
    };

    const marketFieldIds = [
        'coin_price',
        'network_daily_coin_production',
        'network_hashrate',
    ];
    const hashrateFactors = {
        'H/s': 1,
        'kH/s': 10 ** 3,
        'MH/s': 10 ** 6,
        'GH/s': 10 ** 9,
        'TH/s': 10 ** 12,
        'PH/s': 10 ** 15,
        'EH/s': 10 ** 18,
        'Sol/s': 1,
        'kSol/s': 10 ** 3,
        'MSol/s': 10 ** 6,
        'GSol/s': 10 ** 9,
    };
    let marketRequestToken = 0;
    let marketHashrateBaseValue = null;
    let marketRefreshTimer = null;

    const marketInput = (field) => document.getElementById(field);
    const formatMarketNumber = (value) => {
        if (!Number.isFinite(value)) return '';
        return Number(value.toPrecision(12)).toString();
    };

    const setMarketStatus = (key, state = '') => {
        const status = document.getElementById('market-data-status');
        const message = document.getElementById('market-data-message');
        if (!status || !message) return;
        if (!key) {
            status.hidden = true;
            status.dataset.i18nKey = '';
            return;
        }
        status.hidden = false;
        status.dataset.i18nKey = key;
        status.dataset.state = state;
        status.classList.toggle('is-loading', state === 'loading');
        status.classList.toggle('is-warning', state === 'warning');
        message.textContent = translate(key);
    };

    const formatMarketTimestamp = (value) => {
        const date = new Date(value);
        if (!value || Number.isNaN(date.getTime())) return '--';
        const pad = number => String(number).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const setMarketMeta = (fields, fetchedAt) => {
        const meta = document.getElementById('market-data-meta');
        const sourceValue = document.getElementById('market-data-source');
        const fetchedValue = document.getElementById('market-data-fetched');
        const observedValue = document.getElementById('market-data-observed');
        if (!meta || !sourceValue || !fetchedValue || !observedValue) return;
        const sources = Object.values(fields || {})
            .map((field) => field?.source)
            .filter(Boolean);
        if (sources.length === 0) {
            meta.hidden = true;
            return;
        }
        sourceValue.textContent = [...new Set(sources)].join(', ');
        fetchedValue.textContent = formatMarketTimestamp(fetchedAt);
        const observedAt = Object.values(fields || {})
            .map((field) => field?.observed_at)
            .filter(Boolean)
            .map((value) => new Date(value))
            .filter((date) => !Number.isNaN(date.getTime()))
            .sort((left, right) => right.getTime() - left.getTime())[0];
        observedValue.textContent = observedAt ? formatMarketTimestamp(observedAt.toISOString()) : '--';
        meta.hidden = false;
    };

    const setMarketValue = (field, value) => {
        const input = marketInput(field);
        if (!input) return false;
        const source = input.dataset.marketSource || 'empty';
        if (source === 'manual' || source === 'initial') return false;
        if (!Number.isFinite(value)) {
            if (source === 'api') input.value = '';
            input.dataset.marketSource = 'empty';
            return false;
        }
        input.value = formatMarketNumber(value);
        input.dataset.marketSource = 'api';
        return true;
    };

    const resetMarketApiValues = () => {
        marketHashrateBaseValue = null;
        setMarketMeta({});
        marketFieldIds.forEach((field) => {
            const input = marketInput(field);
            if (input?.dataset.marketSource === 'api') {
                input.value = '';
                input.dataset.marketSource = 'empty';
            }
        });
    };

    const applyNetworkHashrate = (field) => {
        const input = marketInput('network_hashrate');
        if (!input || !field || !Number.isFinite(Number(field.base_value))) return false;
        marketHashrateBaseValue = Number(field.base_value);
        const recommendedUnit = field.recommended_unit;
        const supportedUnits = Array.from(networkHashrateUnitSelect?.options || []).map((option) => option.value);
        const unitSource = networkHashrateUnitSelect?.dataset.marketUnitSource || 'auto';
        if (unitSource !== 'manual' && supportedUnits.includes(recommendedUnit)) {
            networkHashrateUnitSelect.value = recommendedUnit;
        }
        const unit = networkHashrateUnitSelect?.value;
        const factor = hashrateFactors[unit];
        return factor ? setMarketValue('network_hashrate', marketHashrateBaseValue / factor) : false;
    };

    const requestMarketData = async () => {
        const coinId = getCoinId(coinSelect?.value);
        const settings = getCoinSettings();
        if (!coinId || !settings) return;
        if (settings.isCustom) {
            setMarketStatus('index.marketCustomManual', 'warning');
            setMarketMeta({});
            updateInputMonitor();
            return;
        }
        const requestToken = ++marketRequestToken;
        setMarketStatus('index.marketLoading', 'loading');
        try {
            const response = await fetch(`/api/market-data?coin=${encodeURIComponent(settings.ticker || coinId)}`, {
                headers: { Accept: 'application/json' },
            });
            if (!response.ok) throw new Error(`Market data request failed with HTTP ${response.status}.`);
            const payload = await response.json();
            if (requestToken !== marketRequestToken || getCoinId(coinSelect?.value) !== coinId) return;

            const fields = payload.fields || {};
            if (fields.coin_price) {
                setMarketValue('coin_price', Number(fields.coin_price.value));
            } else {
                setMarketValue('coin_price', NaN);
            }
            if (fields.network_daily_coin_production) {
                setMarketValue('network_daily_coin_production', Number(fields.network_daily_coin_production.value));
            } else {
                setMarketValue('network_daily_coin_production', NaN);
            }
            if (fields.network_hashrate) {
                applyNetworkHashrate(fields.network_hashrate);
            } else {
                setMarketValue('network_hashrate', NaN);
                marketHashrateBaseValue = null;
            }
            setMarketMeta(fields, payload.fetched_at);
            updateInputMonitor();
            const missing = marketFieldIds.some((field) => !marketInput(field)?.value.trim());
            setMarketStatus(
                payload.warnings?.length || missing ? 'index.marketPartial' : 'index.marketUpdated',
                payload.warnings?.length || missing ? 'warning' : '',
            );
        } catch (error) {
            if (requestToken !== marketRequestToken) return;
            marketHashrateBaseValue = null;
            setMarketMeta({});
            setMarketStatus('index.marketManual', 'warning');
        }
    };

    const startMarketRefresh = () => {
        if (!coinSelect) return;
        if (marketRefreshTimer !== null) window.clearInterval(marketRefreshTimer);
        marketRefreshTimer = window.setInterval(() => {
            if (document.hidden || !getCoinSettings()) return;
            requestMarketData();
        }, 60 * 1000);
    };

    marketFieldIds.forEach((field) => {
        const input = marketInput(field);
        if (!input) return;
        input.dataset.marketSource = input.value.trim() ? 'initial' : 'empty';
        input.addEventListener('input', () => {
            input.dataset.marketSource = 'manual';
            if (field === 'network_hashrate') marketHashrateBaseValue = null;
        });
    });
    networkHashrateUnitSelect?.addEventListener('change', () => {
        networkHashrateUnitSelect.dataset.marketUnitSource = 'manual';
        const input = marketInput('network_hashrate');
        const factor = hashrateFactors[networkHashrateUnitSelect.value];
        if (input?.dataset.marketSource === 'api' && factor && Number.isFinite(marketHashrateBaseValue)) {
            input.value = formatMarketNumber(marketHashrateBaseValue / factor);
        }
        updateInputMonitor();
    });
    window.addEventListener('languagechange', () => {
        const status = document.getElementById('market-data-status');
        const message = document.getElementById('market-data-message');
        if (status?.dataset.i18nKey && message) message.textContent = translate(status.dataset.i18nKey);
        const resultCoin = document.getElementById('result-coin-name');
        syncResultCoinLabel();
    });
    updateInputMonitor();
    if (getCoinSettings()) requestMarketData();
    startMarketRefresh();

    monitorRequiredFields.forEach((field) => {
        const input = document.getElementById(field);
        input?.addEventListener('input', () => {
            // Keep the in-progress string untouched; the monitor parses a snapshot only.
            input.dataset.pendingValue = input.value;
            updateInputMonitor();
        });
    });
    customNameInput?.addEventListener('input', updateInputMonitor);
    algorithmInput?.addEventListener('input', updateInputMonitor);
    syncResultCoinLabel();
    [hashrateUnitSelect, networkHashrateUnitSelect].forEach((select) => {
        select?.addEventListener('change', updateInputMonitor);
    });
    updateInputMonitor();

    decimalInputs.forEach((input) => {
        input.addEventListener('input', () => {
            input.dataset.pendingValue = input.value;
        });
        input.addEventListener('blur', () => normalizeOnBlur(input));
    });

    document.querySelectorAll('[data-number-mode="integer"]').forEach((input) => {
        input.addEventListener('input', () => {
            input.dataset.pendingValue = input.value;
        });
        input.addEventListener('blur', () => {
            input.value = input.value.replace(/[^0-9]/g, '');
        });
    });

    const inputForm = document.querySelector('form[method="post"]');
    const clearFormButton = document.getElementById('clear-form-button');
    clearFormButton?.addEventListener('click', () => {
        inputForm?.querySelectorAll('input:not([type="hidden"])').forEach((input) => {
            input.value = ['other_cost', 'pool_fee'].includes(input.id) ? '0' : '';
            input.dataset.pendingValue = input.value;
        });
        if (coinSelect) {
            coinSelect.value = '';
            coinSelect.dataset.selectedCoin = '';
            coinSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
        [hashrateUnitSelect, networkHashrateUnitSelect].forEach((select) => {
            if (select) select.dataset.selectedUnit = '';
        });
        resetMarketApiValues();
        setMarketStatus('');
        updateInputMonitor();
    });
    if (inputForm) {
        inputForm.addEventListener('submit', () => {
            decimalInputs.forEach((input) => normalizeOnBlur(input));
            inputForm.querySelectorAll('[data-number-mode="integer"]').forEach((input) => {
                input.value = input.value.replace(/[^0-9]/g, '');
            });
        });
    }

    const dataNode = document.getElementById('chart-data');
    const chartCanvas = document.getElementById('revenueChart');
    if (!dataNode || !chartCanvas) return;

    const values = JSON.parse(dataNode.textContent);
    let chartInstance = null;
    const chartLabels = () => [translate('result.dailyRevenue'), translate('result.electricityCost')];

    const drawFallbackChart = () => {
        const width = chartCanvas.clientWidth || 600;
        const height = chartCanvas.clientHeight || 280;
        const ratio = window.devicePixelRatio || 1;
        const context = chartCanvas.getContext('2d');
        const chartValues = [values.revenue, values.electricity];
        const maxValue = Math.max(...chartValues, 1) * 1.2;
        const left = 42;
        const right = 18;
        const top = 16;
        const bottom = 47;
        const plotHeight = height - top - bottom;

        chartCanvas.width = width * ratio;
        chartCanvas.height = height * ratio;
        context.scale(ratio, ratio);
        context.clearRect(0, 0, width, height);
        context.font = '10px DM Mono, monospace';
        context.textAlign = 'right';
        context.strokeStyle = 'rgba(139, 153, 165, 0.12)';
        context.fillStyle = '#60707c';

        for (let step = 0; step <= 4; step += 1) {
            const y = top + plotHeight - (plotHeight * step / 4);
            context.beginPath();
            context.moveTo(left, y);
            context.lineTo(width - right, y);
            context.stroke();
            context.fillText(`$${(maxValue * step / 4).toFixed(0)}`, left - 8, y + 3);
        }

        const barWidth = Math.min(64, (width - left - right) / 4);
        chartValues.forEach((value, index) => {
            const x = left + (width - left - right) * (index + 0.5) / 2 - barWidth / 2;
            const barHeight = plotHeight * value / maxValue;
            const y = top + plotHeight - barHeight;
            context.fillStyle = index === 0 ? '#61b7ff' : '#ffb85c';
            context.fillRect(x, y, barWidth, barHeight);
            context.textAlign = 'center';
            context.fillStyle = '#8b99a5';
            context.fillText(chartLabels()[index], x + barWidth / 2, height - 16);
        });
    };

    if (typeof Chart === 'undefined') {
        drawFallbackChart();
        window.addEventListener('resize', drawFallbackChart);
    } else {
        const context = chartCanvas.getContext('2d');
        const gradient = context.createLinearGradient(0, 0, 0, 280);
        gradient.addColorStop(0, 'rgba(97, 183, 255, 0.34)');
        gradient.addColorStop(1, 'rgba(97, 183, 255, 0.03)');

        chartInstance = new Chart(chartCanvas, {
            type: 'bar',
            data: {
                labels: chartLabels(),
                datasets: [{
                    data: [values.revenue, values.electricity],
                    backgroundColor: [gradient, 'rgba(255, 184, 92, 0.75)'],
                    borderColor: ['#61b7ff', '#ffb85c'],
                    borderWidth: 1,
                    borderRadius: 2,
                    barThickness: 54,
                }],
            },
            options: {
                animation: { duration: 700, easing: 'easeOutQuart' },
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#17212a',
                        borderColor: '#35444f',
                        borderWidth: 1,
                        titleFont: { family: 'DM Mono' },
                        bodyFont: { family: 'DM Mono' },
                        displayColors: false,
                        callbacks: { label: item => ` $${item.raw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#8b99a5', font: { family: 'DM Mono', size: 10 } },
                        border: { color: '#26323d' },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(139, 153, 165, 0.12)' },
                        ticks: { color: '#60707c', font: { family: 'DM Mono', size: 9 }, callback: value => `$${value}` },
                        border: { display: false },
                    },
                },
            },
        });
    }

    window.addEventListener('languagechange', () => {
        if (chartInstance) {
            chartInstance.data.labels = chartLabels();
            chartInstance.update('none');
        } else {
            drawFallbackChart();
        }
    });
});
