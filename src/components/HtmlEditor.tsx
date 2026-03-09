import { useState, useCallback, useEffect } from "react";
import { Code2, Play, Copy, Trash2, FileCode, Download, Plus, X, Bot, Menu, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import AiAgentPanel from "./AiAgentPanel";

interface Tab {
  id: string;
  name: string;
  content: string;
}

const STORAGE_KEY = "html-viewer-tabs";
const ACTIVE_TAB_KEY = "html-viewer-active-tab";

const defaultHtml = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Meine Seite</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.2rem;
      opacity: 0.9;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>👋 Willkommen!</h1>
    <p>Bearbeite diesen HTML-Code und sieh die Vorschau live.</p>
  </div>
</body>
</html>`;

const loadTabsFromStorage = (): Tab[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Fehler beim Laden der Tabs:", e);
  }
  return [{ id: "1", name: "index.html", content: defaultHtml }];
};

const loadActiveTabFromStorage = (tabs: Tab[]): string => {
  try {
    const stored = localStorage.getItem(ACTIVE_TAB_KEY);
    if (stored && tabs.some(t => t.id === stored)) {
      return stored;
    }
  } catch (e) {
    console.error("Fehler beim Laden des aktiven Tabs:", e);
  }
  return tabs[0]?.id || "1";
};

const HtmlEditor = () => {
  const [tabs, setTabs] = useState<Tab[]>(() => loadTabsFromStorage());
  const [activeTabId, setActiveTabId] = useState(() => loadActiveTabFromStorage(tabs));
  const [previewKey, setPreviewKey] = useState(0);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [mobileView, setMobileView] = useState<"editor" | "preview" | "ai">("editor");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
  }, [tabs]);

  useEffect(() => {
    localStorage.setItem(ACTIVE_TAB_KEY, activeTabId);
  }, [activeTabId]);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  const handleRun = useCallback(() => {
    setPreviewKey((prev) => prev + 1);
    if (isMobile) setMobileView("preview");
    toast({ title: "HTML aktualisiert", description: "Vorschau neu geladen." });
  }, [isMobile]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(activeTab.content);
    toast({ title: "Kopiert!", description: "HTML-Code in Zwischenablage." });
  }, [activeTab.content]);

  const handleClear = useCallback(() => {
    setTabs(prev => prev.map(t => 
      t.id === activeTabId ? { ...t, content: "" } : t
    ));
    setPreviewKey((prev) => prev + 1);
  }, [activeTabId]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([activeTab.content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeTab.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Download gestartet", description: `${activeTab.name} wird heruntergeladen.` });
  }, [activeTab]);

  const handleOpenInBrowser = useCallback(() => {
    const blob = new Blob([activeTab.content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }, [activeTab.content]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          const newTab: Tab = {
            id: Date.now().toString() + Math.random(),
            name: file.name,
            content
          };
          setTabs(prev => [...prev, newTab]);
          setActiveTabId(newTab.id);
          setPreviewKey((prev) => prev + 1);
          toast({ title: "Datei geladen", description: `${file.name} hinzugefügt.` });
        };
        reader.readAsText(file);
      });
    }
    e.target.value = "";
  }, []);

  const handleAddTab = useCallback(() => {
    const newTab: Tab = {
      id: Date.now().toString(),
      name: `seite-${tabs.length + 1}.html`,
      content: `<!DOCTYPE html>\n<html lang="de">\n<head>\n  <meta charset="UTF-8">\n  <title>Neue Seite</title>\n</head>\n<body>\n  <h1>Neue Seite</h1>\n</body>\n</html>`
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs.length]);

  const handleCloseTab = useCallback((tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      toast({ title: "Letzter Tab", description: "Kann nicht geschlossen werden.", variant: "destructive" });
      return;
    }
    const tabIndex = tabs.findIndex(t => t.id === tabId);
    const newTabs = tabs.filter(t => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[Math.min(tabIndex, newTabs.length - 1)].id);
    }
  }, [tabs, activeTabId]);

  const handleContentChange = useCallback((content: string) => {
    setTabs(prev => prev.map(t => 
      t.id === activeTabId ? { ...t, content } : t
    ));
  }, [activeTabId]);

  const handleTabRename = useCallback((tabId: string, newName: string) => {
    setTabs(prev => prev.map(t => 
      t.id === tabId ? { ...t, name: newName.endsWith('.html') ? newName : `${newName}.html` } : t
    ));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 glow-border">
            <Code2 className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-sm sm:text-xl font-semibold text-foreground">HTML Viewer</h1>
            <p className="text-[10px] sm:text-sm text-muted-foreground hidden sm:block">Code eingeben & live abspielen</p>
          </div>
        </div>
        
        {/* Desktop buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <label htmlFor="file-upload">
            <input id="file-upload" type="file" accept=".html,.htm" multiple onChange={handleFileUpload} className="hidden" />
            <Button variant="outline" size="sm" asChild className="cursor-pointer">
              <span><FileCode className="w-4 h-4 mr-2" />Datei laden</span>
            </Button>
          </label>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />Kopieren
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="w-4 h-4 mr-2" />Leeren
          </Button>
          <Button size="sm" onClick={handleRun} className="animate-pulse-glow">
            <Play className="w-4 h-4 mr-2" />Abspielen
          </Button>
          <Button size="sm" variant="secondary" onClick={handleOpenInBrowser}>
            <Play className="w-4 h-4 mr-2" />Im Browser öffnen
          </Button>
          <Button size="sm" variant={showAiPanel ? "default" : "outline"} onClick={() => setShowAiPanel(!showAiPanel)}>
            <Bot className="w-4 h-4 mr-2" />KI-Agenten
          </Button>
        </div>

        {/* Mobile buttons */}
        <div className="flex sm:hidden items-center gap-1">
          <Button size="sm" onClick={handleRun} className="h-8 px-2">
            <Play className="w-3.5 h-3.5" />
          </Button>
          <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <Menu className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {showMobileMenu && isMobile && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-card border-b border-border sm:hidden">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { handleCopy(); setShowMobileMenu(false); }}>
            <Copy className="w-3 h-3 mr-1" />Kopieren
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { handleDownload(); setShowMobileMenu(false); }}>
            <Download className="w-3 h-3 mr-1" />Download
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { handleClear(); setShowMobileMenu(false); }}>
            <Trash2 className="w-3 h-3 mr-1" />Leeren
          </Button>
          <label htmlFor="file-upload-mobile">
            <input id="file-upload-mobile" type="file" accept=".html,.htm" multiple onChange={(e) => { handleFileUpload(e); setShowMobileMenu(false); }} className="hidden" />
            <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
              <span><FileCode className="w-3 h-3 mr-1" />Datei</span>
            </Button>
          </label>
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { handleOpenInBrowser(); setShowMobileMenu(false); }}>
            <Play className="w-3 h-3 mr-1" />Browser
          </Button>
        </div>
      )}

      {/* Mobile view switcher */}
      {isMobile && (
        <div className="flex border-b border-border bg-secondary sm:hidden">
          <button
            onClick={() => setMobileView("editor")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              mobileView === "editor" ? "text-primary border-b-2 border-primary bg-card" : "text-muted-foreground"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />Editor
          </button>
          <button
            onClick={() => setMobileView("preview")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              mobileView === "preview" ? "text-primary border-b-2 border-primary bg-card" : "text-muted-foreground"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />Vorschau
          </button>
          <button
            onClick={() => setMobileView("ai")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors ${
              mobileView === "ai" ? "text-primary border-b-2 border-primary bg-card" : "text-muted-foreground"
            }`}
          >
            <Bot className="w-3.5 h-3.5" />KI
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div className={`flex flex-col border-r border-border ${
          isMobile 
            ? (mobileView === "editor" ? "w-full" : "hidden") 
            : (showAiPanel ? "w-1/3" : "w-1/2")
        }`}>
          {/* Tabs */}
          <div className="flex items-center bg-editor border-b border-border overflow-x-auto">
            <div className="flex items-center">
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 cursor-pointer border-r border-border transition-colors ${
                    activeTabId === tab.id 
                      ? "bg-card text-foreground border-b-2 border-b-primary" 
                      : "bg-editor text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
                  <input
                    type="text"
                    value={tab.name}
                    onChange={(e) => handleTabRename(tab.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent font-mono text-xs sm:text-sm w-16 sm:w-24 focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                  />
                  <button
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:bg-destructive/20 rounded p-0.5 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddTab}
              className="p-2 hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
              title="Neuer Tab"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Editor */}
          <Textarea
            value={activeTab.content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="<!-- Füge deinen HTML-Code hier ein -->"
            className="flex-1 resize-none border-0 rounded-none bg-editor font-mono text-xs sm:text-sm leading-relaxed p-3 sm:p-4 focus-visible:ring-0 editor-scrollbar text-foreground placeholder:text-muted-foreground"
            spellCheck={false}
          />
        </div>

        {/* Preview Panel */}
        <div className={`flex flex-col ${
          isMobile 
            ? (mobileView === "preview" ? "w-full" : "hidden") 
            : (showAiPanel ? "w-1/3" : "w-1/2")
        }`}>
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-secondary border-b border-border">
            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="text-xs sm:text-sm text-muted-foreground font-medium truncate">Vorschau: {activeTab.name}</span>
          </div>
          <div className="flex-1 bg-preview">
            <iframe
              key={`${activeTabId}-${previewKey}`}
              srcDoc={activeTab.content}
              title="HTML Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>

        {/* AI Panel */}
        {(isMobile ? mobileView === "ai" : showAiPanel) && (
          <div className={isMobile ? "w-full" : "w-1/3"}>
            <AiAgentPanel 
              currentHtml={activeTab.content}
              onHtmlUpdate={(html) => {
                handleContentChange(html);
                setPreviewKey(prev => prev + 1);
                toast({ title: "KI-Code generiert", description: "HTML-Code von der KI erstellt." });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HtmlEditor;
