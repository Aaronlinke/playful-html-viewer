import { useState, useCallback } from "react";
import { Code2, Play, Copy, Trash2, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

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

const HtmlEditor = () => {
  const [htmlCode, setHtmlCode] = useState(defaultHtml);
  const [previewKey, setPreviewKey] = useState(0);

  const handleRun = useCallback(() => {
    setPreviewKey((prev) => prev + 1);
    toast({
      title: "HTML aktualisiert",
      description: "Die Vorschau wurde neu geladen.",
    });
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(htmlCode);
    toast({
      title: "Kopiert!",
      description: "HTML-Code wurde in die Zwischenablage kopiert.",
    });
  }, [htmlCode]);

  const handleClear = useCallback(() => {
    setHtmlCode("");
    setPreviewKey((prev) => prev + 1);
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setHtmlCode(content);
        setPreviewKey((prev) => prev + 1);
        toast({
          title: "Datei geladen",
          description: `${file.name} wurde erfolgreich geladen.`,
        });
      };
      reader.readAsText(file);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 glow-border">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">HTML Viewer</h1>
            <p className="text-sm text-muted-foreground">Code eingeben & live abspielen</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="file-upload">
            <input
              id="file-upload"
              type="file"
              accept=".html,.htm"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button variant="outline" size="sm" asChild className="cursor-pointer">
              <span>
                <FileCode className="w-4 h-4 mr-2" />
                Datei laden
              </span>
            </Button>
          </label>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Kopieren
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="w-4 h-4 mr-2" />
            Leeren
          </Button>
          <Button size="sm" onClick={handleRun} className="animate-pulse-glow">
            <Play className="w-4 h-4 mr-2" />
            Abspielen
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div className="flex flex-col w-1/2 border-r border-border">
          <div className="flex items-center gap-2 px-4 py-2 bg-editor border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-primary/80" />
            </div>
            <span className="text-sm text-muted-foreground font-mono ml-2">index.html</span>
          </div>
          <Textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            placeholder="<!-- Füge deinen HTML-Code hier ein -->"
            className="flex-1 resize-none border-0 rounded-none bg-editor font-mono text-sm leading-relaxed p-4 focus-visible:ring-0 editor-scrollbar text-foreground placeholder:text-muted-foreground"
            spellCheck={false}
          />
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col w-1/2">
          <div className="flex items-center gap-2 px-4 py-2 bg-secondary border-b border-border">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground font-medium">Vorschau</span>
          </div>
          <div className="flex-1 bg-preview">
            <iframe
              key={previewKey}
              srcDoc={htmlCode}
              title="HTML Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HtmlEditor;
