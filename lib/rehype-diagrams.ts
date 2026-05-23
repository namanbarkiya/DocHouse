import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

type HastTextChild = { type: "text"; value: string };

const MERMAID_LANGS = new Set(["language-mermaid", "mermaid"]);

/**
 * Extracts ` ```mermaid ` code blocks and replaces them with sentinel
 * `<div data-diagram-type="mermaid" data-diagram-source="…" />` elements,
 * so the code-highlighter does not try to tokenise them and the React layer
 * can render them via a client component.
 *
 * Must run *before* `rehypeShiki`.
 */
export function rehypeExtractDiagrams() {
  return (tree: Root) => {
    visit(tree, "element", (node, index, parent) => {
      if (
        node.tagName !== "pre" ||
        index == null ||
        !parent ||
        !("children" in parent)
      ) {
        return;
      }
      const code = (node.children?.[0] as Element | undefined) ?? null;
      if (!code || code.tagName !== "code") return;

      const cls = code.properties?.className;
      const classList: string[] = Array.isArray(cls)
        ? cls.filter((c): c is string => typeof c === "string")
        : [];
      const isMermaid = classList.some((c) => MERMAID_LANGS.has(c));
      if (!isMermaid) return;

      const source = (code.children as HastTextChild[])
        .map((c) => (c.type === "text" ? c.value : ""))
        .join("");
      if (!source.trim()) return;

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["diagram-block", "diagram-mermaid"],
          // hast stores data-* attributes camelCased. The component reads
          // these via `node.properties.dataDiagramSource`.
          dataDiagramType: "mermaid",
          dataDiagramSource: source,
        },
        children: [],
      } as Element;
    });
  };
}
