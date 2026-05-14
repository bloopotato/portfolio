import { FormEvent, RefObject } from "react";

type TerminalSectionProps = {
  terminalLines: string[];
  terminalInput: string;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  terminalOutputRef: RefObject<HTMLDivElement | null>;
};

export function TerminalSection({
  terminalLines,
  terminalInput,
  onInputChange,
  onSubmit,
  terminalOutputRef,
}: TerminalSectionProps) {
  return (
    <div className="flex h-full flex-col terminal-font p-4">
      <div
        ref={terminalOutputRef}
        className="mb-3 flex-1 overflow-auto rounded-md border-2 border-border-theme bg-background p-3 text-xs"
      >
        {terminalLines.length === 0 ? (
          <p className="text-muted-theme">Terminal cleared.</p>
        ) : (
          terminalLines.map((line, index) => (
            <p key={`${line}-${index}`} className="whitespace-pre-wrap text-foreground">
              {line}
            </p>
          ))
        )}
      </div>
      <form onSubmit={onSubmit} className="flex items-center gap-2 text-xs">
        <span className="text-foreground">$</span>
        <input
          value={terminalInput}
          onChange={(event) => onInputChange(event.target.value)}
          className="flex-1 rounded-md border-2 border-border-theme bg-surface-3 px-2 py-1 text-foreground outline-none focus:border-emerald-400"
          placeholder="type a command"
        />
      </form>
    </div>
  );
}
