export const brandColors = {
  primary: "#1D4ED8",
  accent: "#DBEAFE",
  ink: "#17191C",
  muted: "#596273",
  paper: "#FFFFFF",
  panel: "#EEF2F8",
} as const;

// Logo 09 retains its navy/cyan gradient independently of the website palette.
export const brandPaths = {
  base: "M0 99C53 60 120 4 165 1C205 -4 232 12 244 39C262 79 232 120 201 148Q196 156 206 152C250 126 284 102 324 71V172C292 200 261 216 229 218C194 220 170 206 170 177C170 159 180 141 180 125C181 97 157 88 133 88C91 87 43 110 0 129Z",
  accent: "M0 180C39 153 85 120 111 120C137 118 145 132 139 152C132 174 118 190 124 212C132 242 160 249 198 253C161 267 125 280 90 280C35 283 1 261 0 214Z",
} as const;

export function brandArtwork(variant: "color" | "white" | "current" = "color", id = "katalhys") {
  const color = variant === "color";
  const fill = variant === "white" ? "#ffffff" : "currentColor";
  const gradients = color ? `<defs>
    <linearGradient id="${id}-upper" gradientUnits="userSpaceOnUse" x1="32" y1="85" x2="324" y2="140">
      <stop stop-color="#173E72"/><stop offset=".36" stop-color="#173E72"/><stop offset=".64" stop-color="#087CB8"/><stop offset="1" stop-color="#64D6F2"/>
    </linearGradient>
    <linearGradient id="${id}-lower" gradientUnits="userSpaceOnUse" x1="110" y1="120" x2="65" y2="280">
      <stop stop-color="#173E72"/><stop offset=".3" stop-color="#087CB8"/><stop offset=".8" stop-color="#64D6F2"/>
    </linearGradient>
  </defs>` : "";
  return `${gradients}<g transform="translate(0 17.4) scale(.790123)"><path d="${brandPaths.base}" fill="${color ? `url(#${id}-upper)` : fill}"/><path d="${brandPaths.accent}" fill="${color ? `url(#${id}-lower)` : fill}"/></g>`;
}
