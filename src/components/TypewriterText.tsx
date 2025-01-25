import React, { ReactNode, useMemo, useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  children: ReactNode; // can be text, <span>, <a>, etc.
  typingSpeed?: number; // ms between typed characters
  onTypingFinish?: () => void; // Add new prop
}

export default function TypewriterText({
  children,
  typingSpeed = 20,
  onTypingFinish, // Add to destructuring
}: TypewriterTextProps) {
  const [typedHTML, setTypedHTML] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // 1) Convert children to an HTML string only if children actually changed
  const htmlString = useMemo(() => {
    return reactNodeToHtmlString(children);
  }, [children]);

  // 2) On mount (or when htmlString changes), parse & type it out
  useEffect(() => {
    const tokens = parseHTMLIntoTokens(htmlString);

    // Reset local state
    setTypedHTML("");
    setIsTyping(true);

    // Add abort controller for cleanup
    const abortController = new AbortController();

    // Convert to async function for better cleanup
    async function runTypingEffect() {
      let currentTokenIndex = 0;
      let currentCharIndex = 0;
      let currentOutput = "";

      while (
        currentTokenIndex < tokens.length &&
        !abortController.signal.aborted
      ) {
        const token = tokens[currentTokenIndex];

        if (token.type === "tag") {
          // Insert entire tag at once
          currentOutput += token.content;
          currentTokenIndex++;
          currentCharIndex = 0;
        } else {
          // Insert one character from text
          const text = token.content;
          currentOutput += text[currentCharIndex];
          currentCharIndex++;

          if (currentCharIndex >= text.length) {
            currentTokenIndex++;
            currentCharIndex = 0;
          }
        }

        setTypedHTML(currentOutput);
        await new Promise((resolve) => setTimeout(resolve, typingSpeed));
      }

      if (!abortController.signal.aborted) {
        setIsTyping(false);
        onTypingFinish?.();
      }
    }

    runTypingEffect();

    return () => {
      abortController.abort();
    };
  }, [htmlString, onTypingFinish, typingSpeed]); // Add all dependencies

  return (
    <span style={{ display: "inline-block", position: "relative" }}>
      {/* Render the typed HTML so far */}
      <span dangerouslySetInnerHTML={{ __html: typedHTML }} />

      {isTyping && (
        <span className="inline-block w-3 h-3 bg-white ml-1 rounded-full animate-blink" />
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </span>
  );
}

// -----------------------
// Helper Functions
// -----------------------

/**
 * Split an HTML string into an array of tokens:
 * {type:'tag', content:'<span style="color:red">'}
 * or
 * {type:'text', content:'Hello'}
 */
function parseHTMLIntoTokens(htmlString: string) {
  const pattern = /(<[^>]*>)|([^<]+)/g;
  const tokens: { type: "tag" | "text"; content: string }[] = [];

  let match;
  while ((match = pattern.exec(htmlString)) !== null) {
    if (match[1]) {
      tokens.push({ type: "tag", content: match[1] });
    } else if (match[2]) {
      tokens.push({ type: "text", content: match[2] });
    }
  }
  return tokens;
}

/**
 * Recursively convert a ReactNode (string, element, array, etc.) into an HTML string:
 *  - Built-in HTML tags => <tag attr="...">childHtml</tag>
 *  - style objects => style="key:val;key2:val2"
 *  - className => class="..."
 *  - text => escape special chars
 *  - arrays => join children
 *  - custom components => skip or handle specially
 */
function reactNodeToHtmlString(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string") {
    return escapeHtml(node);
  }

  if (Array.isArray(node)) {
    return node.map(reactNodeToHtmlString).join("");
  }

  if (React.isValidElement(node)) {
    const { type, props } = node;

    if (typeof type === "string") {
      // It's a native HTML element (span, div, a, etc.)
      let attrs = "";
      for (const [propKey, propValue] of Object.entries(props)) {
        if (propKey === "children" || propValue == null) continue;

        if (propKey === "className") {
          attrs += ` class="${propValue}"`;
        } else if (propKey === "style" && typeof propValue === "object") {
          const styleString = Object.entries(propValue)
            .map(([k, v]) => `${camelToKebabCase(k)}:${v}`)
            .join(";");
          attrs += ` style="${styleString}"`;
        } else {
          // e.g. href, id, data-*, etc.
          attrs += ` ${propKey}="${propValue}"`;
        }
      }

      // Recursively process children
      const childHtml = reactNodeToHtmlString(props.children);
      return `<${type}${attrs}>${childHtml}</${type}>`;
    } else {
      // It's a custom component (like <MyFancyButton />).
      // We can skip or decide how to handle.
      return "";
    }
  }

  // Fallback
  return "";
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function camelToKebabCase(str: string) {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}
