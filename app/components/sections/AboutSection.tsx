"use client";

import { useState } from "react";
import { IoDocument, IoDocumentText, IoSearch, IoGitBranchOutline } from "react-icons/io5";
import { LuFiles } from "react-icons/lu";

type AboutFile = "readme" | "resume";

const README_CONTENT = `# About Me

Hi, I’m Yu Hui, a Year 3 student at NTU pursuing a double degree in Computer Engineering and Business Analytics.

I enjoy building software that blends technical systems with practical, real-world use cases.

## What I Do
I build web and mobile applications, explore data-driven solutions, and experiment with AI tools to create useful products.

## Experience & Focus
- Full-stack development (React, Next.js, backend systems)
- Applied machine learning and data analytics
- Building personal projects for learning and portfolio development
`;

export function AboutSection() {
  const [activeFile, setActiveFile] = useState<AboutFile>("readme");
  const readmeLines = README_CONTENT.split("\n");

  return (
    <div className="h-full overflow-hidden bg-surface-1">
      <div className="grid h-full grid-cols-[50px_1fr]">
        {/* Left Sidebar - Icon Bar */}
        <aside className="flex flex-col items-center gap-6 border-r border-border-theme bg-surface-2 py-4">
          <button
            type="button"
            className="cursor-pointer flex items-center justify-center text-2xl text-foreground hover:opacity-70 transition"
            title="Explorer"
          >
            <LuFiles />
          </button>
          <button
            type="button"
            className="cursor-pointer flex items-center justify-center text-2xl text-muted-foreground hover:opacity-70 transition"
            title="Search"
          >
            <IoSearch />
          </button>
          <button
            type="button"
            className="cursor-pointer flex items-center justify-center text-2xl text-muted-foreground hover:opacity-70 transition"
            title="Source Control"
          >
            <IoGitBranchOutline />
          </button>
        </aside>

        {/* Main Content Area */}
        <section className="flex h-full min-h-0 flex-col">
          {/* Tab Bar */}
          <div className="flex items-center border-b border-border-theme bg-surface-2">
            <button
              type="button"
              onClick={() => setActiveFile("readme")}
              className={`cursor-pointer flex items-center gap-2 border-b-2 px-4 py-2 text-xs transition ${
                activeFile === "readme"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <IoDocumentText />
              README.md
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveFile("resume");
                const link = document.createElement("a");
                link.href = "/NeoYuHui_Resume.pdf";
                link.download = "resume.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className={`cursor-pointer flex items-center gap-2 border-b-2 px-4 py-2 text-xs transition ${
                activeFile === "resume"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <IoDocument />
              resume.pdf
            </button>
          </div>

          {/* Content Area */}
          <div className="min-h-0 flex-1 overflow-auto bg-surface-1 p-2 font-mono text-xs leading-4 text-foreground">
            {activeFile === "readme" ? (
              <div className="space-y-0.5">
                {readmeLines.map((line, index) => (
                  <div key={index} className="grid grid-cols-[1rem_minmax(0,1fr)] gap-4">
                    <div className="select-none text-right text-muted-foreground/60">
                      {index + 1}
                    </div>
                    <div className="min-w-0 whitespace-pre-wrap wrap-break-word">{line || " "}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <p>Downloading resume.docx...</p>
                <a
                  href="/resume.docx"
                  download
                  className="text-foreground underline hover:opacity-80"
                >
                  Click again if download did not start
                </a>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
