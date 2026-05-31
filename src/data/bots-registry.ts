import {
  Code, Shield, Brain, Database, Network, Zap, Wallet, Layers, BarChart3,
  Cpu, FileCode, Eye, Coins, Box, Activity, Server, Globe, Lock,
  Search, Radio, Antenna, Gauge, Gem, Binary,
  Fingerprint, Cloud, Sparkles, Terminal, Blocks, Cable, CircleDot,
  Flame, GitBranch, Landmark, Link2, Orbit, Route, Scale, Scroll,
  ShieldCheck, Webhook, Workflow
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface BotResponse {
  bot: string;
  responses: string[];
  confidence: number;
  matched: boolean;
  matchCount: number;
}

export interface BotDefinition {
  id: string;
  name: string;
  emoji: string;
  icon: LucideIcon;
  color: string;
  specialty: string;
  group: string;
  analyze: (input: string) => BotResponse;
}

function makeBot(
  id: string, name: string, emoji: string, icon: LucideIcon,
  color: string, specialty: string, group: string,
  keywords: string[][], responses: string[][],
  defaultMsg: string, baseConf = 0.85
): BotDefinition {
  return {
    id, name, emoji, icon, color, specialty, group,
    analyze: (input: string) => {
      const low = input.toLowerCase();
      const matched: string[] = [];
      let matchCount = 0;
      keywords.forEach((kws, i) => {
        if (kws.some(k => low.includes(k))) {
          matchCount++;
          responses[i].forEach(r => matched.push(r));
        }
      });
      const isMatch = matched.length > 0;
      if (!isMatch) matched.push(defaultMsg);
      const conf = isMatch
        ? Math.min(0.99, baseConf + matchCount * 0.04 + Math.random() * 0.05)
        : baseConf * 0.55 + Math.random() * 0.05;
      return { bot: id, responses: matched, confidence: conf, matched: isMatch, matchCount };
    }
  };
}

// ===== CORE BOTS (6) =====
const coreBots: BotDefinition[] = [
  makeBot("coder", "CodeMaster", "💻", Code, "from-blue-500 to-cyan-500",
    "Programmierung & Algorithmen", "core",
    [["hash", "sha"], ["private", "key", "schlüssel"], ["code", "algorithmus", "programmier"]],
    [
      ["🔐 HASH-ANALYSE: Bitcoin nutzt SHA256(SHA256(x)) für Block-Hashing, RIPEMD160(SHA256(x)) für Adressen.", "📊 Kollisionswahrscheinlichkeit SHA256: 2^128 Operationen (praktisch unmöglich)."],
      ["🔑 PRIVATE KEY: 256-bit Zufallszahl im Bereich [1, n-1], n = Ordnung der secp256k1 Kurve.", "📐 n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141"],
      ["📝 CODE-PATTERN: Worker-Pool mit SharedArrayBuffer für Multi-Threading empfohlen.", "🔄 Optimale Batch-Größe: 10.000 - 100.000 Keys pro Worker-Iteration."]
    ],
    "💻 CodeMaster: Spezialisiert auf Krypto-Algorithmen, Bitcoin-Protokoll und Code-Optimierung.", 0.85),

  makeBot("security", "SecureGuard", "🛡️", Shield, "from-red-500 to-orange-500",
    "Sicherheit & Kryptographie", "core",
    [["sicher", "security", "schutz"], ["brute", "force", "angriff"]],
    [
      ["🛡️ SICHERHEIT: Private Keys brauchen min. 128-bit Entropie. Brain-Wallets sind UNSICHER!", "⚠️ Häufigste Angriffe: Dictionary, Side-Channel, Timing, Phishing."],
      ["⏱️ BRUTE-FORCE: 2^66 Keys bei 1B/s = ~2.300 Jahre. Mit 1000 GPUs ≈ 2.3 Jahre."]
    ],
    "🛡️ SecureGuard: Analyse von Sicherheitslücken, Angriffsvektoren und Schutzmaßnahmen.", 0.88),

  makeBot("math", "MathGenius", "🧮", Brain, "from-purple-500 to-pink-500",
    "Mathematik & Kryptographie", "core",
    [["kurve", "curve", "elliptic", "secp"], ["wahrscheinlichkeit", "probability", "chance"]],
    [
      ["📐 SECP256K1: y² = x³ + 7 (mod p), p = 2²⁵⁶ - 2³² - 977", "⚡ Endomorphismus: λ-Optimierung für 33% Speedup möglich!"],
      ["🎯 Puzzle #66: 1 in 2^66 = 1 in 73.786.976.294.838.206.464"]
    ],
    "🧮 MathGenius: Elliptische Kurven, Wahrscheinlichkeitsrechnung, kryptographische Formeln.", 0.92),

  makeBot("data", "DataMiner", "📊", Database, "from-green-500 to-emerald-500",
    "Datenanalyse & Statistik", "core",
    [["puzzle", "status", "statistik"], ["66", "67", "130"]],
    [
      ["📊 PUZZLE-STATUS: 65 von 160 gelöst, ~1000 BTC verbleibend ($60M+)"],
      ["🎯 PUZZLE #66: 13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so - 6.6 BTC (~$400k)"]
    ],
    "📊 DataMiner: Puzzle-Statistiken, Belohnungen und historische Blockchain-Daten.", 0.90),

  makeBot("network", "NetLinker", "🌐", Network, "from-yellow-500 to-amber-500",
    "Netzwerk & Kommunikation", "core",
    [["api", "abfrage", "endpoint", "rest"]],
    [["🌐 BLOCKCHAIN APIS: blockchain.info, blockstream.info, mempool.space - Rate-Limit: ~10 req/s", "📡 Protokolle: Bitcoin P2P, WebSocket, REST, gRPC"]],
    "🌐 NetLinker: API-Endpunkte, Node-Verbindungen und Netzwerk-Protokolle.", 0.87),

  makeBot("optimizer", "SpeedDemon", "⚡", Zap, "from-cyan-500 to-blue-500",
    "Performance & Optimierung", "core",
    [["gpu", "hardware", "rtx", "leistung"], ["zeit", "dauer", "speed"]],
    [
      ["⚡ HARDWARE: RTX 4090 = ~2B Keys/s, RTX 3090 = ~1.5B Keys/s, A100 = ~3B Keys/s"],
      ["⏱️ Puzzle #66 mit 1000 RTX 4090s: ~1.17 Jahre theoretisch"]
    ],
    "⚡ SpeedDemon: Hardware-Benchmarks, GPU-Performance und Optimierungs-Strategien.", 0.89),
];

// ===== EXTENDED BOTS (6) =====
const extendedBots: BotDefinition[] = [
  makeBot("walletExpert", "WalletWizard", "👛", Wallet, "from-indigo-500 to-purple-500",
    "Wallet-Analyse & Adressen", "extended",
    [["wallet", "address", "adresse"], ["brain", "mnemonic", "seed"]],
    [
      ["👛 WALLET-TYPEN: Hot (online), Cold (offline), Hardware (Ledger/Trezor), Paper, Multi-Sig", "📍 FORMATE: Legacy (1...), SegWit (3...), Bech32 (bc1q...), Taproot (bc1p...)"],
      ["🧠 BRAIN-WALLET: SHA256(passphrase) → Private Key. SEHR UNSICHER bei schwachen Passwörtern!", "🔐 Besser: BIP39 Mnemonic mit 12-24 Wörtern + Passphrase"]
    ],
    "👛 WalletWizard: Wallet-Typen, Adressformate und Key-Management.", 0.86),

  makeBot("blockchainAnalyst", "ChainTracer", "🔗", Layers, "from-teal-500 to-cyan-500",
    "Blockchain-Analyse", "extended",
    [["blockchain", "chain", "block"], ["utxo", "transaction", "transaktion"]],
    [
      ["🔗 BLOCKCHAIN: UTXO-Tracking, Cluster-Analyse, Taint-Analyse", "📊 Bitcoin: ~900k Blöcke, ~500GB, ~1B Transaktionen"],
      ["💰 UTXO: Unspent Transaction Output - jeder Output wird nur einmal ausgegeben"]
    ],
    "🔗 ChainTracer: On-Chain-Analyse, UTXO-Tracking und Transaktionsgraphen.", 0.88),

  makeBot("cryptoTrader", "TradeBot", "📈", BarChart3, "from-lime-500 to-green-500",
    "Trading & Marktanalyse", "extended",
    [["preis", "price", "btc", "kurs"], ["exchange", "börse", "trading"]],
    [
      ["📈 BTC: Live-Tracking via CoinGecko/Binance APIs möglich", "💹 INDIKATOREN: RSI, MACD, Bollinger Bands, EMA/SMA"],
      ["🏦 TOP EXCHANGES: Binance (größtes Vol.), Coinbase (US reguliert), Kraken (EU)"]
    ],
    "📈 TradeBot: Marktanalyse, Trading-Indikatoren und Exchange-Vergleiche.", 0.84),

  makeBot("miningExpert", "HashMaster", "⛏️", Cpu, "from-orange-500 to-red-500",
    "Mining & Hashpower", "extended",
    [["mining", "hash", "miner"], ["asic", "antminer"]],
    [
      ["⛏️ MINING: Bitcoin nutzt SHA256d - nur ASICs rentabel!", "🔥 Netzwerk-Hashrate: ~500 EH/s, Difficulty Adjustment alle 2016 Blöcke"],
      ["🖥️ TOP ASICS: Antminer S21 (200 TH/s), Whatsminer M60S (186 TH/s)"]
    ],
    "⛏️ HashMaster: Mining-Hardware, Hashrate-Berechnungen und Profitabilität.", 0.87),

  makeBot("smartContractDev", "ContractCoder", "📜", FileCode, "from-violet-500 to-fuchsia-500",
    "Smart Contracts & DeFi", "extended",
    [["smart", "contract", "solidity"], ["defi", "uniswap", "aave"]],
    [
      ["📜 SMART CONTRACTS: Solidity (EVM), Rust (Solana), Move (Aptos/Sui)", "⚠️ SECURITY: Reentrancy, Integer Overflow, Access Control prüfen!"],
      ["💰 DEFI: Uniswap (DEX), Aave (Lending), Curve (Stableswaps), MakerDAO (CDP)"]
    ],
    "📜 ContractCoder: Smart Contract Development, Audit und DeFi-Protokolle.", 0.85),

  makeBot("privacyGuard", "ShadowMask", "🎭", Eye, "from-gray-600 to-gray-800",
    "Privatsphäre & Anonymität", "extended",
    [["privacy", "anonym", "privat", "tor"], ["monero", "xmr", "zcash"]],
    [
      ["🎭 PRIVACY: CoinJoin, PayJoin, Mixing, Tor, VPN für Transaktions-Anonymität", "🔒 Tools: Wasabi Wallet, Whirlpool, Bisq für privates Trading"],
      ["👻 MONERO: Ring Signatures + Stealth Addresses + RingCT = volle Anonymität"]
    ],
    "🎭 ShadowMask: Privacy-Techniken, anonyme Coins und Verschleierungsmethoden.", 0.86),
];

// ===== BLOCKCHAIN API BOTS (12) =====
const blockchainBots: BotDefinition[] = [
  makeBot("bitcoinAPI", "BitcoinNode", "₿", Coins, "from-amber-500 to-orange-500",
    "Bitcoin Core API", "blockchain",
    [["bitcoin", "btc", "rpc"], ["block", "höhe", "height"]],
    [
      ["₿ BITCOIN RPC: getblock, getrawtransaction, getblockchaininfo, sendrawtransaction", "🌐 REST: blockstream.info/api, mempool.space/api, blockchain.info"],
      ["📦 BLOCK-INFO: getblockchaininfo → height, difficulty, bestblockhash, chainwork"]
    ],
    "₿ BitcoinNode: Bitcoin Core RPC-Befehle und Block-Explorer APIs.", 0.91),

  makeBot("ethereumAPI", "EthNode", "⟠", Box, "from-blue-400 to-indigo-500",
    "Ethereum & EVM APIs", "blockchain",
    [["ethereum", "eth", "evm", "web3"], ["gas", "gwei"]],
    [
      ["⟠ ETHEREUM: eth_getBalance, eth_call, eth_sendTransaction, eth_getLogs", "🔌 PROVIDER: Infura, Alchemy, QuickNode, Ankr für schnellen Zugriff"],
      ["⛽ GAS: eth_gasPrice → aktuelle Gas-Kosten, eth_estimateGas → Schätzung"]
    ],
    "⟠ EthNode: Ethereum JSON-RPC, Web3 und EVM-kompatible APIs.", 0.89),

  makeBot("mempoolAPI", "MempoolBot", "🏊", Activity, "from-sky-500 to-blue-500",
    "Mempool & Transaktionen", "blockchain",
    [["mempool", "transaction", "tx"], ["fee", "gebühr", "sat"]],
    [
      ["🏊 MEMPOOL.SPACE: /api/mempool, /api/tx/{txid}, /api/fees/recommended", "💸 FEE TIERS: fastestFee, halfHourFee, hourFee, economyFee (sat/vB)"],
      ["📊 FEES: Aktuell ~2-50 sat/vB je nach Mempool-Auslastung"]
    ],
    "🏊 MempoolBot: Mempool-Status, Fee-Estimation und Transaktions-Tracking.", 0.90),

  makeBot("blockstreamAPI", "BlockstreamNode", "🌊", Server, "from-emerald-500 to-teal-500",
    "Blockstream Esplora API", "blockchain",
    [["blockstream", "esplora"], ["utxo"]],
    [
      ["🌊 BLOCKSTREAM: blockstream.info/api/address/{addr}, /tx/{txid}", "📋 Features: UTXO Query, Address History, Block Explorer, Testnet Support"],
      ["💰 UTXO: /address/{addr}/utxo → alle unspent outputs mit Wert und Bestätigungen"]
    ],
    "🌊 BlockstreamNode: Blockstream Esplora REST API und UTXO-Abfragen.", 0.88),

  makeBot("coingeckoAPI", "GeckoTracker", "🦎", BarChart3, "from-green-400 to-emerald-500",
    "CoinGecko Marktdaten", "blockchain",
    [["coingecko", "preis", "market", "markt"], ["history", "chart", "verlauf"]],
    [
      ["🦎 COINGECKO: api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd", "📊 DATEN: Price, Market Cap, 24h Volume, ATH/ATL, Price Change %"],
      ["📈 HISTORISCH: /coins/{id}/market_chart?days=30 für Preishistorie & Charts"]
    ],
    "🦎 GeckoTracker: CoinGecko API für Preise, Marktkapitalisierung und Trends.", 0.87),

  makeBot("binanceAPI", "BinanceLink", "🔶", Globe, "from-yellow-400 to-amber-500",
    "Binance Exchange API", "blockchain",
    [["binance", "trading", "spot"], ["kline", "candle", "kerze"]],
    [
      ["🔶 BINANCE: api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", "📊 WEBSOCKET: wss://stream.binance.com:9443/ws für Echtzeit-Trades"],
      ["🕯️ KLINES: /api/v3/klines?symbol=BTCUSDT&interval=1h für Candlestick-Daten"]
    ],
    "🔶 BinanceLink: Binance REST & WebSocket API für Trading-Daten.", 0.86),

  makeBot("etherscanAPI", "EtherscanBot", "🔍", Search, "from-blue-500 to-cyan-500",
    "Etherscan Block Explorer", "blockchain",
    [["etherscan", "explorer", "scan"], ["contract", "verify", "abi"]],
    [
      ["🔍 ETHERSCAN: api.etherscan.io/api?module=account&action=balance", "📋 MODULE: account, contract, transaction, block, logs, token, stats"],
      ["📜 CONTRACT: action=getabi für ABI, getsourcecode für verifizierte Source"]
    ],
    "🔍 EtherscanBot: Etherscan API für Balances, Contracts und Token-Tracking.", 0.88),

  makeBot("solanaAPI", "SolanaRPC", "◎", Radio, "from-purple-400 to-fuchsia-500",
    "Solana JSON-RPC", "blockchain",
    [["solana", "sol", "spl"], ["nft", "metaplex"]],
    [
      ["◎ SOLANA: getBalance, getAccountInfo, getTransaction, getSignaturesForAddress", "🔌 PROVIDER: Helius, QuickNode, Alchemy für schnelle Solana RPCs"],
      ["🖼️ SOLANA NFTs: Metaplex Standard, getTokenAccountsByOwner für Token-Listen"]
    ],
    "◎ SolanaRPC: Solana JSON-RPC, SPL Tokens und Metaplex NFTs.", 0.85),

  makeBot("polygonAPI", "PolygonNode", "🟣", Antenna, "from-purple-500 to-violet-500",
    "Polygon/Matic API", "blockchain",
    [["polygon", "matic"], ["bridge", "l2"]],
    [
      ["🟣 POLYGON: polygon-rpc.com - ~2 sec Blocks, <$0.01 Fees, volle EVM-Kompatibilität"],
      ["🌉 BRIDGE: Polygon Portal für ETH ↔ MATIC Transfers via Plasma & PoS Bridge"]
    ],
    "🟣 PolygonNode: Polygon PoS RPC, Matic Bridge und L2-Transaktionen.", 0.86),

  makeBot("chainlinkAPI", "OracleBot", "🔮", Gem, "from-blue-600 to-indigo-600",
    "Chainlink Oracles", "blockchain",
    [["chainlink", "oracle", "link"], ["vrf", "random", "zufall"]],
    [
      ["🔮 CHAINLINK: Dezentrale Oracles für Off-Chain Daten on-chain", "📊 PRICE FEEDS: BTC/USD, ETH/USD live on-chain verfügbar"],
      ["🎲 VRF: Verifiable Random Function für faire, nachweisbare Zufallszahlen"]
    ],
    "🔮 OracleBot: Chainlink Price Feeds, VRF und Cross-Chain Messaging (CCIP).", 0.87),

  makeBot("defiAPI", "DeFiPulse", "💎", Gauge, "from-pink-500 to-rose-500",
    "DeFi Protokoll APIs", "blockchain",
    [["defi", "tvl", "yield", "farming"], ["apy", "rendite", "staking"]],
    [
      ["💎 DEFI: DefiLlama API für TVL, Yields und Protokoll-Daten", "📊 TOP: Lido ($30B), Aave ($10B), MakerDAO ($8B), Uniswap ($5B) TVL"],
      ["💰 YIELD: APYs von 2-20% je nach Risiko, Protokoll und Asset"]
    ],
    "💎 DeFiPulse: DeFi-Protokolle, TVL-Rankings und Yield-Vergleiche.", 0.85),

  makeBot("nftAPI", "NFTIndexer", "🖼️", Binary, "from-fuchsia-500 to-pink-500",
    "NFT & Metadaten APIs", "blockchain",
    [["nft", "opensea", "blur"], ["metadata", "ipfs", "arweave"]],
    [
      ["🖼️ NFT APIs: OpenSea v2, Alchemy NFT API, Moralis, Reservoir", "📋 STANDARDS: ERC-721 (unique), ERC-1155 (semi-fungible), Metaplex (Solana)"],
      ["📦 STORAGE: IPFS für dezentrale Metadata, Arweave für permanente Speicherung"]
    ],
    "🖼️ NFTIndexer: NFT-Marktplatz APIs, Metadata-Standards und On-Chain Daten.", 0.84),
];

// ===== LAYER 2 BOTS (6) =====
const layer2Bots: BotDefinition[] = [
  makeBot("lightningBot", "LightningNode", "⚡", Zap, "from-yellow-400 to-orange-400",
    "Lightning Network", "layer2",
    [["lightning", "ln", "channel", "kanal"], ["invoice", "payment", "zahlung"]],
    [
      ["⚡ LIGHTNING: Off-Chain Payment Channels, ~1M TPS theoretisch, <1 Cent Fees", "🔌 NODES: LND, c-lightning, Eclair - BOLT Protokoll-Standard"],
      ["💳 INVOICES: BOLT11 Invoices, Keysend, AMP für spontane Zahlungen"]
    ],
    "⚡ LightningNode: Lightning Network, Payment Channels und Routing.", 0.88),

  makeBot("arbitrumBot", "ArbitrumNode", "🔵", Orbit, "from-blue-500 to-sky-400",
    "Arbitrum L2 Rollup", "layer2",
    [["arbitrum", "arb", "rollup"], ["optimistic", "fraud"]],
    [
      ["🔵 ARBITRUM: Optimistic Rollup auf Ethereum, ~0.1-0.5$ Fees, 7 Tage Challenge", "🌐 RPC: arb1.arbitrum.io/rpc, Alchemy, Infura mit Arbitrum-Support"],
      ["📋 FRAUD PROOF: 7-Tage Challenge-Periode für Withdrawal nach L1"]
    ],
    "🔵 ArbitrumNode: Arbitrum One/Nova Rollup, Nitro und Stylus.", 0.86),

  makeBot("optimismBot", "OptimismNode", "🔴", CircleDot, "from-red-500 to-rose-400",
    "Optimism L2 Rollup", "layer2",
    [["optimism", "op", "superchain"], ["bedrock", "fault"]],
    [
      ["🔴 OPTIMISM: Optimistic Rollup, OP Stack, Superchain-Vision für L2-Netzwerk", "💰 OP TOKEN: Governance + RetroPGF für Public Goods Funding"],
      ["🏗️ BEDROCK: Modularer Upgrade, shared Sequencer, Fault Proofs"]
    ],
    "🔴 OptimismNode: OP Stack, Superchain, Bedrock und RetroPGF.", 0.85),

  makeBot("baseBot", "BaseNode", "🔷", Blocks, "from-blue-600 to-blue-400",
    "Base L2 (Coinbase)", "layer2",
    [["base", "coinbase l2"], ["onchain", "buildOnBase"]],
    [
      ["🔷 BASE: Coinbase L2 auf OP Stack, niedrige Fees, fiat on-ramp via Coinbase", "🏗️ FEATURES: Account Abstraction, Paymaster, gaslose Transaktionen möglich"],
      ["📈 WACHSTUM: Schnell wachsende L2 mit starkem Coinbase-Ökosystem"]
    ],
    "🔷 BaseNode: Base L2 von Coinbase, OP Stack und On-Chain Ökosystem.", 0.84),

  makeBot("zkSyncBot", "zkSyncNode", "🟢", ShieldCheck, "from-green-500 to-emerald-400",
    "zkSync Era ZK-Rollup", "layer2",
    [["zksync", "zk rollup", "zk-rollup"], ["zero knowledge", "zkp", "validity"]],
    [
      ["🟢 ZKSYNC ERA: ZK-Rollup mit nativer Account Abstraction, <$0.10 Fees", "🔐 ZK-PROOFS: Validity Proofs statt Fraud Proofs = sofortige Finality"],
      ["💡 FEATURES: Native AA, Paymaster, LLVM-Compiler für Solidity & Vyper"]
    ],
    "🟢 zkSyncNode: zkSync Era, ZK-Proofs und Account Abstraction.", 0.87),

  makeBot("starknetBot", "StarkNetNode", "🌀", Sparkles, "from-indigo-500 to-purple-400",
    "StarkNet ZK-Rollup", "layer2",
    [["starknet", "stark", "cairo"], ["starks", "validity proof"]],
    [
      ["🌀 STARKNET: ZK-Rollup mit Cairo-Sprache, STARKs statt SNARKs", "📝 CAIRO: Eigene Programmiersprache für beweisbare Programme"],
      ["🔬 STARKS: Transparent, post-quantum sicher, kein Trusted Setup nötig"]
    ],
    "🌀 StarkNetNode: StarkNet, Cairo-Programmierung und STARK-Proofs.", 0.86),
];

// ===== CROSS-CHAIN BOTS (6) =====
const crossChainBots: BotDefinition[] = [
  makeBot("cosmosBot", "CosmosHub", "⚛️", Orbit, "from-indigo-400 to-violet-500",
    "Cosmos IBC Ökosystem", "crosschain",
    [["cosmos", "atom", "ibc"], ["tendermint", "cosmwasm"]],
    [
      ["⚛️ COSMOS: Inter-Blockchain Communication (IBC) für Cross-Chain Transfers", "🌐 ÖKOSYSTEM: 50+ IBC-Chains, Osmosis DEX, Stride Liquid Staking"],
      ["🏗️ SDK: Cosmos SDK + Tendermint/CometBFT für eigene Blockchain in Wochen"]
    ],
    "⚛️ CosmosHub: IBC-Protokoll, Cosmos SDK und App-Chain-Ökosystem.", 0.87),

  makeBot("polkadotBot", "PolkadotRelay", "⭕", GitBranch, "from-pink-500 to-purple-500",
    "Polkadot Parachains", "crosschain",
    [["polkadot", "dot", "parachain"], ["substrate", "xcm"]],
    [
      ["⭕ POLKADOT: Relay Chain + Parachains, Shared Security via Validators", "🔗 XCM: Cross-Consensus Messaging für Parachain-Kommunikation"],
      ["🏗️ SUBSTRATE: Framework für Custom-Blockchains mit Polkadot-Kompatibilität"]
    ],
    "⭕ PolkadotRelay: Parachains, XCM-Messaging und Substrate-Development.", 0.85),

  makeBot("thorchainBot", "ThorNode", "⚔️", Scale, "from-emerald-500 to-cyan-500",
    "THORChain DEX", "crosschain",
    [["thorchain", "rune", "thor"], ["swap", "cross-chain dex"]],
    [
      ["⚔️ THORCHAIN: Native Cross-Chain Swaps ohne Wrapping oder Bridges", "💰 RUNE: Dual-Asset Liquidity Pools, Impermanent Loss Protection"],
      ["🔄 SWAPS: BTC→ETH, ETH→AVAX direkt und dezentral ohne Intermediäre"]
    ],
    "⚔️ ThorNode: THORChain native Swaps, RUNE Pools und Cross-Chain DEX.", 0.86),

  makeBot("wormholeBot", "WormholeGate", "🕳️", Cable, "from-violet-500 to-blue-500",
    "Wormhole Bridge", "crosschain",
    [["wormhole", "bridge", "brücke"], ["wrapped", "portal"]],
    [
      ["🕳️ WORMHOLE: Cross-Chain Bridge für 20+ Chains (ETH, SOL, BSC, AVAX...)", "⚠️ RISIKO: Bridge-Hacks sind häufig - $320M Wormhole Hack 2022"],
      ["🔐 GUARDIAN: 19 Guardian-Nodes validieren Cross-Chain Messages"]
    ],
    "🕳️ WormholeGate: Wormhole Bridge, Guardian-Netzwerk und Token-Transfers.", 0.84),

  makeBot("layerZeroBot", "LayerZeroLink", "🔗", Link2, "from-cyan-500 to-teal-500",
    "LayerZero Omnichain", "crosschain",
    [["layerzero", "omnichain", "oft"], ["stargate", "lz"]],
    [
      ["🔗 LAYERZERO: Omnichain Interoperability Protocol, Ultra Light Nodes", "📋 OFT: Omnichain Fungible Token Standard für native Multi-Chain Tokens"],
      ["🌐 STARGATE: LayerZero-basierter Cross-Chain DEX mit unified Liquidity"]
    ],
    "🔗 LayerZeroLink: Omnichain Messaging, OFT-Standard und Stargate.", 0.85),

  makeBot("axelarBot", "AxelarGateway", "🛸", Route, "from-teal-400 to-green-500",
    "Axelar Cross-Chain", "crosschain",
    [["axelar", "gmp", "cross-chain message"], ["squid", "interchain"]],
    [
      ["🛸 AXELAR: General Message Passing (GMP) für beliebige Cross-Chain Calls", "🔐 SICHERHEIT: PoS-Validator-Set, Quadratic Voting für Dezentralisierung"],
      ["🦑 SQUID: Axelar-basierter Router für Cross-Chain Swaps & Calls"]
    ],
    "🛸 AxelarGateway: GMP-Protokoll, Interchain-Tokens und Squid Router.", 0.85),
];

// ===== STAKING & ADVANCED BOTS (6) =====
const stakingBots: BotDefinition[] = [
  makeBot("lidoBot", "LidoStaker", "🏊", Landmark, "from-sky-400 to-blue-500",
    "Lido Liquid Staking", "staking",
    [["lido", "steth", "liquid staking"], ["staking", "validator", "pos"]],
    [
      ["🏊 LIDO: Größtes Liquid Staking Protokoll, ~$30B TVL, stETH/wstETH", "💰 APY: ~3-5% ETH Staking Reward + DeFi-Composability mit stETH"],
      ["📊 STAKING: 32 ETH Minimum für Solo-Validatoren, Lido ab beliebigem Betrag"]
    ],
    "🏊 LidoStaker: Liquid Staking, stETH-Derivate und Validator-Ökonomie.", 0.88),

  makeBot("eigenBot", "EigenBot", "🔄", Workflow, "from-indigo-500 to-blue-600",
    "EigenLayer Restaking", "staking",
    [["eigen", "restaking", "avs"], ["eigenlayer", "eigenda"]],
    [
      ["🔄 EIGENLAYER: Restaking von ETH/LSTs für zusätzliche Sicherheits-Services", "🏗️ AVS: Actively Validated Services nutzen restaked ETH als Sicherheit"],
      ["📊 EIGENDA: Dezentrale Data Availability Layer basierend auf EigenLayer"]
    ],
    "🔄 EigenBot: EigenLayer Restaking, AVS und Shared Security.", 0.86),

  makeBot("mevBot", "MEVGuard", "🤖", Terminal, "from-red-600 to-orange-500",
    "MEV & Flashbots", "staking",
    [["mev", "flashbot", "sandwich"], ["frontrun", "backrun", "jit"]],
    [
      ["🤖 MEV: Maximal Extractable Value - Sandwich, Frontrun, Backrun, JIT Liquidity", "🛡️ FLASHBOTS: MEV-Protect RPC, MEV-Share für faire Verteilung"],
      ["⚠️ SANDWICH: Bot kauft vor dir, du kaufst teurer, Bot verkauft = Profit für Bot"]
    ],
    "🤖 MEVGuard: MEV-Erkennung, Flashbots-Protection und Searcher-Strategien.", 0.87),

  makeBot("zkProverBot", "ZKProver", "🔬", Fingerprint, "from-green-600 to-emerald-500",
    "Zero Knowledge Proofs", "staking",
    [["zk", "zero knowledge", "proof"], ["snark", "stark", "groth16", "plonk"]],
    [
      ["🔬 ZK-PROOFS: Beweise ohne Offenlegung von Daten - SNARKs vs STARKs", "📐 SNARKs: Kompakt, schnell zu verifizieren, brauchen Trusted Setup"],
      ["🏗️ STARKs: Transparent (kein Setup), post-quantum sicher, aber größer"]
    ],
    "🔬 ZKProver: Zero Knowledge Proofs, SNARKs, STARKs und zkEVM.", 0.89),

  makeBot("daoBot", "DAOManager", "🏛️", Landmark, "from-amber-500 to-yellow-500",
    "DAO Governance", "staking",
    [["dao", "governance", "abstimmung"], ["voting", "proposal", "treasury"]],
    [
      ["🏛️ DAO: Dezentrale Autonome Organisation - on-chain Governance & Treasury", "📋 TOOLS: Snapshot (off-chain), Governor (on-chain), Tally für Dashboards"],
      ["🗳️ VOTING: Token-weighted, Quadratic Voting, Conviction Voting"]
    ],
    "🏛️ DAOManager: DAO-Governance, Voting-Mechanismen und Treasury-Management.", 0.84),

  makeBot("gamefiBot", "GameFiBot", "🎮", Flame, "from-fuchsia-500 to-pink-400",
    "GameFi & Play-to-Earn", "staking",
    [["gamefi", "play to earn", "p2e", "gaming"], ["nft game", "metaverse", "ingame"]],
    [
      ["🎮 GAMEFI: Play-to-Earn, Move-to-Earn, Game-NFTs als Assets", "🌐 TOP: Axie Infinity, Illuvium, Gods Unchained, Star Atlas"],
      ["💰 MODELLE: Free-to-Play + NFT Drops, Play-to-Earn, Stake-to-Play"]
    ],
    "🎮 GameFiBot: GameFi-Ökosystem, P2E-Modelle und Gaming-NFTs.", 0.83),
];

export const ALL_BOTS: Record<string, BotDefinition> = {};
[...coreBots, ...extendedBots, ...blockchainBots, ...layer2Bots, ...crossChainBots, ...stakingBots].forEach(bot => {
  ALL_BOTS[bot.id] = bot;
});

export const BOT_GROUPS: Record<string, { name: string; color: string }> = {
  core: { name: "Core Bots", color: "from-blue-600 to-cyan-600" },
  extended: { name: "Extended Bots", color: "from-purple-600 to-pink-600" },
  blockchain: { name: "Blockchain APIs", color: "from-amber-600 to-orange-600" },
  layer2: { name: "Layer 2 Networks", color: "from-green-600 to-emerald-600" },
  crosschain: { name: "Cross-Chain Bridges", color: "from-violet-600 to-indigo-600" },
  staking: { name: "Staking & Advanced", color: "from-red-600 to-rose-600" },
};

export const BOT_COUNT = Object.keys(ALL_BOTS).length; // 48
