// High quality SVG trading chart generators for presets so the app works instantly out of the box
function createTradingViewChartSVG(
  asset: string,
  timeframe: string,
  trend: 'bullish' | 'bearish',
  pattern: string
): string {
  const isBull = trend === 'bullish';
  const mainColor = isBull ? '#089981' : '#f23645';
  const bg = '#131722';
  const cardBg = '#1e222d';
  const gridColor = '#2a2e39';
  const textColor = '#d1d4dc';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450" style="background:${bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <!-- Grid lines -->
    <rect width="800" height="450" fill="${bg}"/>
    <line x1="0" y1="90" x2="800" y2="90" stroke="${gridColor}" stroke-width="1" stroke-dasharray="4"/>
    <line x1="0" y1="180" x2="800" y2="180" stroke="${gridColor}" stroke-width="1" stroke-dasharray="4"/>
    <line x1="0" y1="270" x2="800" y2="270" stroke="${gridColor}" stroke-width="1" stroke-dasharray="4"/>
    <line x1="0" y1="360" x2="800" y2="360" stroke="${gridColor}" stroke-width="1" stroke-dasharray="4"/>
    
    <line x1="160" y1="0" x2="160" y2="450" stroke="${gridColor}" stroke-width="1" stroke-dasharray="4"/>
    <line x1="320" y1="0" x2="320" y2="450" stroke="${gridColor}" stroke-width="1" stroke-dasharray="4"/>
    <line x1="480" y1="0" x2="480" y2="450" stroke="${gridColor}" stroke-width="1" stroke-dasharray="4"/>
    <line x1="640" y1="0" x2="640" y2="450" stroke="${gridColor}" stroke-width="1" stroke-dasharray="4"/>

    <!-- Header bar -->
    <rect width="800" height="40" fill="${cardBg}"/>
    <text x="15" y="25" fill="#f0b90b" font-size="16" font-weight="bold">${asset}</text>
    <rect x="120" y="10" width="45" height="22" rx="4" fill="#2a2e39"/>
    <text x="142" y="25" fill="${textColor}" font-size="12" text-anchor="middle" font-weight="600">${timeframe}</text>
    <text x="180" y="25" fill="#2962ff" font-size="12" font-weight="bold">TRADINGVIEW • ABAIDULLAH ANALYSIS</text>

    <!-- Indicators overlay (EMA 20/50 & VWAP) -->
    <path d="${isBull ? 'M 50 320 Q 200 280, 400 210 T 750 120' : 'M 50 120 Q 200 180, 400 250 T 750 350'}" fill="none" stroke="#2962ff" stroke-width="2"/>
    <path d="${isBull ? 'M 50 350 Q 250 310, 450 240 T 750 160' : 'M 50 100 Q 250 150, 450 220 T 750 380'}" fill="none" stroke="#ff9800" stroke-width="1.5" stroke-dasharray="6,3"/>

    <!-- Order Block / FVG Box -->
    <rect x="${isBull ? '360' : '360'}" y="${isBull ? '220' : '160'}" width="280" height="45" fill="${isBull ? 'rgba(8, 153, 129, 0.25)' : 'rgba(242, 54, 69, 0.25)'}" stroke="${mainColor}" stroke-width="1.5" stroke-dasharray="4"/>
    <text x="${isBull ? '370' : '370'}" y="${isBull ? '247' : '187'}" fill="${mainColor}" font-size="11" font-weight="bold">${pattern.toUpperCase()}</text>

    <!-- Price Candlesticks Mock -->
    ${generateCandlesticks(isBull)}

    <!-- Watermark / Branding -->
    <text x="400" y="225" fill="rgba(255,255,255,0.04)" font-size="32" font-weight="bold" text-anchor="middle">ABAIDULLAH TRADER</text>

    <!-- Price axis right -->
    <rect x="730" y="0" width="70" height="450" fill="${cardBg}"/>
    <line x1="730" y1="0" x2="730" y2="450" stroke="${gridColor}"/>
    <text x="765" y="100" fill="${textColor}" font-size="10" text-anchor="middle">${isBull ? '97,800' : '1.0920'}</text>
    <text x="765" y="180" fill="${textColor}" font-size="10" text-anchor="middle">${isBull ? '97,200' : '1.0880'}</text>
    <rect x="731" y="210" width="69" height="20" fill="${mainColor}"/>
    <text x="765" y="224" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle">${isBull ? '96,520' : '1.0845'}</text>
    <text x="765" y="300" fill="${textColor}" font-size="10" text-anchor="middle">${isBull ? '95,800' : '1.0800'}</text>
    <text x="765" y="380" fill="${textColor}" font-size="10" text-anchor="middle">${isBull ? '95,100' : '1.0760'}</text>
  </svg>`;

  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

function generateCandlesticks(isBull: boolean): string {
  const candles = [];
  const startX = 60;
  const count = 18;
  const step = 36;
  
  let currentY = isBull ? 330 : 120;

  for (let i = 0; i < count; i++) {
    const x = startX + i * step;
    const isUp = isBull ? (i % 3 !== 1) : (i % 3 === 1);
    const bodyHeight = 15 + Math.random() * 35;
    
    if (isBull) {
      if (i > 8 && i < 12) currentY += 8; // pullback to Order block
      else currentY -= 12; // impulse upward
    } else {
      if (i > 8 && i < 12) currentY -= 8; // pullback upward
      else currentY += 12; // impulse downward
    }

    const open = currentY;
    const close = isUp ? open - bodyHeight : open + bodyHeight;
    const high = Math.min(open, close) - (5 + Math.random() * 15);
    const low = Math.max(open, close) + (5 + Math.random() * 15);
    const color = isUp ? '#089981' : '#f23645';

    candles.push(`
      <line x1="${x}" y1="${high}" x2="${x}" y2="${low}" stroke="${color}" stroke-width="1.5"/>
      <rect x="${x - 6}" y="${Math.min(open, close)}" width="12" height="${Math.abs(close - open)}" fill="${color}" rx="1"/>
    `);
  }

  // Annotations
  if (isBull) {
    candles.push(`
      <!-- Liquidity sweep arrow -->
      <path d="M 380 290 L 380 260" stroke="#f0b90b" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="380" y="310" fill="#f0b90b" font-size="11" font-weight="bold" text-anchor="middle">SSL SWEEP / LIQUIDITY GRAB</text>
      <!-- BOS Line -->
      <line x1="300" y1="180" x2="550" y2="180" stroke="#2962ff" stroke-width="1.5" stroke-dasharray="3"/>
      <text x="420" y="173" fill="#2962ff" font-size="11" font-weight="bold" text-anchor="middle">BOS (Break of Structure)</text>
    `);
  } else {
    candles.push(`
      <!-- BSL sweep -->
      <line x1="300" y1="130" x2="550" y2="130" stroke="#f0b90b" stroke-width="1.5" stroke-dasharray="3"/>
      <text x="420" y="122" fill="#f0b90b" font-size="11" font-weight="bold" text-anchor="middle">BSL SWEEP (Buy-side Liquidity)</text>
      <!-- CHoCH Line -->
      <line x1="350" y1="240" x2="600" y2="240" stroke="#f23645" stroke-width="1.5" stroke-dasharray="3"/>
      <text x="470" y="255" fill="#f23645" font-size="11" font-weight="bold" text-anchor="middle">CHoCH / MSS (Market Structure Shift)</text>
    `);
  }

  return candles.join('\n');
}

export const SAMPLE_PRESETS = [
  {
    id: 'btc-bullish-ob-fvg',
    title: 'BTC/USDT 15M/5M/1M Bullish Order Block Retest',
    asset: 'BTC/USDT',
    description: 'Sell-Side Liquidity (SSL) sweep on 15M, followed by 5M CHoCH displacement leaving a clear 1M Bullish FVG & Demand Zone.',
    images: [
      {
        name: 'BTCUSDT_15M_Structure.png',
        timeframe: '15M',
        url: createTradingViewChartSVG('BTC/USDT', '15M', 'bullish', '15M Demand Zone & SSL Sweep')
      },
      {
        name: 'BTCUSDT_5M_Displacement.png',
        timeframe: '5M',
        url: createTradingViewChartSVG('BTC/USDT', '5M', 'bullish', '5M Bullish CHoCH & BOS')
      },
      {
        name: 'BTCUSDT_1M_Entry_Zone.png',
        timeframe: '1M',
        url: createTradingViewChartSVG('BTC/USDT', '1M', 'bullish', '1M Bullish FVG Retest Entry')
      }
    ]
  },
  {
    id: 'eurusd-bearish-mss',
    title: 'EUR/USD 15M/5M Bearish MSS & Supply Grab',
    asset: 'EUR/USD',
    description: 'Buy-Side Liquidity (BSL) grab above London high, followed by aggressive downward displacement creating a Bearish Order Block.',
    images: [
      {
        name: 'EURUSD_15M_LiquidityGrab.png',
        timeframe: '15M',
        url: createTradingViewChartSVG('EUR/USD', '15M', 'bearish', '15M BSL Sweep above London High')
      },
      {
        name: 'EURUSD_5M_Supply_Block.png',
        timeframe: '5M',
        url: createTradingViewChartSVG('EUR/USD', '5M', 'bearish', '5M Bearish Order Block & FVG')
      },
      {
        name: 'EURUSD_1M_Scalp_Trigger.png',
        timeframe: '1M',
        url: createTradingViewChartSVG('EUR/USD', '1M', 'bearish', '1M Retest & Mitigation Entry')
      }
    ]
  },
  {
    id: 'xauusd-gold-fvg-scalp',
    title: 'XAU/USD (Gold) 5M/3M/1M High Confluence Buy',
    asset: 'XAU/USD',
    description: 'New York Session open momentum, VWAP support bounce with double bottom liquidity sweep on 3M.',
    images: [
      {
        name: 'XAUUSD_5M_VWAP_Bounce.png',
        timeframe: '5M',
        url: createTradingViewChartSVG('XAU/USD', '5M', 'bullish', '5M VWAP + Bullish Mitigation')
      },
      {
        name: 'XAUUSD_3M_Liquidity_Grab.png',
        timeframe: '3M',
        url: createTradingViewChartSVG('XAU/USD', '3M', 'bullish', '3M Equal Lows Sweep')
      },
      {
        name: 'XAUUSD_1M_Impulse_Entry.png',
        timeframe: '1M',
        url: createTradingViewChartSVG('XAU/USD', '1M', 'bullish', '1M Fair Value Gap Fill')
      }
    ]
  }
];
