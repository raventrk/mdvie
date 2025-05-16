"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorView } from "@codemirror/view";
import { FaBold, FaItalic, FaUnderline, FaLink, FaImage, FaCode, FaTable, FaListUl, FaListOl, FaQuoteLeft, FaHeading, FaSave, FaFileExport, FaEye, FaEdit, FaColumns, FaCheck } from "react-icons/fa";

interface MarkdownEditorProps {
  initialContent?: string;
  fileName: string;
}

export function MarkdownEditor({ initialContent = "", fileName }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("split");
  const [fontSize, setFontSize] = useState(14);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const insertMarkdownSyntax = (prefix: string, suffix: string, placeholder: string) => {
    setContent((prev) => `${prev}${prefix}${placeholder}${suffix}`);
  };

  const saveContent = useCallback(() => {
    localStorage.setItem(`mdvie-${fileName}`, content);
    setLastSaved(new Date());
    
    // Kaydetme onayını göster ve 2 saniye sonra kaldır
    setShowSaveConfirmation(true);
    setTimeout(() => {
      setShowSaveConfirmation(false);
    }, 2000);
  }, [content, fileName]);

  // Dosya değiştiğinde içeriği sıfırla
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [fileName, initialContent]);

  // Otomatik kaydetme
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem(`mdvie-${fileName}`, content);
      setLastSaved(new Date());
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [content, fileName]);

  // Yazı tipi boyutunu localStorage'dan yükle
  useEffect(() => {
    const savedFontSize = localStorage.getItem("mdvie-font-size");
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10));
    }
  }, []);

  // Klavye kısayolları
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        switch (e.key) {
          case "b":
            e.preventDefault();
            insertMarkdownSyntax("**", "**", "kalın metin");
            break;
          case "i":
            e.preventDefault();
            insertMarkdownSyntax("*", "*", "italik metin");
            break;
          case "k":
            e.preventDefault();
            insertMarkdownSyntax("[", "](url)", "bağlantı");
            break;
          case "1":
            e.preventDefault();
            setViewMode("edit");
            break;
          case "2":
            e.preventDefault();
            setViewMode("preview");
            break;
          case "3":
            e.preventDefault();
            setViewMode("split");
            break;
          case "s":
            e.preventDefault();
            saveContent();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveContent]);

  const exportMarkdown = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, fileName]);

  // Araç çubuğu işlevleri
  const handleToolbarClick = (action: string) => {
    switch (action) {
      case "bold":
        insertMarkdownSyntax("**", "**", "kalın metin");
        break;
      case "italic":
        insertMarkdownSyntax("*", "*", "italik metin");
        break;
      case "underline":
        insertMarkdownSyntax("<u>", "</u>", "altı çizili metin");
        break;
      case "link":
        insertMarkdownSyntax("[", "](url)", "bağlantı metni");
        break;
      case "image":
        insertMarkdownSyntax("![", "](resim-url)", "alt metin");
        break;
      case "code":
        insertMarkdownSyntax("```\n", "\n```", "kod bloğu");
        break;
      case "table":
        insertMarkdownSyntax(
          "| Başlık 1 | Başlık 2 | Başlık 3 |\n| --- | --- | --- |\n| Satır 1 | Veri | Veri |\n| Satır 2 | Veri | Veri |\n",
          "",
          ""
        );
        break;
      case "heading":
        insertMarkdownSyntax("## ", "\n", "Başlık");
        break;
      case "unordered-list":
        insertMarkdownSyntax("- ", "\n", "Liste öğesi");
        break;
      case "ordered-list":
        insertMarkdownSyntax("1. ", "\n", "Sıralı liste öğesi");
        break;
      case "quote":
        insertMarkdownSyntax("> ", "\n", "Alıntı");
        break;
      case "save":
        saveContent();
        break;
      case "export":
        exportMarkdown();
        break;
    }
  };

  const formatLastSaved = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <div 
        className="flex items-center justify-between p-2 border-b border-[color:var(--border)]" 
        style={{ background: 'var(--card)' }}
      >
        <div className="flex space-x-1">
          <button
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5`}
            style={{
              background: viewMode === "edit" ? 'var(--primary)' : 'var(--secondary)',
              color: viewMode === "edit" ? 'var(--primary-foreground)' : 'var(--secondary-foreground)',
            }}
            onClick={() => setViewMode("edit")}
            title="Düzenleme modu (Ctrl+1)"
          >
            <FaEdit size={12} />
            <span>Düzenle</span>
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5`}
            style={{
              background: viewMode === "preview" ? 'var(--primary)' : 'var(--secondary)',
              color: viewMode === "preview" ? 'var(--primary-foreground)' : 'var(--secondary-foreground)',
            }}
            onClick={() => setViewMode("preview")}
            title="Önizleme modu (Ctrl+2)"
          >
            <FaEye size={12} />
            <span>Önizleme</span>
          </button>
          <button
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5`}
            style={{
              background: viewMode === "split" ? 'var(--primary)' : 'var(--secondary)',
              color: viewMode === "split" ? 'var(--primary-foreground)' : 'var(--secondary-foreground)',
            }}
            onClick={() => setViewMode("split")}
            title="Bölünmüş mod (Ctrl+3)"
          >
            <FaColumns size={12} />
            <span>Bölünmüş</span>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {showSaveConfirmation && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs animate-fade-in">
              <FaCheck size={10} />
              <span>Kaydedildi</span>
            </div>
          )}
          {lastSaved && (
            <span className="text-[10px]" style={{ color: 'var(--muted-foreground)' }}>Son: {formatLastSaved(lastSaved)}</span>
          )}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-0.5 px-2 rounded-full text-white text-xs font-medium">
            {fileName}
          </div>
        </div>
      </div>

      <div 
        className="flex items-center flex-wrap gap-0.5 p-1 border-b border-[color:var(--border)]" 
        style={{ background: 'var(--card)' }}
      >
        <div className="flex items-center gap-0.5 mr-1.5">
          <button
            className="p-1.5 hover:bg-[color:var(--secondary)] rounded-md transition-all"
            onClick={() => handleToolbarClick("bold")}
            title="Kalın (Ctrl+B)"
          >
            <FaBold size={12} style={{ color: 'var(--foreground)' }} />
          </button>
          <button
            className="p-1.5 hover:bg-[color:var(--secondary)] rounded-md transition-all"
            onClick={() => handleToolbarClick("italic")}
            title="İtalik (Ctrl+I)"
          >
            <FaItalic size={12} style={{ color: 'var(--foreground)' }} />
          </button>
          <button
            className="p-1.5 hover:bg-[color:var(--secondary)] rounded-md transition-all"
            onClick={() => handleToolbarClick("underline")}
            title="Altı Çizili"
          >
            <FaUnderline size={12} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
        
        <div className="h-5 w-px mx-0.5 my-auto" style={{ background: 'var(--border)' }}></div>
        
        <div className="flex items-center gap-0.5 mr-1.5">
          <button
            className="p-1.5 hover:bg-[color:var(--secondary)] rounded-md transition-all"
            onClick={() => handleToolbarClick("heading")}
            title="Başlık"
          >
            <FaHeading size={12} style={{ color: 'var(--foreground)' }} />
          </button>
          <button
            className="p-1.5 hover:bg-[color:var(--secondary)] rounded-md transition-all"
            onClick={() => handleToolbarClick("quote")}
            title="Alıntı"
          >
            <FaQuoteLeft size={12} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
        
        <div className="h-5 w-px mx-0.5 my-auto" style={{ background: 'var(--border)' }}></div>
        
        <div className="flex items-center gap-0.5 mr-1.5">
          <button
            className="p-1.5 hover:bg-[color:var(--secondary)] rounded-md transition-all"
            onClick={() => handleToolbarClick("unordered-list")}
            title="Sırasız Liste"
          >
            <FaListUl size={12} style={{ color: 'var(--foreground)' }} />
          </button>
          <button
            className="p-1.5 hover:bg-[color:var(--secondary)] rounded-md transition-all"
            onClick={() => handleToolbarClick("ordered-list")}
            title="Sıralı Liste"
          >
            <FaListOl size={12} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
        
        <div className="h-5 w-px mx-0.5 my-auto" style={{ background: 'var(--border)' }}></div>
        
        <div className="flex items-center gap-0.5">
          <button
            className="p-1.5 hover:bg-[color:var(--secondary)] rounded-md transition-all"
            onClick={() => handleToolbarClick("link")}
            title="Bağlantı (Ctrl+K)"
          >
            <FaLink size={12} style={{ color: 'var(--foreground)' }} />
          </button>
          <button
            className="p-1.5 hover:bg-[color:var(--secondary)] rounded-md transition-all"
            onClick={() => handleToolbarClick("image")}
            title="Resim"
          >
            <FaImage size={12} style={{ color: 'var(--foreground)' }} />
          </button>
          <button 
            className="p-1.5 hover:bg-[color:var(--secondary)] rounded-md transition-all" 
            onClick={() => handleToolbarClick("code")} 
            title="Kod"
          >
            <FaCode size={12} style={{ color: 'var(--foreground)' }} />
          </button>
          <button 
            className="p-1.5 hover:bg-[color:var(--secondary)] rounded-md transition-all" 
            onClick={() => handleToolbarClick("table")} 
            title="Tablo"
          >
            <FaTable size={12} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
        
        <div className="flex-grow"></div>
        
        <div className="flex items-center gap-0.5">
          <button
            className="px-2 py-1 bg-[color:var(--primary)] text-[color:var(--primary-foreground)] rounded-md transition-all flex items-center gap-1 text-xs font-medium hover:opacity-90"
            onClick={() => handleToolbarClick("save")}
            title="Kaydet (Ctrl+S)"
          >
            <FaSave size={10} />
            <span>Kaydet</span>
          </button>
          <button
            className="p-1.5 hover:bg-[color:var(--secondary)] rounded-md transition-all"
            onClick={() => handleToolbarClick("export")}
            title="Dışa Aktar"
          >
            <FaFileExport size={12} style={{ color: 'var(--foreground)' }} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {(viewMode === "edit" || viewMode === "split") && (
          <div 
            className={`${viewMode === "split" ? "w-1/2" : "w-full"} overflow-auto h-full border-r border-[color:var(--border)]`} 
            style={{ 
              background: 'var(--background)'
            }}
          >
            <CodeMirror
              value={content}
              height="100%"
              theme={vscodeDark}
              extensions={[markdown(), EditorView.lineWrapping]}
              onChange={(value) => setContent(value)}
              style={{ 
                fontSize: `${fontSize}px`,
                height: '100%'
              }}
              className="h-full"
            />
          </div>
        )}

        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={`${
              viewMode === "split" ? "w-1/2" : "w-full"
            } overflow-auto p-4 max-w-none h-full markdown-content`}
            style={{ 
              fontSize: `${fontSize}px`,
              background: 'var(--background)'
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}