import { getCollection } from "astro:content";

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export const getServices = async () => (await getCollection("services")).sort(byOrder);
export const getTeam = async () => (await getCollection("team")).sort(byOrder);
export const getPortfolio = async () => (await getCollection("portfolio")).sort(byOrder);
export const getPosts = async () =>
  (await getCollection("blog")).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

/** "March 29,2026" (template blog meta style) or "02 March, 2026" (template home cards). */
export function formatDate(d: Date, style: "meta" | "card" | "short" = "meta") {
  const day = d.getUTCDate();
  const month = d.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  const year = d.getUTCFullYear();
  if (style === "card") return `${String(day).padStart(2, "0")} ${month}, ${year}`;
  if (style === "short") return `${day} ${month} ${year}`;
  return `${month} ${day},${year}`;
}
