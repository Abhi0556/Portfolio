import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const { window: jsdomWindow } = new JSDOM("");
const purify = DOMPurify(
  jsdomWindow as unknown as Window & typeof globalThis
);

export function sanitize(value: string): string {
  return purify.sanitize(value, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

export function sanitizeJsonArray(value: string[]): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === "string" ? sanitize(item) : ""));
}