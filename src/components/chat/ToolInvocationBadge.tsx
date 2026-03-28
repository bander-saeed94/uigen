"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocationBadgeProps {
  toolName: string;
  args: Record<string, unknown>;
  state: string;
}

function getLabel(toolName: string, args: Record<string, unknown>): string {
  const path = args?.path as string | undefined;
  const filename = path ? path.split("/").filter(Boolean).pop() ?? "" : "";

  if (toolName === "str_replace_editor") {
    const command = args?.command as string | undefined;
    switch (command) {
      case "create":
        return `Creating ${filename}`.trim();
      case "str_replace":
      case "insert":
        return `Editing ${filename}`.trim();
      case "view":
        return `Reading ${filename}`.trim();
      default:
        return `Editing ${filename}`.trim();
    }
  }

  if (toolName === "file_manager") {
    const command = args?.command as string | undefined;
    if (command === "rename") {
      const newPath = args?.new_path as string | undefined;
      const newFilename = newPath
        ? newPath.split("/").filter(Boolean).pop() ?? ""
        : "";
      return `Renaming to ${newFilename}`.trim();
    }
    if (command === "delete") {
      return `Deleting ${filename}`.trim();
    }
  }

  return toolName;
}

export function ToolInvocationBadge({
  toolName,
  args,
  state,
}: ToolInvocationBadgeProps) {
  const label = getLabel(toolName, args);
  const isDone = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
