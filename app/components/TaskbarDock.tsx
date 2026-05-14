import type { ReactNode } from "react";

import { WindowId } from "../types/windows";

import { GoSun, GoMoon } from "react-icons/go";

type DockApp = {
  id: WindowId;
  label: string;
  icon: ReactNode;
};

type DockLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

type TaskbarDockProps = {
  apps: DockApp[];
  links: DockLink[];
  openWindows: Record<WindowId, boolean>;
  onOpenApp: (id: WindowId) => void;
  themeMode: "dark" | "light";
  onToggleTheme: () => void;
};

export function TaskbarDock({
  apps,
  links,
  openWindows,
  onOpenApp,
  themeMode,
  onToggleTheme,
}: TaskbarDockProps) {
  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border-2 border-border-theme bg-surface-3 px-3 py-2 shadow-2xl backdrop-blur">
        {apps.map((app) => (
          <button
            key={app.id}
            type="button"
            onClick={() => onOpenApp(app.id)}
            title={app.label}
            aria-label={`Open ${app.label}`}
            className="group relative flex h-12 w-12 items-center cursor-pointer justify-center rounded-xl border-2 border-border-theme bg-surface-4 text-2xl transition hover:-translate-y-0.5"
          >
            <span aria-hidden="true">{app.icon}</span>
            {openWindows[app.id] ? (
              <span
                className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-emerald-400"
                aria-hidden="true"
              />
            ) : null}
          </button>
        ))}

        <div className="mx-1 h-8 w-px bg-border-theme" aria-hidden="true" />

        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            title={link.label}
            aria-label={link.label}
            className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-border-theme bg-surface-4 text-2xl transition hover:-translate-y-0.5"
          >
            <span aria-hidden="true">{link.icon}</span>
          </a>
        ))}

        <div className="mx-1 h-8 w-px bg-border-theme" aria-hidden="true" />

        <button
          type="button"
          onClick={onToggleTheme}
          title={themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border-2 border-border-theme bg-surface-4 text-2xl transition hover:-translate-y-0.5"
        >
          <span>{themeMode === "dark" ? <GoSun /> : <GoMoon />}</span>
        </button>
      </div>
    </footer>
  );
}
