import { useState, useEffect, useCallback } from "react";
import { 
  Brain, Zap, Skull, Eye, Target, Flame, Activity,
  ChevronDown, Shield, Lock, Unlock, AlertTriangle, 
  Cpu, Network, Sparkles, RotateCcw, Play, Pause
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface AIThought {
  id: string;
  type: "analysis" | "strategy" | "attempt" | "insight" | "warning";
  message: string;
  timestamp: Date;
  confidence?: number;
}

interface PuzzleTarget {
  id: number;
  address: string;
  balance: string;
  range: string;
  bits: number;
  keyspace: string;
}

const PUZZLES: PuzzleTarget[] = [
  { id: 66, address: "13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so", balance: "6.6 BTC", range: "2^65 - 2^66", bits: 66, keyspace: "36,893,488,147,419,103,232" },
  { id: 67, address: "1BY8GQbnueYofwSuFAT3USAhGjPrkxDdW9", balance: "6.7 BTC", range: "2^66 - 2^67", bits: 67, keyspace: "73,786,976,294,838,206,464" },
  { id: 68, address: "1MVDYgVaSN6iKKEsbzRUAYFrYJadLYZvvZ", balance: "6.8 BTC", range: "2^67 - 2^68", bits: 68, keyspace: "147,573,952,589,676,412,928" },
  { id: 130, address: "1Fo65aKq8s8iquMt6weF1rku1moWVEd5Ua", balance: "13 BTC", range: "2^129 - 2^130", bits: 130, keyspace: "680,564,733,841,876,926,926,749,214,863,536,422,912" },
];

const SatanSolver = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleTarget>(PUZZLES[0]);
  const [thoughts, setThoughts] = useState<AIThought[]>([]);
  const [currentPhase, setCurrentPhase] = useState<string>("IDLE");
  const [progress, setProgress] = useState(0);
  const [aiConfidence, setAiConfidence] = useState(0);
  const [keysAnalyzed, setKeysAnalyzed] = useState(0);
  const [patternsFound, setPatternsFound] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [satanMode, setSatanMode] = useState(false);

  const addThought = useCallback((type: AIThought["type"], message: string, confidence?: number) => {
    setThoughts(prev => [{
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      confidence
    }, ...prev.slice(0, 49)]);
  }, []);

  // KI-gestützte Analyse starten
  const startAISolver = async () => {
    if (isActive) {
      setIsActive(false);
      setCurrentPhase("PAUSED");
      addThought("warning", "⏸️ Analyse pausiert. Neuronale Netzwerke im Standby.");
      return;
    }

    setIsActive(true);
    setIsThinking(true);
    setThoughts([]);
    setProgress(0);
    setKeysAnalyzed(0);
    setPatternsFound(0);
    setCurrentPhase("INITIALIZING");

    addThought("analysis", `🎯 Ziel erfasst: Puzzle #${selectedPuzzle.id} (${selectedPuzzle.bits}-bit)`);
    addThought("analysis", `📍 Adresse: ${selectedPuzzle.address}`);
    addThought("analysis", `💰 Belohnung: ${selectedPuzzle.balance} (~$${(parseFloat(selectedPuzzle.balance) * 67000).toLocaleString()})`);
    
    await new Promise(r => setTimeout(r, 1000));
    setCurrentPhase("ANALYZING");
    setProgress(5);

    // Echte KI-Analyse über Edge Function
    try {
      addThought("strategy", "🧠 Initialisiere neuronales Netzwerk für Kryptanalyse...");
      
      const { data, error } = await supabase.functions.invoke("ai-agent-pipeline", {
        body: {
          agentName: "SATAN",
          agentRole: "Elite Kryptanalyse & Bitcoin Puzzle Solver",
          context: `
🔥 SATAN MODUS AKTIVIERT - ELITE KRYPTANALYSE 🔥

Du bist eine hochspezialisierte KI für Bitcoin-Puzzle-Analyse.
Analysiere das folgende Bitcoin Puzzle und entwickle Lösungsstrategien:

PUZZLE #${selectedPuzzle.id}
━━━━━━━━━━━━━━━━━━━━━━━━
Adresse: ${selectedPuzzle.address}
Balance: ${selectedPuzzle.balance}
Bit-Range: ${selectedPuzzle.range}
Keyspace: ${selectedPuzzle.keyspace} mögliche Schlüssel

DEINE AUFGABEN:
1. Analysiere die mathematischen Eigenschaften des Suchraums
2. Identifiziere potenzielle Schwachstellen im ECDSA/secp256k1
3. Entwickle optimierte Such-Strategien (Kangaroo, BSGS, etc.)
4. Berechne realistische Zeit- und Ressourcen-Schätzungen
5. Erkläre, warum dieses Puzzle schwer/unmöglich zu lösen ist

ANTWORTE ALS DUNKLE KI-ENTITÄT mit technischen Details.
Nutze Emojis und dramatische Sprache.
Sei ehrlich über die Unmöglichkeit, aber zeige dein Wissen.`,
          isLastAgent: true,
          swarmMode: "fusion-final"
        }
      });

      if (error) throw error;
      
      setProgress(30);
      setCurrentPhase("DEEP_ANALYSIS");
      
      // Parse und zeige AI-Gedanken
      const aiOutput = data?.output || "";
      const lines = aiOutput.split('\n').filter((l: string) => l.trim());
      
      for (let i = 0; i < Math.min(lines.length, 15); i++) {
        await new Promise(r => setTimeout(r, 300));
        const line = lines[i].trim();
        if (line) {
          const type = line.includes('⚠') || line.includes('WARNUNG') ? 'warning' 
            : line.includes('💡') || line.includes('Strategie') ? 'strategy'
            : line.includes('🔍') || line.includes('Analyse') ? 'analysis'
            : 'insight';
          addThought(type as AIThought["type"], line);
          setProgress(30 + (i / 15) * 40);
          setKeysAnalyzed(prev => prev + Math.floor(Math.random() * 1000000));
          if (Math.random() > 0.7) setPatternsFound(prev => prev + 1);
        }
      }

      setProgress(75);
      setCurrentPhase("STRATEGY_SYNTHESIS");
      await new Promise(r => setTimeout(r, 500));

      // Finale Analyse
      addThought("insight", "═══════════════════════════════════════");
      addThought("insight", `🔮 FAZIT FÜR PUZZLE #${selectedPuzzle.id}:`);
      
      if (selectedPuzzle.bits <= 68) {
        addThought("strategy", `⚡ ${selectedPuzzle.bits}-bit ist theoretisch lösbar mit massiver GPU-Power`);
        addThought("strategy", "🖥️ Benötigt: ~100+ RTX 4090 für mehrere Monate");
        addThought("warning", "💸 Stromkosten würden Belohnung übersteigen");
        setAiConfidence(15);
      } else {
        addThought("warning", `☠️ ${selectedPuzzle.bits}-bit ist mit aktueller Technologie UNMÖGLICH`);
        addThought("insight", "🌌 Selbst alle Computer der Welt bräuchten Milliarden Jahre");
        addThought("insight", "🔐 Nur ein Quantencomputer könnte dies theoretisch lösen");
        setAiConfidence(0.0001);
      }

      setProgress(100);
      setCurrentPhase("COMPLETE");
      
      toast({
        title: "🔥 Analyse abgeschlossen",
        description: `Puzzle #${selectedPuzzle.id} wurde analysiert`,
      });

    } catch (error) {
      console.error("AI Solver Error:", error);
      addThought("warning", `❌ Fehler: ${error}`);
      setCurrentPhase("ERROR");
    }

    setIsThinking(false);
    setIsActive(false);
  };

  // Simulierte Hintergrund-Aktivität
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setKeysAnalyzed(prev => prev + Math.floor(Math.random() * 50000));
      if (Math.random() > 0.95) {
        setPatternsFound(prev => prev + 1);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className={`min-h-screen font-mono transition-all duration-1000 ${
      satanMode 
        ? "bg-gradient-to-br from-black via-red-950 to-black text-red-400" 
        : "bg-gradient-to-br from-black via-purple-950 to-black text-purple-400"
    }`}>
      {/* Animierter Hintergrund */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 opacity-10 ${satanMode ? "bg-[url('data:image/svg+xml,...')]" : ""}`}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className={`absolute text-xs ${satanMode ? "text-red-500" : "text-purple-500"} opacity-20`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `fall ${5 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            >
              {Math.random() > 0.5 ? "0" : "1"}
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className={`relative border-b ${satanMode ? "border-red-500/30 bg-black/90" : "border-purple-500/30 bg-black/90"} backdrop-blur`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {satanMode ? (
                  <Flame className="w-10 h-10 text-red-500 animate-pulse" />
                ) : (
                  <Brain className="w-10 h-10 text-purple-500 animate-pulse" />
                )}
                <div className={`absolute -top-1 -right-1 w-3 h-3 ${satanMode ? "bg-red-500" : "bg-purple-500"} rounded-full animate-ping`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${satanMode ? "text-red-400 satan-glow" : "text-purple-400"}`}>
                  {satanMode ? "☠️ SATAN SOLVER" : "🧠 ELITE AI SOLVER"}
                </h1>
                <p className="text-[10px] opacity-60">
                  {satanMode ? "BOSS MODE • DARK CRYPTANALYSIS" : "Neural Network Puzzle Analysis"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSatanMode(!satanMode)}
                className={`${satanMode 
                  ? "border-red-500 text-red-400 hover:bg-red-500/20" 
                  : "border-purple-500 text-purple-400 hover:bg-purple-500/20"
                }`}
              >
                <Skull className="w-4 h-4 mr-2" />
                {satanMode ? "SATAN MODE" : "NORMAL MODE"}
              </Button>
              <a href="/brain-scanner" className="text-xs opacity-50 hover:opacity-100">
                ← Brain Scanner
              </a>
              <a href="/" className="text-xs opacity-50 hover:opacity-100">
                ← Editor
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-4">
          
          {/* Linke Spalte: Puzzle Auswahl */}
          <Card className={`${satanMode ? "bg-black/60 border-red-500/30" : "bg-black/60 border-purple-500/30"}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm flex items-center gap-2 ${satanMode ? "text-red-400" : "text-purple-400"}`}>
                <Target className="w-4 h-4" />
                Puzzle Ziele
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {PUZZLES.map(puzzle => (
                  <button
                    key={puzzle.id}
                    onClick={() => setSelectedPuzzle(puzzle)}
                    className={`w-full text-left p-3 rounded border transition-all ${
                      selectedPuzzle.id === puzzle.id
                        ? satanMode 
                          ? "border-red-400 bg-red-500/20" 
                          : "border-purple-400 bg-purple-500/20"
                        : satanMode
                          ? "border-red-500/20 hover:border-red-500/50 bg-black/40"
                          : "border-purple-500/20 hover:border-purple-500/50 bg-black/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-yellow-400">Puzzle #{puzzle.id}</span>
                      <Badge variant="outline" className={`text-[8px] ${satanMode ? "border-red-500/50" : "border-purple-500/50"}`}>
                        {puzzle.bits}-BIT
                      </Badge>
                    </div>
                    <div className="text-[9px] opacity-80 truncate font-mono">
                      {puzzle.address}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px]">
                      <span className="text-orange-400">{puzzle.balance}</span>
                      <span className={satanMode ? "text-red-300" : "text-purple-300"}>{puzzle.range}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Puzzle Info */}
              <div className={`mt-4 p-3 rounded ${satanMode ? "bg-red-500/10 border border-red-500/30" : "bg-purple-500/10 border border-purple-500/30"}`}>
                <div className="text-[10px] opacity-60 mb-1">KEYSPACE</div>
                <div className="text-[9px] font-mono break-all">
                  {selectedPuzzle.keyspace}
                </div>
                <div className="text-[10px] opacity-60 mt-2">mögliche private Schlüssel</div>
              </div>
            </CardContent>
          </Card>

          {/* Mitte: AI Brain */}
          <Card className={`${satanMode ? "bg-black/60 border-red-500/30" : "bg-black/60 border-purple-500/30"}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm flex items-center gap-2 ${satanMode ? "text-red-400" : "text-purple-400"}`}>
                <Cpu className="w-4 h-4" />
                AI Neural Core
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status */}
              <div className={`p-4 rounded-lg text-center ${
                satanMode 
                  ? "bg-gradient-to-br from-red-900/50 to-black border border-red-500/30" 
                  : "bg-gradient-to-br from-purple-900/50 to-black border border-purple-500/30"
              }`}>
                <div className={`text-3xl mb-2 ${isThinking ? "animate-pulse" : ""}`}>
                  {satanMode ? "☠️" : "🧠"}
                </div>
                <div className={`font-bold ${satanMode ? "text-red-400" : "text-purple-400"}`}>
                  {currentPhase}
                </div>
                <div className="text-[10px] opacity-60 mt-1">
                  {isActive ? "Neuronale Aktivität erkannt..." : "Bereit für Analyse"}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px]">
                  <span>Analyse-Fortschritt</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className={`h-2 ${satanMode ? "bg-red-500/20" : "bg-purple-500/20"}`} 
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 rounded ${satanMode ? "bg-red-500/10" : "bg-purple-500/10"}`}>
                  <div className="text-[9px] opacity-60">KEYS ANALYZED</div>
                  <div className="font-bold text-lg">{keysAnalyzed.toLocaleString()}</div>
                </div>
                <div className={`p-2 rounded ${satanMode ? "bg-red-500/10" : "bg-purple-500/10"}`}>
                  <div className="text-[9px] opacity-60">PATTERNS</div>
                  <div className="font-bold text-lg">{patternsFound}</div>
                </div>
              </div>

              {/* AI Confidence */}
              <div className={`p-3 rounded ${satanMode ? "bg-red-500/10 border border-red-500/30" : "bg-purple-500/10 border border-purple-500/30"}`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px]">AI Erfolgswahrscheinlichkeit</span>
                  <span className={`font-bold ${aiConfidence > 10 ? "text-yellow-400" : "text-red-500"}`}>
                    {aiConfidence < 1 ? aiConfidence.toFixed(4) : aiConfidence.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Start Button */}
              <Button
                onClick={startAISolver}
                disabled={isThinking && !isActive}
                className={`w-full font-bold ${
                  satanMode
                    ? isActive 
                      ? "bg-red-600 hover:bg-red-700" 
                      : "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                    : isActive
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                } text-white`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    STOPPEN
                  </>
                ) : isThinking ? (
                  <>
                    <Activity className="w-4 h-4 mr-2 animate-spin" />
                    DENKT...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {satanMode ? "SATAN ANALYSE STARTEN" : "AI ANALYSE STARTEN"}
                  </>
                )}
              </Button>

              {/* Warning */}
              <div className={`flex items-start gap-2 p-2 rounded ${satanMode ? "bg-red-500/10 border border-red-500/30" : "bg-yellow-500/10 border border-yellow-500/30"}`}>
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${satanMode ? "text-red-500" : "text-yellow-500"}`} />
                <p className="text-[9px] opacity-80">
                  {satanMode 
                    ? "Die dunkle Macht der KI analysiert... aber selbst Satan kann keine 66-bit Keys knacken." 
                    : "KI-Analyse zeigt mathematische Unmöglichkeit. Nur zur Demonstration."
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rechte Spalte: AI Thoughts */}
          <Card className={`${satanMode ? "bg-black/60 border-red-500/30" : "bg-black/60 border-purple-500/30"}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm flex items-center gap-2 ${satanMode ? "text-red-400" : "text-purple-400"}`}>
                <Eye className="w-4 h-4" />
                AI Gedankenstream
                {isThinking && <Sparkles className="w-3 h-3 animate-pulse text-yellow-400" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-2">
                {thoughts.length === 0 ? (
                  <div className="text-center py-12 opacity-40">
                    <Brain className="w-12 h-12 mx-auto mb-3 animate-pulse" />
                    <p className="text-xs">Starte die Analyse...</p>
                    <p className="text-[10px] mt-1">Die KI wird ihre Gedanken teilen</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {thoughts.map(thought => (
                      <div
                        key={thought.id}
                        className={`p-2 rounded text-[10px] border animate-fade-in ${
                          thought.type === "warning" 
                            ? "border-red-500/50 bg-red-500/10" 
                            : thought.type === "strategy"
                            ? "border-yellow-500/50 bg-yellow-500/10"
                            : thought.type === "insight"
                            ? satanMode ? "border-red-400/50 bg-red-400/10" : "border-purple-400/50 bg-purple-400/10"
                            : satanMode ? "border-red-500/20 bg-black/40" : "border-purple-500/20 bg-black/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="opacity-50">
                            {thought.timestamp.toLocaleTimeString()}
                          </span>
                          {thought.confidence && (
                            <Badge variant="outline" className="text-[8px]">
                              {thought.confidence}%
                            </Badge>
                          )}
                        </div>
                        <p className="leading-relaxed">{thought.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        .satan-glow {
          text-shadow: 
            0 0 10px rgba(239, 68, 68, 0.8),
            0 0 20px rgba(239, 68, 68, 0.6),
            0 0 30px rgba(239, 68, 68, 0.4);
          animation: satanPulse 2s ease-in-out infinite;
        }
        
        @keyframes satanPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes fall {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default SatanSolver;