import type { ReactNode } from "react";

import { WindowId } from "../types/windows";

type DesktopIconProps = {
  id: WindowId;
  label: string;
  icon: ReactNode;
  onOpen: (id: WindowId) => void;
};

export function DesktopIcon({ id, label, icon, onOpen }: DesktopIconProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(id)}
      className="flex w-24 flex-col cursor-pointer items-center rounded-md p-2 text-xs hover:bg-white/20"
    >
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}
