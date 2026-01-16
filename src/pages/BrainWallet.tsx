import { useState, useEffect, useCallback } from "react";
import { 
  Brain, Search, Zap, Lock, Unlock, Key, Cpu, Activity, 
  Eye, EyeOff, ChevronDown, ChevronUp, Skull, Diamond,
  RefreshCw, Target, Shield, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface PuzzleTarget {
  id: number;
  address: string;
  balance: string;
  range: string;
  status: "unsolved" | "solved" | "hunting";
  reward: string;
}

interface ScanResult {
  privateKey: string;
  address: string;
  balance: string;
  timestamp: Date;
  match: boolean;
}

// Bitcoin Puzzle Challenges (echte Puzzle-Adressen)
const PUZZLE_TARGETS: PuzzleTarget[] = [
  { id: 66, address: "13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so", balance: "6.6 BTC", range: "2^65 - 2^66", status: "unsolved", reward: "~$440,000" },
  { id: 67, address: "1BY8GQbnueYofwSuFAT3USAhGjPrkxDdW9", balance: "6.7 BTC", range: "2^66 - 2^67", status: "unsolved", reward: "~$450,000" },
  { id: 68, address: "1MVDYgVaSN6iKKEsbzRUAYFrYJadLYZvvZ", balance: "6.8 BTC", range: "2^67 - 2^68", status: "unsolved", reward: "~$455,000" },
  { id: 69, address: "19vkiEajfhuZ8bs8Zu2jgmC6oqZbWqhxhG", balance: "6.9 BTC", range: "2^68 - 2^69", status: "unsolved", reward: "~$460,000" },
  { id: 70, address: "19YZECXj3SxEZMoUeJ1yiPsw8xANe7M7QR", balance: "7.0 BTC", range: "2^69 - 2^70", status: "unsolved", reward: "~$470,000" },
  { id: 71, address: "1PWo3JeB9jrGwfHDNpdGK54CRas7fsVzXU", balance: "7.1 BTC", range: "2^70 - 2^71", status: "unsolved", reward: "~$475,000" },
  { id: 72, address: "1JTK7s9YVYywfm5XUH7RNhHJH1LshCaRFR", balance: "7.2 BTC", range: "2^71 - 2^72", status: "unsolved", reward: "~$480,000" },
  { id: 73, address: "12VVRNPi4SJqUTsp6FmqDqY5ehvVFkigbw", balance: "7.3 BTC", range: "2^72 - 2^73", status: "unsolved", reward: "~$490,000" },
  { id: 130, address: "1Fo65aKq8s8iquMt6weF1rku1moWVEd5Ua", balance: "13 BTC", range: "2^129 - 2^130", status: "unsolved", reward: "~$870,000" },
];

const BrainWallet = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [keysChecked, setKeysChecked] = useState(0);
  const [keysPerSecond, setKeysPerSecond] = useState(0);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleTarget | null>(null);
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  const [customPhrase, setCustomPhrase] = useState("");
  const [brainwalletMode, setBrainwalletMode] = useState<"puzzle" | "brainwallet" | "random">("puzzle");
  const [eliteMode, setEliteMode] = useState(false);

  // Simulierter Scan-Prozess
  const runScan = useCallback(async () => {
    if (isScanning) {
      setIsScanning(false);
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setKeysChecked(0);
    
    const startTime = Date.now();
    let checked = 0;

    const interval = setInterval(() => {
      checked += Math.floor(Math.random() * 50000) + 10000;
      setKeysChecked(checked);
      
      const elapsed = (Date.now() - startTime) / 1000;
      setKeysPerSecond(Math.floor(checked / elapsed));
      
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 2;
        return Math.min(newProgress, 99);
      });

      // Simuliere gefundene Keys (nur zur Demo)
      if (Math.random() < 0.02) {
        const fakeKey = Array.from({ length: 64 }, () => 
          "0123456789abcdef"[Math.floor(Math.random() * 16)]
        ).join("");
        
        const fakeAddress = `1${Array.from({ length: 33 }, () => 
          "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[Math.floor(Math.random() * 58)]
        ).join("")}`;

        setScanResults(prev => [{
          privateKey: fakeKey,
          address: fakeAddress,
          balance: "0 BTC",
          timestamp: new Date(),
          match: false,
        }, ...prev.slice(0, 99)]);
      }
    }, 100);

    // Stoppe nach 30 Sekunden
    setTimeout(() => {
      clearInterval(interval);
      setIsScanning(false);
      setScanProgress(100);
      toast({
        title: "🔍 Scan abgeschlossen",
        description: `${keysChecked.toLocaleString()} Keys überprüft`,
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [isScanning, keysChecked]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-green-400 font-mono">
      {/* Matrix-artiger Header */}
      <div className="border-b border-green-500/30 bg-black/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Brain className="w-8 h-8 text-green-400 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-400 glitch-text">
                  🧠 BRAIN WALLET SCANNER
                </h1>
                <p className="text-[10px] text-green-500/60">ELITE EDITION • Bitcoin Puzzle Hunter</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`border-green-500 ${eliteMode ? "bg-green-500 text-black" : "text-green-500"}`}
                onClick={() => setEliteMode(!eliteMode)}
              >
                <Skull className="w-3 h-3 mr-1" />
                {eliteMode ? "ELITE ON" : "ELITE OFF"}
              </Badge>
              <a 
                href="/satan-solver" 
                className="px-2 py-1 text-xs bg-red-500/20 border border-red-500/50 rounded text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-1"
              >
                <Skull className="w-3 h-3" />
                SATAN SOLVER
              </a>
              <a href="/" className="text-xs text-green-500/50 hover:text-green-400">
                ← Editor
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Linke Spalte: Puzzle Targets */}
          <Card className="bg-black/60 border-green-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Bitcoin Puzzle Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-2">
                <div className="space-y-2">
                  {PUZZLE_TARGETS.map(puzzle => (
                    <button
                      key={puzzle.id}
                      onClick={() => setSelectedPuzzle(puzzle)}
                      className={`w-full text-left p-2 rounded border transition-all ${
                        selectedPuzzle?.id === puzzle.id
                          ? "border-green-400 bg-green-500/20"
                          : "border-green-500/20 hover:border-green-500/50 bg-black/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-yellow-400">#{puzzle.id}</span>
                        <Badge variant="outline" className="text-[8px] border-green-500/50">
                          {puzzle.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-[9px] text-green-500/80 truncate font-mono">
                        {puzzle.address}
                      </div>
                      <div className="flex justify-between mt-1 text-[10px]">
                        <span className="text-orange-400">{puzzle.balance}</span>
                        <span className="text-green-300">{puzzle.reward}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Mitte: Scanner Control */}
          <Card className="bg-black/60 border-green-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-400 text-sm flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Scanner Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mode Selection */}
              <div className="grid grid-cols-3 gap-1">
                {[
                  { mode: "puzzle", label: "Puzzle", icon: Target },
                  { mode: "brainwallet", label: "Brain", icon: Brain },
                  { mode: "random", label: "Random", icon: RefreshCw },
                ].map(({ mode, label, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setBrainwalletMode(mode as typeof brainwalletMode)}
                    className={`p-2 rounded text-[10px] flex flex-col items-center gap-1 transition-all ${
                      brainwalletMode === mode
                        ? "bg-green-500 text-black"
                        : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Brain Wallet Input */}
              {brainwalletMode === "brainwallet" && (
                <div className="space-y-2">
                  <label className="text-[10px] text-green-500">
                    Passphrase / Seed Word Liste:
                  </label>
                  <Textarea
                    value={customPhrase}
                    onChange={(e) => setCustomPhrase(e.target.value)}
                    placeholder="password, 123456, bitcoin, satoshi, nakamoto..."
                    className="bg-black/60 border-green-500/30 text-green-400 text-xs min-h-[80px]"
                  />
                </div>
              )}

              {/* Selected Puzzle Info */}
              {selectedPuzzle && brainwalletMode === "puzzle" && (
                <div className="p-3 rounded bg-green-500/10 border border-green-500/30">
                  <div className="text-[10px] text-green-500 mb-1">ZIEL:</div>
                  <div className="font-bold text-yellow-400">Puzzle #{selectedPuzzle.id}</div>
                  <div className="text-[9px] text-green-400/80 break-all mt-1">
                    {selectedPuzzle.address}
                  </div>
                  <div className="text-[10px] text-green-500/60 mt-2">
                    Range: {selectedPuzzle.range}
                  </div>
                </div>
              )}

              {/* Scan Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded bg-black/40 border border-green-500/20">
                  <div className="text-[9px] text-green-500/60">KEYS CHECKED</div>
                  <div className="font-bold text-lg text-green-400">
                    {keysChecked.toLocaleString()}
                  </div>
                </div>
                <div className="p-2 rounded bg-black/40 border border-green-500/20">
                  <div className="text-[9px] text-green-500/60">KEYS/SEC</div>
                  <div className="font-bold text-lg text-cyan-400">
                    {keysPerSecond.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-green-500">
                  <span>Fortschritt</span>
                  <span>{scanProgress.toFixed(1)}%</span>
                </div>
                <Progress value={scanProgress} className="h-2 bg-green-500/20" />
              </div>

              {/* Start/Stop Button */}
              <Button
                onClick={runScan}
                className={`w-full ${
                  isScanning
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                } text-black font-bold`}
              >
                {isScanning ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-pulse" />
                    STOPPEN
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    SCAN STARTEN
                  </>
                )}
              </Button>

              {/* Warning */}
              <div className="flex items-start gap-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/30">
                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-[9px] text-yellow-500/80">
                  Dies ist ein Simulator zur Demonstration. Echtes Puzzle-Hunting 
                  erfordert massive GPU-Power und spezialisierte Software.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rechte Spalte: Scan Results */}
          <Card className="bg-black/60 border-green-500/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-green-400 text-sm flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Scan Ergebnisse
                </CardTitle>
                <button
                  onClick={() => setShowPrivateKeys(!showPrivateKeys)}
                  className="text-green-500/50 hover:text-green-400"
                >
                  {showPrivateKeys ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-2">
                {scanResults.length === 0 ? (
                  <div className="text-center py-8 text-green-500/40">
                    <Lock className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs">Starte Scan für Ergebnisse</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {scanResults.map((result, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded text-[9px] border ${
                          result.match
                            ? "border-yellow-500 bg-yellow-500/20"
                            : "border-green-500/10 bg-black/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-green-500/60">
                            {result.timestamp.toLocaleTimeString()}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={result.match ? "border-yellow-500 text-yellow-500" : "border-green-500/30"}
                          >
                            {result.balance}
                          </Badge>
                        </div>
                        <div className="font-mono text-[8px] text-green-400/80 truncate">
                          {showPrivateKeys ? result.privateKey : "••••••••••••••••••••••••••••••••"}
                        </div>
                        <div className="font-mono text-[8px] text-cyan-400/60 truncate mt-0.5">
                          → {result.address}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Stats */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: "Gesamt geprüft", value: keysChecked.toLocaleString(), icon: Search },
            { label: "Geschwindigkeit", value: `${keysPerSecond.toLocaleString()}/s`, icon: Zap },
            { label: "Gefundene Wallets", value: scanResults.filter(r => r.match).length.toString(), icon: Unlock },
            { label: "Leere Wallets", value: scanResults.filter(r => !r.match).length.toString(), icon: Lock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-3 rounded bg-black/60 border border-green-500/20">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-green-500" />
                <span className="text-[10px] text-green-500/60">{label}</span>
              </div>
              <div className="font-bold text-xl text-green-400 mt-1">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS für Glitch-Effekt */}
      <style>{`
        .glitch-text {
          text-shadow: 
            0.05em 0 0 rgba(255, 0, 0, 0.75),
            -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
            0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          animation: glitch 500ms infinite;
        }
        
        @keyframes glitch {
          0% { text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em 0.05em 0 rgba(0, 0, 255, 0.75); }
          14% { text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em 0.05em 0 rgba(0, 0, 255, 0.75); }
          15% { text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75); }
          49% { text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75); }
          50% { text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75); }
          99% { text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75); }
          100% { text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em -0.05em 0 rgba(0, 0, 255, 0.75); }
        }
      `}</style>
    </div>
  );
};

export default BrainWallet;
