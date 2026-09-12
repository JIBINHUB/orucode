"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => <pre className="code-fallback">Loading editor…</pre>,
});

export type CodeLang = "html" | "css" | "js" | "jsx";

interface Props {
  value: string;
  lang: CodeLang;
  editable?: boolean;
  onChange?: (value: string) => void;
  height?: string;
}

export default function CodeView({ value, lang, editable = false, onChange, height }: Props) {
  const extensions = useMemo(() => {
    if (lang === "html") return [html()];
    if (lang === "css") return [css()];
    return [javascript({ jsx: lang === "jsx" })];
  }, [lang]);

  return (
    <CodeMirror
      value={value}
      theme={vscodeLight}
      extensions={extensions}
      editable={editable}
      readOnly={!editable}
      onChange={onChange}
      height={height}
      basicSetup={{ foldGutter: false, highlightActiveLine: editable, highlightActiveLineGutter: editable }}
    />
  );
}
