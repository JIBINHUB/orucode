"use client";

import { CopyIcon } from "./Icons";
import { copyText, useStore } from "@/lib/store";

export default function CopyPrompt({ text }: { text: string }) {
  const { toast } = useStore();
  return (
    <div className="svc-prompt">
      <pre>{text}</pre>
      <button className="btn btn-primary btn-sm" onClick={() => copyText(text).then(() => toast("Prompt copied"))}>
        <CopyIcon size={14} /> Copy prompt
      </button>
    </div>
  );
}
