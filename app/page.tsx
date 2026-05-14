"use client";

import {
  FormEvent,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoLogoLinkedin, IoLogoGithub, IoMail } from "react-icons/io5";
import { DesktopIcon } from "./components/DesktopIcon";
import { TaskbarDock } from "./components/TaskbarDock";
import { WindowFrame } from "./components/WindowFrame";
import { AboutSection } from "./components/sections/AboutSection";
import { ContactSection } from "./components/sections/ContactSection";
import { EducationSection } from "./components/sections/EducationSection";
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { TerminalSection } from "./components/sections/TerminalSection";
import {
  ICONS,
  INITIAL_WINDOWS,
  WINDOW_ORDER,
  WindowId,
  WindowState,
  windowNameToIdMap,
} from "./types/windows";

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";
type ThemeMode = "dark" | "light";

const DOCK_LINKS = [
  { href: "https://github.com/bloopotato", label: "GitHub", icon: <IoLogoGithub /> },
  { href: "https://www.linkedin.com/in/yu-hui-neo", label: "LinkedIn", icon: <IoLogoLinkedin /> },
  { href: "mailto:yuhuineo@gmail.com", label: "Email", icon: <IoMail /> },
];

export default function Home() {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(INITIAL_WINDOWS);
  const [, setTopZIndex] = useState(6);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme =
      typeof window !== "undefined" ? window.localStorage.getItem("portfolio-theme") : null;
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
    return typeof window !== "undefined" &&
      !window.matchMedia("(prefers-color-scheme: light)").matches
      ? "dark"
      : "light";
  });
  const [isMobile, setIsMobile] = useState(false);
  const [time, setTime] = useState(new Date());
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "Welcome to Yu Hui's Portfolio. Type 'help' to see commands.",
  ]);

  const dragState = useRef<{ id: WindowId; offsetX: number; offsetY: number } | null>(null);
  const resizeState = useRef<{
    id: WindowId;
    direction: ResizeDirection;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);
  const terminalOutputRef = useRef<HTMLDivElement | null>(null);

  const openWindow = (id: WindowId) => {
    setTopZIndex((previousTop) => {
      const newTop = previousTop + 1;
      setWindows((previousWindows) => ({
        ...previousWindows,
        [id]: {
          ...previousWindows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: newTop,
        },
      }));
      return newTop;
    });
  };

  const closeWindow = (id: WindowId) => {
    setWindows((previousWindows) => ({
      ...previousWindows,
      [id]: {
        ...previousWindows[id],
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        restoreBounds: null,
      },
    }));
  };

  const minimizeWindow = (id: WindowId) => {
    setWindows((previousWindows) => ({
      ...previousWindows,
      [id]: {
        ...previousWindows[id],
        isMinimized: true,
      },
    }));
  };

  const handleDockAppClick = (id: WindowId) => {
    if (windows[id].isOpen && !windows[id].isMinimized) {
      minimizeWindow(id);
      return;
    }

    openWindow(id);
  };

  const toggleMaximizeWindow = (id: WindowId) => {
    setWindows((previousWindows) => {
      const targetWindow = previousWindows[id];

      if (targetWindow.isMaximized && targetWindow.restoreBounds) {
        return {
          ...previousWindows,
          [id]: {
            ...targetWindow,
            ...targetWindow.restoreBounds,
            isMaximized: false,
            restoreBounds: null,
          },
        };
      }

      const nextWidth = Math.max(320, window.innerWidth - 16);
      const nextHeight = Math.max(220, window.innerHeight - 40 - 96);

      return {
        ...previousWindows,
        [id]: {
          ...targetWindow,
          x: 8,
          y: 8,
          width: nextWidth,
          height: nextHeight,
          isMaximized: true,
          isMinimized: false,
          restoreBounds: {
            x: targetWindow.x,
            y: targetWindow.y,
            width: targetWindow.width,
            height: targetWindow.height,
          },
        },
      };
    });

    focusWindow(id);
  };

  const focusWindow = (id: WindowId) => {
    setTopZIndex((previousTop) => {
      const newTop = previousTop + 1;
      setWindows((previousWindows) => ({
        ...previousWindows,
        [id]: {
          ...previousWindows[id],
          zIndex: newTop,
        },
      }));
      return newTop;
    });
  };

  const startDragging = (event: ReactMouseEvent<HTMLElement>, id: WindowId) => {
    event.preventDefault();

    if (windows[id].isMaximized) {
      return;
    }

    focusWindow(id);

    const bounds = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!bounds) {
      return;
    }

    dragState.current = {
      id,
      offsetX: event.clientX - bounds.left,
      offsetY: event.clientY - bounds.top,
    };
  };

  const startResizing = (
    event: ReactMouseEvent<HTMLElement>,
    id: WindowId,
    direction: ResizeDirection,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (windows[id].isMaximized) {
      return;
    }

    focusWindow(id);

    const targetWindow = windows[id];
    resizeState.current = {
      id,
      direction,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: targetWindow.x,
      startTop: targetWindow.y,
      startWidth: targetWindow.width,
      startHeight: targetWindow.height,
    };
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
    window.localStorage.setItem("portfolio-theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewportMode = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateViewportMode();
    mediaQuery.addEventListener("change", updateViewportMode);

    return () => {
      mediaQuery.removeEventListener("change", updateViewportMode);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      if (resizeState.current) {
        const { id, direction, startX, startY, startLeft, startTop, startWidth, startHeight } =
          resizeState.current;
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;
        const rightEdge = startLeft + startWidth;
        const bottomEdge = startTop + startHeight;
        const minWidth = 320;
        const minHeight = 200;
        const maxRight = window.innerWidth - 20;
        const maxBottom = window.innerHeight - 20;

        let nextX = startLeft;
        let nextY = startTop;
        let nextWidth = startWidth;
        let nextHeight = startHeight;

        if (direction.includes("e")) {
          nextWidth = Math.max(minWidth, Math.min(startWidth + deltaX, maxRight - startLeft));
        }

        if (direction.includes("s")) {
          nextHeight = Math.max(minHeight, Math.min(startHeight + deltaY, maxBottom - startTop));
        }

        if (direction.includes("w")) {
          const rawLeft = startLeft + deltaX;
          nextX = Math.max(20, Math.min(rawLeft, rightEdge - minWidth));
          nextWidth = rightEdge - nextX;
        }

        if (direction.includes("n")) {
          const rawTop = startTop + deltaY;
          nextY = Math.max(40, Math.min(rawTop, bottomEdge - minHeight));
          nextHeight = bottomEdge - nextY;
        }

        setWindows((previousWindows) => ({
          ...previousWindows,
          [id]: {
            ...previousWindows[id],
            x: nextX,
            y: nextY,
            width: nextWidth,
            height: nextHeight,
          },
        }));
        return;
      }

      if (!dragState.current) {
        return;
      }

      const { id, offsetX, offsetY } = dragState.current;
      const maxX = Math.max(20, window.innerWidth - windows[id].width - 20);
      const maxY = Math.max(50, window.innerHeight - windows[id].height - 20);
      const nextX = Math.min(Math.max(20, event.clientX - offsetX), maxX);
      const nextY = Math.min(Math.max(40, event.clientY - offsetY), maxY);

      setWindows((previousWindows) => ({
        ...previousWindows,
        [id]: {
          ...previousWindows[id],
          x: nextX,
          y: nextY,
        },
      }));
    };

    const onRelease = () => {
      dragState.current = null;
      resizeState.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onRelease);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onRelease);
    };
  }, [isMobile, windows]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const output = terminalOutputRef.current;
    if (output) {
      output.scrollTop = output.scrollHeight;
    }
  }, [terminalLines]);

  const runCommand = (rawInput: string) => {
    const command = rawInput.trim();
    const normalized = command.toLowerCase();

    if (!command) {
      return;
    }

    if (normalized === "clear") {
      setTerminalLines([]);
      return;
    }

    const outputLines: string[] = [];

    if (normalized === "help") {
      outputLines.push("Commands: help, ls, open <window>, close <window>, whoami, date, clear");
    } else if (normalized === "ls") {
      outputLines.push("about projects education contact terminal");
    } else if (normalized === "whoami") {
      outputLines.push("yu hui - computer engineering and business analytics student");
    } else if (normalized === "date") {
      outputLines.push(new Date().toString());
    } else if (normalized.startsWith("open ")) {
      if (isMobile) {
        outputLines.push(
          "Mobile stacked mode: open is disabled because all sections are already visible.",
        );
        setTerminalLines((previous) => [...previous, `$ ${command}`, ...outputLines]);
        return;
      }

      const target = normalized.replace("open ", "").trim();
      const id = windowNameToIdMap[target];
      if (!id) {
        outputLines.push(`Unknown window: ${target}`);
      } else {
        openWindow(id);
        outputLines.push(`Opened ${target}`);
      }
    } else if (normalized.startsWith("close ")) {
      if (isMobile) {
        outputLines.push("Mobile stacked mode: close is disabled.");
        setTerminalLines((previous) => [...previous, `$ ${command}`, ...outputLines]);
        return;
      }

      const target = normalized.replace("close ", "").trim();
      const id = windowNameToIdMap[target];
      if (!id) {
        outputLines.push(`Unknown window: ${target}`);
      } else {
        closeWindow(id);
        outputLines.push(`Closed ${target}`);
      }
    } else {
      outputLines.push(`Command not found: ${command}`);
    }

    setTerminalLines((previous) => [...previous, `$ ${command}`, ...outputLines]);
  };

  const submitCommand = (event: FormEvent) => {
    event.preventDefault();
    const currentInput = terminalInput;
    setTerminalInput("");
    runCommand(currentInput);
  };

  const orderedOpenWindows = useMemo(
    () =>
      WINDOW_ORDER.map((id) => windows[id])
        .filter((windowState) => windowState.isOpen && !windowState.isMinimized)
        .sort((a, b) => a.zIndex - b.zIndex),
    [windows],
  );

  const toggleThemeMode = () => {
    setThemeMode((previousTheme) => (previousTheme === "dark" ? "light" : "dark"));
  };

  const renderWindowContent = (id: WindowId) => {
    if (id === "about") {
      return <AboutSection />;
    }

    if (id === "projects") {
      return <ProjectsSection />;
    }

    if (id === "education") {
      return <EducationSection />;
    }

    if (id === "contact") {
      return <ContactSection />;
    }

    return (
      <TerminalSection
        terminalLines={terminalLines}
        terminalInput={terminalInput}
        onInputChange={setTerminalInput}
        onSubmit={submitCommand}
        terminalOutputRef={terminalOutputRef}
      />
    );
  };

  return (
    <div className="min-h-screen w-screen overflow-y-auto bg-background text-foreground md:h-screen md:overflow-hidden">
      <nav className="flex h-10 items-center justify-between border-b border-border-theme bg-surface-1 px-4 text-sm">
        <div className="font-semibold">Yu Hui&apos; Portfolio</div>
        <div className="flex items-center gap-4 text-muted-theme">
          <span>{isMobile ? "Mobile" : "Desktop"}</span>
          <span>{time.toLocaleTimeString()}</span>
        </div>
      </nav>

      <main className="md:hidden min-h-[calc(100vh-2.5rem)] w-full space-y-3 bg-background p-3">
        {WINDOW_ORDER.map((id) => (
          <section
            key={id}
            className="overflow-hidden rounded-lg border border-border-theme bg-surface-1 shadow-2xl backdrop-blur"
          >
            <header className="flex h-10 items-center border-b border-border-theme bg-surface-2 px-3">
              <span className="text-sm">{windows[id].title}</span>
            </header>
            <div className="p-4 text-sm leading-6">{renderWindowContent(id)}</div>
          </section>
        ))}
      </main>

      <main className="relative hidden h-[calc(100vh-2.5rem)] w-full bg-background md:block">
        <div className="absolute left-4 top-4 flex flex-col gap-3">
          {ICONS.map((icon) => (
            <DesktopIcon
              key={icon.id}
              id={icon.id}
              label={icon.label}
              icon={icon.icon}
              onOpen={openWindow}
            />
          ))}
        </div>

        {orderedOpenWindows.map((windowState) => (
          <WindowFrame
            key={windowState.id}
            windowState={windowState}
            onFocus={focusWindow}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onToggleMaximize={toggleMaximizeWindow}
            onStartDragging={startDragging}
            onStartResizing={startResizing}
          >
            {renderWindowContent(windowState.id)}
          </WindowFrame>
        ))}

        <TaskbarDock
          apps={ICONS}
          links={DOCK_LINKS}
          onOpenApp={handleDockAppClick}
          themeMode={themeMode}
          onToggleTheme={toggleThemeMode}
          openWindows={{
            about: windows.about.isOpen,
            projects: windows.projects.isOpen,
            education: windows.education.isOpen,
            contact: windows.contact.isOpen,
            terminal: windows.terminal.isOpen,
          }}
        />
      </main>
    </div>
  );
}
