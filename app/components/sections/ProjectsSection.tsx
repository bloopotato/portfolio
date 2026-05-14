"use client";

import { useMemo, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoFolder } from "react-icons/io5";

type ProjectFolder = {
  id: string;
  folderName: string;
  title: string;
  summary: string;
  stack: string[];
  details: string;
  updatedAt: string;
  link?: string;
};
const PROJECT_FOLDERS: ProjectFolder[] = [
  {
    id: "nlp-dashboard",
    folderName: "nlp-dashboard",
    title: "NLP Dashboard",
    summary: "Natural language analytics dashboard for interactive data exploration.",
    stack: ["React", "Python", "FastAPI", "Docker"],
    details:
      "Built an NLP-powered analytics dashboard that allows users to explore datasets using natural language queries or interactive charts. The system dynamically generates visualisations and insights from user prompts, making data analysis more accessible for non-technical users.",
    updatedAt: "2025-08",
  },

  {
    id: "gamified-fitness-app",
    folderName: "gamified-fitness-app",
    title: "Gamified Fitness App",
    summary: "AI-powered fitness tracking application with gamification features.",
    stack: ["React Native", "Supabase"],
    details:
      "Developed a gamified fitness application that helps users track calorie intake, workouts, and exercise progress. Features include detailed workout logging, AI-generated workout recommendations, and social features designed to improve motivation and long-term engagement.",
    updatedAt: "2025-08",
  },

  {
    id: "ai-powered-food-app",
    folderName: "ai-powered-food-app",
    title: "AI-Powered Food & Wellness App",
    summary: "Smart nutrition and wellness application integrated with IoT health devices.",
    stack: ["React Native", "Python", "FastAPI", "Android SDK", "Kotlin"],
    details:
      "Contributed to the design and prototyping of an AI-powered food and wellness platform integrated with a smart weighing scale. Users can log meals while AI estimates calorie and nutritional values. The connected hardware device tracks metrics such as BMI and body fat percentage, allowing users to monitor health progress over time.",
    updatedAt: "2025-09",
  },

  {
    id: "expense-tracker-app",
    folderName: "expense-tracker-app",
    title: "Expense Tracker App",
    summary: "Full-stack expense management application for budgeting and finance tracking.",
    stack: ["Java", "Spring Boot", "PostgreSQL"],
    details:
      "Built a full-stack expense tracking application inspired by modern budgeting tools such as Cashew. The platform supports expense categorisation, filtering, and financial tracking to help users better manage personal spending habits.",
    updatedAt: "2025-06",
  },

  {
    id: "healthcare-ai-chatbot",
    folderName: "healthcare-ai-chatbot",
    title: "Healthcare AI Chatbot",
    summary: "Healthcare management platform with personalised AI-assisted guidance.",
    stack: ["React Native", "Django", "SQL"],
    details:
      "Developed a healthcare management application that enables users to track illnesses, appointments, medications, and personal medical information. The platform includes an AI chatbot that uses user-provided health data to offer personalised guidance for minor health-related queries, helping reduce unnecessary clinic visits.",
    updatedAt: "2025-02",
    link: "https://github.com/bloopotato/binary-babes",
  },

  {
    id: "portfolio-site",
    folderName: "portfolio-site",
    title: "Interactive Portfolio Site",
    summary: "Desktop-inspired portfolio website showcasing projects and technical skills.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    details:
      "Designed and developed a desktop-inspired portfolio website featuring an interactive UI, draggable windows, terminal-inspired navigation, and animated project exploration. Built to showcase projects and technical skills through a more immersive user experience.",
    updatedAt: "2026-05",
    link: "https://github.com/bloopotato/portfolio",
  },
  {
    id: "bto-management-system",
    folderName: "bto-management-system",
    title: "BTO Management System",
    summary: "Command-line management system for handling BTO applications and workflows.",
    stack: ["Java"],
    details:
      "Developed an object-oriented command-line application in Java to simulate the management of BTO projects, applications, and enquiries. The system supports multiple user roles, approval workflows, project management, and applicant tracking using core OOP principles and data structures.",
    updatedAt: "2025-03",
    link: "https://github.com/bloopotato/SC2002-BTO-Project",
  },
];

export function ProjectsSection() {
  const [navigationHistory, setNavigationHistory] = useState<(string | null)[]>([null]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const activeProjectId = navigationHistory[historyIndex] ?? null;

  const activeProject = useMemo(
    () => PROJECT_FOLDERS.find((project) => project.id === activeProjectId) ?? null,
    [activeProjectId],
  );

  const currentPath = activeProject
    ? `/home/yuhui/projects/${activeProject.folderName}`
    : "/home/yuhui/projects";

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < navigationHistory.length - 1;

  const handleOpenFolder = (projectId: string) => {
    const newHistory = navigationHistory.slice(0, historyIndex + 1);
    newHistory.push(projectId);
    setNavigationHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleBack = () => {
    if (canGoBack) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="flex items-center gap-2 p-2">
        <button
          type="button"
          onClick={handleBack}
          disabled={Boolean(!canGoBack)}
          className="flex items-center cursor-pointer justify-center rounded border-2 border-border-theme p-1 text-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-surface-3"
          title="Go back"
          aria-label="Go back"
        >
          <IoIosArrowBack />
        </button>
        <button
          type="button"
          onClick={handleForward}
          disabled={Boolean(!canGoForward)}
          className="flex items-center cursor-pointer justify-center rounded border-2 border-border-theme p-1 text-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-surface-3"
          title="Go forward"
          aria-label="Go forward"
        >
          <IoIosArrowForward />
        </button>
        <div className="flex-1 self-stretch flex items-center rounded border-2 border-border-theme bg-surface-3 px-3 font-mono text-xs text-foreground overflow-hidden">
          {currentPath}
        </div>
      </div>

      {/* Directory View */}
      {!activeProject && (
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[...PROJECT_FOLDERS]
              .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
              .map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => handleOpenFolder(project.id)}
                  className="group flex flex-col items-center gap-2 rounded p-3 transition hover:bg-surface-3"
                >
                  <div className="text-6xl transition group-hover:scale-110">
                    <IoFolder />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-foreground">{project.folderName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{project.updatedAt}</p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Project Details View */}
      {activeProject && (
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">{activeProject.title}</h3>
                {activeProject.link && (
                  <div className="relative w-fit group cursor-pointer">
                    <div className="absolute inset-0 rounded-xl bg-border-theme" />

                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block rounded-xl border-2 border-border-theme bg-surface-3 px-4 py-1 text-sm text-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    >
                      GitHub
                    </a>
                  </div>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-theme">{activeProject.summary}</p>
            </div>
            <div className="relative w-fit group cursor-pointer">
              <div className="absolute inset-0 rounded bg-border-theme" />
              <div className="relative rounded border-2 border-border-theme bg-surface-3 p-3 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                <p className="text-xs uppercase tracking-widest text-muted-theme mb-2">README</p>
                <p className="text-sm leading-relaxed text-foreground">{activeProject.details}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-theme">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {activeProject.stack.map((item) => (
                  <div key={item} className="relative w-fit group">
                    <div className="absolute inset-0 rounded bg-border-theme" />

                    <span className="cursor-pointer relative block rounded border-2 border-border-theme bg-surface-3 px-2 py-1 text-xs text-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
