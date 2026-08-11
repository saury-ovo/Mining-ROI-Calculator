/* UI copy and language switching for the calculator front end. */
(function () {
    const translations = {
        en: {
            common: {
                browserTitle: 'ASIC ROI Analyzer',
                resultBrowserTitle: 'ASIC ROI Analyzer | {miner}',
                analyticsWorkspace: 'ANALYTICS WORKSPACE',
                modelInput: 'USD / 24H MODEL',
                modelComplete: 'MODEL COMPLETE',
                language: 'Language',
                optional: 'OPTIONAL',
                calculateROI: 'Calculate ROI',
                editAssumptions: 'Edit assumptions',
                na: 'N/A'
            },
            index: {
                pageKicker: 'CAPITAL ALLOCATION TOOL',
                titleLead: 'Mining Machine',
                titleTail: 'ROI Calculator',
                introCopy: 'Build a clean operating model for your next mining deployment.',
                noteEnergy: 'Model uses 24-hour energy and revenue assumptions',
                noteRefresh: 'Results refresh instantly from your inputs',
                assetProfile: 'ASSET PROFILE',
                machineConfiguration: 'Machine configuration',
                capitalStack: 'CAPITAL STACK',
                acquisitionCost: 'Acquisition cost',
                capitalCaption: 'Include shipping, setup, hosting, or other one-time expenses.',
                operatingProfile: 'OPERATING PROFILE',
                powerMarket: 'Power and market assumptions',
                readyForAnalysis: 'READY FOR ANALYSIS',
                actionTitle: 'Turn assumptions into an investment view.',
                actionDescription: 'Review operating margin, capital recovery, and annualized return in one dashboard.',
                localNotice: 'No data is stored. This model runs locally.'
            },
            fields: {
                minerName: 'Miner Name',
                algorithm: 'Algorithm',
                coin: 'Coin',
                hashrate: 'Hashrate',
                networkHashrate: 'Network Hashrate',
                hashrateUnit: 'Hashrate unit',
                networkHashrateUnit: 'Network hashrate unit',
                quantity: 'Quantity',
                machinePrice: 'Machine Price',
                otherCost: 'Other Cost',
                powerConsumption: 'Power Consumption',
                electricityPrice: 'Electricity Price',
                poolFee: 'Pool Fee',
                dailyCoinOutput: 'Daily Coin Output',
                coinPrice: 'Coin Price'
            },
            placeholders: {
                minerName: 'Enter miner model',
                algorithm: 'Enter algorithm',
                coin: 'Enter coin',
                hashrate: 'Enter value',
                networkHashrate: 'Enter value',
                algorithmAuto: 'Auto selected from coin',
                quantity: 'Enter qty',
                machinePrice: 'Enter price',
                powerConsumption: 'Enter power',
                electricityPrice: 'Enter rate',
                dailyCoinOutput: 'Enter output',
                coinPrice: 'Enter price',
                zero: '0'
            },
            coin: { selectPrompt: 'Select coin' },
            units: {
                ths: 'TH/s',
                usd: 'USD',
                watt: 'W',
                kwh: '/kWh',
                percent: '%',
                coinDay: 'COIN / DAY',
                usdDay: 'USD / DAY',
                kwhDay: 'kWh / DAY',
                perDay: '/ day',
                days: 'DAYS'
            },
            result: {
                pageKicker: 'INVESTMENT ANALYSIS',
                introCopy: 'A performance snapshot for your {quantity}-unit deployment.',
                statusProfitable: 'PROFITABLE',
                statusLoss: 'LOSS',
                unrealisticWarning: 'Input data may be unrealistic',
                calculationDetails: 'Calculation Details',
                dailyCoinOutputDetail: 'Daily coin output',
                coinPriceDetail: 'Coin price',
                revenueFormula: 'output × price × quantity',
                lessThanOneDay: '<1 Day',
                coreMetrics: 'CORE METRICS',
                initialInvestment: 'INITIAL INVESTMENT',
                capitalDeployed: 'CAPITAL DEPLOYED',
                dailyRevenue: 'DAILY REVENUE',
                grossMiningOutput: 'GROSS MINING OUTPUT',
                electricityCost: 'ELECTRICITY COST',
                dailyProfit: 'DAILY PROFIT',
                netAfterPool: 'NET AFTER POOL FEE',
                operatingMargin: 'OPERATING MARGIN',
                revenueVsElectricity: 'Revenue vs. electricity',
                revenue: 'Revenue',
                electricity: 'Electricity',
                poolFee: 'Pool fee',
                roiAnalysis: 'ROI ANALYSIS',
                capitalRecovery: 'Capital recovery',
                paybackPeriod: 'PAYBACK PERIOD',
                recoveryView: '365-DAY RECOVERY VIEW',
                monthlyProfit: 'Monthly Profit',
                annualProfit: 'Annual Profit',
                annualROI: 'Annual ROI',
                breakEvenElectricity: 'Break-even Electricity',
                modelAssumptions: 'Model assumptions are based on current inputs and a 30-day month / 365-day year convention.'
            }
        },
        zh: {
            common: {
                browserTitle: 'ASIC ROI Analyzer',
                resultBrowserTitle: 'ASIC ROI Analyzer | {miner}',
                analyticsWorkspace: '分析工作区',
                modelInput: '美元 / 24小时模型',
                modelComplete: '模型完成',
                language: '语言',
                optional: '可选',
                calculateROI: '计算 ROI',
                editAssumptions: '编辑假设',
                na: '不适用'
            },
            index: {
                pageKicker: '资本配置工具',
                titleLead: '矿机',
                titleTail: '投资收益分析器',
                introCopy: '为下一次矿机部署建立清晰的运营模型。',
                noteEnergy: '模型采用 24 小时能源和收益假设',
                noteRefresh: '输入修改后结果会即时刷新',
                assetProfile: '资产概况',
                machineConfiguration: '矿机配置',
                capitalStack: '资本结构',
                acquisitionCost: '采购成本',
                capitalCaption: '可计入运输、安装、托管或其他一次性费用。',
                operatingProfile: '运营概况',
                powerMarket: '电力与市场假设',
                readyForAnalysis: '准备分析',
                actionTitle: '将假设转化为投资视图。',
                actionDescription: '在一个 Dashboard 中查看运营利润、资本回收和年化回报。',
                localNotice: '不保存数据。本模型在本地运行。'
            },
            fields: {
                minerName: '矿机名称', algorithm: '算法', coin: '币种', hashrate: '算力', networkHashrate: '全网算力', quantity: '数量',
                hashrateUnit: '算力单位', networkHashrateUnit: '全网算力单位',
                machinePrice: '单台矿机价格', otherCost: '其他成本', powerConsumption: '功耗', electricityPrice: '电价',
                poolFee: '矿池手续费', dailyCoinOutput: '每日产币量', coinPrice: '币价'
            },
            placeholders: {
                minerName: '输入矿机型号', algorithm: '自动匹配币种', coin: '选择币种', hashrate: '输入数值', networkHashrate: '输入数值', quantity: '输入数量',
                algorithmAuto: '根据币种自动选择',
                machinePrice: '输入价格', powerConsumption: '输入功耗', electricityPrice: '输入电价', dailyCoinOutput: '输入产出',
                coinPrice: '输入价格', zero: '0'
            },
            coin: { selectPrompt: '选择币种' },
            units: {
                ths: 'TH/s', usd: '美元', watt: 'W', kwh: '/千瓦时', percent: '%', coinDay: '币 / 天',
                usdDay: '美元 / 天', kwhDay: '千瓦时 / 天', perDay: '/ 天', days: '天'
            },
            result: {
                pageKicker: '投资分析', introCopy: '这是你部署 {quantity} 台矿机的表现快照。', statusProfitable: '盈利', statusLoss: '亏损',
                unrealisticWarning: '输入数据可能不合理', calculationDetails: '计算明细', dailyCoinOutputDetail: '每日产币量', coinPriceDetail: '币价',
                revenueFormula: '产币量 × 币价 × 数量', lessThanOneDay: '<1 天',
                coreMetrics: '核心指标', initialInvestment: '初始投资', capitalDeployed: '已投入资本', dailyRevenue: '每日收益',
                grossMiningOutput: '挖矿总产出', electricityCost: '电费成本', dailyProfit: '每日利润', netAfterPool: '扣除矿池费后',
                operatingMargin: '运营利润', revenueVsElectricity: '收益 vs 电费', revenue: '收益', electricity: '电费', poolFee: '矿池费',
                roiAnalysis: 'ROI 分析', capitalRecovery: '资本回收', paybackPeriod: '回本周期', recoveryView: '365 天回本进度',
                monthlyProfit: '月度利润', annualProfit: '年度利润', annualROI: '年度 ROI', breakEvenElectricity: '盈亏平衡电价',
                modelAssumptions: '模型基于当前输入，并采用 30 天月份 / 365 天年度约定。'
            }
        },
        ja: {
            common: {
                browserTitle: 'ASIC ROI Analyzer', resultBrowserTitle: 'ASIC ROI Analyzer | {miner}', analyticsWorkspace: '分析ワークスペース',
                modelInput: 'USD / 24時間モデル', modelComplete: 'モデル完了', language: '言語', optional: '任意',
                calculateROI: 'ROIを計算', editAssumptions: '前提を編集', na: '該当なし'
            },
            index: {
                pageKicker: '資本配分ツール', titleLead: 'マイニング', titleTail: 'ROI計算ツール',
                introCopy: '次のマイニング展開に向けた運用モデルを作成します。', noteEnergy: '24時間の電力と収益の前提を使用',
                noteRefresh: '入力から結果を即時更新', assetProfile: '資産プロファイル', machineConfiguration: 'マシン設定',
                capitalStack: '資本構成', acquisitionCost: '取得コスト', capitalCaption: '輸送、セットアップ、ホスティングなどの一時費用を含めます。',
                operatingProfile: '運用プロファイル', powerMarket: '電力と市場の前提', readyForAnalysis: '分析の準備完了',
                actionTitle: '前提を投資ビューに変換します。', actionDescription: '運用利益、資本回収、年率リターンを一つのダッシュボードで確認できます。',
                localNotice: 'データは保存されません。このモデルはローカルで動作します。'
            },
            fields: {
                minerName: 'マイナー名', algorithm: 'アルゴリズム', coin: 'コイン', hashrate: 'ハッシュレート', networkHashrate: 'ネットワークハッシュレート', quantity: '数量',
                hashrateUnit: 'ハッシュレート単位', networkHashrateUnit: 'ネットワークハッシュレート単位',
                machinePrice: 'マシン価格', otherCost: 'その他コスト', powerConsumption: '消費電力', electricityPrice: '電気料金',
                poolFee: 'プール手数料', dailyCoinOutput: '1日のコイン出力', coinPrice: 'コイン価格'
            },
            placeholders: {
                minerName: 'マイナーのモデルを入力', algorithm: 'コインから自動選択', coin: 'コインを選択', hashrate: '数値を入力', networkHashrate: '数値を入力',
                algorithmAuto: 'コインから自動選択',
                quantity: '数量を入力', machinePrice: '価格を入力', powerConsumption: '電力を入力', electricityPrice: '料金を入力',
                dailyCoinOutput: '出力を入力', coinPrice: '価格を入力', zero: '0'
            },
            coin: { selectPrompt: 'コインを選択' },
            units: { ths: 'TH/s', usd: 'USD', watt: 'W', kwh: '/kWh', percent: '%', coinDay: 'コイン / 日', usdDay: 'USD / 日', kwhDay: 'kWh / 日', perDay: '/ 日', days: '日' },
            result: {
                pageKicker: '投資分析', introCopy: '{quantity}台の展開に関するパフォーマンススナップショットです。', statusProfitable: '収益あり', statusLoss: '損失',
                unrealisticWarning: '入力データが現実的でない可能性があります', calculationDetails: '計算詳細', dailyCoinOutputDetail: '1日のコイン出力', coinPriceDetail: 'コイン価格',
                revenueFormula: '出力 × 価格 × 数量', lessThanOneDay: '<1 日',
                coreMetrics: '主要指標', initialInvestment: '初期投資', capitalDeployed: '投入資本', dailyRevenue: '日次収益', grossMiningOutput: '総マイニング収益',
                electricityCost: '電力コスト', dailyProfit: '日次利益', netAfterPool: 'プール手数料控除後', operatingMargin: '運用マージン', revenueVsElectricity: '収益 vs 電力',
                revenue: '収益', electricity: '電力', poolFee: 'プール手数料', roiAnalysis: 'ROI分析', capitalRecovery: '資本回収', paybackPeriod: '回収期間',
                recoveryView: '365日回収ビュー', monthlyProfit: '月次利益', annualProfit: '年次利益', annualROI: '年次ROI', breakEvenElectricity: '損益分岐電気料金',
                modelAssumptions: 'モデルは現在の入力と30日/月、365日/年の前提に基づきます。'
            }
        },
        ko: {
            common: {
                browserTitle: 'ASIC ROI Analyzer', resultBrowserTitle: 'ASIC ROI Analyzer | {miner}', analyticsWorkspace: '분석 작업 공간', modelInput: 'USD / 24시간 모델',
                modelComplete: '모델 완료', language: '언어', optional: '선택 사항', calculateROI: 'ROI 계산', editAssumptions: '가정 편집', na: '해당 없음'
            },
            index: {
                pageKicker: '자본 배분 도구', titleLead: '채굴', titleTail: 'ROI 계산기', introCopy: '다음 채굴 장비 배치를 위한 운영 모델을 만드세요.',
                noteEnergy: '24시간 전력 및 수익 가정을 사용합니다', noteRefresh: '입력값에 따라 결과가 즉시 갱신됩니다', assetProfile: '자산 프로필',
                machineConfiguration: '장비 구성', capitalStack: '자본 구성', acquisitionCost: '취득 비용', capitalCaption: '배송, 설치, 호스팅 및 기타 일회성 비용을 포함하세요.',
                operatingProfile: '운영 프로필', powerMarket: '전력 및 시장 가정', readyForAnalysis: '분석 준비 완료', actionTitle: '가정을 투자 관점으로 바꿔보세요.',
                actionDescription: '하나의 대시보드에서 운영 마진, 자본 회수, 연간 수익률을 확인하세요.', localNotice: '데이터는 저장되지 않습니다. 이 모델은 로컬에서 실행됩니다.'
            },
            fields: {
                minerName: '채굴기 이름', algorithm: '알고리즘', coin: '코인', hashrate: '해시레이트', networkHashrate: '네트워크 해시레이트', quantity: '수량', machinePrice: '장비 가격',
                hashrateUnit: '해시레이트 단위', networkHashrateUnit: '네트워크 해시레이트 단위',
                otherCost: '기타 비용', powerConsumption: '전력 소비량', electricityPrice: '전기 요금', poolFee: '풀 수수료', dailyCoinOutput: '일일 코인 생산량', coinPrice: '코인 가격'
            },
            placeholders: {
                minerName: '채굴기 모델 입력', algorithm: '코인에서 자동 선택', coin: '코인 선택', hashrate: '값 입력', networkHashrate: '값 입력', quantity: '수량 입력',
                algorithmAuto: '코인에서 자동 선택',
                machinePrice: '가격 입력', powerConsumption: '전력 입력', electricityPrice: '요금 입력', dailyCoinOutput: '생산량 입력', coinPrice: '가격 입력', zero: '0'
            },
            coin: { selectPrompt: '코인 선택' },
            units: { ths: 'TH/s', usd: 'USD', watt: 'W', kwh: '/kWh', percent: '%', coinDay: '코인 / 일', usdDay: 'USD / 일', kwhDay: 'kWh / 일', perDay: '/ 일', days: '일' },
            result: {
                pageKicker: '투자 분석', introCopy: '{quantity}대 배치의 성과 스냅샷입니다.', statusProfitable: '수익성 있음', statusLoss: '손실',
                unrealisticWarning: '입력 데이터가 비현실적일 수 있습니다', calculationDetails: '계산 세부 정보', dailyCoinOutputDetail: '일일 코인 생산량', coinPriceDetail: '코인 가격',
                revenueFormula: '생산량 × 가격 × 수량', lessThanOneDay: '<1일', coreMetrics: '핵심 지표',
                initialInvestment: '초기 투자', capitalDeployed: '투입 자본', dailyRevenue: '일일 수익', grossMiningOutput: '총 채굴 수익', electricityCost: '전기 비용',
                dailyProfit: '일일 이익', netAfterPool: '풀 수수료 차감 후', operatingMargin: '운영 마진', revenueVsElectricity: '수익 vs 전기 비용', revenue: '수익',
                electricity: '전기 비용', poolFee: '풀 수수료', roiAnalysis: 'ROI 분석', capitalRecovery: '자본 회수', paybackPeriod: '회수 기간', recoveryView: '365일 회수 현황',
                monthlyProfit: '월간 이익', annualProfit: '연간 이익', annualROI: '연간 ROI', breakEvenElectricity: '손익분기 전기 요금', modelAssumptions: '현재 입력값과 30일/월, 365일/년 기준으로 계산됩니다.'
            }
        },
        es: {
            common: {
                browserTitle: 'ASIC ROI Analyzer', resultBrowserTitle: 'ASIC ROI Analyzer | {miner}', analyticsWorkspace: 'ESPACIO DE ANÁLISIS', modelInput: 'USD / MODELO 24H',
                modelComplete: 'MODELO COMPLETO', language: 'Idioma', optional: 'OPCIONAL', calculateROI: 'Calcular ROI', editAssumptions: 'Editar supuestos', na: 'N/D'
            },
            index: {
                pageKicker: 'HERRAMIENTA DE ASIGNACIÓN DE CAPITAL', titleLead: 'Minería', titleTail: 'Calculadora ROI', introCopy: 'Crea un modelo operativo claro para tu próximo despliegue de minería.',
                noteEnergy: 'El modelo usa supuestos de energía e ingresos de 24 horas', noteRefresh: 'Los resultados se actualizan al instante', assetProfile: 'PERFIL DEL ACTIVO',
                machineConfiguration: 'Configuración del equipo', capitalStack: 'ESTRUCTURA DE CAPITAL', acquisitionCost: 'Coste de adquisición', capitalCaption: 'Incluye envío, instalación, hosting u otros gastos únicos.',
                operatingProfile: 'PERFIL OPERATIVO', powerMarket: 'Supuestos de energía y mercado', readyForAnalysis: 'LISTO PARA ANALIZAR', actionTitle: 'Convierte los supuestos en una vista de inversión.',
                actionDescription: 'Revisa el margen operativo, la recuperación del capital y el retorno anualizado en un dashboard.', localNotice: 'No se guardan datos. Este modelo se ejecuta localmente.'
            },
            fields: {
                minerName: 'Nombre del minero', algorithm: 'Algoritmo', coin: 'Moneda', hashrate: 'Hashrate', networkHashrate: 'Hashrate de red', quantity: 'Cantidad', machinePrice: 'Precio del equipo',
                hashrateUnit: 'Unidad de hashrate', networkHashrateUnit: 'Unidad de hashrate de red',
                otherCost: 'Otros costes', powerConsumption: 'Consumo eléctrico', electricityPrice: 'Precio de electricidad', poolFee: 'Comisión del pool', dailyCoinOutput: 'Producción diaria', coinPrice: 'Precio de la moneda'
            },
            placeholders: {
                minerName: 'Introduce el modelo', algorithm: 'Selección automática por moneda', coin: 'Selecciona la moneda', hashrate: 'Introduce valor', networkHashrate: 'Introduce valor', quantity: 'Introduce cantidad',
                algorithmAuto: 'Selección automática por moneda',
                machinePrice: 'Introduce precio', powerConsumption: 'Introduce potencia', electricityPrice: 'Introduce tarifa', dailyCoinOutput: 'Introduce producción', coinPrice: 'Introduce precio', zero: '0'
            },
            coin: { selectPrompt: 'Selecciona la moneda' },
            units: { ths: 'TH/s', usd: 'USD', watt: 'W', kwh: '/kWh', percent: '%', coinDay: 'MONEDA / DÍA', usdDay: 'USD / DÍA', kwhDay: 'kWh / DÍA', perDay: '/ día', days: 'DÍAS' },
            result: {
                pageKicker: 'ANÁLISIS DE INVERSIÓN', introCopy: 'Resumen de rendimiento para tu despliegue de {quantity} unidades.', statusProfitable: 'RENTABLE', statusLoss: 'PÉRDIDA',
                unrealisticWarning: 'Los datos introducidos pueden no ser realistas', calculationDetails: 'Detalles del cálculo', dailyCoinOutputDetail: 'Producción diaria', coinPriceDetail: 'Precio de la moneda',
                revenueFormula: 'producción × precio × cantidad', lessThanOneDay: '<1 día', coreMetrics: 'MÉTRICAS CLAVE',
                initialInvestment: 'INVERSIÓN INICIAL', capitalDeployed: 'CAPITAL INVERTIDO', dailyRevenue: 'INGRESOS DIARIOS', grossMiningOutput: 'PRODUCCIÓN BRUTA', electricityCost: 'COSTE ELÉCTRICO',
                dailyProfit: 'BENEFICIO DIARIO', netAfterPool: 'NETO TRAS COMISIÓN', operatingMargin: 'MARGEN OPERATIVO', revenueVsElectricity: 'Ingresos vs. electricidad', revenue: 'Ingresos',
                electricity: 'Electricidad', poolFee: 'Comisión del pool', roiAnalysis: 'ANÁLISIS ROI', capitalRecovery: 'Recuperación del capital', paybackPeriod: 'PERIODO DE RETORNO', recoveryView: 'VISTA DE RECUPERACIÓN A 365 DÍAS',
                monthlyProfit: 'Beneficio mensual', annualProfit: 'Beneficio anual', annualROI: 'ROI anual', breakEvenElectricity: 'Electricidad de equilibrio', modelAssumptions: 'El modelo usa las entradas actuales y la convención de 30 días por mes / 365 días por año.'
            }
        }
    };

    // Production fields use the network-wide issuance model.
    translations.en.fields.networkDailyCoinProduction = 'Network Daily Coin Production';
    translations.en.placeholders.networkDailyCoinProduction = 'Enter network daily production';
    translations.en.result.networkDailyProduction = 'Network Daily Production';
    translations.en.result.miningShare = 'Mining Share';
    translations.en.result.estimatedDailyCoin = 'Estimated Daily Coin';

    translations.zh.fields.networkDailyCoinProduction = '\u5168\u7f51\u6bcf\u65e5\u4ea7\u5e01\u91cf';
    translations.zh.placeholders.networkDailyCoinProduction = '\u8f93\u5165\u5168\u7f51\u6bcf\u65e5\u4ea7\u5e01\u91cf';
    translations.zh.result.networkDailyProduction = '\u5168\u7f51\u6bcf\u65e5\u4ea7\u51fa';
    translations.zh.result.miningShare = '\u6316\u77ff\u5360\u6bd4';
    translations.zh.result.estimatedDailyCoin = '\u9884\u4f30\u6bcf\u65e5\u4ea7\u5e01';

    translations.ja.fields.networkDailyCoinProduction = '\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u65e5\u6b21\u30b3\u30a4\u30f3\u751f\u7523\u91cf';
    translations.ja.placeholders.networkDailyCoinProduction = '\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u306e\u65e5\u6b21\u751f\u7523\u91cf\u3092\u5165\u529b';
    translations.ja.result.networkDailyProduction = '\u30cd\u30c3\u30c8\u30ef\u30fc\u30af\u65e5\u6b21\u751f\u7523\u91cf';
    translations.ja.result.miningShare = '\u30de\u30a4\u30cb\u30f3\u30b0\u30b7\u30a7\u30a2';
    translations.ja.result.estimatedDailyCoin = '\u63a8\u5b9a\u65e5\u6b21\u30b3\u30a4\u30f3';

    translations.ko.fields.networkDailyCoinProduction = '\ub124\ud2b8\uc6cc\ud06c \uc77c\uc77c \ucf54\uc778 \uc0dd\uc0b0\ub7c9';
    translations.ko.placeholders.networkDailyCoinProduction = '\ub124\ud2b8\uc6cc\ud06c \uc77c\uc77c \uc0dd\uc0b0\ub7c9 \uc785\ub825';
    translations.ko.result.networkDailyProduction = '\ub124\ud2b8\uc6cc\ud06c \uc77c\uc77c \uc0dd\uc0b0\ub7c9';
    translations.ko.result.miningShare = '\ucc44\uad74 \uc810\uc720\uc728';
    translations.ko.result.estimatedDailyCoin = '\uc608\uc0c1 \uc77c\uc77c \ucf54\uc778';

    translations.es.fields.networkDailyCoinProduction = 'Producci\u00f3n diaria de la red';
    translations.es.placeholders.networkDailyCoinProduction = 'Introduce la producci\u00f3n diaria de la red';
    translations.es.result.networkDailyProduction = 'Producci\u00f3n diaria de la red';
    translations.es.result.miningShare = 'Participaci\u00f3n minera';
    translations.es.result.estimatedDailyCoin = 'Monedas diarias estimadas';

    translations.en.index.marketLoading = 'Loading market data...';
    translations.en.index.marketUpdated = 'Market data updated. Manual inputs remain in control.';
    translations.en.index.marketPartial = 'Some market data is unavailable. Enter missing values manually.';
    translations.en.index.marketManual = 'Market data unavailable. Please enter values manually.';
    translations.en.index.marketSource = 'Source';
    translations.en.index.marketFetchedAt = 'Fetched';
    translations.en.index.marketObservedAt = 'Observed';
    translations.zh.index.marketLoading = '\u6b63\u5728\u52a0\u8f7d\u5e02\u573a\u6570\u636e...';
    translations.zh.index.marketUpdated = '\u5e02\u573a\u6570\u636e\u5df2\u66f4\u65b0\u3002\u624b\u52a8\u8f93\u5165\u4f18\u5148\u3002';
    translations.zh.index.marketPartial = '\u90e8\u5206\u5e02\u573a\u6570\u636e\u4e0d\u53ef\u7528\uff0c\u8bf7\u624b\u52a8\u8865\u5145\u7f3a\u5931\u503c\u3002';
    translations.zh.index.marketManual = '\u5e02\u573a\u6570\u636e\u4e0d\u53ef\u7528\uff0c\u8bf7\u624b\u52a8\u8f93\u5165\u3002';
    translations.zh.index.marketSource = '\u6570\u636e\u6765\u6e90';
    translations.zh.index.marketFetchedAt = '\u83b7\u53d6\u65f6\u95f4';
    translations.zh.index.marketObservedAt = '\u6570\u636e\u89c2\u6d4b\u65f6\u95f4';
    translations.ja.index.marketLoading = '\u5e02\u5834\u30c7\u30fc\u30bf\u3092\u8aad\u307f\u8fbc\u3093\u3067\u3044\u307e\u3059...';
    translations.ja.index.marketUpdated = '\u5e02\u5834\u30c7\u30fc\u30bf\u3092\u66f4\u65b0\u3057\u307e\u3057\u305f\u3002\u624b\u52d5\u5165\u529b\u304c\u512a\u5148\u3055\u308c\u307e\u3059\u3002';
    translations.ja.index.marketPartial = '\u4e00\u90e8\u306e\u5e02\u5834\u30c7\u30fc\u30bf\u3092\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093\u3002\u4e0d\u8db3\u5024\u3092\u624b\u52d5\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002';
    translations.ja.index.marketManual = '\u5e02\u5834\u30c7\u30fc\u30bf\u3092\u5229\u7528\u3067\u304d\u307e\u305b\u3093\u3002\u5024\u3092\u624b\u52d5\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\u3002';
    translations.ja.index.marketSource = '\u30bd\u30fc\u30b9';
    translations.ja.index.marketFetchedAt = '\u53d6\u5f97\u6642\u523b';
    translations.ja.index.marketObservedAt = '\u89b3\u6e2c\u6642\u523b';
    translations.ko.index.marketLoading = '\uc2dc\uc7a5 \ub370\uc774\ud130 \ubd88\ub7ec\uc624\ub294 \uc911...';
    translations.ko.index.marketUpdated = '\uc2dc\uc7a5 \ub370\uc774\ud130\uac00 \uc5c5\ub370\uc774\ud2b8\ub418\uc5c8\uc2b5\ub2c8\ub2e4. \uc218\ub3d9 \uc785\ub825\uc774 \uc6b0\uc120\ub429\ub2c8\ub2e4.';
    translations.ko.index.marketPartial = '\uc77c\ubd80 \uc2dc\uc7a5 \ub370\uc774\ud130\ub97c \uc0ac\uc6a9\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4. \ub204\ub77d\ub41c \uac12\uc744 \uc218\ub3d9\uc73c\ub85c \uc785\ub825\ud558\uc138\uc694.';
    translations.ko.index.marketManual = '\uc2dc\uc7a5 \ub370\uc774\ud130\ub97c \uc0ac\uc6a9\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4. \uac12\uc744 \uc218\ub3d9\uc73c\ub85c \uc785\ub825\ud558\uc138\uc694.';
    translations.ko.index.marketSource = '\ucd9c\ucc98';
    translations.ko.index.marketFetchedAt = '\uc870\ud68c \uc2dc\uac01';
    translations.ko.index.marketObservedAt = '\uad00\uce21 \uc2dc\uac01';
    translations.es.index.marketLoading = 'Cargando datos de mercado...';
    translations.es.index.marketUpdated = 'Datos de mercado actualizados. Las entradas manuales tienen prioridad.';
    translations.es.index.marketPartial = 'Algunos datos de mercado no están disponibles. Introduce los valores faltantes manualmente.';
    translations.es.index.marketManual = 'Datos de mercado no disponibles. Introduce los valores manualmente.';
    translations.es.index.marketSource = 'Fuente';
    translations.es.index.marketFetchedAt = 'Obtenido';
    translations.es.index.marketObservedAt = 'Observado';

    const monitorTranslations = {
        en: {
            common: { roiTerminal: 'ROI TERMINAL', modelLive: 'LIVE', window24h: '24H', storageLocal: 'LOCAL', panelInput: 'INPUT / 01', panelLive: 'LIVE / 01', chartWindow: '24H / USD' },
            index: { telemetryModel: 'MODEL', telemetryWindow: 'WINDOW', telemetryStore: 'STORE', identity: 'IDENTITY', computeProfile: 'COMPUTE PROFILE', operatingAssumptions: 'OPERATING ASSUMPTIONS', monitorTitle: 'OPERATING MONITOR', monitorSubtitle: 'Secondary operating signals', monitorInputStatus: 'INPUT READINESS', totalPowerLoad: 'Total Power Load', perMachinePowerCost: 'Per-Machine Daily Power Cost', selectedAsset: 'Selected Asset', monitorDescription: 'Secondary signals update from your current inputs. Core ROI results appear after submission.' },
            units: { kilowatt: 'kW', usdMachineDay: 'USD / MACHINE / DAY' },
            result: { auditTrail: 'AUDIT TRAIL' },
        },
        zh: {
            common: { roiTerminal: '\u6536\u76ca\u7ec8\u7aef', modelLive: '\u5b9e\u65f6', window24h: '24\u5c0f\u65f6', storageLocal: '\u672c\u5730', panelInput: '\u8f93\u5165 / 01', panelLive: '\u5b9e\u65f6 / 01', chartWindow: '24\u5c0f\u65f6 / \u7f8e\u5143' },
            index: { telemetryModel: '\u6a21\u578b', telemetryWindow: '\u5468\u671f', telemetryStore: '\u5b58\u50a8', identity: '\u8d44\u4ea7\u8eab\u4efd', computeProfile: '\u7b97\u529b\u914d\u7f6e', operatingAssumptions: '\u8fd0\u8425\u5047\u8bbe', monitorTitle: '\u8fd0\u8425\u76d1\u89c6', monitorSubtitle: '\u8f93\u5165\u8fd0\u8425\u4fe1\u53f7', monitorInputStatus: '\u8f93\u5165\u5c31\u7eea\u5ea6', totalPowerLoad: '\u603b\u529f\u7387\u8d1f\u8f7d', perMachinePowerCost: '\u5355\u53f0\u6bcf\u65e5\u7535\u529b\u6210\u672c', selectedAsset: '\u5f53\u524d\u8d44\u4ea7', monitorDescription: '\u4e8c\u7ea7\u4fe1\u53f7\u968f\u5f53\u524d\u8f93\u5165\u66f4\u65b0\u3002\u6838\u5fc3 ROI \u7ed3\u679c\u5c06\u5728\u63d0\u4ea4\u540e\u663e\u793a\u3002' },
            units: { kilowatt: '\u5343\u74e6', usdMachineDay: '\u7f8e\u5143 / \u5355\u53f0 / \u65e5' },
            result: { auditTrail: '\u5ba1\u8ba1\u8f68\u8ff9' },
        },
        ja: {
            common: { roiTerminal: 'ROI \u30bf\u30fc\u30df\u30ca\u30eb', modelLive: '\u30e9\u30a4\u30d6', window24h: '24\u6642\u9593', storageLocal: '\u30ed\u30fc\u30ab\u30eb', panelInput: '\u5165\u529b / 01', panelLive: '\u30e9\u30a4\u30d6 / 01', chartWindow: '24\u6642\u9593 / USD' },
            index: { telemetryModel: '\u30e2\u30c7\u30eb', telemetryWindow: '\u671f\u9593', telemetryStore: '\u4fdd\u5b58\u5148', identity: '\u30a2\u30bb\u30c3\u30c8\u60c5\u5831', computeProfile: '\u30b3\u30f3\u30d4\u30e5\u30fc\u30c8\u8a2d\u5b9a', operatingAssumptions: '\u904b\u7528\u524d\u63d0', monitorTitle: '\u904b\u7528\u30e2\u30cb\u30bf\u30fc', monitorSubtitle: '\u4e8c\u6b21\u904b\u7528\u30b7\u30b0\u30ca\u30eb', monitorInputStatus: '\u5165\u529b\u6e96\u5099\u5ea6', totalPowerLoad: '\u7dcf\u96fb\u529b\u8ca0\u8377', perMachinePowerCost: '\u30de\u30b7\u30f3\u5358\u4f4d\u306e\u65e5\u6b21\u96fb\u6c17\u4ee3', selectedAsset: '\u9078\u629e\u8cc7\u7523', monitorDescription: '\u4e8c\u6b21\u30b7\u30b0\u30ca\u30eb\u306f\u5165\u529b\u306b\u5fdc\u3058\u3066\u66f4\u65b0\u3055\u308c\u307e\u3059\u3002\u4e3b\u8981 ROI \u7d50\u679c\u306f\u9001\u4fe1\u5f8c\u306b\u8868\u793a\u3055\u308c\u307e\u3059\u3002' },
            units: { kilowatt: 'kW', usdMachineDay: 'USD / \u53f0 / \u65e5' },
            result: { auditTrail: '\u76e3\u67fb\u30c8\u30ec\u30fc\u30b9' },
        },
        ko: {
            common: { roiTerminal: 'ROI \ud130\ubbf8\ub110', modelLive: '\uc2e4\uc2dc\uac04', window24h: '24\uc2dc\uac04', storageLocal: '\ub85c\uceec', panelInput: '\uc785\ub825 / 01', panelLive: '\uc2e4\uc2dc\uac04 / 01', chartWindow: '24\uc2dc\uac04 / USD' },
            index: { telemetryModel: '\ubaa8\ub378', telemetryWindow: '\uae30\uac04', telemetryStore: '\uc800\uc7a5', identity: '\uc790\uc0b0 \uc815\ubcf4', computeProfile: '\uc5f0\uc0b0 \ud504\ub85c\ud30c\uc77c', operatingAssumptions: '\uc6b4\uc601 \uac00\uc815', monitorTitle: '\uc6b4\uc601 \ubaa8\ub2c8\ud130', monitorSubtitle: '\uc785\ub825 \uae30\ubc18 \ubcf4\uc870 \uc2e0\ud638', monitorInputStatus: '\uc785\ub825 \uc900\ube44\ub3c4', totalPowerLoad: '\ucd1d \uc804\ub825 \ubd80\ud558', perMachinePowerCost: '\uba38\uc2e0\ubcc4 \uc77c\uc77c \uc804\ub825\ube44', selectedAsset: '\uc120\ud0dd \uc790\uc0b0', monitorDescription: '\ubcf4\uc870 \uc2e0\ud638\ub294 \ud604\uc7ac \uc785\ub825\uc5d0 \ub530\ub77c \uc5c5\ub370\uc774\ud2b8\ub429\ub2c8\ub2e4. \ud575\uc2ec ROI \uacb0\uacfc\ub294 \uc81c\ucd9c \ud6c4 \ud45c\uc2dc\ub429\ub2c8\ub2e4.' },
            units: { kilowatt: 'kW', usdMachineDay: 'USD / \ub300 / \uc77c' },
            result: { auditTrail: '\uac80\uc99d \uae30\ub85d' },
        },
        es: {
            common: { roiTerminal: 'TERMINAL ROI', modelLive: 'EN VIVO', window24h: '24H', storageLocal: 'LOCAL', panelInput: 'ENTRADA / 01', panelLive: 'EN VIVO / 01', chartWindow: '24H / USD' },
            index: { telemetryModel: 'MODELO', telemetryWindow: 'PERIODO', telemetryStore: 'GUARDADO', identity: 'IDENTIDAD', computeProfile: 'PERFIL DE C\u00d3MPUTO', operatingAssumptions: 'SUPUESTOS OPERATIVOS', monitorTitle: 'MONITOR OPERATIVO', monitorSubtitle: 'Se\u00f1ales operativas secundarias', monitorInputStatus: 'PREPARACI\u00d3N DE ENTRADA', totalPowerLoad: 'Carga total de potencia', perMachinePowerCost: 'Coste el\u00e9ctrico diario por m\u00e1quina', selectedAsset: 'Activo seleccionado', monitorDescription: 'Las se\u00f1ales secundarias se actualizan con las entradas actuales. Los resultados ROI aparecen despu\u00e9s del env\u00edo.' },
            units: { kilowatt: 'kW', usdMachineDay: 'USD / M\u00c1QUINA / D\u00cdA' },
            result: { auditTrail: 'TRAZA DE AUDITOR\u00cdA' },
        },
    };

    Object.keys(monitorTranslations).forEach((locale) => {
        const source = monitorTranslations[locale];
        Object.keys(source).forEach((section) => {
            Object.assign(translations[locale][section], source[section]);
        });
    });

    const localeTags = { en: 'en', zh: 'zh-CN', ja: 'ja', ko: 'ko', es: 'es' };
    const getValue = (locale, key) => key.split('.').reduce((value, part) => value && value[part], translations[locale]);
    const format = (value) => String(value).replace(/\{(miner|quantity)\}/g, (_, token) => {
        const body = document.body;
        return token === 'miner' ? (body.dataset.minerName || 'Mining Machine') : (body.dataset.quantity || '');
    });
    const currentLocale = () => document.getElementById('languageSelect')?.value || 'en';
    const applyTranslations = (locale) => {
        const selectedLocale = translations[locale] ? locale : 'en';
        document.documentElement.lang = localeTags[selectedLocale];
        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const value = getValue(selectedLocale, element.dataset.i18n);
            if (value !== undefined) element.textContent = format(value);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            const value = getValue(selectedLocale, element.dataset.i18nPlaceholder);
            if (value !== undefined) element.placeholder = value;
        });
        document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
            const value = getValue(selectedLocale, element.dataset.i18nAria);
            if (value !== undefined) element.setAttribute('aria-label', value);
        });
        const language = getValue(selectedLocale, 'common.language');
        const select = document.getElementById('languageSelect');
        if (select) select.setAttribute('aria-label', language);
        const title = document.querySelector('title[data-i18n]');
        if (title) document.title = format(getValue(selectedLocale, title.dataset.i18n));
        window.dispatchEvent(new CustomEvent('languagechange', { detail: { locale: selectedLocale } }));
    };

    const select = document.getElementById('languageSelect');
    let savedLocale = 'en';
    try { savedLocale = localStorage.getItem('miningRoiLanguage') || 'en'; } catch (error) { /* Storage may be unavailable in private mode. */ }
    if (select) {
        select.value = translations[savedLocale] ? savedLocale : 'en';
        select.addEventListener('change', () => {
            const locale = select.value;
            try { localStorage.setItem('miningRoiLanguage', locale); } catch (error) { /* Keep the current page usable. */ }
            applyTranslations(locale);
        });
    }

    window.MiningI18n = {
        t: (key) => format(getValue(currentLocale(), key) || key),
        apply: applyTranslations,
        getLocale: currentLocale
    };
    applyTranslations(select?.value || 'en');
}());
