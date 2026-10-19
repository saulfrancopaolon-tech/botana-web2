/**
 * Transición suave entre páginas (Tienda ↔ Mayoreo): un fundido corto.
 * Solo usa opacidad, así no rompe los elementos fijos (barra inferior, carrito).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>
}
