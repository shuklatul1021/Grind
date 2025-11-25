import { useEffect, useRef } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/themes/prism-tomorrow.css";


type CodeEditorProps = {
  code: string;
  setCode: (value: string) => void;
  language?: string;
  placeholder?: string;
  minHeight?: number | string;
};

export default function CodeEditor({
  code,
  setCode,
  language,
  placeholder = "Write your code here...",
  minHeight = 400,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const gutterRef = useRef<HTMLPreElement | null>(null);

  const prismLang = (() => {
    switch (language) {
      case "c":
        return "c";
      case "cpp":
        return "cpp";
      case "java":
        return "java";
      case "python":
        return "python";
      case "javascript":
        return "javascript";
      case "typescript":
        return "typescript";
      case "jsx":
        return "jsx";
      case "go":
        return "go";
      case "rust":
        return "rust";
      default:
        return "javascript";
    }
  })();
  const highlight = (codeStr: string) => {
    try {
      const grammar = (Prism.languages as any)[prismLang] || Prism.languages["javascript"];
      return Prism.highlight(codeStr, grammar, prismLang);
    } catch {
      return codeStr.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  };

  const lines = code ? code.split("\n") : [""];
  const lineNumbers = Array.from({ length: lines.length }, (_, i) => String(i + 1)).join("\n");

  useEffect(() => {
    const editorEl = editorRef.current;
    const gutterEl = gutterRef.current;
    if (!editorEl || !gutterEl) return;

    const onScroll = () => {
      gutterEl.scrollTop = editorEl.scrollTop;
    };

    editorEl.addEventListener("scroll", onScroll, { passive: true });
    return () => editorEl.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative rounded-md border border-border/40 bg-muted/30 h-full">
      <div className="flex">
        <pre
          ref={gutterRef}
          aria-hidden
          className="select-none bg-transparent pr-3 text-right text-xs text-muted-foreground leading-6 px-3 py-3 overflow-hidden"
          style={{
            width: 56,
            minWidth: 56,
            maxWidth: 56,
            margin: 0,
            borderRight: "1px solid rgba(148,163,184,0.08)",
            lineHeight: "1.5rem",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",
            maxHeight: "min(70vh, 800px)",
            overflow: "auto",
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
          {lineNumbers}
        </pre>
        <div
          ref={editorRef}
          className="flex-1 overflow-auto"
          style={{
            maxHeight: "min(70vh, 800px)",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Courier New', monospace",
          }}
        >
          <Editor
            value={code}
            onValueChange={(val) => setCode(val)}
            highlight={(c) => highlight(c)}
            padding={12}
            textareaId="code-editor"
            placeholder={placeholder}
            style={{
              fontFamily: "inherit",
              fontSize: 14,
              outline: "none",
              background: "transparent",
              minHeight,
              whiteSpace: "pre",
            }}
            preClassName="text-sm leading-6"
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-border/40 px-3 py-1.5 text-xs text-muted-foreground">
        <div>{lines.length} {lines.length === 1 ? "line" : "lines"}</div>
        <div>{language}</div>
      </div>
    </div>
  );
}