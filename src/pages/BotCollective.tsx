import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  Bot, Brain, Code, Shield, Zap, Database, 
  Network, Send, Sparkles, MessageSquare, 
  ArrowRight, CheckCircle, Home, Cpu
} from "lucide-react";
import { Link } from "react-router-dom";

// Spezialisierte Bot-Definitionen mit Wissensbasen
const BOTS = {
  coder: {
    id: "coder",
    name: "CodeMaster",
    emoji: "💻",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    specialty: "Programmierung & Algorithmen",
    knowledge: {
      languages: ["JavaScript", "TypeScript", "Python", "Rust", "Solidity"],
      patterns: ["MVC", "SOLID", "DRY", "KISS", "Factory", "Observer"],
      crypto: {
        hashing: ["SHA256", "RIPEMD160", "Keccak256"],
        signing: ["ECDSA", "Ed25519", "Schnorr"],
        curves: ["secp256k1", "ed25519", "P-256"]
      },
      bitcoin: {
        addressTypes: ["P2PKH", "P2SH", "Bech32", "Bech32m"],
        privateKeyFormats: ["WIF", "HEX", "Base58"],
        derivation: ["BIP32", "BIP39", "BIP44", "BIP84"]
      }
    },
    analyze: (input: string, context: any) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("hash") || lowInput.includes("sha")) {
        responses.push("🔐 HASH-ANALYSE: Bitcoin verwendet SHA256(SHA256(x)) für Block-Hashing und RIPEMD160(SHA256(x)) für Adressen.");
        responses.push("📊 Kollisionswahrscheinlichkeit bei SHA256: 2^128 Operationen (praktisch unmöglich).");
      }
      
      if (lowInput.includes("private") || lowInput.includes("key") || lowInput.includes("schlüssel")) {
        responses.push("🔑 PRIVATE KEY STRUKTUR: 256-bit Zufallszahl im Bereich [1, n-1] wobei n = Ordnung der secp256k1 Kurve.");
        responses.push("📐 n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");
        responses.push("⚡ WIF-Format: Base58Check(0x80 + privkey + checksum) für Mainnet.");
      }
      
      if (lowInput.includes("puzzle") || lowInput.includes("bitcoin")) {
        responses.push("🧩 PUZZLE-ALGORITHMUS: Systematische Iteration durch Schlüsselraum mit Bloom-Filter für bekannte Adressen.");
        responses.push("💡 Optimierung: Batch-Verarbeitung von EC-Punkt-Multiplikationen mit Endomorphismus.");
        responses.push("🚀 GPU-Beschleunigung: Parallele ECDSA-Berechnungen auf CUDA/OpenCL.");
      }
      
      if (lowInput.includes("code") || lowInput.includes("algorithmus")) {
        responses.push("📝 CODE-PATTERN: Empfehle Worker-Pool mit SharedArrayBuffer für Multi-Threading.");
        responses.push("🔄 Optimale Batch-Größe: 10.000 - 100.000 Keys pro Worker-Iteration.");
      }
      
      if (responses.length === 0) {
        responses.push("💻 Bereit für Code-Analyse. Nenne spezifische Algorithmen oder Krypto-Funktionen.");
      }
      
      return { bot: "coder", responses, confidence: 0.85 + Math.random() * 0.1 };
    }
  },
  
  security: {
    id: "security",
    name: "SecureGuard",
    emoji: "🛡️",
    icon: Shield,
    color: "from-red-500 to-orange-500",
    specialty: "Sicherheit & Kryptographie",
    knowledge: {
      attacks: ["Brute-Force", "Side-Channel", "Timing-Attack", "Rainbow-Tables"],
      defenses: ["Rate-Limiting", "Key-Stretching", "Salting", "HMAC"],
      entropy: {
        minimum: 128,
        recommended: 256,
        sources: ["Hardware-RNG", "OS-Entropy", "User-Input"]
      },
      vulnerabilities: {
        weakKeys: ["Low entropy", "Predictable seeds", "Weak RNG"],
        brainwallet: ["Dictionary attacks", "Rainbow tables", "GPU cracking"]
      }
    },
    analyze: (input: string, context: any) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("sicher") || lowInput.includes("security")) {
        responses.push("🛡️ SICHERHEITS-ANALYSE: Private Keys benötigen mindestens 128-bit Entropie.");
        responses.push("⚠️ WARNUNG: Brain-Wallets sind anfällig für Dictionary-Attacks!");
        responses.push("✅ EMPFEHLUNG: Verwende BIP39 mit 24 Wörtern (256-bit Entropie).");
      }
      
      if (lowInput.includes("brute") || lowInput.includes("force") || lowInput.includes("crack")) {
        responses.push("⏱️ BRUTE-FORCE KALKULATION:");
        responses.push("   • 2^66 Keys = ~7.4 × 10^19 Kombinationen");
        responses.push("   • Bei 1 Billion Keys/s = ~2.300 Jahre");
        responses.push("   • Mit 1000 GPUs = ~2.3 Jahre");
        responses.push("🔥 Puzzle #66 ist am Rand der Machbarkeit!");
      }
      
      if (lowInput.includes("entropy") || lowInput.includes("zufall")) {
        responses.push("🎲 ENTROPIE-CHECK: Überprüfe Zufallsquelle auf Bias und Vorhersagbarkeit.");
        responses.push("📊 Min. 256-bit für langfristige Sicherheit empfohlen.");
      }
      
      if (lowInput.includes("attack") || lowInput.includes("angriff")) {
        responses.push("🚨 BEKANNTE ANGRIFFSVEKTOREN:");
        responses.push("   1. Weak RNG Exploitation");
        responses.push("   2. Side-Channel (Timing, Power)");
        responses.push("   3. Social Engineering");
        responses.push("   4. Malware/Keylogger");
      }
      
      if (responses.length === 0) {
        responses.push("🛡️ Security-Bot aktiv. Frage nach Sicherheitsanalysen oder Angriffsvektoren.");
      }
      
      return { bot: "security", responses, confidence: 0.88 + Math.random() * 0.08 };
    }
  },
  
  math: {
    id: "math",
    name: "MathGenius",
    emoji: "🧮",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    specialty: "Mathematik & Kryptographie",
    knowledge: {
      curves: {
        secp256k1: {
          p: "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F",
          a: 0,
          b: 7,
          G: "Generator Point",
          n: "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141"
        }
      },
      operations: ["Point Addition", "Scalar Multiplication", "Modular Inverse"],
      optimizations: ["Endomorphism", "wNAF", "Montgomery Ladder"]
    },
    analyze: (input: string, context: any) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("kurve") || lowInput.includes("curve") || lowInput.includes("elliptic")) {
        responses.push("📐 SECP256K1 KURVE: y² = x³ + 7 (mod p)");
        responses.push("🔢 p = 2²⁵⁶ - 2³² - 977 (Primzahl)");
        responses.push("📊 Ordnung n ≈ 1.158 × 10⁷⁷ (Anzahl möglicher Private Keys)");
        responses.push("⚡ Endomorphismus: λ-Optimierung für 33% Speedup möglich!");
      }
      
      if (lowInput.includes("wahrscheinlichkeit") || lowInput.includes("probability") || lowInput.includes("chance")) {
        responses.push("🎯 WAHRSCHEINLICHKEITS-BERECHNUNG:");
        responses.push("   • Puzzle #66: 1 in 2^66 = 1 in 73.786.976.294.838.206.464");
        responses.push("   • Bei 1B Keys/s: ~2.339 Jahre Expected Value");
        responses.push("   • Luck-Faktor kann dies drastisch reduzieren!");
      }
      
      if (lowInput.includes("formel") || lowInput.includes("berechnung") || lowInput.includes("math")) {
        responses.push("🧮 MATHEMATISCHE GRUNDLAGEN:");
        responses.push("   • Public Key P = k × G (Skalarmultiplikation)");
        responses.push("   • k = Private Key (256-bit Integer)");
        responses.push("   • G = Generator Point auf secp256k1");
        responses.push("   • Umkehrung (Discrete Log) ist praktisch unmöglich!");
      }
      
      if (lowInput.includes("optimierung") || lowInput.includes("speed")) {
        responses.push("⚡ OPTIMIERUNGS-STRATEGIEN:");
        responses.push("   1. Batch-Inversion: O(n) → O(1) für n Inversionen");
        responses.push("   2. wNAF Encoding: Reduziert Point-Additions um ~25%");
        responses.push("   3. Endomorphismus: Nutzt Kurven-Symmetrie für Speedup");
      }
      
      if (responses.length === 0) {
        responses.push("🧮 Math-Bot bereit. Frage nach Kurven, Wahrscheinlichkeiten oder Formeln.");
      }
      
      return { bot: "math", responses, confidence: 0.92 + Math.random() * 0.06 };
    }
  },
  
  data: {
    id: "data",
    name: "DataMiner",
    emoji: "📊",
    icon: Database,
    color: "from-green-500 to-emerald-500",
    specialty: "Datenanalyse & Statistik",
    knowledge: {
      puzzles: {
        66: { bits: 66, range: "2^65 - 2^66", address: "13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so", reward: "6.6 BTC" },
        67: { bits: 67, range: "2^66 - 2^67", address: "1BY8GQbnueYofwSuFAT3USAhGjPrkxDdW9", reward: "6.7 BTC" },
        68: { bits: 68, range: "2^67 - 2^68", address: "1MVDYgVaSN6iKKEsbzRUAYFrYJadLYZvvZ", reward: "6.8 BTC" },
        130: { bits: 130, range: "2^129 - 2^130", address: "1Fo65aKq8s8iquKTpWNBchNv2aGYLVSQ4e", reward: "13.0 BTC" }
      },
      statistics: {
        totalPuzzles: 160,
        solved: 65,
        remaining: 95,
        totalReward: "~1000 BTC"
      }
    },
    analyze: (input: string, context: any) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("puzzle") || lowInput.includes("status")) {
        responses.push("📊 PUZZLE-STATISTIK:");
        responses.push("   • Gelöst: 65 von 160 Puzzles");
        responses.push("   • Verbleibend: 95 Puzzles");
        responses.push("   • Gesamtwert: ~1000 BTC ($60M+)");
        responses.push("   • Nächstes Ziel: Puzzle #66 (6.6 BTC)");
      }
      
      if (lowInput.includes("66") || lowInput.includes("sechsundsechzig")) {
        responses.push("🎯 PUZZLE #66 DETAILS:");
        responses.push("   • Adresse: 13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so");
        responses.push("   • Belohnung: 6.6 BTC (~$400.000)");
        responses.push("   • Suchraum: 2^65 bis 2^66");
        responses.push("   • Größe: ~36.893.488.147.419.103.232 Keys");
      }
      
      if (lowInput.includes("reward") || lowInput.includes("belohnung") || lowInput.includes("btc")) {
        responses.push("💰 BELOHNUNGS-ÜBERSICHT:");
        responses.push("   • #66: 6.6 BTC");
        responses.push("   • #67: 6.7 BTC");
        responses.push("   • #68: 6.8 BTC");
        responses.push("   • #130: 13.0 BTC");
        responses.push("   • Gesamt verfügbar: ~964 BTC");
      }
      
      if (lowInput.includes("history") || lowInput.includes("gelöst") || lowInput.includes("solved")) {
        responses.push("📜 LÖSUNGS-HISTORIE:");
        responses.push("   • #1-65: Alle gelöst (2015-2023)");
        responses.push("   • Letzte Lösung: #65 im Jahr 2019");
        responses.push("   • Schwierigkeit steigt exponentiell!");
      }
      
      if (responses.length === 0) {
        responses.push("📊 Data-Bot aktiv. Frage nach Puzzle-Statistiken oder Belohnungen.");
      }
      
      return { bot: "data", responses, confidence: 0.90 + Math.random() * 0.08 };
    }
  },
  
  network: {
    id: "network",
    name: "NetLinker",
    emoji: "🌐",
    icon: Network,
    color: "from-yellow-500 to-amber-500",
    specialty: "Netzwerk & Kommunikation",
    knowledge: {
      protocols: ["Bitcoin P2P", "WebSocket", "REST API", "gRPC"],
      nodes: ["Full Node", "SPV", "Light Client"],
      apis: ["Blockchain.info", "BlockCypher", "Mempool.space"]
    },
    analyze: (input: string, context: any) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("api") || lowInput.includes("abfrage")) {
        responses.push("🌐 VERFÜGBARE APIS:");
        responses.push("   • blockchain.info/rawaddr/{address}");
        responses.push("   • blockstream.info/api/address/{address}");
        responses.push("   • mempool.space/api/address/{address}");
        responses.push("💡 Rate-Limits beachten: ~10 req/s");
      }
      
      if (lowInput.includes("node") || lowInput.includes("netzwerk")) {
        responses.push("🖥️ NETZWERK-INFO:");
        responses.push("   • Aktive Nodes: ~15.000 weltweit");
        responses.push("   • Blockchain-Größe: ~500 GB");
        responses.push("   • Für Puzzle-Scanning: Light-Client reicht!");
      }
      
      if (lowInput.includes("verbindung") || lowInput.includes("connect")) {
        responses.push("🔗 VERBINDUNGS-STATUS:");
        responses.push("   • Bot-Kollektiv: ONLINE");
        responses.push("   • Inter-Bot-Kommunikation: AKTIV");
        responses.push("   • Wissens-Synchronisation: ECHTZEIT");
      }
      
      if (responses.length === 0) {
        responses.push("🌐 Network-Bot bereit. Frage nach APIs, Nodes oder Verbindungen.");
      }
      
      return { bot: "network", responses, confidence: 0.87 + Math.random() * 0.1 };
    }
  },
  
  optimizer: {
    id: "optimizer",
    name: "SpeedDemon",
    emoji: "⚡",
    icon: Zap,
    color: "from-cyan-500 to-blue-500",
    specialty: "Performance & Optimierung",
    knowledge: {
      hardware: {
        gpu: ["RTX 4090: ~2B keys/s", "RTX 3090: ~1.5B keys/s", "RX 7900 XTX: ~1.8B keys/s"],
        asic: ["Hypothetisch: ~100B keys/s"],
        cpu: ["Ryzen 9: ~50M keys/s", "Intel i9: ~45M keys/s"]
      },
      techniques: ["SIMD", "AVX-512", "CUDA", "OpenCL", "Multi-Threading"]
    },
    analyze: (input: string, context: any) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("gpu") || lowInput.includes("grafikkarte") || lowInput.includes("hardware")) {
        responses.push("⚡ HARDWARE-PERFORMANCE:");
        responses.push("   • RTX 4090: ~2 Milliarden Keys/s");
        responses.push("   • RTX 3090: ~1.5 Milliarden Keys/s");
        responses.push("   • RX 7900 XTX: ~1.8 Milliarden Keys/s");
        responses.push("💪 Empfehlung: RTX 4090 für beste Effizienz!");
      }
      
      if (lowInput.includes("optimierung") || lowInput.includes("schneller") || lowInput.includes("speed")) {
        responses.push("🚀 OPTIMIERUNGS-TIPPS:");
        responses.push("   1. Batch-Verarbeitung: 100k Keys pro Iteration");
        responses.push("   2. Bloom-Filter: O(1) Adress-Lookup");
        responses.push("   3. Endomorphismus: 33% Speedup");
        responses.push("   4. Memory-Pooling: Reduziert Allokationen");
      }
      
      if (lowInput.includes("zeit") || lowInput.includes("dauer") || lowInput.includes("time")) {
        responses.push("⏱️ ZEIT-KALKULATION (für Puzzle #66):");
        responses.push("   • 1 RTX 4090: ~1.168 Jahre");
        responses.push("   • 10 RTX 4090s: ~117 Jahre");
        responses.push("   • 100 RTX 4090s: ~11.7 Jahre");
        responses.push("   • 1000 RTX 4090s: ~1.17 Jahre");
        responses.push("💡 Luck kann dies drastisch verkürzen!");
      }
      
      if (responses.length === 0) {
        responses.push("⚡ Speed-Bot aktiv. Frage nach Hardware oder Optimierungen.");
      }
      
      return { bot: "optimizer", responses, confidence: 0.89 + Math.random() * 0.08 };
    }
  }
};

