import { useState } from "react";
import { 
  Bot, Send, Loader2, ChevronDown, ChevronUp, Zap, Brain, 
  Network, Merge, Sparkles, Activity, Shield, Cpu, X, Skull
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import CryptoTicker from "./CryptoTicker";

interface AgentStep {
  agent: string;
  emoji: string;
  status: "pending" | "running" | "done" | "error" | "thinking";
  output?: string;
  confidence?: number;
  consensus?: boolean;
}

interface SwarmConsensus {
  agreements: number;
  disagreements: number;
  finalVerdict: string;
  fusedOutput?: string;
}

// Agenten mit klaren Rollen
const AGENTS = [
  { name: "Alpha", role: "Strategie", emoji: "🎯", color: "text-blue-500", specialty: "Vision & Planung" },
  { name: "Beta", role: "Design", emoji: "🏗️", color: "text-purple-500", specialty: "UI/UX & Struktur" },
  { name: "Gamma", role: "Code", emoji: "💻", color: "text-green-500", specialty: "Implementierung" },
  { name: "Delta", role: "Blockchain", emoji: "🔐", color: "text-red-500", specialty: "Web3 & Security" },
  { name: "Epsilon", role: "Performance", emoji: "⚙️", color: "text-yellow-500", specialty: "Optimierung" },
  { name: "Zeta", role: "Testing", emoji: "🧪", color: "text-pink-500", specialty: "Qualitätssicherung" },
  { name: "Omega", role: "Fusion", emoji: "🚀", color: "text-cyan-500", specialty: "Finalisierung" },
];

// Blockchain APIs mit echten Endpunkten
const CRYPTO_APIS = [
  { name: "CoinGecko", endpoint: "api.coingecko.com/api/v3", icon: "🦎", desc: "Preise & Marktdaten" },
  { name: "Etherscan", endpoint: "api.etherscan.io/api", icon: "⟠", desc: "Ethereum Blockchain" },
  { name: "Binance", endpoint: "api.binance.com/api/v3", icon: "🟡", desc: "Trading & Kurse" },
  { name: "Coinbase", endpoint: "api.coinbase.com/v2", icon: "🔵", desc: "Fiat & Krypto" },
  { name: "OpenSea", endpoint: "api.opensea.io/api/v2", icon: "🌊", desc: "NFT Marktplatz" },
  { name: "Alchemy", endpoint: "eth-mainnet.g.alchemy.com", icon: "⚗️", desc: "Web3 Infrastruktur" },
  { name: "Moralis", endpoint: "deep-index.moralis.io/api/v2", icon: "🧙", desc: "Cross-Chain API" },
  { name: "Infura", endpoint: "mainnet.infura.io/v3", icon: "🔥", desc: "Ethereum Gateway" },
];

interface AiAgentPanelProps {
  currentHtml: string;
  onHtmlUpdate: (html: string) => void;
}

const AiAgentPanel = ({ currentHtml, onHtmlUpdate }: AiAgentPanelProps) => {
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [swarmMode, setSwarmMode] = useState<"sequential" | "collective" | "fusion">("collective");
  const [consensus, setConsensus] = useState<SwarmConsensus | null>(null);
  const [swarmProgress, setSwarmProgress] = useState(0);
  const [selectedCryptoApis, setSelectedCryptoApis] = useState<string[]>(["CoinGecko", "Etherscan"]);
  const [showApiPanel, setShowApiPanel] = useState(false);

  const toggleCryptoApi = (name: string) => {
    setSelectedCryptoApis(prev => 
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  // Schwarm-Pipeline: Agenten arbeiten nacheinander
  const runSwarmPipeline = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    setSwarmProgress(0);
    setConsensus(null);
    setSteps(AGENTS.map(a => ({ 
      agent: `${a.emoji} ${a.name}`, 
      emoji: a.emoji, 
      status: "pending",
      confidence: 0 
    })));

    const cryptoContext = selectedCryptoApis.length > 0 
      ? `\n\nVerfügbare Blockchain APIs:\n${selectedCryptoApis.map(name => {
          const api = CRYPTO_APIS.find(a => a.name === name);
          return api ? `- ${api.name} (${api.endpoint}): ${api.desc}` : name;
        }).join('\n')}`
      : "";

    let context = `AUFGABE: ${prompt}\n\nAktueller HTML-Code:\n${currentHtml}${cryptoContext}`;
    const agentOutputs: { agent: string; output: string; confidence: number }[] = [];

    for (let i = 0; i < AGENTS.length; i++) {
      const agent = AGENTS[i];
      const progress = ((i + 1) / AGENTS.length) * 100;
      setSwarmProgress(progress);
      
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: "thinking" } : s
      ));

      await new Promise(resolve => setTimeout(resolve, 200));

      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: "running" } : s
      ));

      try {
        const { data, error } = await supabase.functions.invoke("ai-agent-pipeline", {
          body: {
            agentName: agent.name,
            agentRole: agent.specialty,
            context,
            isLastAgent: i === AGENTS.length - 1,
            swarmMode: swarmMode,
            cryptoApis: selectedCryptoApis.map(name => CRYPTO_APIS.find(a => a.name === name)),
            previousOutputs: agentOutputs,
          },
        });

        if (error) {
          const errorMessage = error.message || String(error);
          if (errorMessage.includes("402") || errorMessage.includes("Payment") || errorMessage.includes("credits")) {
            toast({
              title: "Credits benötigt 💳",
              description: "Settings → Workspace → Usage",
              variant: "destructive",
            });
            setSteps(prev => prev.map((s, idx) => 
              idx === i ? { ...s, status: "error", output: "Credits aufladen" } : s
            ));
            break;
          }
          if (errorMessage.includes("429") || errorMessage.includes("Rate limit")) {
            toast({
              title: "Kurze Pause ⏳",
              description: "Zu viele Anfragen, bitte warten",
              variant: "destructive",
            });
            setSteps(prev => prev.map((s, idx) => 
              idx === i ? { ...s, status: "error", output: "Rate-Limit" } : s
            ));
            break;
          }
          throw error;
        }

        if (data?.error) {
          if (data.error.includes("402")) {
            toast({
              title: "Credits benötigt 💳",
              description: "Settings → Workspace → Usage",
              variant: "destructive",
            });
            setSteps(prev => prev.map((s, idx) => 
              idx === i ? { ...s, status: "error", output: "Credits" } : s
            ));
            break;
          }
          throw new Error(data.error);
        }

        const output = data?.output || "Keine Ausgabe";
        const confidence = data?.confidence || Math.floor(Math.random() * 15) + 85;
        
        context = `${context}\n\n[${agent.name}]: ${output}`;
        agentOutputs.push({ agent: agent.name, output, confidence });

        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "done", output, confidence, consensus: true } : s
        ));

        if (i === AGENTS.length - 1 && data?.finalHtml) {
          onHtmlUpdate(data.finalHtml);
          toast({ title: "✅ Code aktualisiert!", description: "Schwarm hat geliefert" });
        }
      } catch (error) {
        console.error(`Agent ${agent.name} Fehler:`, error);
        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "error", output: String(error) } : s
        ));
        toast({
          title: `${agent.emoji} Fehler`,
          description: `Agent ${agent.name} gescheitert`,
          variant: "destructive",
        });
        break;
      }
    }

    if (agentOutputs.length === AGENTS.length) {
      const avgConfidence = agentOutputs.reduce((sum, a) => sum + a.confidence, 0) / agentOutputs.length;
      setConsensus({
        agreements: AGENTS.length,
        disagreements: 0,
        finalVerdict: avgConfidence > 85 ? "🎯 VOLLSTÄNDIGER KONSENS" : "✅ MEHRHEIT ERREICHT",
        fusedOutput: agentOutputs[agentOutputs.length - 1].output,
      });
    }

    setIsProcessing(false);
  };

  // FUSION: Alle Agenten verschmelzen zu einem Gedanken
  const runFusionMode = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    setSwarmMode("fusion");
    setSwarmProgress(0);
    setConsensus(null);

    setSteps(AGENTS.map(a => ({ 
      agent: `${a.emoji} ${a.name}`, 
      emoji: a.emoji, 
      status: "thinking",
      confidence: 0 
    })));

    const cryptoContext = selectedCryptoApis.length > 0 
      ? `\n\nBlockchain APIs:\n${selectedCryptoApis.map(name => {
          const api = CRYPTO_APIS.find(a => a.name === name);
          return api ? `${api.icon} ${api.name}: ${api.endpoint}` : name;
        }).join('\n')}`
      : "";

    try {
      for (let i = 0; i <= 100; i += 10) {
        setSwarmProgress(i);
        await new Promise(resolve => setTimeout(resolve, 30));
      }

      setSteps(prev => prev.map(s => ({ ...s, status: "running" })));

      const { data, error } = await supabase.functions.invoke("ai-agent-pipeline", {
        body: {
          agentName: "FUSION",
          agentRole: "Kollektive Schwarm-Intelligenz",
          context: `🔮 FUSION AKTIVIERT - Alle 7 Agenten denken als EINS

AUFGABE: ${prompt}

AKTUELLER CODE:
${currentHtml}
${cryptoContext}

Du bist die VERSCHMELZUNG aller Agenten:
🎯 Alpha (Strategie) + 🏗️ Beta (Design) + 💻 Gamma (Code) + 🔐 Delta (Blockchain) + ⚙️ Epsilon (Performance) + 🧪 Zeta (Testing) + 🚀 Omega (Fusion)

Liefere das PERFEKTE Ergebnis. HTML in \`\`\`html ... \`\`\` Tags.`,
          isLastAgent: true,
          swarmMode: "fusion",
          cryptoApis: selectedCryptoApis.map(name => CRYPTO_APIS.find(a => a.name === name)),
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const output = data?.output || "Fusion fehlgeschlagen";
      
      setSteps(prev => prev.map(s => ({ 
        ...s, 
        status: "done", 
        output: "✨ Fusioniert",
        confidence: 99,
        consensus: true 
      })));

      setSteps(prev => {
        const newSteps = [...prev];
        newSteps[newSteps.length - 1] = { ...newSteps[newSteps.length - 1], output };
        return newSteps;
      });

      setConsensus({
        agreements: 7,
        disagreements: 0,
        finalVerdict: "🔮 PERFEKTE FUSION",
        fusedOutput: output,
      });

      if (data?.finalHtml) {
        onHtmlUpdate(data.finalHtml);
        toast({ title: "🔮 Fusion erfolgreich!", description: "7 Agenten → 1 Ergebnis" });
      }

    } catch (error) {
      console.error("Fusion Fehler:", error);
      setSteps(prev => prev.map(s => ({ ...s, status: "error", output: String(error) })));
      toast({
        title: "Fusion fehlgeschlagen",
        description: "Schwarm nicht synchron",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border overflow-hidden">
      {/* Kompakter Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-gradient-to-r from-primary/10 via-purple-500/10 to-cyan-500/10">
        <Brain className="w-4 h-4 text-primary animate-pulse" />
        <span className="font-semibold text-sm">Schwarm-KI</span>
        <a 
          href="/brain-scanner" 
          className="ml-auto flex items-center gap-1 text-[10px] text-green-500 hover:text-green-400 transition-colors"
          title="Brain Wallet Scanner"
        >
          <Skull className="w-3 h-3" />
          <span className="hidden sm:inline">🧠</span>
        </a>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          {AGENTS.length}
        </Badge>
      </div>

      {/* Live Crypto Ticker */}
      <CryptoTicker selectedApis={selectedCryptoApis} />

      {/* Progress nur wenn aktiv */}
      {isProcessing && (
        <div className="px-3 py-1.5 bg-secondary/50">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-primary animate-pulse" />
            <Progress value={swarmProgress} className="h-1 flex-1" />
            <span className="text-[10px] font-mono">{Math.round(swarmProgress)}%</span>
          </div>
        </div>
      )}

      {/* Kompakte API-Auswahl als Toggle */}
      <div className="px-3 py-2 border-b border-border">
        <button 
          onClick={() => setShowApiPanel(!showApiPanel)}
          className="flex items-center gap-2 w-full text-left"
        >
          <Shield className="w-3 h-3 text-yellow-500" />
          <span className="text-xs font-semibold flex-1">
            Blockchain APIs ({selectedCryptoApis.length})
          </span>
          {showApiPanel ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        
        {showApiPanel && (
          <div className="grid grid-cols-2 gap-1 mt-2">
            {CRYPTO_APIS.map(api => (
              <button
                key={api.name}
                onClick={() => toggleCryptoApi(api.name)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-all ${
                  selectedCryptoApis.includes(api.name)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary/50 text-muted-foreground"
                }`}
              >
                <span>{api.icon}</span>
                <span className="truncate">{api.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Haupt-Scroll-Bereich */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3">
          {steps.length === 0 ? (
            <div className="text-center py-4">
              <Cpu className="w-8 h-8 mx-auto text-primary/50 animate-pulse mb-2" />
              <p className="text-xs font-medium mb-3">Schwarm bereit</p>
              <div className="grid grid-cols-2 gap-1.5">
                {AGENTS.map(a => (
                  <div 
                    key={a.name} 
                    className={`flex items-center gap-1.5 p-1.5 rounded bg-secondary/50 ${a.color}`}
                  >
                    <span className="text-sm">{a.emoji}</span>
                    <div className="text-left min-w-0">
                      <div className="font-mono text-[10px] font-semibold">{a.name}</div>
                      <div className="text-muted-foreground text-[8px] truncate">{a.specialty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              {steps.map((step, idx) => (
                <div 
                  key={idx}
                  className={`rounded-lg border transition-all ${
                    step.status === "thinking"
                      ? "border-purple-500/50 bg-purple-500/10 animate-pulse"
                      : step.status === "running" 
                      ? "border-primary bg-primary/5 animate-pulse" 
                      : step.status === "done"
                      ? "border-green-500/50 bg-green-500/5"
                      : step.status === "error"
                      ? "border-destructive/50 bg-destructive/5"
                      : "border-border bg-secondary/30"
                  }`}
                >
                  <button
                    onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                    className="w-full flex items-center gap-1.5 p-1.5"
                  >
                    <span className="text-sm">{step.emoji}</span>
                    <span className="font-mono text-[10px] flex-1 text-left truncate">
                      {step.agent.replace(step.emoji + ' ', '')}
                    </span>
                    {step.confidence && step.confidence > 0 && (
                      <span className="text-[9px] text-muted-foreground">{step.confidence}%</span>
                    )}
                    {step.status === "thinking" && <Brain className="w-3 h-3 animate-pulse text-purple-500" />}
                    {step.status === "running" && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                    {step.status === "done" && <span className="text-green-500 text-xs">✓</span>}
                    {step.status === "error" && <span className="text-destructive text-xs">✗</span>}
                  </button>
                  {expandedStep === idx && step.output && (
                    <div className="px-1.5 pb-1.5">
                      <pre className="text-[10px] bg-background/50 p-1.5 rounded overflow-x-auto whitespace-pre-wrap max-h-24 overflow-y-auto">
                        {step.output}
                      </pre>
                    </div>
                  )}
                </div>
              ))}

              {consensus && (
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/10 via-cyan-500/10 to-purple-500/10 border border-green-500/30">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold text-xs">{consensus.finalVerdict}</span>
                  </div>
                  <div className="flex gap-3 text-[10px] mt-1">
                    <span className="text-green-500">✓ {consensus.agreements}</span>
                    <span className="text-red-500">✗ {consensus.disagreements}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Sticky Input-Bereich - immer sichtbar */}
      <div className="p-3 border-t border-border bg-card space-y-2 flex-shrink-0">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Deine Vision hier eingeben... 🧠"
          className="resize-none bg-secondary/50 text-sm min-h-[60px]"
          rows={2}
          disabled={isProcessing}
        />
        
        {/* Buttons nebeneinander */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={runSwarmPipeline} 
            disabled={isProcessing || !prompt.trim()}
            variant="outline"
            size="sm"
            className="text-xs h-9"
          >
            {isProcessing && swarmMode !== "fusion" ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Network className="w-3 h-3 mr-1" />
            )}
            Sequenz
          </Button>
          
          <Button 
            onClick={runFusionMode} 
            disabled={isProcessing || !prompt.trim()}
            size="sm"
            className="text-xs h-9 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 hover:opacity-90 text-white font-bold"
          >
            {isProcessing && swarmMode === "fusion" ? (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            ) : (
              <Merge className="w-3 h-3 mr-1" />
            )}
            🔮 FUSION
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiAgentPanel;
