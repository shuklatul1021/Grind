import { useEffect, useRef, useState } from "react";
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
import { useTheme } from "../contexts/ThemeContext";
import { KEYWORDS } from "../format/ResponseFormatter";


// Helper to get caret coordinates
const getCaretCoordinates = (
  element: HTMLTextAreaElement,
  position: number
) => {
  const div = document.createElement("div");
  const style = window.getComputedStyle(element);

  Array.from(style).forEach((prop) => {
    div.style.setProperty(prop, style.getPropertyValue(prop));
  });

  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.top = "0";
  div.style.left = "0";
  div.style.overflow = "hidden";

  div.textContent = element.value.substring(0, position);

  const span = document.createElement("span");
  span.textContent = element.value.substring(position) || ".";
  div.appendChild(span);

  document.body.appendChild(div);

  const coordinates = {
    top: span.offsetTop + parseInt(style.borderTopWidth),
    left: span.offsetLeft + parseInt(style.borderLeftWidth),
    height: parseInt(style.lineHeight),
  };

  document.body.removeChild(div);

  return coordinates;
};

// Custom VS Code Dark Theme for Prism
const vsCodeDarkTheme = `
  code[class*="language-"],
  pre[class*="language-"] {
    color: #d4d4d4;
    text-shadow: none;
    font-family: "JetBrains Mono", "Fira Code", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    font-size: 14px;
    line-height: 1.6;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    tab-size: 4;
    hyphens: none;
  }

  /* Token Colors */
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #6a9955;
    font-style: italic;
  }

  .token.punctuation {
    color: #d4d4d4;
  }

  .token.namespace {
    opacity: .7;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #b5cea8;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #ce9178;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #d4d4d4;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #569cd6;
  }

  .token.function,
  .token.class-name {
    color: #dcdcaa;
  }

  .token.regex,
  .token.important,
  .token.variable {
    color: #9cdcfe;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }
  
  /* Editor Specific Overrides */
  .editor-container textarea {
    outline: none !important;
  }
`;

// Custom VS Code Light Theme for Prism
const vsCodeLightTheme = `
  code[class*="language-"],
  pre[class*="language-"] {
    color: #000000;
    text-shadow: none;
    font-family: "JetBrains Mono", "Fira Code", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    font-size: 14px;
    line-height: 1.6;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    tab-size: 4;
    hyphens: none;
  }

  /* Token Colors */
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #008000;
    font-style: italic;
  }

  .token.punctuation {
    color: #000000;
  }

  .token.namespace {
    opacity: .7;
  }

  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #098658;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: #a31515;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #000000;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #0000ff;
  }

  .token.function,
  .token.class-name {
    color: #795e26;
  }

  .token.regex,
  .token.important,
  .token.variable {
    color: #0000ff;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }

  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }
  
  /* Editor Specific Overrides */
  .editor-container textarea {
    outline: none !important;
  }
`;

type CodeEditorProps = {
  code: string;
  setCode: (value: string) => void;
  language?: string;
  placeholder?: string;
  minHeight?: number | string;
};

const BRACKET_PAIRS: Record<string, string> = {
  "{": "}",
  "[": "]",
  "(": ")",
  '"': '"',
  "'": "'",
  "`": "`",
};

