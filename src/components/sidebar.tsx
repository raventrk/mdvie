"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaCog, FaFile, FaFolder, FaPlus, FaHome, FaMarkdown, FaEllipsisH, FaTrash, FaEdit, FaDownload } from "react-icons/fa";
import { ThemeToggle } from "./theme-toggle";

interface FileMenu {
  id: string;
  isOpen: boolean;
}

export function Sidebar() {
  const [files, setFiles] = useState<string[]>([]);
  const [fileMenu, setFileMenu] = useState<FileMenu | null>(null);
  const [renameFile, setRenameFile] = useState<{id: string, name: string} | null>(null);

  // LocalStorage'dan dosyaları yükle
  useEffect(() => {
    // localStorage'dan kayıtlı dosya listesini al
    const savedFiles = localStorage.getItem("mdvie-files");
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    } else {
      // Varsayılan dosya olarak template.md ekle
      const defaultFiles = ["template.md"];
      setFiles(defaultFiles);
      localStorage.setItem("mdvie-files", JSON.stringify(defaultFiles));
    }
  }, []);

  // Dosya listesi değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (files.length > 0) {
      localStorage.setItem("mdvie-files", JSON.stringify(files));
    }
  }, [files]);

  // Menüyü aç/kapat
  const toggleMenu = (fileId: string) => {
    if (fileMenu && fileMenu.id === fileId) {
      setFileMenu(null);
    } else {
      setFileMenu({ id: fileId, isOpen: true });
    }
  };

  // Dosya Sil
  const deleteFile = (fileName: string) => {
    // localStorage'dan dosya içeriğini sil
    localStorage.removeItem(`mdvie-${fileName}`);
    
    // Dosya listesinden kaldır
    const updatedFiles = files.filter(file => file !== fileName);
    setFiles(updatedFiles);
    setFileMenu(null);
  };

  // Dosya İndir
  const downloadFile = (fileName: string) => {
    const content = localStorage.getItem(`mdvie-${fileName}`) || "";
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setFileMenu(null);
  };

  // Dosya yeniden adlandır
  const startRename = (fileName: string) => {
    setRenameFile({ id: fileName, name: fileName });
    setFileMenu(null);
  };

  const handleRename = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && renameFile) {
      const oldName = renameFile.id;
      const newName = renameFile.name.endsWith(".md") ? renameFile.name : `${renameFile.name}.md`;
      
      // İçeriği eski addan yeni ada taşı
      const content = localStorage.getItem(`mdvie-${oldName}`) || "";
      localStorage.setItem(`mdvie-${newName}`, content);
      localStorage.removeItem(`mdvie-${oldName}`);
      
      // Dosya listesini güncelle
      const updatedFiles = files.map(file => file === oldName ? newName : file);
      setFiles(updatedFiles);
      setRenameFile(null);
    } else if (e.key === "Escape") {
      setRenameFile(null);
    }
  };

  const handleClickOutside = () => {
    setFileMenu(null);
  };

  return (
    <div className="flex h-full w-72 flex-col shadow-md z-10" style={{ background: 'var(--card)' }}>
      <div className="flex items-center justify-between p-4 border-b border-[color:var(--border)]">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: 'var(--primary)' }}>
            <FaMarkdown className="h-4 w-4" style={{ color: 'var(--primary-foreground)' }} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">MDVie</h1>
        </div>
        <ThemeToggle />
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 py-1 text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
            <FaFolder className="h-3.5 w-3.5" style={{ color: 'var(--primary)' }} />
            <span>Dosyalarım</span>
          </div>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-all hover:opacity-80 hover:scale-105"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            aria-label="Yeni Dosya"
            onClick={() => {
              const newFileName = `Untitled-${files.length + 1}.md`;
              setFiles([...files, newFileName]);
            }}
          >
            <FaPlus className="h-3 w-3" />
          </button>
        </div>
        
        <div className="space-y-1.5 mt-2">
          {files.map((file) => (
            <div key={file} className="relative">
              {renameFile && renameFile.id === file ? (
                <div className="flex items-center p-1.5 rounded-lg" style={{ background: 'var(--secondary)' }}>
                  <input
                    type="text"
                    value={renameFile.name}
                    onChange={(e) => setRenameFile({ ...renameFile, name: e.target.value })}
                    onKeyDown={handleRename}
                    autoFocus
                    className="w-full p-1.5 rounded text-sm"
                    style={{ background: 'var(--background)', borderColor: 'var(--border)' }}
                  />
                </div>
              ) : (
                <div className="flex items-center">
                  <Link
                    href={`/edit/${encodeURIComponent(file)}`}
                    className="flex-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-[color:var(--secondary)]"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-md" style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}>
                      <FaFile className="h-3 w-3" style={{ color: 'var(--primary)' }} />
                    </div>
                    <span className="truncate font-medium">{file}</span>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(file);
                    }}
                    className="p-1.5 rounded-md hover:bg-[color:var(--secondary)]"
                  >
                    <FaEllipsisH className="h-3 w-3" style={{ color: 'var(--muted-foreground)' }} />
                  </button>
                  
                  {fileMenu && fileMenu.id === file && (
                    <div 
                      className="absolute right-0 top-9 z-50 bg-[color:var(--card)] shadow-lg rounded-lg border border-[color:var(--border)] w-40"
                      onClick={e => e.stopPropagation()}
                    >
                      <button 
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-[color:var(--secondary)] text-left"
                        onClick={() => startRename(file)}
                      >
                        <FaEdit className="h-3.5 w-3.5" style={{ color: 'var(--muted-foreground)' }} />
                        <span>Yeniden Adlandır</span>
                      </button>
                      <button 
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-[color:var(--secondary)] text-left"
                        onClick={() => downloadFile(file)}
                      >
                        <FaDownload className="h-3.5 w-3.5" style={{ color: 'var(--muted-foreground)' }} />
                        <span>İndir</span>
                      </button>
                      <button 
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-[color:var(--destructive)] hover:text-[color:var(--destructive-foreground)] text-left rounded-b-lg"
                        onClick={() => deleteFile(file)}
                      >
                        <FaTrash className="h-3.5 w-3.5" />
                        <span>Sil</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 space-y-2 border-t border-[color:var(--border)]">
        <Link
          href="/edit/template.md"
          className="flex items-center gap-2 rounded-lg px-3 py-2 w-full text-sm transition-all hover:bg-[color:var(--secondary)]"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-md" style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}>
            <FaHome className="h-3 w-3" style={{ color: 'var(--primary)' }} />
          </div>
          <span className="font-medium">Ana Sayfa</span>
        </Link>
        
        <Link
          href="/settings"
          className="flex items-center gap-2 rounded-lg px-3 py-2 w-full text-sm transition-all hover:bg-[color:var(--secondary)]"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-md" style={{ background: 'rgba(var(--primary-rgb), 0.1)' }}>
            <FaCog className="h-3 w-3" style={{ color: 'var(--primary)' }} />
          </div>
          <span className="font-medium">Ayarlar</span>
        </Link>
      </div>
      
      {/* Menü dışına tıklandığında kapat */}
      {fileMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={handleClickOutside}
        />
      )}
    </div>
  );
} 