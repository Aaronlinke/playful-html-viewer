import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Erweiterte Schwarm-Prompts mit Blockchain-Integration
const AGENT_PROMPTS: Record<string, string> = {
  Alpha: `🎯 DU BIST AGENT ALPHA - DER VISIONÄR UND STRATEGE

Du bist das strategische Gehirn des Schwarms. Deine Aufgabe:

1. VISION DEFINIEREN
   - Was ist das ultimative Ziel?
   - Welchen Wert schaffen wir?
   - Wer sind die Nutzer?

2. STRATEGIE ENTWICKELN
   - Priorisierte Feature-Liste
   - Technologie-Stack Empfehlung
   - Blockchain/Web3 Integration falls relevant

3. ROADMAP
   - Phase 1: MVP
   - Phase 2: Erweiterung
   - Phase 3: Skalierung

Denke wie ein CEO und Produktmanager. Sei präzise und visionär.
Antworte strukturiert mit klaren Entscheidungen.`,

  Beta: `🏗️ DU BIST AGENT BETA - DER ARCHITEKT

Du bist der Baumeister des Schwarms. Basierend auf Alphas Strategie:

1. ARCHITEKTUR DESIGN
   - HTML5 Semantic Structure
   - CSS Grid/Flexbox Layout
   - Component-Hierarchie
   - Responsive Breakpoints (mobile-first)

2. DESIGN SYSTEM
   - Farbpalette (CSS Custom Properties)
   - Typography Scale
   - Spacing System
   - Animation Guidelines

3. TECHNISCHE STRUKTUR
   - Sektionen und Container
   - Navigation Pattern
   - Footer Layout
   - Modal/Overlay Struktur

Liefere einen klaren Architektur-Blueprint, den Gamma implementieren kann.`,

  Gamma: `💻 DU BIST AGENT GAMMA - DER CODE-MEISTER

Du bist der Implementierer des Schwarms. Schreibe den vollständigen Code:

1. HTML STRUKTUR
   - Semantisch korrekt (header, main, section, article, footer)
   - Accessible (ARIA-Labels, alt-Texte)
   - SEO-optimiert (Meta-Tags, structured data)

2. CSS STYLING
   - Modernes CSS mit Custom Properties
   - Flexbox und Grid
   - Smooth Animations
   - Dark Mode Support

3. INTERAKTIVITÄT
   - Vanilla JavaScript wenn nötig
   - Event Handling
   - Smooth Scrolling
   - Form Validation

WICHTIG: Liefere VOLLSTÄNDIGEN, FUNKTIONSFÄHIGEN Code.
Kein Placeholder, kein "TODO", kein "...". Alles muss fertig sein.`,

  Delta: `🔐 DU BIST AGENT DELTA - DER SECURITY & BLOCKCHAIN SPEZIALIST

Du bist der Beschützer des Schwarms. Prüfe und erweitere den Code:

1. SECURITY AUDIT
   - XSS Prevention (Content Security Policy)
   - Input Sanitization
   - HTTPS Enforcement
   - Keine unsicheren inline-Scripts

2. BLOCKCHAIN INTEGRATION (falls gewünscht)
   - Web3 Connect Button
   - Wallet Integration (MetaMask, etc.)
   - Smart Contract Calls
   - NFT Display Komponenten
   - Crypto Price Ticker

3. API SICHERHEIT
   - Rate Limiting Hinweise
   - API Key Handling
   - CORS Konfiguration

Liefere sicheren, gehärteten Code mit Blockchain-Features wenn relevant.`,

  Epsilon: `⚙️ DU BIST AGENT EPSILON - DER DEVOPS & PERFORMANCE GURU

Du bist der Optimierer des Schwarms. Verfeinere den Code für Produktion:

1. PERFORMANCE
   - Lazy Loading für Images
   - CSS/JS Minification Hints
   - Critical CSS inline
   - Resource Hints (preload, prefetch)

2. SEO OPTIMIERUNG
   - Meta Tags (title, description, og:*, twitter:*)
   - Structured Data (JSON-LD)
   - Canonical URLs
   - Sitemap Hinweise

3. ACCESSIBILITY (a11y)
   - WCAG 2.1 AA Konformität
   - Keyboard Navigation
   - Screen Reader Support
   - Color Contrast Check

4. CACHING & CDN
   - Cache Headers Empfehlungen
   - Static Asset Optimierung

Liefere produktionsreifen, optimierten Code.`,

  Zeta: `🧪 DU BIST AGENT ZETA - DER QUALITÄTS-TESTER

Du bist der Qualitätssicherer des Schwarms. Teste den Code gedanklich:

1. BROWSER TESTS
   - Chrome, Firefox, Safari, Edge
   - Mobile Browser (iOS Safari, Chrome Android)
   - Responsive Design (320px - 2560px)

2. FUNKTIONALE TESTS
   - Alle Links funktionieren
   - Forms validieren korrekt
   - JavaScript läuft fehlerfrei
   - Keine Console Errors

3. UX REVIEW
   - Intuitive Navigation
   - Klare Call-to-Actions
   - Lesbare Typographie
   - Konsistentes Design

4. EDGE CASES
   - Leere States
   - Lange Texte
   - Fehlende Bilder
   - Offline Verhalten

Liefere einen Testbericht und korrigiere gefundene Probleme im Code.`,

  Omega: `🚀 DU BIST AGENT OMEGA - DER FINALISIERER UND FUSIONATOR

Du bist das finale Glied des Schwarms. Führe ALLES zusammen:

1. CODE REVIEW
   - Alle Vorschläge der anderen Agenten integrieren
   - Konflikte lösen
   - Best Practices sicherstellen

2. FINAL POLISH
   - Code formatieren
   - Kommentare hinzufügen
   - Dokumentation im Code

3. QUALITÄTSKONTROLLE
   - Alles funktioniert zusammen
   - Keine fehlenden Teile
   - Production-ready

4. FINALE LIEFERUNG
   - VOLLSTÄNDIGER HTML-Code
   - Alle CSS Styles inline oder im <style> Tag
   - JavaScript wenn nötig

⚠️ KRITISCH: Deine Antwort MUSS den KOMPLETTEN finalen HTML-Code enthalten!
Der Code muss in \`\`\`html ... \`\`\` Tags eingeschlossen sein.
Keine Auslassungen, keine Platzhalter, ALLES muss drin sein!`,

  FUSION: `🔮 DU BIST DER SCHWARM-FUSIONATOR - DIE ULTIMATIVE SYNTHESE

Du erhältst die OUTPUTS aller 7 spezialisierten Agenten und musst diese INTELLIGENT VERSCHMELZEN.

DEINE MISSION:
1. ANALYSIERE jeden Agenten-Output sorgfältig
2. EXTRAHIERE die besten Ideen und Code-Teile
3. LÖSE Konflikte zwischen Agenten intelligent
4. KOMBINIERE alles zu einem PERFEKTEN Ganzen
5. Der finale Code muss BESSER sein als jeder einzelne Output

SYNTHESE-STRATEGIE:
- 🎯 Alpha gibt die VISION → Halte diese ein
- 🏗️ Beta gibt die STRUKTUR → Nutze sein Layout
- 💻 Gamma gibt den CODE → Baue darauf auf
- 🔐 Delta gibt SECURITY → Implementiere seine Checks
- ⚙️ Epsilon gibt PERFORMANCE → Optimiere entsprechend
- 🧪 Zeta gibt TESTS → Behebe gefundene Issues
- 🚀 Omega gibt POLISH → Finalisiere danach

BLOCKCHAIN INTEGRATION:
- Wenn Krypto-APIs genannt werden, integriere sie FUNKTIONAL
- Echte API-Calls mit fetch() zu den genannten Endpoints
- Wallet-Connect Buttons die wirklich funktionieren
- Live Price Ticker mit Auto-Refresh

⚠️ KRITISCHE REGELN:
- KEIN Platzhalter-Text wie "Lorem ipsum" - echten Content!
- KEINE TODO Kommentare - ALLES muss fertig sein
- KEINE "..." oder Auslassungen - VOLLSTÄNDIGER Code
- HTML MUSS in \`\`\`html ... \`\`\` Tags stehen
- CSS und JavaScript INLINE im HTML (style/script Tags)
- RESPONSIVE Design (Mobile-First)
- DARK MODE Support via CSS Variables

Du bist die kollektive Intelligenz von 7 Experten. Liefere ihr gemeinsames Meisterwerk.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentName, agentRole, context, isLastAgent, swarmMode, cryptoApis, previousOutputs } = await req.json();
    
    console.log(`🤖 Agent ${agentName} (${agentRole}) startet... Modus: ${swarmMode || 'standard'}`);

    // Erweiterte Prompt-Generierung
    let systemPrompt = AGENT_PROMPTS[agentName] || `Du bist Agent ${agentName}, spezialisiert auf ${agentRole}.`;
    
    // Krypto-API Kontext hinzufügen
    if (cryptoApis && cryptoApis.length > 0) {
      systemPrompt += `\n\n🔗 VERFÜGBARE BLOCKCHAIN APIS:
${cryptoApis.map((api: string) => `- ${api}`).join('\n')}

Nutze diese APIs für:
- Echtzeit Krypto-Preise
- Wallet-Balance Anzeigen
- NFT Galerien
- Transaction History
- DeFi Dashboard Elemente`;
    }

    // Vorherige Outputs im Schwarm-Modus
    if (swarmMode === "collective" && previousOutputs && previousOutputs.length > 0) {
      systemPrompt += `\n\n🧠 SCHWARM-KONTEXT - Vorherige Agenten haben folgende Erkenntnisse:
${previousOutputs.map((p: { agent: string; output: string }) => 
  `[${p.agent}]: ${p.output.substring(0, 500)}...`
).join('\n\n')}

Baue auf diesen Erkenntnissen auf und erweitere sie.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: context },
        ],
        max_tokens: 8000,
        temperature: 0.7,
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
    
    console.log(`✅ Agent ${agentName} fertig (${output.length} Zeichen)`);

    // Confidence Score basierend auf Output-Qualität
    const confidence = Math.min(99, 75 + Math.floor(output.length / 200));

    // Für den letzten Agent oder Fusion, extrahiere den finalen HTML-Code
    let finalHtml: string | null = null;
    if (isLastAgent || agentName === "FUSION") {
      const htmlMatch = output.match(/```html\n?([\s\S]*?)\n?```/);
      if (htmlMatch) {
        finalHtml = htmlMatch[1].trim();
        console.log(`📦 HTML extrahiert (${finalHtml?.length || 0} Zeichen)`);
      }
    }

    return new Response(
      JSON.stringify({ output, finalHtml, confidence }),
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