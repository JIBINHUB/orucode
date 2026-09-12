/**
 * Tagged template for authoring code snippets. Keeps backslashes raw (like
 * String.raw) and strips the common leading indentation plus the first and
 * last blank lines, so snippets can be indented naturally in data files.
 */
export function code(strings: TemplateStringsArray, ...values: unknown[]): string {
  const raw = strings.raw.reduce(
    (acc, part, i) => acc + part + (i < values.length ? String(values[i]) : ""),
    "",
  );
  const lines = raw.replace(/^[ \t]*\n/, "").replace(/\n[ \t]*$/, "").split("\n");
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => (line.match(/^[ \t]*/) as RegExpMatchArray)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(min)).join("\n");
}

export function indent(text: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.trim() ? pad + line : line))
    .join("\n");
}

export function toPascalCase(input: string): string {
  const name = input
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
  return /^[A-Z]/.test(name) ? name : "Component" + name;
}
