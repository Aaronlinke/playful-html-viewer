import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, RefreshCw, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  icon: string;
}

// Simulierte Live-Preise (echte API-Calls würden API-Keys benötigen)
const MOCK_CRYPTOS: CryptoPrice[] = [
  { symbol: "BTC", name: "Bitcoin", price: 67542.32, change24h: 2.34, icon: "₿" },
  { symbol: "ETH", name: "Ethereum", price: 3421.87, change24h: -1.23, icon: "⟠" },
  { symbol: "BNB", name: "Binance", price: 589.45, change24h: 0.87, icon: "🟡" },
  { symbol: "SOL", name: "Solana", price: 142.67, change24h: 5.43, icon: "◎" },
  { symbol: "XRP", name: "Ripple", price: 0.5234, change24h: -0.45, icon: "✕" },
  { symbol: "ADA", name: "Cardano", price: 0.4521, change24h: 1.12, icon: "₳" },
  { symbol: "DOGE", name: "Dogecoin", price: 0.1234, change24h: 3.21, icon: "🐕" },
  { symbol: "DOT", name: "Polkadot", price: 6.78, change24h: -2.11, icon: "●" },
];

interface CryptoTickerProps {
  selectedApis: string[];
}

const CryptoTicker = ({ selectedApis }: CryptoTickerProps) => {
  const [prices, setPrices] = useState<CryptoPrice[]>(MOCK_CRYPTOS);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simuliere Live-Updates
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setPrices(prev => prev.map(crypto => ({
        ...crypto,
        price: crypto.price * (1 + (Math.random() - 0.5) * 0.002),
        change24h: crypto.change24h + (Math.random() - 0.5) * 0.1,
      })));
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  };

  return (
    <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border-b border-yellow-500/30">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/50">
        <Zap className="w-3 h-3 text-yellow-500" />
        <span className="text-[10px] font-bold text-yellow-500">LIVE TICKER</span>
        <Badge 
          variant="outline" 
          className={`text-[8px] px-1 py-0 ml-auto ${isLive ? "border-green-500 text-green-500" : "border-muted text-muted-foreground"}`}
        >
          {isLive ? "● LIVE" : "○ PAUSED"}
        </Badge>
        <button 
          onClick={() => setIsLive(!isLive)}
          className="p-0.5 hover:bg-secondary rounded"
        >
          <RefreshCw className={`w-3 h-3 ${isLive ? "animate-spin text-green-500" : "text-muted-foreground"}`} style={{ animationDuration: "3s" }} />
        </button>
      </div>

      {/* Ticker Tape */}
      <div className="overflow-hidden">
        <div className="flex animate-scroll-x gap-4 px-3 py-1.5">
          {[...prices, ...prices].map((crypto, idx) => (
            <div 
              key={`${crypto.symbol}-${idx}`}
              className="flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span className="text-sm">{crypto.icon}</span>
              <span className="font-mono text-[10px] font-bold">{crypto.symbol}</span>
              <span className="font-mono text-[10px]">{formatPrice(crypto.price)}</span>
              <span className={`flex items-center text-[9px] font-mono ${crypto.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                {crypto.change24h >= 0 ? <TrendingUp className="w-2 h-2 mr-0.5" /> : <TrendingDown className="w-2 h-2 mr-0.5" />}
                {crypto.change24h >= 0 ? "+" : ""}{crypto.change24h.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* APIs Indicator */}
      {selectedApis.length > 0 && (
        <div className="flex items-center gap-1 px-3 py-0.5 text-[8px] text-muted-foreground border-t border-border/30">
          <span>Quellen:</span>
          {selectedApis.slice(0, 3).map((api, idx) => (
            <Badge key={api} variant="secondary" className="text-[7px] px-1 py-0">
              {api}
            </Badge>
          ))}
          {selectedApis.length > 3 && (
            <span>+{selectedApis.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default CryptoTicker;
