"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Sidebar } from "../../components/sidebar";
import { FaChevronLeft, FaGithub, FaSun, FaMoon, FaDesktop, FaFont, FaCheck, FaInfo, FaArrowRight } from "react-icons/fa";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(14);
  const [mounted, setMounted] = useState(false);
  const [gitUserName, setGitUserName] = useState("");
  const [gitEmail, setGitEmail] = useState("");
  const [saved, setSaved] = useState(false);

  // Hydration hatalarını önlemek için
  useEffect(() => {
    setMounted(true);
    // Kaydedilmiş yazı tipi boyutunu yükle
    const savedFontSize = localStorage.getItem("mdvie-font-size");
    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize, 10));
    }

    // Git kullanıcı bilgilerini yükle
    const savedGitUserName = localStorage.getItem("mdvie-git-username");
    const savedGitEmail = localStorage.getItem("mdvie-git-email");
    if (savedGitUserName) setGitUserName(savedGitUserName);
    if (savedGitEmail) setGitEmail(savedGitEmail);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
    localStorage.setItem("mdvie-font-size", size.toString());
  };

  const handleGitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("mdvie-git-username", gitUserName);
    localStorage.setItem("mdvie-git-email", gitEmail);
    setSaved(true);
    
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 w-full overflow-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-5">
            <Link
              href="/edit/template.md"
              className="mr-3 p-1.5 hover:opacity-80 rounded-md transition-all"
              style={{ background: 'var(--primary)' }}
              aria-label="Geri"
            >
              <FaChevronLeft className="h-3 w-3" style={{ color: 'var(--primary-foreground)' }} />
            </Link>
            <h1 className="text-xl font-bold">Ayarlar</h1>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <section className="p-5 rounded-lg border border-[color:var(--border)] shadow-sm animate-fade-in" style={{ background: 'var(--card)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-md" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                  <FaSun className="h-3.5 w-3.5" />
                </div>
                <h2 className="text-base font-medium">Görünüm</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tema</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      className="flex flex-col items-center justify-center gap-2 p-2 rounded-md border transition-all hover:shadow-md relative"
                      style={{ 
                        background: 'var(--card)', 
                        borderColor: theme === "light" ? 'var(--primary)' : 'var(--border)'
                      }}
                      onClick={() => setTheme("light")}
                    >
                      <FaSun className="h-5 w-5" style={{ color: theme === "light" ? 'var(--primary)' : 'var(--foreground)' }} />
                      <span className="text-xs">Açık</span>
                      {theme === "light" && (
                        <div className="absolute top-1 right-1 p-0.5 rounded-full" style={{ background: 'var(--primary)' }}>
                          <FaCheck className="h-2 w-2" style={{ color: 'var(--primary-foreground)' }} />
                        </div>
                      )}
                    </button>
                    <button
                      className="flex flex-col items-center justify-center gap-2 p-2 rounded-md border transition-all hover:shadow-md relative"
                      style={{ 
                        background: 'var(--card)', 
                        borderColor: theme === "dark" ? 'var(--primary)' : 'var(--border)'
                      }}
                      onClick={() => setTheme("dark")}
                    >
                      <FaMoon className="h-5 w-5" style={{ color: theme === "dark" ? 'var(--primary)' : 'var(--foreground)' }} />
                      <span className="text-xs">Koyu</span>
                      {theme === "dark" && (
                        <div className="absolute top-1 right-1 p-0.5 rounded-full" style={{ background: 'var(--primary)' }}>
                          <FaCheck className="h-2 w-2" style={{ color: 'var(--primary-foreground)' }} />
                        </div>
                      )}
                    </button>
                    <button
                      className="flex flex-col items-center justify-center gap-2 p-2 rounded-md border transition-all hover:shadow-md relative"
                      style={{ 
                        background: 'var(--card)', 
                        borderColor: theme === "system" ? 'var(--primary)' : 'var(--border)'
                      }}
                      onClick={() => setTheme("system")}
                    >
                      <FaDesktop className="h-5 w-5" style={{ color: theme === "system" ? 'var(--primary)' : 'var(--foreground)' }} />
                      <span className="text-xs">Sistem</span>
                      {theme === "system" && (
                        <div className="absolute top-1 right-1 p-0.5 rounded-full" style={{ background: 'var(--primary)' }}>
                          <FaCheck className="h-2 w-2" style={{ color: 'var(--primary-foreground)' }} />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <FaFont className="h-3 w-3" style={{ color: 'var(--muted-foreground)' }} />
                    <label className="block text-sm font-medium">Yazı Tipi Boyutu: {fontSize}px</label>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    step="1"
                    value={fontSize}
                    onChange={(e) => handleFontSizeChange(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 rounded appearance-none"
                    style={{ background: 'var(--secondary)', accentColor: 'var(--primary)' }}
                  />
                  <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    <span>12px</span>
                    <span>16px</span>
                    <span>20px</span>
                    <span>24px</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="p-5 rounded-lg border border-[color:var(--border)] shadow-sm animate-fade-in animate-delay-100" style={{ background: 'var(--card)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-md" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                  <FaGithub className="h-3.5 w-3.5" />
                </div>
                <h2 className="text-base font-medium">Git Entegrasyonu</h2>
              </div>
              
              <form onSubmit={handleGitSubmit} className="space-y-3">
                <div>
                  <label htmlFor="gitUserName" className="block text-sm font-medium mb-1">
                    Git Kullanıcı Adı
                  </label>
                  <input
                    id="gitUserName"
                    type="text"
                    value={gitUserName}
                    onChange={(e) => setGitUserName(e.target.value)}
                    className="w-full p-2 rounded-md border text-sm"
                    style={{ background: 'var(--background)', borderColor: 'var(--input)' }}
                    placeholder="Kullanıcı adınız"
                  />
                </div>
                <div>
                  <label htmlFor="gitEmail" className="block text-sm font-medium mb-1">
                    Git Email
                  </label>
                  <input
                    id="gitEmail"
                    type="email"
                    value={gitEmail}
                    onChange={(e) => setGitEmail(e.target.value)}
                    className="w-full p-2 rounded-md border text-sm"
                    style={{ background: 'var(--background)', borderColor: 'var(--input)' }}
                    placeholder="email@örnek.com"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all hover:opacity-90 text-sm"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                  {saved ? (
                    <>
                      <FaCheck className="h-3 w-3" />
                      <span>Kaydedildi!</span>
                    </>
                  ) : (
                    <>
                      <FaGithub className="h-3 w-3" />
                      <span>Git Bilgilerini Kaydet</span>
                      <FaArrowRight className="h-2.5 w-2.5 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </section>

            <section className="p-5 rounded-lg border border-[color:var(--border)] shadow-sm md:col-span-2 animate-fade-in animate-delay-200" style={{ background: 'var(--card)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-md" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                  <FaInfo className="h-3.5 w-3.5" />
                </div>
                <h2 className="text-base font-medium">Hakkında</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="text-sm font-medium mb-1">MDVie Markdown Editör</h3>
                  <p style={{ color: 'var(--muted-foreground)' }}>
                    Modern tasarımıyla markdown düzenleme deneyiminizi geliştirecek güçlü bir uygulama. Next.js ve modern web teknolojileriyle oluşturulmuştur.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Özellikler</h3>
                  <div className="grid grid-cols-2">
                    <ul className="list-disc pl-4 space-y-0.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <li>Live Preview</li>
                      <li>Split View</li>
                      <li>AutoSave</li>
                    </ul>
                    <ul className="list-disc pl-4 space-y-0.5 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      <li>Keyboard Shortcuts</li>
                      <li>Code Highlighting</li>
                      <li>Modern UI</li>
                    </ul>
                  </div>
                </div>
                
                <div className="md:col-span-2 border-t border-[color:var(--border)] pt-2 mt-1 flex items-center justify-between">
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    Versiyon: 1.0.0
                  </p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    Build: 20231210-001
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 