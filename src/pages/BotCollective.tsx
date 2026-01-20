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
  ArrowRight, CheckCircle, Home, Cpu, Wallet,
  Globe, Lock, Coins, Activity, BarChart3,
  Server, Cloud, Eye, FileCode, Binary,
  Fingerprint, Search, Layers, Box, Radio,
  Antenna, Gauge, Gem
} from "lucide-react";
import { Link } from "react-router-dom";

// 24 SPEZIALISIERTE BOTS - VOLLSTÄNDIGES KOLLEKTIV
const BOTS = {
  // ===== GRUPPE 1: CORE BOTS (Original 6) =====
  coder: {
    id: "coder",
    name: "CodeMaster",
    emoji: "💻",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    specialty: "Programmierung & Algorithmen",
    group: "core",
    knowledge: {
      languages: ["JavaScript", "TypeScript", "Python", "Rust", "Solidity", "C++", "Go"],
      patterns: ["MVC", "SOLID", "DRY", "KISS", "Factory", "Observer", "Singleton"],
      crypto: {
        hashing: ["SHA256", "RIPEMD160", "Keccak256", "Blake2b"],
        signing: ["ECDSA", "Ed25519", "Schnorr", "BLS"],
        curves: ["secp256k1", "ed25519", "P-256", "BN254"]
      },
      bitcoin: {
        addressTypes: ["P2PKH", "P2SH", "Bech32", "Bech32m", "P2TR"],
        privateKeyFormats: ["WIF", "HEX", "Base58", "Bech32"],
        derivation: ["BIP32", "BIP39", "BIP44", "BIP84", "BIP86"]
      }
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("hash") || lowInput.includes("sha")) {
        responses.push("🔐 HASH-ANALYSE: Bitcoin verwendet SHA256(SHA256(x)) für Block-Hashing und RIPEMD160(SHA256(x)) für Adressen.");
        responses.push("📊 Kollisionswahrscheinlichkeit bei SHA256: 2^128 Operationen (praktisch unmöglich).");
      }
      
      if (lowInput.includes("private") || lowInput.includes("key") || lowInput.includes("schlüssel")) {
        responses.push("🔑 PRIVATE KEY STRUKTUR: 256-bit Zufallszahl im Bereich [1, n-1] wobei n = Ordnung der secp256k1 Kurve.");
        responses.push("📐 n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141");
      }
      
      if (lowInput.includes("code") || lowInput.includes("algorithmus")) {
        responses.push("📝 CODE-PATTERN: Empfehle Worker-Pool mit SharedArrayBuffer für Multi-Threading.");
        responses.push("🔄 Optimale Batch-Größe: 10.000 - 100.000 Keys pro Worker-Iteration.");
      }
      
      if (responses.length === 0) {
        responses.push("💻 CodeMaster aktiv. Spezialisiert auf Krypto-Algorithmen und Bitcoin-Protokoll.");
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
    group: "core",
    knowledge: {
      attacks: ["Brute-Force", "Side-Channel", "Timing-Attack", "Rainbow-Tables", "Phishing"],
      defenses: ["Rate-Limiting", "Key-Stretching", "Salting", "HMAC", "2FA"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("sicher") || lowInput.includes("security")) {
        responses.push("🛡️ SICHERHEITS-ANALYSE: Private Keys benötigen mindestens 128-bit Entropie.");
        responses.push("⚠️ WARNUNG: Brain-Wallets sind anfällig für Dictionary-Attacks!");
      }
      
      if (lowInput.includes("brute") || lowInput.includes("force")) {
        responses.push("⏱️ BRUTE-FORCE: 2^66 Keys bei 1B/s = ~2.300 Jahre. Mit 1000 GPUs = ~2.3 Jahre.");
      }
      
      if (responses.length === 0) {
        responses.push("🛡️ SecureGuard aktiv. Frage nach Sicherheitsanalysen oder Angriffsvektoren.");
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
    group: "core",
    knowledge: {
      curves: { secp256k1: { a: 0, b: 7 } },
      operations: ["Point Addition", "Scalar Multiplication", "Modular Inverse"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("kurve") || lowInput.includes("curve") || lowInput.includes("elliptic")) {
        responses.push("📐 SECP256K1: y² = x³ + 7 (mod p), p = 2²⁵⁶ - 2³² - 977");
        responses.push("⚡ Endomorphismus: λ-Optimierung für 33% Speedup möglich!");
      }
      
      if (lowInput.includes("wahrscheinlichkeit") || lowInput.includes("probability")) {
        responses.push("🎯 Puzzle #66: 1 in 2^66 = 1 in 73.786.976.294.838.206.464");
      }
      
      if (responses.length === 0) {
        responses.push("🧮 MathGenius bereit. Frage nach Kurven, Wahrscheinlichkeiten oder Formeln.");
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
    group: "core",
    knowledge: {
      puzzles: { 66: "6.6 BTC", 67: "6.7 BTC", 130: "13.0 BTC" }
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("puzzle") || lowInput.includes("status")) {
        responses.push("📊 PUZZLE-STATISTIK: 65 von 160 gelöst, ~1000 BTC verbleibend ($60M+)");
      }
      
      if (lowInput.includes("66")) {
        responses.push("🎯 PUZZLE #66: 13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so - 6.6 BTC (~$400k)");
      }
      
      if (responses.length === 0) {
        responses.push("📊 DataMiner aktiv. Frage nach Puzzle-Statistiken oder Belohnungen.");
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
    group: "core",
    knowledge: {
      protocols: ["Bitcoin P2P", "WebSocket", "REST API", "gRPC"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("api") || lowInput.includes("abfrage")) {
        responses.push("🌐 APIS: blockchain.info, blockstream.info, mempool.space - Rate-Limit: ~10 req/s");
      }
      
      if (responses.length === 0) {
        responses.push("🌐 NetLinker bereit. Frage nach APIs, Nodes oder Verbindungen.");
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
    group: "core",
    knowledge: {
      hardware: { "RTX 4090": "2B keys/s", "RTX 3090": "1.5B keys/s" }
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("gpu") || lowInput.includes("hardware")) {
        responses.push("⚡ HARDWARE: RTX 4090 = ~2B Keys/s, RTX 3090 = ~1.5B Keys/s");
      }
      
      if (lowInput.includes("zeit") || lowInput.includes("dauer")) {
        responses.push("⏱️ Puzzle #66 mit 1000 RTX 4090s: ~1.17 Jahre");
      }
      
      if (responses.length === 0) {
        responses.push("⚡ SpeedDemon aktiv. Frage nach Hardware oder Optimierungen.");
      }
      
      return { bot: "optimizer", responses, confidence: 0.89 + Math.random() * 0.08 };
    }
  },

  // ===== GRUPPE 2: ERWEITERTE BOTS (Neue 6) =====
  
  walletExpert: {
    id: "walletExpert",
    name: "WalletWizard",
    emoji: "👛",
    icon: Wallet,
    color: "from-indigo-500 to-purple-500",
    specialty: "Wallet-Analyse & Adressen",
    group: "extended",
    knowledge: {
      walletTypes: ["Hot Wallet", "Cold Wallet", "Hardware Wallet", "Paper Wallet", "Brain Wallet"],
      addressFormats: ["Legacy (1...)", "SegWit (3...)", "Native SegWit (bc1q...)", "Taproot (bc1p...)"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("wallet") || lowInput.includes("address")) {
        responses.push("👛 WALLET-TYPEN: Hot (online), Cold (offline), Hardware (Ledger/Trezor)");
        responses.push("📍 ADDRESS-FORMATE: Legacy (1...), SegWit (3...), Bech32 (bc1q...), Taproot (bc1p...)");
      }
      
      if (lowInput.includes("brain")) {
        responses.push("🧠 BRAIN-WALLET: SHA256(passphrase) → Private Key. SEHR UNSICHER bei schwachen Passwörtern!");
      }
      
      if (responses.length === 0) {
        responses.push("👛 WalletWizard aktiv. Frage nach Wallet-Typen oder Adressformaten.");
      }
      
      return { bot: "walletExpert", responses, confidence: 0.86 + Math.random() * 0.1 };
    }
  },
  
  blockchainAnalyst: {
    id: "blockchainAnalyst",
    name: "ChainTracer",
    emoji: "🔗",
    icon: Layers,
    color: "from-teal-500 to-cyan-500",
    specialty: "Blockchain-Analyse",
    group: "extended",
    knowledge: {
      chains: ["Bitcoin", "Ethereum", "Litecoin", "Dogecoin"],
      analysis: ["UTXO Tracking", "Cluster Analysis", "Taint Analysis"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("blockchain") || lowInput.includes("chain")) {
        responses.push("🔗 BLOCKCHAIN-ANALYSE: UTXO-Tracking, Cluster-Analyse, Taint-Analyse");
        responses.push("📊 Bitcoin: ~900k Blöcke, ~500GB Daten, ~1B Transaktionen");
      }
      
      if (lowInput.includes("utxo")) {
        responses.push("💰 UTXO: Unspent Transaction Output - Basis des Bitcoin-Modells");
      }
      
      if (responses.length === 0) {
        responses.push("🔗 ChainTracer aktiv. Frage nach Blockchain-Analyse oder UTXO-Tracking.");
      }
      
      return { bot: "blockchainAnalyst", responses, confidence: 0.88 + Math.random() * 0.09 };
    }
  },
  
  cryptoTrader: {
    id: "cryptoTrader",
    name: "TradeBot",
    emoji: "📈",
    icon: BarChart3,
    color: "from-lime-500 to-green-500",
    specialty: "Trading & Marktanalyse",
    group: "extended",
    knowledge: {
      exchanges: ["Binance", "Coinbase", "Kraken", "Bitfinex"],
      indicators: ["RSI", "MACD", "Bollinger Bands", "Moving Averages"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("preis") || lowInput.includes("price") || lowInput.includes("btc")) {
        responses.push("📈 BTC MARKT: Live-Tracking via CoinGecko/Binance APIs");
        responses.push("💹 INDIKATOREN: RSI, MACD, Bollinger Bands für Trendanalyse");
      }
      
      if (lowInput.includes("exchange") || lowInput.includes("börse")) {
        responses.push("🏦 TOP EXCHANGES: Binance (größtes Volumen), Coinbase (US), Kraken (EU)");
      }
      
      if (responses.length === 0) {
        responses.push("📈 TradeBot aktiv. Frage nach Preisen, Börsen oder Trading-Indikatoren.");
      }
      
      return { bot: "cryptoTrader", responses, confidence: 0.84 + Math.random() * 0.12 };
    }
  },
  
  miningExpert: {
    id: "miningExpert",
    name: "HashMaster",
    emoji: "⛏️",
    icon: Cpu,
    color: "from-orange-500 to-red-500",
    specialty: "Mining & Hashpower",
    group: "extended",
    knowledge: {
      algorithms: ["SHA256 (BTC)", "Scrypt (LTC)", "Ethash (ETH)", "RandomX (XMR)"],
      hardware: ["ASIC", "GPU", "FPGA", "CPU"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("mining") || lowInput.includes("hash")) {
        responses.push("⛏️ MINING: Bitcoin nutzt SHA256 - nur ASICs rentabel!");
        responses.push("🔥 HASHRATE: Netzwerk ~500 EH/s, Antminer S19 XP = 140 TH/s");
      }
      
      if (lowInput.includes("asic")) {
        responses.push("🖥️ TOP ASICS: Antminer S19 XP (140 TH/s), Whatsminer M50S (126 TH/s)");
      }
      
      if (responses.length === 0) {
        responses.push("⛏️ HashMaster aktiv. Frage nach Mining-Hardware oder Hashrates.");
      }
      
      return { bot: "miningExpert", responses, confidence: 0.87 + Math.random() * 0.1 };
    }
  },
  
  smartContractDev: {
    id: "smartContractDev",
    name: "ContractCoder",
    emoji: "📜",
    icon: FileCode,
    color: "from-violet-500 to-fuchsia-500",
    specialty: "Smart Contracts & DeFi",
    group: "extended",
    knowledge: {
      languages: ["Solidity", "Vyper", "Rust (Solana)", "Move (Aptos)"],
      protocols: ["Uniswap", "Aave", "Compound", "Curve"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("smart") || lowInput.includes("contract") || lowInput.includes("solidity")) {
        responses.push("📜 SMART CONTRACTS: Solidity für EVM, Rust für Solana, Move für Aptos");
        responses.push("⚠️ SECURITY: Reentrancy, Integer Overflow, Access Control prüfen!");
      }
      
      if (lowInput.includes("defi")) {
        responses.push("💰 DEFI: Uniswap (DEX), Aave (Lending), Curve (Stableswaps)");
      }
      
      if (responses.length === 0) {
        responses.push("📜 ContractCoder aktiv. Frage nach Smart Contracts oder DeFi-Protokollen.");
      }
      
      return { bot: "smartContractDev", responses, confidence: 0.85 + Math.random() * 0.1 };
    }
  },
  
  privacyGuard: {
    id: "privacyGuard",
    name: "ShadowMask",
    emoji: "🎭",
    icon: Eye,
    color: "from-gray-600 to-gray-800",
    specialty: "Privatsphäre & Anonymität",
    group: "extended",
    knowledge: {
      techniques: ["CoinJoin", "Mixing", "Tor", "VPN"],
      coins: ["Monero (XMR)", "Zcash (ZEC)", "Dash (DASH)"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("privacy") || lowInput.includes("anonym") || lowInput.includes("privat")) {
        responses.push("🎭 PRIVACY: CoinJoin, Mixing Services, Tor-Netzwerk");
        responses.push("🔒 PRIVACY COINS: Monero (Ring Signatures), Zcash (zk-SNARKs)");
      }
      
      if (lowInput.includes("monero") || lowInput.includes("xmr")) {
        responses.push("👻 MONERO: Ring Signatures + Stealth Addresses = maximale Anonymität");
      }
      
      if (responses.length === 0) {
        responses.push("🎭 ShadowMask aktiv. Frage nach Privacy-Techniken oder anonymen Coins.");
      }
      
      return { bot: "privacyGuard", responses, confidence: 0.86 + Math.random() * 0.1 };
    }
  },

  // ===== GRUPPE 3: BLOCKCHAIN API BOTS (12 neue) =====
  
  bitcoinAPI: {
    id: "bitcoinAPI",
    name: "BitcoinNode",
    emoji: "₿",
    icon: Coins,
    color: "from-amber-500 to-orange-500",
    specialty: "Bitcoin Core API",
    group: "blockchain",
    knowledge: {
      rpcCommands: ["getblock", "getrawtransaction", "getblockchaininfo", "getmempoolinfo"],
      apis: ["Bitcoin Core RPC", "Electrum", "Blockstream API"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("bitcoin") || lowInput.includes("btc") || lowInput.includes("rpc")) {
        responses.push("₿ BITCOIN CORE RPC: getblock, getrawtransaction, sendrawtransaction");
        responses.push("🌐 REST APIs: blockstream.info/api, mempool.space/api, blockchain.info");
      }
      
      if (lowInput.includes("block")) {
        responses.push("📦 BLOCK-INFO: getblockchaininfo → height, difficulty, bestblockhash");
      }
      
      if (responses.length === 0) {
        responses.push("₿ BitcoinNode aktiv. Frage nach Bitcoin RPC oder APIs.");
      }
      
      return { bot: "bitcoinAPI", responses, confidence: 0.91 + Math.random() * 0.07 };
    }
  },
  
  ethereumAPI: {
    id: "ethereumAPI",
    name: "EthNode",
    emoji: "⟠",
    icon: Box,
    color: "from-blue-400 to-indigo-500",
    specialty: "Ethereum & EVM APIs",
    group: "blockchain",
    knowledge: {
      methods: ["eth_getBalance", "eth_call", "eth_sendTransaction", "eth_getLogs"],
      providers: ["Infura", "Alchemy", "QuickNode", "Ankr"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("ethereum") || lowInput.includes("eth") || lowInput.includes("evm")) {
        responses.push("⟠ ETHEREUM JSON-RPC: eth_getBalance, eth_call, eth_sendTransaction");
        responses.push("🔌 PROVIDER: Infura, Alchemy, QuickNode für schnellen Zugriff");
      }
      
      if (lowInput.includes("gas")) {
        responses.push("⛽ GAS: eth_gasPrice, eth_estimateGas - wichtig für Transaktionskosten");
      }
      
      if (responses.length === 0) {
        responses.push("⟠ EthNode aktiv. Frage nach Ethereum RPC oder Web3 APIs.");
      }
      
      return { bot: "ethereumAPI", responses, confidence: 0.89 + Math.random() * 0.08 };
    }
  },
  
  mempoolAPI: {
    id: "mempoolAPI",
    name: "MempoolBot",
    emoji: "🏊",
    icon: Activity,
    color: "from-sky-500 to-blue-500",
    specialty: "Mempool & Transaktionen",
    group: "blockchain",
    knowledge: {
      endpoints: ["/api/mempool", "/api/tx", "/api/fees/recommended"],
      metrics: ["Fee Rate", "Mempool Size", "Block Weight"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("mempool") || lowInput.includes("transaction") || lowInput.includes("tx")) {
        responses.push("🏊 MEMPOOL.SPACE API: /api/mempool, /api/tx/{txid}, /api/fees/recommended");
        responses.push("💸 FEE ESTIMATION: fastestFee, halfHourFee, hourFee, economyFee");
      }
      
      if (lowInput.includes("fee") || lowInput.includes("gebühr")) {
        responses.push("📊 AKTUELLE FEES: ~2-50 sat/vB je nach Auslastung");
      }
      
      if (responses.length === 0) {
        responses.push("🏊 MempoolBot aktiv. Frage nach Mempool-Status oder Transaktions-Fees.");
      }
      
      return { bot: "mempoolAPI", responses, confidence: 0.90 + Math.random() * 0.07 };
    }
  },
  
  blockstreamAPI: {
    id: "blockstreamAPI",
    name: "BlockstreamNode",
    emoji: "🌊",
    icon: Server,
    color: "from-emerald-500 to-teal-500",
    specialty: "Blockstream Esplora API",
    group: "blockchain",
    knowledge: {
      endpoints: ["/address", "/tx", "/block", "/blocks/tip"],
      features: ["UTXO Query", "Address History", "Block Explorer"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("blockstream") || lowInput.includes("esplora")) {
        responses.push("🌊 BLOCKSTREAM API: blockstream.info/api/address/{addr}");
        responses.push("📋 ENDPOINTS: /tx/{txid}, /block/{hash}, /address/{addr}/utxo");
      }
      
      if (lowInput.includes("utxo")) {
        responses.push("💰 UTXO QUERY: /address/{addr}/utxo → alle unspent outputs");
      }
      
      if (responses.length === 0) {
        responses.push("🌊 BlockstreamNode aktiv. Frage nach Blockstream/Esplora API.");
      }
      
      return { bot: "blockstreamAPI", responses, confidence: 0.88 + Math.random() * 0.09 };
    }
  },
  
  coingeckoAPI: {
    id: "coingeckoAPI",
    name: "GeckoTracker",
    emoji: "🦎",
    icon: BarChart3,
    color: "from-green-400 to-emerald-500",
    specialty: "CoinGecko Marktdaten",
    group: "blockchain",
    knowledge: {
      endpoints: ["/coins/markets", "/simple/price", "/coins/{id}/history"],
      data: ["Price", "Market Cap", "Volume", "ATH", "ATL"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("coingecko") || lowInput.includes("preis") || lowInput.includes("market")) {
        responses.push("🦎 COINGECKO API: api.coingecko.com/api/v3/simple/price");
        responses.push("📊 DATEN: Price, Market Cap, 24h Volume, ATH/ATL, Price Change");
      }
      
      if (lowInput.includes("history") || lowInput.includes("chart")) {
        responses.push("📈 HISTORICAL: /coins/{id}/market_chart?days=30 für Preishistorie");
      }
      
      if (responses.length === 0) {
        responses.push("🦎 GeckoTracker aktiv. Frage nach Krypto-Preisen oder Marktdaten.");
      }
      
      return { bot: "coingeckoAPI", responses, confidence: 0.87 + Math.random() * 0.1 };
    }
  },
  
  binanceAPI: {
    id: "binanceAPI",
    name: "BinanceLink",
    emoji: "🔶",
    icon: Globe,
    color: "from-yellow-400 to-amber-500",
    specialty: "Binance Exchange API",
    group: "blockchain",
    knowledge: {
      endpoints: ["/ticker/price", "/klines", "/depth", "/trades"],
      features: ["Spot Trading", "Futures", "WebSocket Streams"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("binance") || lowInput.includes("trading")) {
        responses.push("🔶 BINANCE API: api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
        responses.push("📊 STREAMS: wss://stream.binance.com:9443/ws für Live-Daten");
      }
      
      if (lowInput.includes("kline") || lowInput.includes("candle")) {
        responses.push("🕯️ KLINES: /api/v3/klines?symbol=BTCUSDT&interval=1h");
      }
      
      if (responses.length === 0) {
        responses.push("🔶 BinanceLink aktiv. Frage nach Binance API oder Trading-Daten.");
      }
      
      return { bot: "binanceAPI", responses, confidence: 0.86 + Math.random() * 0.1 };
    }
  },
  
  etherscanAPI: {
    id: "etherscanAPI",
    name: "EtherscanBot",
    emoji: "🔍",
    icon: Search,
    color: "from-blue-500 to-cyan-500",
    specialty: "Etherscan Block Explorer",
    group: "blockchain",
    knowledge: {
      modules: ["account", "contract", "transaction", "block", "logs"],
      features: ["Contract Verification", "Token Tracking", "Gas Tracker"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("etherscan") || lowInput.includes("explorer")) {
        responses.push("🔍 ETHERSCAN API: api.etherscan.io/api?module=account&action=balance");
        responses.push("📋 MODULE: account, contract, transaction, block, logs, token");
      }
      
      if (lowInput.includes("contract")) {
        responses.push("📜 CONTRACT: action=getabi für ABI, action=getsourcecode für Code");
      }
      
      if (responses.length === 0) {
        responses.push("🔍 EtherscanBot aktiv. Frage nach Etherscan API oder Contract-Daten.");
      }
      
      return { bot: "etherscanAPI", responses, confidence: 0.88 + Math.random() * 0.09 };
    }
  },
  
  solanaAPI: {
    id: "solanaAPI",
    name: "SolanaRPC",
    emoji: "◎",
    icon: Radio,
    color: "from-purple-400 to-fuchsia-500",
    specialty: "Solana JSON-RPC",
    group: "blockchain",
    knowledge: {
      methods: ["getBalance", "getBlock", "getTransaction", "getSignaturesForAddress"],
      providers: ["Helius", "QuickNode", "Alchemy", "GenesysGo"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("solana") || lowInput.includes("sol")) {
        responses.push("◎ SOLANA RPC: getBalance, getAccountInfo, getTransaction");
        responses.push("🔌 PROVIDER: Helius, QuickNode, Alchemy für schnelle RPCs");
      }
      
      if (lowInput.includes("nft") || lowInput.includes("token")) {
        responses.push("🖼️ SOLANA NFTs: Metaplex Standard, getTokenAccountsByOwner");
      }
      
      if (responses.length === 0) {
        responses.push("◎ SolanaRPC aktiv. Frage nach Solana API oder SPL Tokens.");
      }
      
      return { bot: "solanaAPI", responses, confidence: 0.85 + Math.random() * 0.1 };
    }
  },
  
  polygonAPI: {
    id: "polygonAPI",
    name: "PolygonNode",
    emoji: "🟣",
    icon: Antenna,
    color: "from-purple-500 to-violet-500",
    specialty: "Polygon/Matic API",
    group: "blockchain",
    knowledge: {
      endpoints: ["Polygon RPC", "Polygon Scan", "Matic Bridge"],
      features: ["Low Fees", "Fast Finality", "EVM Compatible"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("polygon") || lowInput.includes("matic")) {
        responses.push("🟣 POLYGON RPC: polygon-rpc.com, Alchemy, QuickNode");
        responses.push("💨 VORTEILE: ~2 sec Blocks, <$0.01 Fees, volle EVM-Kompatibilität");
      }
      
      if (lowInput.includes("bridge")) {
        responses.push("🌉 BRIDGE: Polygon Portal für ETH ↔ MATIC Transfers");
      }
      
      if (responses.length === 0) {
        responses.push("🟣 PolygonNode aktiv. Frage nach Polygon API oder Matic Bridge.");
      }
      
      return { bot: "polygonAPI", responses, confidence: 0.86 + Math.random() * 0.1 };
    }
  },
  
  chainlinkAPI: {
    id: "chainlinkAPI",
    name: "OracleBot",
    emoji: "🔮",
    icon: Gem,
    color: "from-blue-600 to-indigo-600",
    specialty: "Chainlink Oracles",
    group: "blockchain",
    knowledge: {
      feeds: ["Price Feeds", "VRF", "Automation", "CCIP"],
      networks: ["Ethereum", "Polygon", "Arbitrum", "Optimism"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("chainlink") || lowInput.includes("oracle")) {
        responses.push("🔮 CHAINLINK: Dezentrale Oracles für Off-Chain Daten");
        responses.push("📊 PRICE FEEDS: BTC/USD, ETH/USD etc. on-chain verfügbar");
      }
      
      if (lowInput.includes("vrf") || lowInput.includes("random")) {
        responses.push("🎲 VRF: Verifiable Random Function für faire Zufallszahlen on-chain");
      }
      
      if (responses.length === 0) {
        responses.push("🔮 OracleBot aktiv. Frage nach Chainlink Oracles oder Price Feeds.");
      }
      
      return { bot: "chainlinkAPI", responses, confidence: 0.87 + Math.random() * 0.1 };
    }
  },
  
  defiAPI: {
    id: "defiAPI",
    name: "DeFiPulse",
    emoji: "💎",
    icon: Gauge,
    color: "from-pink-500 to-rose-500",
    specialty: "DeFi Protokoll APIs",
    group: "blockchain",
    knowledge: {
      protocols: ["Uniswap", "Aave", "Compound", "MakerDAO", "Curve"],
      metrics: ["TVL", "APY", "Liquidity", "Volume"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("defi") || lowInput.includes("tvl") || lowInput.includes("yield")) {
        responses.push("💎 DEFI APIs: DefiLlama, DeFiPulse, Zapper für TVL & Yields");
        responses.push("📊 TOP PROTOKOLLE: Lido ($30B), Aave ($10B), MakerDAO ($8B) TVL");
      }
      
      if (lowInput.includes("apy") || lowInput.includes("yield")) {
        responses.push("💰 YIELD FARMING: APYs von 2-20% je nach Risiko und Protokoll");
      }
      
      if (responses.length === 0) {
        responses.push("💎 DeFiPulse aktiv. Frage nach DeFi-Protokollen oder TVL.");
      }
      
      return { bot: "defiAPI", responses, confidence: 0.85 + Math.random() * 0.1 };
    }
  },
  
  nftAPI: {
    id: "nftAPI",
    name: "NFTIndexer",
    emoji: "🖼️",
    icon: Binary,
    color: "from-fuchsia-500 to-pink-500",
    specialty: "NFT & Metadaten APIs",
    group: "blockchain",
    knowledge: {
      platforms: ["OpenSea", "Blur", "Magic Eden", "LooksRare"],
      standards: ["ERC-721", "ERC-1155", "Metaplex"]
    },
    analyze: (input: string) => {
      const responses: string[] = [];
      const lowInput = input.toLowerCase();
      
      if (lowInput.includes("nft") || lowInput.includes("opensea")) {
        responses.push("🖼️ NFT APIs: OpenSea API, Alchemy NFT API, Moralis");
        responses.push("📋 STANDARDS: ERC-721 (unique), ERC-1155 (semi-fungible)");
      }
      
      if (lowInput.includes("metadata") || lowInput.includes("ipfs")) {
        responses.push("📦 METADATA: IPFS für dezentrale Speicherung, Arweave für Permanenz");
      }
      
      if (responses.length === 0) {
        responses.push("🖼️ NFTIndexer aktiv. Frage nach NFT-APIs oder Metadata-Standards.");
      }
      
      return { bot: "nftAPI", responses, confidence: 0.84 + Math.random() * 0.12 };
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

const BOT_GROUPS = {
  core: { name: "Core Bots", color: "from-blue-600 to-cyan-600" },
  extended: { name: "Extended Bots", color: "from-purple-600 to-pink-600" },
  blockchain: { name: "Blockchain APIs", color: "from-amber-600 to-orange-600" }
};

export default function BotCollective() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeBots, setActiveBots] = useState<Record<string, boolean>>(
    Object.keys(BOTS).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );
  const [collectiveMode, setCollectiveMode] = useState(true);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const processWithCollective = useCallback((userInput: string) => {
    const results: BotResponse[] = [];
    
    Object.entries(BOTS).forEach(([id, bot]) => {
      if (activeBots[id]) {
        const result = bot.analyze(userInput);
        results.push(result);
      }
    });
    
    return results;
  }, [activeBots]);

  const synthesizeCollective = (results: BotResponse[]): string => {
    if (results.length === 0) return "Keine aktiven Bots verfügbar.";
    
    const sorted = [...results].sort((a, b) => b.confidence - a.confidence);
    
    let synthesis = "🤖 **KOLLEKTIV-SYNTHESE** (24 BOTS AKTIV)\n\n";
    synthesis += `📊 ${results.length} Bots haben analysiert:\n\n`;
    
    // Gruppiere nach Bot-Gruppen
    const groups: Record<string, BotResponse[]> = { core: [], extended: [], blockchain: [] };
    sorted.forEach(result => {
      const bot = BOTS[result.bot as keyof typeof BOTS];
      if (bot && result.responses.length > 1) {
        groups[bot.group].push(result);
      }
    });
    
    Object.entries(groups).forEach(([groupId, groupResults]) => {
      if (groupResults.length > 0) {
        const group = BOT_GROUPS[groupId as keyof typeof BOT_GROUPS];
        synthesis += `\n**${group.name}**:\n`;
        groupResults.slice(0, 3).forEach(result => {
          const bot = BOTS[result.bot as keyof typeof BOTS];
          synthesis += `${bot.emoji} **${bot.name}** (${(result.confidence * 100).toFixed(0)}%):\n`;
          result.responses.slice(0, 2).forEach(r => {
            synthesis += `${r}\n`;
          });
        });
      }
    });
    
    const avgConfidence = sorted.reduce((sum, r) => sum + r.confidence, 0) / sorted.length;
    synthesis += `\n\n🎯 **Kollektive Konfidenz: ${(avgConfidence * 100).toFixed(1)}%** | **${results.length} Bots aktiv**`;
    
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
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const results = processWithCollective(input);
    
    if (collectiveMode) {
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
      results.forEach((result, index) => {
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
      });
    }
    
    setIsProcessing(false);
  };

  const toggleGroup = (groupId: string) => {
    const botsInGroup = Object.entries(BOTS)
      .filter(([_, bot]) => bot.group === groupId)
      .map(([id]) => id);
    
    const allActive = botsInGroup.every(id => activeBots[id]);
    
    setActiveBots(prev => {
      const newState = { ...prev };
      botsInGroup.forEach(id => {
        newState[id] = !allActive;
      });
      return newState;
    });
  };

  const activeBotCount = Object.values(activeBots).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="border-purple-500/50">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link to="/brain-wallet">
              <Button variant="outline" size="sm" className="border-cyan-500/50">
                <Brain className="w-4 h-4 mr-2" />
                Brain Scanner
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-400" />
              BOT KOLLEKTIV 24
              <Sparkles className="w-8 h-8 text-amber-400" />
            </h1>
            <p className="text-gray-400 text-sm">24 Spezialisierte Bots • Kollektive Intelligenz • Blockchain APIs</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="bg-green-500/20 text-green-400 px-4 py-2 text-lg">
              {activeBotCount}/24 AKTIV
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4">
        {/* Bot Übersicht - Links */}
        <div className="col-span-3 space-y-3">
          <Card className="bg-gray-800/50 border-purple-500/30 p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-bold">Kollektiv-Modus</span>
              <Switch
                checked={collectiveMode}
                onCheckedChange={setCollectiveMode}
              />
            </div>
            <p className="text-xs text-gray-400">
              {collectiveMode ? "Alle Bots antworten zusammen" : "Einzelne Bot-Antworten"}
            </p>
          </Card>

          {/* Bot Gruppen */}
          {Object.entries(BOT_GROUPS).map(([groupId, group]) => {
            const botsInGroup = Object.entries(BOTS).filter(([_, bot]) => bot.group === groupId);
            const activeInGroup = botsInGroup.filter(([id]) => activeBots[id]).length;
            
            return (
              <Card key={groupId} className="bg-gray-800/50 border-gray-700 p-3">
                <div 
                  className="flex items-center justify-between cursor-pointer mb-2"
                  onClick={() => setActiveGroup(activeGroup === groupId ? null : groupId)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${group.color}`} />
                    <span className="text-white font-semibold text-sm">{group.name}</span>
                  </div>
                  <Badge className="bg-gray-700 text-gray-300 text-xs">
                    {activeInGroup}/{botsInGroup.length}
                  </Badge>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs mb-2 border-gray-600"
                  onClick={() => toggleGroup(groupId)}
                >
                  {activeInGroup === botsInGroup.length ? "Alle deaktivieren" : "Alle aktivieren"}
                </Button>
                
                {(activeGroup === groupId || activeGroup === null) && (
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {botsInGroup.map(([id, bot]) => (
                      <div
                        key={id}
                        className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-all ${
                          activeBots[id] 
                            ? `bg-gradient-to-r ${bot.color} bg-opacity-20` 
                            : "bg-gray-700/30 opacity-50"
                        }`}
                        onClick={() => setActiveBots(prev => ({ ...prev, [id]: !prev[id] }))}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{bot.emoji}</span>
                          <span className="text-white text-xs font-medium">{bot.name}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${activeBots[id] ? "bg-green-400" : "bg-gray-600"}`} />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Chat - Mitte */}
        <div className="col-span-6">
          <Card className="bg-gray-800/50 border-purple-500/30 h-[calc(100vh-180px)] flex flex-col">
            <div className="p-3 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <span className="text-white font-bold">Kollektiv-Chat</span>
              </div>
              <Badge className={`${collectiveMode ? "bg-purple-500" : "bg-gray-600"}`}>
                {collectiveMode ? "KOLLEKTIV" : "EINZELN"}
              </Badge>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    <Bot className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">24 Bots warten auf deine Frage...</p>
                    <p className="text-sm mt-2">Bitcoin, Ethereum, DeFi, NFTs, Mining, APIs...</p>
                  </div>
                )}
                
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`${
                      message.type === "user"
                        ? "ml-auto bg-blue-600 max-w-[80%]"
                        : message.type === "collective"
                        ? "bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30"
                        : "bg-gray-700/50"
                    } rounded-lg p-3`}
                  >
                    {message.type !== "user" && (
                      <div className="flex items-center gap-2 mb-2">
                        {message.type === "collective" ? (
                          <>
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 font-bold text-sm">KOLLEKTIV</span>
                          </>
                        ) : (
                          <>
                            <span>{BOTS[message.bot as keyof typeof BOTS]?.emoji}</span>
                            <span className="text-white font-bold text-sm">
                              {BOTS[message.bot as keyof typeof BOTS]?.name}
                            </span>
                          </>
                        )}
                        {message.confidence && (
                          <Badge className="bg-green-500/20 text-green-400 text-xs ml-auto">
                            {(message.confidence * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="text-white text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 text-sm">
                        {activeBotCount} Bots analysieren...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-3 border-t border-gray-700">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Frage das Bot-Kollektiv... (Bitcoin, ETH, DeFi, APIs...)"
                  className="bg-gray-900 border-gray-600 text-white resize-none"
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
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-6"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Netzwerk-Visualisierung - Rechts */}
        <div className="col-span-3 space-y-3">
          <Card className="bg-gray-800/50 border-amber-500/30 p-3">
            <div className="text-center mb-3">
              <Network className="w-8 h-8 mx-auto text-amber-400 mb-2" />
              <span className="text-white font-bold">Netzwerk Status</span>
            </div>
            
            {/* Animated Network Visualization */}
            <div className="relative h-48 bg-gray-900/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Central Hub */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Orbiting Bots */}
                  {Object.entries(BOTS).slice(0, 12).map(([id, bot], i) => {
                    const angle = (i / 12) * 2 * Math.PI;
                    const radius = 70;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    return (
                      <div
                        key={id}
                        className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                          activeBots[id] 
                            ? `bg-gradient-to-r ${bot.color}` 
                            : "bg-gray-700 opacity-30"
                        }`}
                        style={{
                          left: `calc(50% + ${x}px - 12px)`,
                          top: `calc(50% + ${y}px - 12px)`,
                        }}
                      >
                        {bot.emoji}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Connection Lines Animation */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {Object.entries(BOTS).slice(0, 12).map(([id], i) => {
                  const angle = (i / 12) * 2 * Math.PI;
                  const radius = 70;
                  const x = Math.cos(angle) * radius + 96;
                  const y = Math.sin(angle) * radius + 96;
                  
                  return activeBots[id] && (
                    <line
                      key={id}
                      x1="96" y1="96"
                      x2={x} y2={y}
                      stroke="rgba(168, 85, 247, 0.3)"
                      strokeWidth="1"
                      className="animate-pulse"
                    />
                  );
                })}
              </svg>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gray-800/50 border-cyan-500/30 p-3">
            <div className="text-white font-bold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Live Statistiken
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Core Bots:</span>
                <span className="text-blue-400">{Object.entries(BOTS).filter(([id, b]) => b.group === "core" && activeBots[id]).length}/6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Extended:</span>
                <span className="text-purple-400">{Object.entries(BOTS).filter(([id, b]) => b.group === "extended" && activeBots[id]).length}/6</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Blockchain APIs:</span>
                <span className="text-amber-400">{Object.entries(BOTS).filter(([id, b]) => b.group === "blockchain" && activeBots[id]).length}/12</span>
              </div>
              <div className="border-t border-gray-700 pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-300">Total Aktiv:</span>
                  <span className="text-green-400">{activeBotCount}/24</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Example Queries */}
          <Card className="bg-gray-800/50 border-green-500/30 p-3">
            <div className="text-white font-bold mb-2 text-sm">Beispiel-Fragen:</div>
            <div className="space-y-1">
              {[
                "Bitcoin Puzzle #66 analysieren",
                "Ethereum Gas Fees erklären",
                "DeFi Protokolle vergleichen",
                "NFT Metadata Standards"
              ].map((q, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={() => setInput(q)}
                >
                  <ArrowRight className="w-3 h-3 mr-2" />
                  {q}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
