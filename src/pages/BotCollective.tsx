import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  Bot, Brain, Send, Sparkles, MessageSquare, 
  ArrowRight, Home, Cpu, Network, Activity,
  Database, Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { ALL_BOTS, BOT_GROUPS, BOT_COUNT, type BotResponse } from "@/data/bots-registry";

// ===== BOT MEMORY =====
interface BotMemoryEntry {
  query: string;
  topBots: string[];
  timestamp: number;
}

interface BotMemoryStore {
  entries: BotMemoryEntry[];
  learnedFacts: Record<string, string[]>;
  queryCount: number;
}

const MEMORY_KEY = "bot-collective-memory";

function loadMemory(): BotMemoryStore {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { entries: [], learnedFacts: {}, queryCount: 0 };
}

function saveMemory(mem: BotMemoryStore) {
  try {
    // Keep last 100 entries
    mem.entries = mem.entries.slice(-100);
    localStorage.setItem(MEMORY_KEY, JSON.stringify(mem));
  } catch {}
}

function recordQuery(query: string, results: BotResponse[]) {
  const mem = loadMemory();
  const topBots = results
    .filter(r => r.matched)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5)
    .map(r => r.bot);
  
  mem.entries.push({ query, topBots, timestamp: Date.now() });
  mem.queryCount++;
  
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  words.forEach(word => {
    if (!mem.learnedFacts[word]) mem.learnedFacts[word] = [];
    topBots.forEach(botId => {
      if (!mem.learnedFacts[word].includes(botId)) {
        mem.learnedFacts[word].push(botId);
      }
    });
    mem.learnedFacts[word] = mem.learnedFacts[word].slice(0, 5);
  });
  
  saveMemory(mem);
  return mem;
}

// ===== TYPES =====
interface Message {
  id: string;
  type: "user" | "bot" | "collective";
  content: string;
  bot?: string;
  confidence?: number;
  timestamp: Date;
}