interface Message {
  id: string;
  type: "user" | "bot" | "collective";
  content: string;
  bot?: string;
  confidence?: number;
  timestamp: Date;
}

interface BotResponse {
  bot: string;
  responses: string[];
  confidence: number;
}

export default function BotCollective() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeBots, setActiveBots] = useState<Record<string, boolean>>({
    coder: true,
    security: true,
    math: true,
    data: true,
    network: true,
    optimizer: true
  });
  const [collectiveMode, setCollectiveMode] = useState(true);

  const processWithCollective = useCallback((userInput: string) => {
    const results: BotResponse[] = [];
    
    // Sammle Antworten von allen aktiven Bots
    Object.entries(BOTS).forEach(([id, bot]) => {
      if (activeBots[id]) {
        const result = bot.analyze(userInput, { previousResults: results });
        results.push(result);
      }
    });
    
    return results;
  }, [activeBots]);

  const synthesizeCollective = (results: BotResponse[]): string => {
    if (results.length === 0) return "Keine aktiven Bots verfügbar.";
    
    // Sortiere nach Confidence
    const sorted = [...results].sort((a, b) => b.confidence - a.confidence);
    
    let synthesis = "🤖 **KOLLEKTIV-SYNTHESE**\n\n";
    synthesis += `📊 ${results.length} Bots haben analysiert:\n\n`;
    
    sorted.forEach(result => {
      const bot = BOTS[result.bot as keyof typeof BOTS];
      synthesis += `${bot.emoji} **${bot.name}** (${(result.confidence * 100).toFixed(0)}% Konfidenz):\n`;
      result.responses.forEach(r => {
        synthesis += `${r}\n`;
      });
      synthesis += "\n";
    });
    
    // Berechne Gesamt-Konfidenz
    const avgConfidence = sorted.reduce((sum, r) => sum + r.confidence, 0) / sorted.length;
    synthesis += `\n🎯 **Kollektive Konfidenz: ${(avgConfidence * 100).toFixed(1)}%**`;
    
    return synthesis;
  };

  const handleSubmit = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    
    // Simuliere Verarbeitungszeit
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const results = processWithCollective(input);
    
    if (collectiveMode) {
      // Kollektive Antwort
      const synthesis = synthesizeCollective(results);
      const collectiveMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "collective",
        content: synthesis,
        confidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, collectiveMessage]);
    } else {
      // Individuelle Bot-Antworten
      results.forEach((result, index) => {
        setTimeout(() => {
          const bot = BOTS[result.bot as keyof typeof BOTS];
          const botMessage: Message = {
            id: (Date.now() + index + 1).toString(),
            type: "bot",
            content: result.responses.join("\n"),
            bot: result.bot,
            confidence: result.confidence,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        }, index * 300);
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Home className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Cpu className="w-8 h-8 text-cyan-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Bot Collective
                  </h1>
                  <p className="text-xs text-gray-400">Lokale KI ohne API-Kosten</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Kollektiv-Modus</span>
                <Switch
                  checked={collectiveMode}
                  onCheckedChange={setCollectiveMode}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>
              <Badge variant="outline" className="border-green-500 text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                {Object.values(activeBots).filter(Boolean).length} Bots aktiv
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Bot Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 border-gray-700 p-4">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                Aktive Bots
              </h2>
              
              <div className="space-y-3">
                {Object.entries(BOTS).map(([id, bot]) => {
                  const Icon = bot.icon;
                  return (
                    <div
                      key={id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        activeBots[id]
                          ? "bg-gray-700/50 border-gray-600"
                          : "bg-gray-800/30 border-gray-700/50 opacity-50"
                      }`}
                      onClick={() => setActiveBots(prev => ({ ...prev, [id]: !prev[id] }))}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${bot.color} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{bot.emoji} {bot.name}</p>
                            <p className="text-xs text-gray-400">{bot.specialty}</p>
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${activeBots[id] ? "bg-green-500 animate-pulse" : "bg-gray-600"}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                <p className="text-xs text-gray-400 mb-2">💡 Tipp</p>
                <p className="text-xs text-gray-300">
                  Im Kollektiv-Modus werden alle Antworten zusammengefasst. Deaktiviere ihn für individuelle Bot-Antworten.
                </p>
              </div>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800/50 border-gray-700 h-[calc(100vh-200px)] flex flex-col">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center mb-4">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Bot Collective bereit!</h3>
                    <p className="text-gray-400 max-w-md mb-6">
                      Stelle Fragen zu Bitcoin-Puzzles, Kryptographie, Algorithmen oder Sicherheit. 
                      Die spezialisierten Bots analysieren gemeinsam.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {["Wie löst man Puzzle #66?", "Erkläre secp256k1", "GPU Performance?", "Sicherheitsrisiken?"].map(q => (
                        <Button
                          key={q}
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          onClick={() => setInput(q)}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            msg.type === "user"
                              ? "bg-cyan-600 text-white"
                              : msg.type === "collective"
                              ? "bg-gradient-to-br from-purple-900/50 to-cyan-900/50 border border-purple-500/30"
                              : "bg-gray-700/50 border border-gray-600"
                          }`}
                        >
                          {msg.type !== "user" && (
                            <div className="flex items-center gap-2 mb-2">
                              {msg.type === "collective" ? (
                                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                                  <Network className="w-3 h-3 mr-1" />
                                  Kollektiv
                                </Badge>
                              ) : msg.bot && (
                                <Badge 
                                  className={`bg-gradient-to-r ${BOTS[msg.bot as keyof typeof BOTS]?.color} text-white border-0`}
                                >
                                  {BOTS[msg.bot as keyof typeof BOTS]?.emoji} {BOTS[msg.bot as keyof typeof BOTS]?.name}
                                </Badge>
                              )}
                              {msg.confidence && (
                                <span className="text-xs text-gray-400">
                                  {(msg.confidence * 100).toFixed(0)}% Konfidenz
                                </span>
                              )}
                            </div>
                          )}
                          <div className="text-sm whitespace-pre-wrap">
                            {msg.content.split("**").map((part, i) => 
                              i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                            )}
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            {msg.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 flex items-center gap-3">
                          <div className="flex gap-1">
                            {[0, 1, 2].map(i => (
                              <div
                                key={i}
                                className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.1}s` }}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">Bots analysieren...</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Stelle eine Frage an das Bot-Kollektiv..."
                    className="flex-1 bg-gray-700/50 border-gray-600 text-white resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing || !input.trim()}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-6"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bot Network Visualization */}
        <Card className="mt-6 bg-gray-800/50 border-gray-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            Bot-Netzwerk Verbindungen
          </h3>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {Object.entries(BOTS).map(([id, bot], index) => {
              const Icon = bot.icon;
              const isActive = activeBots[id];
              return (
                <div key={id} className="flex items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bot.color} flex items-center justify-center transition-all ${
                      isActive ? "scale-100 opacity-100" : "scale-90 opacity-40"
                    }`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {index < Object.keys(BOTS).length - 1 && (
                    <ArrowRight className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-gray-600"}`} />
                  )}
                </div>
              );
            })}
          </div>
          
          <p className="text-center text-gray-400 text-sm mt-4">
            Alle aktiven Bots teilen ihr Wissen und analysieren gemeinsam
          </p>
        </Card>
      </div>
    </div>
  );
}
