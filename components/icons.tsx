import type { ReactNode } from "react"

/* ───────────── Colores por categoría ───────────── */
export const CAT_COLOR: Record<string, string> = {
  Papas: "#FF3B30",
  Cacahuates: "#FF9F0A",
  Chips: "#2BB5A0",
  Gomitas: "#FF4F8B",
  Bebidas: "#0A84FF",
  Dulces: "#B08968",
}

/* ───────────── Set de íconos (línea, 24×24) ───────────── */
const P: Record<string, ReactNode> = {
  // Snacks
  bag: <><path d="M5 4.8 L7 3.2 L9 4.8 L11 3.2 L13 4.8 L15 3.2 L17 4.8 L19 3.2 Q20.4 12 19 20.8 L19 20.8 L17 19.2 L15 20.8 L13 19.2 L11 20.8 L9 19.2 L7 20.8 L5 19.2 Q3.6 12 5 4.8Z" /><path d="M8.5 11.5c1.2-1.1 2.3-1.1 3.5 0s2.3 1.1 3.5 0M8.5 14.5c1.2-1.1 2.3-1.1 3.5 0s2.3 1.1 3.5 0" /></>,
  peanut: <g transform="rotate(38 12 11)"><path d="M8 6.5a4 4 0 0 1 8 0c0 1.4-.9 2.3-.9 3.5s.9 2.1.9 3.5a4 4 0 0 1-8 0c0-1.4.9-2.3.9-3.5S8 7.9 8 6.5Z" /><path d="M10.5 5.8h.01M13.2 7.6h.01M10.8 14.4h.01M13.4 12.6h.01" /></g>,
  chip: <><circle cx="12" cy="12" r="8.5" /><path d="M7.5 12.5c1.5-1.6 3-1.6 4.5 0s3 1.6 4.5 0" /><path d="M9 8.5h.01M14.5 8h.01M12 16.5h.01" /></>,
  bonbon: <><circle cx="12" cy="12" r="4.8" /><path d="M7.4 10 2.6 7.6v8.8L7.4 14" /><path d="M16.6 10l4.8-2.4v8.8L16.6 14" /></>,
  cup: <><path d="M6 8h12l-1.4 12.2a1.5 1.5 0 0 1-1.5 1.3H8.9a1.5 1.5 0 0 1-1.5-1.3L6 8Z" /><path d="M5 8h14" /><path d="M13 8l1-5h3.5" /><path d="M7 14c1.6-.8 3.2-.8 5 0s3.4.8 5 0" /></>,
  bar: <><rect x="5" y="2.5" width="14" height="19" rx="3" /><path d="M5 8.8h14M5 15.2h14M12 2.5v19" /></>,
  // UI
  flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />,
  sparkles: <><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" /><path d="M5 3v4M3 5h4M19 17v4M17 19h4" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  check: <path d="M20 6 9 17l-5-5" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  arrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
  arrowDown: <path d="M12 5v14M5 12l7 7 7-7" />,
  cart: <><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" /></>,
  gift: <><path d="M20 12v10H4V12" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" /></>,
  store: <><path d="m3 9 1.5-5h15L21 9" /><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /><path d="M5 12.5V21h14v-8.5" /><path d="M10 21v-5h4v5" /></>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M11 18h2" /></>,
  insta: <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>,
  trend: <><path d="m22 7-8.5 8.5-5-5L2 17" /><path d="M16 7h6v6" /></>,
  tag: <><path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4Z" /><circle cx="7.5" cy="7.5" r="1" fill="currentColor" /></>,
  zap: <path d="M4 14a1 1 0 0 1-.8-1.6l9.9-10.2a.5.5 0 0 1 .9.5L12.1 9A1 1 0 0 0 13 10h7a1 1 0 0 1 .8 1.6l-9.9 10.2a.5.5 0 0 1-.9-.5L11.9 15A1 1 0 0 0 11 14Z" />,
  receipt: <><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 17.5v-11" /></>,
  cake: <><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" /><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" /><path d="M2 21h20" /><path d="M7 8v3M12 8v3M17 8v3" /><path d="M7 4h.01M12 4h.01M17 4h.01" /></>,
  building: <><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4M10 10h4M10 14h4M10 18h4" /></>,
  box: <><path d="m7.5 4.3 9 5.2" /><path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></>,
  coffee: <><path d="M10 2v2M14 2v2M6 2v2" /><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" /></>,
  trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.7V17c0 .6-.5 1-1 1.2C7.8 18.8 7 20.2 7 22M14 14.7V17c0 .6.5 1 1 1.2 1.2.6 2 2 2 3.8" /><path d="M18 2H6v7a6 6 0 0 0 12 0Z" /></>,
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7Z" />,
}

export type IconName = keyof typeof P | string

export function Ico({ name, size = 20, strokeWidth = 2, className, style }: {
  name: IconName; size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      {P[name] ?? P.sparkles}
    </svg>
  )
}

/** Ícono de cada categoría de producto */
const CAT_ICON: Record<string, string> = {
  Papas: "bag", Botanas: "bag", Cacahuates: "peanut", Chips: "chip", Gomitas: "bonbon", Bebidas: "cup", Dulces: "bar",
}
export function CategoryIcon({ cat, size = 22, strokeWidth = 1.8, className }: { cat: string; size?: number; strokeWidth?: number; className?: string }) {
  return <Ico name={CAT_ICON[cat] ?? "sparkles"} size={size} strokeWidth={strokeWidth} className={className} />
}
