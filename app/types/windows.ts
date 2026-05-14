import { createElement, type ReactNode } from "react";
import { GoBriefcase, GoFile, GoGear, GoMail, GoTerminal } from "react-icons/go";
import { IoFolderOutline } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";

export type WindowId = "about" | "projects" | "education" | "contact" | "terminal";

export type WindowState = {
  id: WindowId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  restoreBounds: { x: number; y: number; width: number; height: number } | null;
  zIndex: number;
};

export const WINDOW_ORDER: WindowId[] = ["about", "projects", "education", "contact", "terminal"];

export const INITIAL_WINDOWS: Record<WindowId, WindowState> = {
  about: {
    id: "about",
    title: "about",
    x: 160,
    y: 80,
    width: 550,
    height: 500,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    restoreBounds: null,
    zIndex: 1,
  },
  projects: {
    id: "projects",
    title: "projects",
    x: 220,
    y: 120,
    width: 520,
    height: 340,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    restoreBounds: null,
    zIndex: 2,
  },
  contact: {
    id: "contact",
    title: "contact.sh",
    x: 340,
    y: 120,
    width: 420,
    height: 500,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    restoreBounds: null,
    zIndex: 4,
  },
  terminal: {
    id: "terminal",
    title: "terminal",
    x: 150,
    y: 50,
    width: 620,
    height: 360,
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    restoreBounds: null,
    zIndex: 5,
  },
  education: {
    id: "education",
    title: "education",
    x: 80,
    y: 160,
    width: 700,
    height: 500,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    restoreBounds: null,
    zIndex: 3,
  },
};

export const ICONS: {
  id: WindowId;
  label: string;
  icon: ReactNode;
}[] = [
  { id: "about", label: "About", icon: createElement(GoFile) },
  { id: "projects", label: "Projects", icon: createElement(IoFolderOutline) },
  { id: "education", label: "Education", icon: createElement(GoBriefcase) },
  { id: "contact", label: "Contact", icon: createElement(AiOutlineMessage) },
  { id: "terminal", label: "Terminal", icon: createElement(GoTerminal) },
];

export const windowNameToIdMap: Record<string, WindowId> = {
  about: "about",
  projects: "projects",
  education: "education",
  contact: "contact",
  terminal: "terminal",
};
