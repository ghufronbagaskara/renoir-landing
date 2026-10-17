# Home problem section — design research

Research date: 2026-10-17. Scope: replace the scattered Home problem composition while retaining its purpose: information across chat and spreadsheets becomes one operational workflow with AI assistance and human decisions.

## Findings in the existing composition

The headline, detached bottom-left statement, two small unrelated project thumbnails and narrow right copy create four competing reading positions. The marketing-site thumbnail does not explain the internal-system problem. A larger coherent operational illustration should carry the story; real Work remains evidence, separate from conceptual AI capability.

## References inspected

| Primary source | Observed pattern | Useful adaptation | Avoid |
| --- | --- | --- | --- |
| [Magic UI Animated Beam on 21st](https://21st.dev/@dillionverma/components/animated-beam), [official component](https://magicui.design/docs/components/animated-beam) | Six peripheral tool icons connect to a larger central node; curved paths explain a shared integration point. The component is a React implementation, with Framer Motion listed by 21st. | A small number of named information sources converging into one order record. Thin cobalt SVG connectors make the relationship explicit. | Installing the React component, branded tool logo soup or perpetual traveling beams. |
| [Image Compare on 21st](https://21st.dev/@kuratlielia/components/image-compare) | A bounded before/after canvas with a moving divider reveals two versions of the same subject. The published component lists Motion and lucide-react. | Show the same order before and after consolidation so the comparison has a concrete subject. | A mandatory drag interaction that hides half the explanation, especially on phones; an extra island for a simple comparison. |
| [Nodeflow — Odama on Dribbble](https://dribbble.com/shots/26361098-Nodeflow-AI-Workflow-Landing-Page) | The inspected shot uses one dominant workflow canvas: restrained dark node cards, thin electric-blue connections, sparse typography and a clear group boundary. Supporting features repeat that visual language. | One composition with a shared baseline and scale; the information flow itself becomes the signature image. | Copying the developer-oriented API labels, neon atmosphere, decorative perspective grid or an entire new dark landing-page aesthetic. |
| [Linear homepage — Intake and integrations](https://linear.app/) | A short heading and benefit sit above one wide product story: a conversation panel connects contextually to a work board. AI examples use specific tasks inside the work context. | Depict one recognizable operator question and one answer record, rather than abstract AI particles or a generic chatbot floating beside a screenshot. | Copying Linear product UI, dark styling or claims into Katalhys; treating an illustrative AI answer as an existing shipped feature. |

Nodeflow and Linear were also inspected in Chrome; reference screenshots are kept in ignored `.work-capture/problem-research/`. Source pages were used for design analysis only. No source code or artwork is copied into the website.

## Direction A — one order, one place to look (recommended)

One strong headline above a single bounded operational canvas. Inside, the same order links two readable states: chat/spreadsheet/report fragments on the left, a calm order record on the right with status, owner and next action. A compact AI-assistance row offers finding information, summarizing updates and drafting follow-ups. A visible conceptual-example label and human-review wording distinguish the offer from actual Work proof.

The main contrast comes from information hierarchy, not decorative color: quieter source fragments, a clear cobalt connector, then a stronger final record. Use white and pale blue surfaces with ink typography. Keep the next service section cobalt as requested. On mobile, source fragments become a short stacked list followed by the final record; every label remains readable without interaction.

Optional small inline case-study link uses the real Order & Field Sales project. Its screenshot may be a single modest proof thumbnail or remain in Work; remove the competing marketing-site thumbnail from this section.

Suggested EN headline: “One order. Too many places to look.”
Suggested ID headline: “Satu pesanan. Terlalu banyak tempat mencari.”
These are proposals, not a requirement to replace all existing copy.

## Direction B — the operator's desk

A single large real order-system screenshot on one side, paired with a concise problem statement and three task callouts on the other. A separately labeled conceptual AI card could show one question and a draft summary. This provides stronger immediate software proof but risks implying that AI already exists in the shown application. It is also more visually similar to the existing Work showcase.

## Recommendation and implementation limits

Use Direction A. It directly fixes the scattered hierarchy, turns the service proposition into a recognizable situation, and differs from the later screenshot-led Work section. It is still understandable as a static composition and can be built with Astro markup, existing typography/tokens and a few inline SVG paths.

No new image generation, external images, font download, dependency, React hydration, canvas, perpetual animation or scroll listener is needed. If any motion is used, restrict it to a short hover/focus response on a real link. All substantive content stays visible by default, with logical reading order, sufficient contrast and no fake controls. Do not invent time savings, customer outcomes or AI capabilities in existing Work. Preserve the owner's existing screenshot pixels and anonymize internal-system client names in surrounding text.
