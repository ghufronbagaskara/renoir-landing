# Renoir image system

The hero presents Renoir's own identity campaign. It is an editorial illustration, not a client campaign or a photograph of a real installation. Product evidence comes from authentic founder-project screenshots. Abstract material sculptures have been retired because they did not explain the studio's work.

## Photo prompts and artwork

Generate blank photographic surfaces only. Add the exact production Joint SVG and GeneralSans typography afterwards with Sharp and Playwright. Never ask the image model to draw the logo, readable type, interfaces, people, or client evidence.

Shared direction: frontal editorial photography, plausible matte paper or porcelain, natural side light, neutral grey surroundings, visible material texture. No office, laptop, server rack, glowing effects, abstract sculpture, fake lettering, or glossy plastic surfaces.

| Ignored master in `.work-capture/renoir-visual/` | Generation brief and final role                                                                                                                                                                                                                |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `campaign-wall-desktop.png`                      | Two blank wall posters, one ivory and one near-black, photographed straight on with natural side light. Keep rectangular edges visible and generous outer space. Final artwork adds Renoir, The Joint, Design / Build / Run, and the services. |
| `campaign-wall-mobile.png`                       | Reference the desktop material and light, but compose a separate portrait: a large blank ivory poster and smaller near-black poster beside it, both inside the frame. Composite artwork separately.                                            |
| `campaign-book.png`                              | A thin closed blank ivory brand publication photographed frontally, subtle paper edges and directional shadow. Final artwork adds the exact identity and services. First small About image.                                                    |
| `campaign-detail.png`                            | Frontal close view of a blank dark matte campaign print on a light textured wall, fine grain and restrained shadow. Final artwork adds only the production Joint and Renoir wordmark. Second small About image.                                |
| `campaign-porcelain.png`                         | Recognisable white round porcelain plate with a fine cobalt botanical edge, photographed with the whole plate visible. No lettering or invented historical scene. Name-story editorial illustration, not an archive photograph.                |

`bun run images:editorial` runs Node TypeScript stripping, Playwright artwork rendering, and Sharp composition. Masters stay ignored. Only final WebP variants enter `src/assets/img`. Sources are not enlarged. Hero sources are 1536x1024 and 1024x1536; shipped variants include desktop 1536/960 and portrait 900/450. Inspect compositing coordinates whenever a master changes.

## Evidence and diagrams

- Home problem: contained MAXY AI and Order & Field Sales desktop screens, with captions linked to their studies.
- Marketing: MAXY AI desktop/mobile hero; AI solution and Industrial Coatings supporting screens.
- Internal systems: Order & Field Sales desktop/mobile hero; order detail and field-project detail supporting screens.
- UI/UX: Expert Profile desktop/mobile hero; resource modal and AI CEO Circle application supporting screens.
- Deployment: the honest architecture diagram. Do not create a dashboard or fill the missing Komodo slot until safe access is available.
- Service thumbnails: contained corresponding desktop screens or diagram.
- Process: inline SVG scope checklist, design structure, code, and delivery scenes. Labels remain localized HTML; these are explanatory diagrams, not product evidence.
- About CTA, breadcrumb, and footer: ink surfaces and the exact Joint SVG, without raster backgrounds.

## Notes

Each article uses a drawn diagram rather than generated material symbolism. `scripts/compose-note-images.ts` renders GeneralSans labels in EN/ID and exports article, list, card, and sidebar WebP sizes from one diagram master per locale.

| Article                                  | Diagram                                                                                                                                  |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Most websites are bought, not built      | Repeated generic page structures beside an individually structured page.                                                                 |
| Nothing is delivered until it is running | Code connects to a running application, then access, monitoring, and backups.                                                            |
| Speed is a specification                 | Content appears, layout stays still, and interaction responds, illustrated with page structures; no fabricated scores or timing numbers. |

Wide crops preserve explanatory labels. Sidebar squares contain the whole illustration. These diagrams are editorial explanations, not screenshots.

## Review and motion

Review Home, About, Process, four services, Notes index and three articles in EN/ID at 390, 768, and 1440 px. Check subjects, exact artwork, loading, alt text, and overflow. Hero parallax uses the existing passive rAF transform mechanism only at >=1024 px, with overscan and displacement capped by available space and 120 px. Smaller screens, reduced motion, and no JavaScript use a static image. Content does not wait for animation to become readable.

Keep below-fold images lazy and dimensions explicit. The hero uses responsive srcset and separate portrait art direction. Validate production assets and Lighthouse instead of assuming smaller files guarantee the performance target.
