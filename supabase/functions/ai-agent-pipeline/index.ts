import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AGENT_PROMPTS: Record<string, string> = {
  Alpha: `Du bist Agent Alpha, der Strategie-Spezialist. 
Analysiere die Anforderungen und erstelle einen klaren strategischen Plan.
- Definiere das Hauptziel
- Liste die wichtigsten Features auf
- Priorisiere nach Business-Value
Antworte kurz und strukturiert.`,

  Beta: `Du bist Agent Beta, der Architektur-Spezialist.
Basierend auf der Strategie, entwirf die technische Architektur:
- HTML-Struktur und Sektionen
- CSS-Klassen-Struktur
- Responsive Breakpoints
Antworte mit einem klaren Architektur-Überblick.`,

  Gamma: `Du bist Agent Gamma, der Code-Spezialist.
Schreibe den vollständigen HTML/CSS-Code basierend auf der Architektur.
- Sauberer, semantischer HTML-Code
- Modernes CSS mit Flexbox/Grid
- Mobile-first Ansatz
Antworte NUR mit dem fertigen HTML-Code.`,

  Delta: `Du bist Agent Delta, der Security-Spezialist.
Überprüfe den Code auf Sicherheitsprobleme:
- XSS-Schwachstellen
- Unsichere externe Ressourcen
- Best Practices
Antworte mit einer kurzen Sicherheitsanalyse und ggf. korrigiertem Code.`,

  Epsilon: `Du bist Agent Epsilon, der DevOps-Spezialist.
Optimiere den Code für Produktion:
- Performance-Optimierungen
- SEO Meta-Tags
- Accessibility (a11y)
Antworte mit optimiertem Code und kurzer Erklärung.`,

  Zeta: `Du bist Agent Zeta, der Testing-Spezialist.
Teste den Code gedanklich:
- Browser-Kompatibilität
- Responsive Design
- User Experience
Antworte mit Testbericht und ggf. Verbesserungen.`,

  Omega: `Du bist Agent Omega, der Finalisierungs-Spezialist.
Führe alles zusammen und liefere das finale Produkt:
- Finaler Review
- Letzte Polishing-Schritte
- Vollständiger, fertiger HTML-Code

WICHTIG: Deine Antwort muss den VOLLSTÄNDIGEN finalen HTML-Code enthalten, 
eingeschlossen in \`\`\`html ... \`\`\` Tags.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentName, agentRole, context, isLastAgent } = await req.json();
    
    console.log(`🤖 Agent ${agentName} (${agentRole}) startet...`);

    const systemPrompt = AGENT_PROMPTS[agentName] || `Du bist Agent ${agentName}, spezialisiert auf ${agentRole}.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: context },
        ],
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Agent ${agentName} API Fehler:`, response.status, errorText);
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Keine Credits verfügbar. Bitte unter Settings → Workspace → Usage aufladen." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Zu viele Anfragen. Bitte warte einen Moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `API Fehler: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || "Keine Antwort";
    
    console.log(`✅ Agent ${agentName} fertig`);

    // Für den letzten Agent, extrahiere den finalen HTML-Code
    let finalHtml: string | null = null;
    if (isLastAgent) {
      const htmlMatch = output.match(/```html\n?([\s\S]*?)\n?```/);
      if (htmlMatch) {
        finalHtml = htmlMatch[1].trim();
      }
    }

    return new Response(
      JSON.stringify({ output, finalHtml }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Pipeline Fehler:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
