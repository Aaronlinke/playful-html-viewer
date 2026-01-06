import { useState } from "react";
import { Bot, Send, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
interface AgentStep {
  agent: string;
  emoji: string;
  status: "pending" | "running" | "done" | "error";
  output?: string;
}

const AGENTS = [
  { name: "Alpha", role: "Strategie", emoji: "🎯" },
  { name: "Beta", role: "Architektur", emoji: "🏗️" },
  { name: "Gamma", role: "Code", emoji: "💻" },
  { name: "Delta", role: "Security", emoji: "🔒" },
  { name: "Epsilon", role: "DevOps", emoji: "⚙️" },
  { name: "Zeta", role: "Testing", emoji: "🧪" },
  { name: "Omega", role: "Finalisierung", emoji: "🚀" },
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

  const runAgentPipeline = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    setSteps(AGENTS.map(a => ({ agent: `${a.name} (${a.role})`, emoji: a.emoji, status: "pending" })));

    let context = `Aufgabe: ${prompt}\n\nAktueller HTML-Code:\n${currentHtml}`;

    for (let i = 0; i < AGENTS.length; i++) {
      const agent = AGENTS[i];
      
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
          },
        });

        if (error) {
          // Check for specific error types
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

        // Check for error in data response
        if (data?.error) {
          const errorMsg = data.error;
          if (errorMsg.includes("402") || errorMsg.includes("credits")) {
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
          throw new Error(errorMsg);
        }

        const output = data?.output || "Keine Ausgabe";
        context = `${context}\n\n${agent.name} (${agent.role}):\n${output}`;

        setSteps(prev => prev.map((s, idx) => 
          idx === i ? { ...s, status: "done", output } : s
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
          title: "Pipeline-Fehler",
          description: `Agent ${agent.name} ist fehlgeschlagen.`,
          variant: "destructive",
        });
        break;
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
        <Bot className="w-5 h-5 text-primary" />
        <span className="font-semibold text-foreground">KI Multi-Agent Pipeline</span>
      </div>

      <ScrollArea className="flex-1 p-4">
        {steps.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-sm">Beschreibe deine Anforderungen und die Agenten werden der Reihe nach arbeiten:</p>
            <div className="mt-4 space-y-1 text-xs">
              {AGENTS.map((a, i) => (
                <div key={a.name} className="flex items-center gap-2 justify-center">
                  <span>{a.emoji}</span>
                  <span className="font-mono">{a.name}</span>
                  <span className="text-muted-foreground/60">({a.role})</span>
                  {i < AGENTS.length - 1 && <span className="text-muted-foreground/40 ml-1">→</span>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className={`rounded-lg border transition-colors ${
                  step.status === "running" 
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
                  className="w-full flex items-center gap-3 p-3"
                >
                  <span className="text-lg">{step.emoji}</span>
                  <span className="font-mono text-sm flex-1 text-left">{step.agent}</span>
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
                  <div className="px-3 pb-3">
                    <pre className="text-xs bg-editor p-2 rounded overflow-x-auto whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {step.output}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Was soll die KI-Pipeline erstellen? z.B. 'Erstelle eine Landing Page für ein Startup'"
          className="resize-none mb-2 bg-editor"
          rows={3}
          disabled={isProcessing}
        />
        <Button 
          onClick={runAgentPipeline} 
          disabled={isProcessing || !prompt.trim()}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Pipeline läuft...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Pipeline starten
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AiAgentPanel;
