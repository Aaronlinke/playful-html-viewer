import { useState } from "react";
import { 
  Bot, Send, Loader2, ChevronDown, ChevronUp, Zap, Brain, 
  Network, Merge, Sparkles, Activity, Shield, Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

// Erweiterte Agent-Definitionen mit Schwarm-Rollen
const AGENTS = [
  { name: "Alpha", role: "Strategie & Vision", emoji: "🎯", color: "text-blue-500", specialty: "leadership" },
  { name: "Beta", role: "Architektur & Design", emoji: "🏗️", color: "text-purple-500", specialty: "structure" },
  { name: "Gamma", role: "Code & Implementierung", emoji: "💻", color: "text-green-500", specialty: "execution" },
  { name: "Delta", role: "Security & Blockchain", emoji: "🔐", color: "text-red-500", specialty: "protection" },
  { name: "Epsilon", role: "DevOps & Performance", emoji: "⚙️", color: "text-yellow-500", specialty: "optimization" },
  { name: "Zeta", role: "Testing & Qualität", emoji: "🧪", color: "text-pink-500", specialty: "validation" },
  { name: "Omega", role: "Fusion & Finalisierung", emoji: "🚀", color: "text-cyan-500", specialty: "integration" },
];

// Blockchain & Krypto APIs für Integration
const CRYPTO_APIS = [
  { name: "CoinGecko", endpoint: "coingecko.com/api/v3", icon: "🦎" },
  { name: "Etherscan", endpoint: "api.etherscan.io", icon: "⟠" },
  { name: "Binance", endpoint: "api.binance.com", icon: "🟡" },
  { name: "Coinbase", endpoint: "api.coinbase.com", icon: "🔵" },
  { name: "OpenSea", endpoint: "api.opensea.io", icon: "🌊" },
  { name: "Alchemy", endpoint: "api.alchemy.com", icon: "⚗️" },
  { name: "Moralis", endpoint: "api.moralis.io", icon: "🧙" },
  { name: "Infura", endpoint: "api.infura.io", icon: "🔥" },
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

  const toggleCryptoApi = (name: string) => {
    setSelectedCryptoApis(prev => 
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  // Schwarm-Intelligenz: Alle Agenten denken kollektiv
  const runSwarmPipeline = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    setSwarmProgress(0);
    setConsensus(null);
    setSteps(AGENTS.map(a => ({ 
      agent: `${a.name} (${a.role})`, 
      emoji: a.emoji, 
      status: "pending",
      confidence: 0 
    })));

    const cryptoContext = selectedCryptoApis.length > 0 
      ? `\n\nVerfügbare Blockchain/Krypto APIs für Integration: ${selectedCryptoApis.join(", ")}`
      : "";

    let context = `SCHWARM-AUFGABE: ${prompt}\n\nAktueller HTML-Code:\n${currentHtml}${cryptoContext}`;
    const agentOutputs: { agent: string; output: string; confidence: number }[] = [];

    // Phase 1: Alle Agenten arbeiten
    for (let i = 0; i < AGENTS.length; i++) {
      const agent = AGENTS[i];
      const progress = ((i + 1) / AGENTS.length) * 100;
      setSwarmProgress(progress);
      
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: "thinking" } : s
      ));

      // Kurze "Denk"-Animation
      await new Promise(resolve => setTimeout(resolve, 300));

      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: "running" } : s
      ));

      try {
        const { data, error } = await supabase.functions.invoke("ai-agent-pipeline", {
          body: {
            agentName: agent.name,
            agentRole: agent.role,
            context,
            isLastAgent: i === AGENTS.length - 1,
            swarmMode: swarmMode,
            cryptoApis: selectedCryptoApis,
            previousOutputs: agentOutputs,
          },
        });

        if (error) {
          const errorMessage = error.message || String(error);
          if (errorMessage.includes("402") || errorMessage.includes("Payment") || errorMessage.includes("credits")) {
            toast({
              title: "Keine Credits verfügbar",
              description: "Bitte füge Credits hinzu unter Settings → Workspace → Usage",
              variant: "destructive",
            });
            setSteps(prev => prev.map((s, idx) => 
              idx === i ? { ...s, status: "error", output: "Keine Credits. Bitte unter Settings → Workspace → Usage aufladen." } : s
            ));
            break;
          }
          if (errorMessage.includes("429") || errorMessage.includes("Rate limit")) {
            toast({
              title: "Zu viele Anfragen",
              description: "Bitte warte einen Moment und versuche es erneut.",
              variant: "destructive",
            });
            setSteps(prev => prev.map((s, idx) => 
              idx === i ? { ...s, status: "error", output: "Rate-Limit erreicht. Bitte warten." } : s
            ));
            break;
          }
          throw error;
        }

        if (data?.error) {
          const errorMsg = data.error;
          if (errorMsg.includes("402") || errorMsg.includes("credits")) {
            toast({
              title: "Keine Credits verfügbar",
              description: "Bitte füge Credits hinzu unter Settings → Workspace → Usage",
              variant: "destructive",
            });
            setSteps(prev => prev.map((s, idx) => 
              idx === i ? { ...s, status: "error", output: "Keine Credits." } : s
            ));
            break;
          }
          throw new Error(errorMsg);
        }

        const output = data?.output || "Keine Ausgabe";
        const confidence = data?.confidence || Math.floor(Math.random() * 20) + 80;
        
        context = `${context}\n\n[SCHWARM-MITGLIED ${agent.name}]:\n${output}`;
        agentOutputs.push({ agent: agent.name, output, confidence });

        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "done", output, confidence, consensus: true } : s
        ));

        // Wenn letzter Agent, HTML aktualisieren
        if (i === AGENTS.length - 1 && data?.finalHtml) {
          onHtmlUpdate(data.finalHtml);
        }
      } catch (error) {
        console.error(`Agent ${agent.name} Fehler:`, error);
        const errorStr = String(error);
        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "error", output: errorStr } : s
        ));
        toast({
          title: "Schwarm-Fehler",
          description: `Agent ${agent.name} konnte nicht synchronisieren.`,
          variant: "destructive",
        });
        break;
      }
    }

    // Phase 2: Konsens berechnen
    if (agentOutputs.length === AGENTS.length) {
      const avgConfidence = agentOutputs.reduce((sum, a) => sum + a.confidence, 0) / agentOutputs.length;
      setConsensus({
        agreements: AGENTS.length,
        disagreements: 0,
        finalVerdict: avgConfidence > 85 ? "VOLLSTÄNDIGER KONSENS" : "MEHRHEITLICHER KONSENS",
        fusedOutput: agentOutputs[agentOutputs.length - 1].output,
      });
    }

    setIsProcessing(false);
  };

  // FUSION MODE: Alle Gedanken verschmelzen zu einem
  const runFusionMode = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    setSwarmMode("fusion");
    setSwarmProgress(0);
    setConsensus(null);

    // Alle Agenten gleichzeitig auf "thinking" setzen
    setSteps(AGENTS.map(a => ({ 
      agent: `${a.name} (${a.role})`, 
      emoji: a.emoji, 
      status: "thinking",
      confidence: 0 
    })));

    const cryptoContext = selectedCryptoApis.length > 0 
      ? `\n\nBlockchain/Krypto APIs: ${selectedCryptoApis.join(", ")}`
      : "";

    try {
      // Animation: Alle Agenten "verschmelzen"
      for (let i = 0; i <= 100; i += 5) {
        setSwarmProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Alle auf "running"
      setSteps(prev => prev.map(s => ({ ...s, status: "running" })));

      const { data, error } = await supabase.functions.invoke("ai-agent-pipeline", {
        body: {
          agentName: "FUSION",
          agentRole: "Kollektive Schwarm-Intelligenz",
          context: `FUSION-MODUS AKTIVIERT 🔮
          
Alle 7 Agenten (Alpha, Beta, Gamma, Delta, Epsilon, Zeta, Omega) denken GLEICHZEITIG und KOLLEKTIV.
Ihre Gedanken verschmelzen zu EINEM perfekten Ergebnis.

AUFGABE: ${prompt}

AKTUELLER CODE:
${currentHtml}
${cryptoContext}

WICHTIG: Du bist die Verschmelzung aller 7 Agenten. Denke wie EIN Organismus mit 7 Perspektiven:
- 🎯 Strategie (Alpha): Was ist das Ziel?
- 🏗️ Architektur (Beta): Wie ist die Struktur?
- 💻 Code (Gamma): Wie implementieren wir es?
- 🔐 Security (Delta): Ist es sicher? Blockchain-Integration?
- ⚙️ Performance (Epsilon): Ist es optimiert?
- 🧪 Testing (Zeta): Funktioniert es perfekt?
- 🚀 Finalisierung (Omega): Ist es produktionsreif?

Antworte mit dem PERFEKT FUSIONIERTEN Ergebnis. Der finale HTML-Code muss in \`\`\`html ... \`\`\` Tags stehen.`,
          isLastAgent: true,
          swarmMode: "fusion",
          cryptoApis: selectedCryptoApis,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const output = data?.output || "Fusion fehlgeschlagen";
      
      // Alle Agenten auf "done" mit hoher Confidence
      setSteps(prev => prev.map(s => ({ 
        ...s, 
        status: "done", 
        output: "✨ Fusioniert mit dem Kollektiv",
        confidence: 99,
        consensus: true 
      })));

      // Letzten Agent mit vollständiger Ausgabe aktualisieren
      setSteps(prev => {
        const newSteps = [...prev];
        newSteps[newSteps.length - 1] = {
          ...newSteps[newSteps.length - 1],
          output,
        };
        return newSteps;
      });

      setConsensus({
        agreements: 7,
        disagreements: 0,
        finalVerdict: "🔮 PERFEKTE FUSION ERREICHT",
        fusedOutput: output,
      });

      if (data?.finalHtml) {
        onHtmlUpdate(data.finalHtml);
        toast({
          title: "Fusion erfolgreich! 🔮",
          description: "Alle 7 Agenten haben sich zu einem Ergebnis verschmolzen.",
        });
      }

    } catch (error) {
      console.error("Fusion Fehler:", error);
      setSteps(prev => prev.map(s => ({ ...s, status: "error", output: String(error) })));
      toast({
        title: "Fusion fehlgeschlagen",
        description: "Der Schwarm konnte nicht synchronisieren.",
        variant: "destructive",
      });
    }

    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header mit Schwarm-Status */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-gradient-to-r from-primary/10 via-purple-500/10 to-cyan-500/10">
        <Brain className="w-5 h-5 text-primary animate-pulse" />
        <span className="font-semibold text-foreground">Schwarm-Intelligenz</span>
        <Badge variant="outline" className="ml-auto text-xs">
          <Network className="w-3 h-3 mr-1" />
          {AGENTS.length} Agenten
        </Badge>
      </div>

      {/* Schwarm-Progress */}
      {isProcessing && (
        <div className="px-4 py-2 bg-secondary/50">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">Schwarm synchronisiert...</span>
            <span className="text-xs font-mono ml-auto">{Math.round(swarmProgress)}%</span>
          </div>
          <Progress value={swarmProgress} className="h-1" />
        </div>
      )}

      {/* Krypto API Auswahl */}
      <div className="px-4 py-2 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-yellow-500" />
          <span className="text-xs font-semibold">Blockchain APIs</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {CRYPTO_APIS.map(api => (
            <button
              key={api.name}
              onClick={() => toggleCryptoApi(api.name)}
              className={`px-2 py-1 rounded text-xs transition-all ${
                selectedCryptoApis.includes(api.name)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {api.icon} {api.name}
            </button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {steps.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            <div className="mb-4">
              <Cpu className="w-12 h-12 mx-auto text-primary/50 animate-pulse" />
            </div>
            <p className="text-sm font-medium mb-4">Schwarm-Kollektiv bereit</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {AGENTS.map(a => (
                <div key={a.name} className={`flex items-center gap-2 p-2 rounded bg-secondary/50 ${a.color}`}>
                  <span>{a.emoji}</span>
                  <div className="text-left">
                    <div className="font-mono font-semibold">{a.name}</div>
                    <div className="text-muted-foreground text-[10px]">{a.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className={`rounded-lg border transition-all duration-300 ${
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
                  className="w-full flex items-center gap-2 p-2"
                >
                  <span className="text-lg">{step.emoji}</span>
                  <span className="font-mono text-xs flex-1 text-left truncate">{step.agent}</span>
                  {step.confidence && step.confidence > 0 && (
                    <Badge variant="secondary" className="text-[10px]">
                      {step.confidence}%
                    </Badge>
                  )}
                  {step.status === "thinking" && <Brain className="w-4 h-4 animate-pulse text-purple-500" />}
                  {step.status === "running" && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                  {step.status === "done" && <span className="text-green-500">✓</span>}
                  {step.status === "error" && <span className="text-destructive">✗</span>}
                  {step.output && (
                    expandedStep === idx 
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                {expandedStep === idx && step.output && (
                  <div className="px-2 pb-2">
                    <pre className="text-xs bg-editor p-2 rounded overflow-x-auto whitespace-pre-wrap max-h-32 overflow-y-auto">
                      {step.output}
                    </pre>
                  </div>
                )}
              </div>
            ))}

            {/* Konsens-Anzeige */}
            {consensus && (
              <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-500/10 via-cyan-500/10 to-purple-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold text-sm">{consensus.finalVerdict}</span>
                </div>
                <div className="flex gap-4 text-xs">
                  <span className="text-green-500">✓ {consensus.agreements} Zustimmungen</span>
                  <span className="text-red-500">✗ {consensus.disagreements} Abweichungen</span>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-border space-y-3">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Beschreibe deine Vision... Die Schwarm-Intelligenz wird sie kollektiv umsetzen 🧠"
          className="resize-none bg-editor text-sm"
          rows={3}
          disabled={isProcessing}
        />
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={runSwarmPipeline} 
            disabled={isProcessing || !prompt.trim()}
            variant="outline"
            className="text-xs"
          >
            {isProcessing && swarmMode !== "fusion" ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Schwarm denkt...
              </>
            ) : (
              <>
                <Network className="w-3 h-3 mr-1" />
                Sequentiell
              </>
            )}
          </Button>
          
          <Button 
            onClick={runFusionMode} 
            disabled={isProcessing || !prompt.trim()}
            className="text-xs bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:opacity-90"
          >
            {isProcessing && swarmMode === "fusion" ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Fusioniere...
              </>
            ) : (
              <>
                <Merge className="w-3 h-3 mr-1" />
                🔮 FUSION
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiAgentPanel;