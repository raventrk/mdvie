"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Sidebar } from "../../../components/sidebar";
import { MarkdownEditor } from "../../../components/markdown-editor";
import { FaSync } from "react-icons/fa";

export default function EditPage() {
  const params = useParams();
  const fileName = decodeURIComponent(params.slug as string);
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      
      // LocalStorage'dan içeriği yükle
      const savedContent = localStorage.getItem(`mdvie-${fileName}`);
      
      if (savedContent) {
        setContent(savedContent);
        setIsLoading(false);
      } else if (fileName === "template.md") {
        // Eğer template.md dosyası ise ve kaydedilmiş içerik yoksa, varsayılan şablonu getir
        try {
          const response = await fetch('/templates/template.md');
          if (response.ok) {
            const templateContent = await response.text();
            setContent(templateContent);
            localStorage.setItem(`mdvie-${fileName}`, templateContent);
          } else {
            setDefaultContent();
          }
        } catch (error) {
          console.error("Template yüklenirken hata oluştu:", error);
          setDefaultContent();
        }
        setIsLoading(false);
      } else {
        // Diğer dosyalar için varsayılan içerik
        setDefaultContent();
        setIsLoading(false);
      }
    }

    function setDefaultContent() {
      const defaultContent = `# ${fileName.replace(/\.md$/, '')}\n\nMDVie ile markdown düzenlemeye başlayın!\n\n## Neler yapabilirsiniz?\n\n- Listeler oluşturabilir\n- **Kalın** veya *italik* yazabilir\n- [Linkler](https://github.com) ekleyebilir\n- Ve çok daha fazlası...\n\n\`\`\`javascript\n// Kod blokları da ekleyebilirsiniz\nfunction hello() {\n  console.log("Merhaba Dünya!");\n}\n\`\`\`\n`;
      setContent(defaultContent);
      localStorage.setItem(`mdvie-${fileName}`, defaultContent);
    }

    loadContent();
  }, [fileName]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 w-full overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full w-full">
            <FaSync className="animate-spin h-8 w-8" style={{ color: 'var(--primary)' }} />
          </div>
        ) : (
          <div className="h-full w-full">
            <MarkdownEditor initialContent={content} fileName={fileName} />
          </div>
        )}
      </main>
    </div>
  );
} 