export default function CodeEditor({
  code,
  setCode,
  language,
  placeholder = "Write your code here...",
}: CodeEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const gutterRef = useRef<HTMLPreElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-suggest state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0 });
  const [currentWord, setCurrentWord] = useState("");

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
      const grammar =
        (Prism.languages as any)[prismLang] || Prism.languages["javascript"];
      return Prism.highlight(codeStr, grammar, prismLang);
    } catch {
      return codeStr
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
  };

  const lines = code ? code.split("\n") : [""];
  const lineNumbers = Array.from({ length: lines.length }, (_, i) =>
    String(i + 1)
  ).join("\n");

  const handleValueChange = (newCode: string) => {
    setCode(newCode);
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const { selectionStart } = textarea;
    const textBeforeCursor = newCode.substring(0, selectionStart);
    const words = textBeforeCursor.split(/[\s\(\)\{\}\[\]\.\,\;\'\"\`]/);
    const lastWord = words[words.length - 1];

    if (lastWord && lastWord.length > 0) {
      const langKeywords =
        KEYWORDS[language || "javascript"] || KEYWORDS["javascript"];
      const filtered = langKeywords.filter(
        (k) => k.startsWith(lastWord) && k !== lastWord
      );

      if (filtered.length > 0) {
        const coords = getCaretCoordinates(textarea, selectionStart);
        setSuggestionPos({
          top: coords.top + coords.height,
          left: coords.left,
        });
        setSuggestions(filtered);
        setShowSuggestions(true);
        setSuggestionIndex(0);
        setCurrentWord(lastWord);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const insertSuggestion = (suggestion: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const { selectionStart } = textarea;
    const textBeforeCursor = code.substring(0, selectionStart);
    const textAfterCursor = code.substring(selectionStart);
    const newTextBefore = textBeforeCursor.substring(
      0,
      textBeforeCursor.length - currentWord.length
    );

    const newCode = newTextBefore + suggestion + textAfterCursor;
    const newCursorPos = newTextBefore.length + suggestion.length;

    setCode(newCode);
    setShowSuggestions(false);

    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
      textarea.focus();
    });
  };

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

  useEffect(() => {
    const textarea = document.getElementById(
      "code-editor"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    textareaRef.current = textarea;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Auto-suggest navigation
      if (showSuggestions) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSuggestionIndex((prev) => (prev + 1) % suggestions.length);
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSuggestionIndex(
            (prev) => (prev - 1 + suggestions.length) % suggestions.length
          );
          return;
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          insertSuggestion(suggestions[suggestionIndex]);
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setShowSuggestions(false);
          return;
        }
      }

      const target = e.target as HTMLTextAreaElement;
      const { selectionStart, selectionEnd, value } = target;

      const char = e.key;
      if (BRACKET_PAIRS[char] && selectionStart === selectionEnd) {
        e.preventDefault();
        const closingChar = BRACKET_PAIRS[char];
        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionEnd);
        const newValue = before + char + closingChar + after;
        const newCursorPos = selectionStart + 1;

        setCode(newValue);

        requestAnimationFrame(() => {
          const newTextarea = document.getElementById(
            "code-editor"
          ) as HTMLTextAreaElement;
          if (newTextarea) {
            newTextarea.selectionStart = newTextarea.selectionEnd =
              newCursorPos;
            newTextarea.focus();
          }
        });
        return;
      }

      const nextChar = value[selectionStart];
      if (
        selectionStart === selectionEnd &&
        (char === "}" ||
          char === "]" ||
          char === ")" ||
          char === '"' ||
          char === "'" ||
          char === "`") &&
        nextChar === char
      ) {
        e.preventDefault();
        const newCursorPos = selectionStart + 1;

        requestAnimationFrame(() => {
          const newTextarea = document.getElementById(
            "code-editor"
          ) as HTMLTextAreaElement;
          if (newTextarea) {
            newTextarea.selectionStart = newTextarea.selectionEnd =
              newCursorPos;
            newTextarea.focus();
          }
        });
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const currentLineStart =
          value.lastIndexOf("\n", selectionStart - 1) + 1;
        const currentLine = value.substring(currentLineStart, selectionStart);
        const indentMatch = currentLine.match(/^\s*/);
        const currentIndent = indentMatch ? indentMatch[0] : "";
        const indentSize = language === "python" ? "    " : "  ";
        const trimmedLine = currentLine.trim();
        let extraIndent = "";

        if (language === "python") {
          if (trimmedLine.endsWith(":")) {
            extraIndent = indentSize;
          }
        } else {
          if (
            trimmedLine.endsWith("{") ||
            trimmedLine.endsWith("[") ||
            trimmedLine.endsWith("(")
          ) {
            extraIndent = indentSize;
          }
        }

        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionEnd);
        const newValue = before + "\n" + currentIndent + extraIndent + after;
        const newCursorPos =
          selectionStart + 1 + currentIndent.length + extraIndent.length;

        setCode(newValue);

        requestAnimationFrame(() => {
          const newTextarea = document.getElementById(
            "code-editor"
          ) as HTMLTextAreaElement;
          if (newTextarea) {
            newTextarea.selectionStart = newTextarea.selectionEnd =
              newCursorPos;
            newTextarea.focus();
          }
        });
        return;
      }

      // Tab for indentation
      if (e.key === "Tab") {
        e.preventDefault();
        const indentSize = language === "python" ? "    " : "  ";
        const before = value.substring(0, selectionStart);
        const after = value.substring(selectionEnd);
        const newValue = before + indentSize + after;
        const newCursorPos = selectionStart + indentSize.length;

        setCode(newValue);

        requestAnimationFrame(() => {
          const newTextarea = document.getElementById(
            "code-editor"
          ) as HTMLTextAreaElement;
          if (newTextarea) {
            newTextarea.selectionStart = newTextarea.selectionEnd =
              newCursorPos;
            newTextarea.focus();
          }
        });
        return;
      }
    };

    textarea.addEventListener("keydown", handleKeyDown);
    const handleBlur = () => setTimeout(() => setShowSuggestions(false), 100);
    textarea.addEventListener("blur", handleBlur);
    textarea.addEventListener("click", () => setShowSuggestions(false));

    return () => {
      textarea.removeEventListener("keydown", handleKeyDown);
      textarea.removeEventListener("blur", handleBlur);
      textarea.removeEventListener("click", () => setShowSuggestions(false));
    };
  }, [code, setCode, showSuggestions, suggestions, suggestionIndex]);

  return (
    <div
      className="relative h-full flex flex-col overflow-hidden group transition-colors duration-200"
      style={{ backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff" }}
    >
      <style>{theme === "dark" ? vsCodeDarkTheme : vsCodeLightTheme}</style>
      <div className="flex flex-1 overflow-hidden relative">
        {/* Gutter */}
        <div
          className="select-none text-right overflow-hidden shrink-0 z-10 transition-colors duration-200"
          style={{
            width: 50,
            backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
            borderRight: `1px solid ${theme === "dark" ? "#333" : "#e5e5e5"}`,
            color: theme === "dark" ? "#858585" : "#6e7681",
          }}
        >
          <pre
            ref={gutterRef}
            className="m-0 pt-3 pb-3 pr-3 text-[14px] leading-[1.6] font-mono bg-transparent"
            style={{
              fontFamily:
                '"JetBrains Mono", "Fira Code", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
            }}
          >
            {lineNumbers}
          </pre>
        </div>
        <div
          ref={editorRef}
          className="flex-1 overflow-auto editor-scroll-container relative"
          style={{
            fontFamily:
              '"JetBrains Mono", "Fira Code", Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
          }}
        >
          <Editor
            value={code}
            onValueChange={handleValueChange}
            highlight={(c) => highlight(c)}
            padding={12}
            textareaId="code-editor"
            placeholder={placeholder}
            style={{
              fontFamily: "inherit",
              fontSize: 14,
              backgroundColor: "transparent",
              minHeight: "100%",
              lineHeight: "1.6",
            }}
            className="editor-container"
          />

          {/* Auto-suggest Popup */}
          {showSuggestions && (
            <div
              className="absolute z-50 rounded-md shadow-lg border overflow-hidden flex flex-col min-w-[150px] max-h-[200px] overflow-y-auto"
              style={{
                top: suggestionPos.top,
                left: suggestionPos.left,
                backgroundColor: theme === "dark" ? "#252526" : "#f3f3f3",
                borderColor: theme === "dark" ? "#454545" : "#e5e5e5",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  className={`px-3 py-1 text-xs cursor-pointer flex items-center gap-2 ${
                    index === suggestionIndex
                      ? theme === "dark"
                        ? "bg-[#04395e] text-white"
                        : "bg-[#0060c0] text-white"
                      : theme === "dark"
                        ? "text-[#cccccc] hover:bg-[#2a2d2e]"
                        : "text-[#333333] hover:bg-[#e8e8e8]"
                  }`}
                  onClick={() => insertSuggestion(suggestion)}
                >
                  <span
                    className={`w-3 h-3 flex items-center justify-center text-[8px] border rounded-sm ${
                      theme === "dark" ? "border-white/20" : "border-black/20"
                    }`}
                  >
                    abc
                  </span>
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="flex items-center justify-between px-3 py-1 text-[11px] font-medium select-none transition-colors duration-200"
        style={{
          backgroundColor: "#000000",
          borderTop: `1px solid ${theme === "dark" ? "#333" : "#e5e5e5"}`,
          color: "#ffffff",
          border : "1px solid #333"
        }}
      >
        <div className="flex items-center gap-3">
          <span>main*</span>
          <span>Ln {lines.length}, Col 1</span>
        </div>
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span className="uppercase">{language}</span>
        </div>
      </div>
    </div>
  );
}
