"use client"
import { useEffect } from "react"
import { useCart } from "./cart-context"

const WA = "524774950232"

interface Props { isOpen: boolean; onClose: () => void }

export function CartModal({ isOpen, onClose }: Props) {
  const { items, totalPrice, removeItem } = useCart()

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  if (!isOpen) return null

  const waMsg = encodeURIComponent(
    "🌶 *Pedido BOTA-NA*\n\n" +
    items.map(i => `• ${i.name} x${i.qty} — $${i.price * i.qty}`).join("\n") +
    `\n\n*Total: $${totalPrice} MXN*\n\nSoy de La Salle Bajío y quisiera ordenar. ¡Gracias!`
  )

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative bg-[#111] border border-white/10 rounded-[2rem] rounded-b-none w-full max-w-[540px] max-h-[88vh] overflow-y-auto p-5 pb-8 z-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-5" />
        <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <h2 className="font-head text-[2rem] mb-1">Mi Pedido</h2>
        <p className="text-white/40 text-sm mb-5">Revisa y ordena por WhatsApp</p>

        {items.length === 0 ? (
          <div className="text-center py-12 text-white/30">
            <div className="text-5xl mb-3">🛒</div>
            <p className="text-sm uppercase tracking-widest font-bold">Tu carrito está vacío</p>
            <p className="text-xs mt-1 text-white/20">Agrega algo del menú</p>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
                  <div className="w-12 h-12 rounded-xl bg-[#181818] flex items-center justify-center text-2xl flex-shrink-0">{item.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{item.name}</div>
                    <div className="text-white/35 text-xs">Cantidad: {item.qty}</div>
                  </div>
                  <div className="font-mono font-bold text-sm flex-shrink-0">${item.price * item.qty}</div>
                  <button onClick={() => removeItem(item.id)} className="text-white/25 hover:text-[#E53E3E] transition-colors flex-shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center py-4 border-t-2 border-white/10 mt-2">
              <span className="text-xs font-black uppercase tracking-widest text-white/40">Total</span>
              <span className="font-mono font-bold text-2xl">${totalPrice} <span className="text-sm text-white/30 font-normal">MXN</span></span>
            </div>

            <a
              href={`https://wa.me/${WA}?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2.5 py-4 rounded-full bg-[#22c55e] text-white font-black text-sm tracking-[.08em] uppercase hover:bg-[#16a34a] hover:-translate-y-0.5 transition-all mt-1"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Pedir por WhatsApp
            </a>
          </>
        )}
      </div>
    </div>
  )
}