export default function BotCollective() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeBots, setActiveBots] = useState<Record<string, boolean>>(
    Object.keys(ALL_BOTS).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );
  const [collectiveMode, setCollectiveMode] = useState(true);
  const [memory, setMemory] = useState<BotMemoryStore>(loadMemory);

  const activeBotCount = Object.values(activeBots).filter(Boolean).length;

  const processWithCollective = useCallback((userInput: string): BotResponse[] => {
    const results: BotResponse[] = [];
    Object.entries(ALL_BOTS).forEach(([id, bot]) => {
      if (activeBots[id]) {
        results.push(bot.analyze(userInput));
      }
    });
    return results;
  }, [activeBots]);

  const synthesizeCollective = (results: BotResponse[]): string => {
    if (results.length === 0) return "Keine aktiven Bots verfügbar.";
    
    const sorted = [...results].sort((a, b) => b.confidence - a.confidence);
    
    // Split into bots with specific matches vs default responses
    const specific = sorted.filter(r => r.responses.length > 1);
    const defaults = sorted.filter(r => r.responses.length === 1);
    
    let synthesis = `🤖 **KOLLEKTIV-SYNTHESE** (${results.length} BOTS AKTIV)\n\n`;
    
    if (specific.length > 0) {
      // Group specific results by bot group
      const groups: Record<string, BotResponse[]> = {};
      specific.forEach(result => {
        const bot = ALL_BOTS[result.bot];
        if (bot) {
          if (!groups[bot.group]) groups[bot.group] = [];
          groups[bot.group].push(result);
        }
      });
      
      Object.entries(groups).forEach(([groupId, groupResults]) => {
        const group = BOT_GROUPS[groupId];
        if (group) {
          synthesis += `\n**${group.name}**:\n`;
          groupResults.forEach(result => {
            const bot = ALL_BOTS[result.bot];
            synthesis += `${bot.emoji} **${bot.name}** (${(result.confidence * 100).toFixed(0)}%):\n`;
            result.responses.forEach(r => {
              synthesis += `  ${r}\n`;
            });
            synthesis += `\n`;
          });
        }
      });
    } else {
      // No specific matches - show all active bots' default responses
      synthesis += `📡 **Alle ${results.length} Bots bereit** - kein spezifischer Treffer.\n`;
      synthesis += `Versuche spezifischere Keywords wie: Bitcoin, Ethereum, DeFi, Mining, Lightning, Staking, NFT, Privacy, Smart Contract, Bridge...\n\n`;
      
      // Show a few defaults as hints
      synthesis += `**Aktive Spezialisten:**\n`;
      defaults.slice(0, 8).forEach(result => {
        const bot = ALL_BOTS[result.bot];
        synthesis += `${bot.emoji} ${bot.name}: ${bot.specialty}\n`;
      });
      synthesis += `... und ${Math.max(0, defaults.length - 8)} weitere\n`;
    }
    
    // Memory context
    const mem = loadMemory();
    if (mem.queryCount > 0) {
      synthesis += `\n💾 **Bot-Gedächtnis**: ${mem.queryCount} Anfragen gespeichert, ${Object.keys(mem.learnedFacts).length} Keywords gelernt`;
    }
    
    const avgConfidence = sorted.reduce((sum, r) => sum + r.confidence, 0) / sorted.length;
    synthesis += `\n🎯 **Kollektive Konfidenz: ${(avgConfidence * 100).toFixed(1)}%** | **${results.length}/${BOT_COUNT} Bots aktiv**`;
    
    return synthesis;
  };

  const handleSubmit = async () => {
    if (!input.trim() || isProcessing) return;
    
    const userInput = input;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: userInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const results = processWithCollective(userInput);
    
    // Record to memory
    const updatedMem = recordQuery(userInput, results);
    setMemory(updatedMem);
    
    if (collectiveMode) {
      const synthesis = synthesizeCollective(results);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: "collective",
        content: synthesis,
        confidence: results.reduce((sum, r) => sum + r.confidence, 0) / results.length,
        timestamp: new Date()
      }]);
    } else {
      // Show only bots with specific answers, plus top 3 defaults
      const specific = results.filter(r => r.responses.length > 1);
      const toShow = specific.length > 0 ? specific : results.slice(0, 5);
      
      toShow.forEach((result, index) => {
        setMessages(prev => [...prev, {
          id: (Date.now() + index + 1).toString(),
          type: "bot",
          content: result.responses.join("\n"),
          bot: result.bot,
          confidence: result.confidence,
          timestamp: new Date()
        }]);
      });
    }
    
    setIsProcessing(false);
  };

  const toggleGroup = (groupId: string) => {
    const botsInGroup = Object.entries(ALL_BOTS)
      .filter(([_, bot]) => bot.group === groupId)
      .map(([id]) => id);
    
    const allActive = botsInGroup.every(id => activeBots[id]);
    setActiveBots(prev => {
      const newState = { ...prev };
      botsInGroup.forEach(id => { newState[id] = !allActive; });
      return newState;
    });
  };

  const clearMemory = () => {
    localStorage.removeItem(MEMORY_KEY);
    setMemory({ entries: [], learnedFacts: {}, queryCount: 0 });
  };

  const [showBotPanel, setShowBotPanel] = useState(false);
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 p-2 sm:p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-3 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/">
              <Button variant="outline" size="sm" className="border-purple-500/50 h-8 text-xs sm:text-sm">
                <Home className="w-3.5 h-3.5 sm:mr-2" /><span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Link to="/brain-wallet">
              <Button variant="outline" size="sm" className="border-cyan-500/50 h-8 text-xs sm:text-sm">
                <Brain className="w-3.5 h-3.5 sm:mr-2" /><span className="hidden sm:inline">Brain Scanner</span>
              </Button>
            </Link>
            <Badge className="bg-green-500/20 text-green-400 px-2 py-1 text-xs sm:text-sm sm:hidden">
              {activeBotCount}/{BOT_COUNT}
            </Badge>
          </div>
          
          <div className="text-left sm:text-center flex-1">
            <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-amber-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-purple-400" />
              BOT KOLLEKTIV {BOT_COUNT}
            </h1>
            <p className="text-gray-400 text-[10px] sm:text-sm">{BOT_COUNT} Bots • 6 Gruppen • Bot-Gedächtnis</p>
          </div>
          
          <Badge className="hidden sm:flex bg-green-500/20 text-green-400 px-4 py-2 text-lg">
            {activeBotCount}/{BOT_COUNT} AKTIV
          </Badge>
        </div>

        {/* Mobile toggle buttons */}
        <div className="flex gap-2 mt-2 sm:hidden">
          <Button 
            variant={showBotPanel ? "default" : "outline"} 
            size="sm" className="flex-1 h-8 text-xs"
            onClick={() => { setShowBotPanel(!showBotPanel); setShowStats(false); }}
          >
            <Bot className="w-3.5 h-3.5 mr-1" />Bots ({activeBotCount})
          </Button>
          <Button 
            variant={showStats ? "default" : "outline"} 
            size="sm" className="flex-1 h-8 text-xs"
            onClick={() => { setShowStats(!showStats); setShowBotPanel(false); }}
          >
            <Activity className="w-3.5 h-3.5 mr-1" />Stats
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4">
        {/* Bot-Panel Links - mobile: collapsible */}
        <div className={`${showBotPanel ? 'block' : 'hidden'} sm:block sm:col-span-3 space-y-2`}>
          <Card className="bg-gray-800/50 border-purple-500/30 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold text-sm">Kollektiv-Modus</span>
              <Switch checked={collectiveMode} onCheckedChange={setCollectiveMode} />
            </div>
            <p className="text-xs text-gray-400">
              {collectiveMode ? "Alle Bots antworten zusammen" : "Einzelne Bot-Antworten"}
            </p>
          </Card>

          {/* Memory Card */}
          <Card className="bg-gray-800/50 border-amber-500/30 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span className="text-white font-bold text-sm">Bot-Gedächtnis</span>
              </div>
              <Button variant="ghost" size="sm" onClick={clearMemory} className="h-6 w-6 p-0 text-gray-500 hover:text-red-400">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Anfragen:</span>
                <span className="text-amber-400">{memory.queryCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Keywords gelernt:</span>
                <span className="text-amber-400">{Object.keys(memory.learnedFacts).length}</span>
              </div>
            </div>
          </Card>

          {/* Bot Groups */}
          <ScrollArea className="h-[50vh] sm:h-[calc(100vh-380px)]">
            <div className="space-y-2 pr-2">
              {Object.entries(BOT_GROUPS).map(([groupId, group]) => {
                const botsInGroup = Object.entries(ALL_BOTS).filter(([_, bot]) => bot.group === groupId);
                const activeInGroup = botsInGroup.filter(([id]) => activeBots[id]).length;
                
                return (
                  <Card key={groupId} className="bg-gray-800/50 border-gray-700 p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${group.color}`} />
                        <span className="text-white font-semibold text-xs">{group.name}</span>
                      </div>
                      <Badge className="bg-gray-700 text-gray-300 text-[10px] px-1.5 py-0">
                        {activeInGroup}/{botsInGroup.length}
                      </Badge>
                    </div>
                    
                    <Button 
                      variant="outline" size="sm" 
                      className="w-full text-[10px] h-6 mb-1 border-gray-600"
                      onClick={() => toggleGroup(groupId)}
                    >
                      {activeInGroup === botsInGroup.length ? "Alle aus" : "Alle an"}
                    </Button>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-0.5">
                      {botsInGroup.map(([id, bot]) => (
                        <div
                          key={id}
                          className={`flex items-center justify-between p-1.5 sm:p-1 rounded cursor-pointer transition-all text-[11px] ${
                            activeBots[id] 
                              ? `bg-gradient-to-r ${bot.color} bg-opacity-20` 
                              : "bg-gray-700/30 opacity-40"
                          }`}
                          onClick={() => setActiveBots(prev => ({ ...prev, [id]: !prev[id] }))}
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-xs">{bot.emoji}</span>
                            <span className="text-white font-medium">{bot.name}</span>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${activeBots[id] ? "bg-green-400" : "bg-gray-600"}`} />
                        </div>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Mitte */}
        <div className="sm:col-span-6">
          <Card className="bg-gray-800/50 border-purple-500/30 h-[calc(100vh-200px)] sm:h-[calc(100vh-180px)] flex flex-col">
            <div className="p-2 sm:p-3 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <span className="text-white font-bold text-sm">Kollektiv-Chat</span>
              </div>
              <Badge className={`text-[10px] sm:text-xs ${collectiveMode ? "bg-purple-500" : "bg-gray-600"}`}>
                {collectiveMode ? "KOLLEKTIV" : "EINZELN"}
              </Badge>
            </div>

            <ScrollArea className="flex-1 p-3 sm:p-4">
              <div className="space-y-3 sm:space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-6 sm:py-10 text-gray-500">
                    <Bot className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
                    <p className="text-sm sm:text-lg">{BOT_COUNT} Bots warten auf deine Frage...</p>
                    <p className="text-xs sm:text-sm mt-2">Bitcoin, Ethereum, DeFi, Layer 2, Bridges, Staking...</p>
                    {memory.queryCount > 0 && (
                      <p className="text-[10px] sm:text-xs mt-2 text-amber-400/60">💾 {memory.queryCount} gespeicherte Anfragen</p>
                    )}
                    {/* Mobile example queries */}
                    <div className="mt-4 flex flex-wrap gap-1.5 justify-center sm:hidden">
                      {["Bitcoin Puzzle #66", "Lightning Network", "DeFi Staking", "ZK Proofs"].map((q, i) => (
                        <Button key={i} variant="outline" size="sm"
                          className="text-[10px] h-7 px-2 border-gray-600 text-gray-400"
                          onClick={() => setInput(q)}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`${
                      message.type === "user"
                        ? "ml-auto bg-blue-600 max-w-[90%] sm:max-w-[80%]"
                        : message.type === "collective"
                        ? "bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30"
                        : "bg-gray-700/50"
                    } rounded-lg p-2.5 sm:p-3`}
                  >
                    {message.type !== "user" && (
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        {message.type === "collective" ? (
                          <>
                            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                            <span className="text-purple-400 font-bold text-xs sm:text-sm">KOLLEKTIV</span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm">{ALL_BOTS[message.bot!]?.emoji}</span>
                            <span className="text-white font-bold text-xs sm:text-sm">
                              {ALL_BOTS[message.bot!]?.name}
                            </span>
                          </>
                        )}
                        {message.confidence && (
                          <Badge className="bg-green-500/20 text-green-400 text-[10px] sm:text-xs ml-auto">
                            {(message.confidence * 100).toFixed(0)}%
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="text-white text-xs sm:text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }} />
                        ))}
                      </div>
                      <span className="text-gray-400 text-xs sm:text-sm">{activeBotCount} Bots analysieren...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-2 sm:p-3 border-t border-gray-700">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Frage das ${BOT_COUNT}-Bot-Kollektiv...`}
                  className="bg-gray-900 border-gray-600 text-white resize-none text-sm min-h-[44px]"
                  rows={1}
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
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-4 sm:px-6 h-auto min-h-[44px]"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Rechte Seite - mobile: collapsible */}
        <div className={`${showStats ? 'block' : 'hidden'} sm:block sm:col-span-3 space-y-3`}>
          {/* Network Visualization */}
          <Card className="bg-gray-800/50 border-amber-500/30 p-3">
            <div className="text-center mb-2">
              <Network className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-amber-400 mb-1" />
              <span className="text-white font-bold text-xs sm:text-sm">Netzwerk Status</span>
            </div>
            
            <div className="relative h-36 sm:h-44 bg-gray-900/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                    <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  {Object.entries(ALL_BOTS).slice(0, 16).map(([id, bot], i) => {
                    const angle = (i / 16) * 2 * Math.PI;
                    const radius = 55;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    return (
                      <div key={id}
                        className={`absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[9px] transition-all ${
                          activeBots[id] ? `bg-gradient-to-r ${bot.color}` : "bg-gray-700 opacity-30"
                        }`}
                        style={{ left: `calc(50% + ${x}px - 8px)`, top: `calc(50% + ${y}px - 8px)` }}
                      >
                        {bot.emoji}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Stats */}
          <Card className="bg-gray-800/50 border-cyan-500/30 p-3">
            <div className="text-white font-bold mb-2 flex items-center gap-2 text-xs sm:text-sm">
              <Activity className="w-4 h-4 text-cyan-400" />
              Live Statistiken
            </div>
            <div className="space-y-1.5 text-xs">
              {Object.entries(BOT_GROUPS).map(([groupId, group]) => {
                const botsInGroup = Object.entries(ALL_BOTS).filter(([_, b]) => b.group === groupId);
                const activeCount = botsInGroup.filter(([id]) => activeBots[id]).length;
                return (
                  <div key={groupId} className="flex justify-between">
                    <span className="text-gray-400">{group.name}:</span>
                    <span className="text-gray-300">{activeCount}/{botsInGroup.length}</span>
                  </div>
                );
              })}
              <div className="border-t border-gray-700 pt-1.5 mt-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-300">Total:</span>
                  <span className="text-green-400">{activeBotCount}/{BOT_COUNT}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Example Queries */}
          <Card className="bg-gray-800/50 border-green-500/30 p-3">
            <div className="text-white font-bold mb-2 text-xs">Beispiel-Fragen:</div>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
              {[
                "Bitcoin Puzzle #66 analysieren",
                "Lightning Network erklären",
                "Ethereum Gas Fees",
                "DeFi Staking Vergleich",
                "Cross-Chain Bridges Risiken",
                "Zero Knowledge Proofs"
              ].map((q, i) => (
                <Button key={i} variant="ghost" size="sm"
                  className="w-full justify-start text-[10px] sm:text-[11px] text-gray-400 hover:text-white hover:bg-gray-700 h-7 px-2"
                  onClick={() => setInput(q)}
                >
                  <ArrowRight className="w-3 h-3 mr-1 shrink-0" /><span className="truncate">{q}</span>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
