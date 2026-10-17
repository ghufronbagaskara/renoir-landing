import { expect, test } from "bun:test";
import { searchCatalog, type SearchEntry } from "./search-catalog";
const entries: SearchEntry[] = [
  { locale: "en", url: "/services/internal/", title: "Internal systems", excerpt: "AI for operators", text: "AI café operator reports" },
  { locale: "en", url: "/portfolio/orders/", title: "Order workflow", excerpt: "Order dashboard", text: "Internal systems for operators" },
  { locale: "id", url: "/id/layanan/internal/", title: "Sistem internal", excerpt: "AI untuk operator", text: "AI cafe operator laporan" },
];
test("catalog matches all query words, normalizes accents, prioritizes titles and respects locale", () => {
  expect(searchCatalog(entries, "INTERNAL", "en").map(result => result.url)).toEqual(["/services/internal/", "/portfolio/orders/"]);
  expect(searchCatalog(entries, "cafe AI", "en")).toHaveLength(1);
  expect(searchCatalog(entries, "AI missing", "en")).toHaveLength(0);
  expect(searchCatalog(entries, "AI", "id")[0].url).toBe("/id/layanan/internal/");
  expect(searchCatalog(entries, " ", "en")).toHaveLength(0);
});
