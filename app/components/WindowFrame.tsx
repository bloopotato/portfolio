import { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { WindowId, WindowState } from "../types/windows";

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

type WindowFrameProps = {
  windowState: WindowState;
  onFocus: (id: WindowId) => void;
  onClose: (id: WindowId) => void;
  onMinimize: (id: WindowId) => void;
  onToggleMaximize: (id: WindowId) => void;
  onStartDragging: (event: ReactMouseEvent<HTMLElement>, id: WindowId) => void;
  onStartResizing?: (
    event: ReactMouseEvent<HTMLElement>,
    id: WindowId,
    direction: ResizeDirection,
  ) => void;
  children: ReactNode;
};

const RESIZE_HANDLES: { direction: ResizeDirection; className: string; label: string }[] = [
  {
    direction: "n",
    className: "absolute left-3 right-3 top-0 h-1 cursor-n-resize",
    label: "Resize north",
  },
  {
    direction: "s",
    className: "absolute bottom-0 left-3 right-3 h-1 cursor-s-resize",
    label: "Resize south",
  },
  {
    direction: "e",
    className: "absolute bottom-3 right-0 top-3 w-1 cursor-e-resize",
    label: "Resize east",
  },
  {
    direction: "w",
    className: "absolute bottom-3 left-0 top-3 w-1 cursor-w-resize",
    label: "Resize west",
  },
  {
    direction: "ne",
    className: "absolute right-0 top-0 h-3 w-3 cursor-ne-resize",
    label: "Resize north east",
  },
  {
    direction: "nw",
    className: "absolute left-0 top-0 h-3 w-3 cursor-nw-resize",
    label: "Resize north west",
  },
  {
    direction: "se",
    className: "absolute bottom-0 right-0 h-3 w-3 cursor-se-resize",
    label: "Resize south east",
  },
  {
    direction: "sw",
    className: "absolute bottom-0 left-0 h-3 w-3 cursor-sw-resize",
    label: "Resize south west",
  },
];

export function WindowFrame({
  windowState,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onStartDragging,
  onStartResizing,
  children,
}: WindowFrameProps) {
  return (
    <section
      style={{
        left: windowState.x,
        top: windowState.y,
        width: windowState.width,
        height: windowState.height,
        zIndex: windowState.zIndex,
      }}
      onMouseDown={() => onFocus(windowState.id)}
      className="absolute overflow-hidden rounded-lg border-2 border-border-theme bg-surface-1 shadow-2xl backdrop-blur"
    >
      <header
        onMouseDown={(event) => onStartDragging(event, windowState.id)}
        className={`flex h-10 items-center justify-between border-b-2 border-border-theme bg-surface-2 px-3 font-outfit font-semibold ${
          windowState.isMaximized ? "cursor-default" : "cursor-move"
        }`}
      >
        <span className="text-sm">{windowState.title}</span>
        <div className="w-16" aria-hidden="true" />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={() => onMinimize(windowState.id)}
            className="h-3.5 w-3.5 rounded-full bg-amber-400 transition hover:bg-amber-300"
            aria-label="Minimize window"
            title="Minimize"
          />
          <button
            type="button"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={() => onToggleMaximize(windowState.id)}
            className="h-3.5 w-3.5 rounded-full bg-emerald-500 transition hover:bg-emerald-400"
            aria-label={windowState.isMaximized ? "Restore window" : "Expand window"}
            title={windowState.isMaximized ? "Restore" : "Expand"}
          />
          <button
            type="button"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={() => onClose(windowState.id)}
            className="h-3.5 w-3.5 rounded-full bg-rose-500 transition hover:bg-rose-400"
            aria-label="Close window"
            title="Close"
          />
        </div>
      </header>

      <div className="h-[calc(100%-2.5rem)] overflow-auto text-sm leading-6">{children}</div>

      {onStartResizing && !windowState.isMaximized
        ? RESIZE_HANDLES.map((handle) => (
            <button
              key={handle.direction}
              type="button"
              onMouseDown={(event) => onStartResizing(event, windowState.id, handle.direction)}
              className={handle.className}
              aria-label={handle.label}
            />
          ))
        : null}
    </section>
  );
}
