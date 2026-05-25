"use client"
import { useState, useEffect } from "react"

const WA = "524774950232"

// ── Catalogo con precio de costo estimado y precio evento ──
const EVENT_PRODUCTS = [
  { id: 1,  name: "Cacahuate Habanero",     emoji: "🥜", cat: "Cacahuates", retail: 15, event: 12, cost: 7  },
  { id: 2,  name: "Cacahuate Jalapeño",     emoji: "🥜", cat: "Cacahuates", retail: 15, event: 12, cost: 7  },
  { id: 3,  name: "Cacahuate Fuego",        emoji: "🥜", cat: "Cacahuates", retail: 15, event: 12, cost: 7  },
  { id: 4,  name: "Chips de Betabel",       emoji: "🫚", cat: "Chips",      retail: 25, event: 20, cost: 12 },
  { id: 5,  name: "Chips de Jicama",        emoji: "🥗", cat: "Chips",      retail: 25, event: 20, cost: 12 },
  { id: 6,  name: "Chips de Taro",          emoji: "🫙", cat: "Chips",      retail: 25, event: 20, cost: 12 },
  { id: 7,  name: "Chips de Camote",        emoji: "🍠", cat: "Chips",      retail: 25, event: 20, cost: 12 },
  { id: 8,  name: "Gomitas Durazno",        emoji: "🍑", cat: "Gomitas",    retail: 15, event: 12, cost: 6  },
  { id: 9,  name: "Gomitas Gusano",         emoji: "🪱", cat: "Gomitas",    retail: 15, event: 12, cost: 6  },
  { id: 10, name: "Gomitas Pic-Ositos",     emoji: "🐻", cat: "Gomitas",    retail: 15, event: 12, cost: 6  },
  { id: 11, name: "Gomitas Tiburon",        emoji: "🦈", cat: "Gomitas",    retail: 15, event: 12, cost: 6  },
  { id: 12, name: "Papas Naturales",        emoji: "🥔", cat: "Papas",      retail: 20, event: 16, cost: 9  },
  { id: 13, name: "Papas Adobadas",         emoji: "🌶️", cat: "Papas",      retail: 20, event: 16, cost: 9  },
  { id: 14, name: "Papas Fuego",            emoji: "🔥", cat: "Papas",      retail: 20, event: 16, cost: 9  },
  { id: 15, name: "Agua de Jamaica",        emoji: "🌺", cat: "Bebidas",    retail: 22, event: 18, cost: 9  },
  { id: 17, name: "Agua de Horchata",       emoji: "🥛", cat: "Bebidas",    retail: 22, event: 18, cost: 9  },
  { id: 16, name: "Chamoyada de Mango",     emoji: "🥭", cat: "Bebidas",    retail: 30, event: 24, cost: 13 },
  { id: 18, name: "Chamoyada de Fresa",     emoji: "🍓", cat: "Bebidas",    retail: 30, event: 24, cost: 13 },
  { id: 19, name: "Chamoyada de Tamarindo", emoji: "🟤", cat: "Bebidas",    retail: 30, event: 24, cost: 13 },
]

const LABEL_PRICE = 4   // precio por etiqueta personalizada
const DEPOSIT_PCT = 0.5 // 50% anticipo

interface Selection {
  id: number
  qty: number
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

type Step = "info" | "products" | "extras" | "summary"

export function EventModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<Step>("info")
  const [eventName, setEventName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [guests, setGuests] = useState("")
  const [contactName, setContactName] = useState("")
  const [selections, setSelections] = useState<Selection[]>([])
  const [wantLabels, setWantLabels] = useState(false)
  const [labelText, setLabelText] = useState("")
  const [wantDelivery, setWantDelivery] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [activeCat, setActiveCat] = useState("Todos")

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setStep("info")
      setSelections([])
      setWantLabels(false)
      setWantDelivery(false)
      setEventName("")
      setEventDate("")
      setGuests("")
      setContactName("")
      setLabelText("")
      setDeliveryAddress("")
      setNotes("")
    }
  }, [isOpen])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [onClose])

  function setQty(id: number, qty: number) {
    if (qty <= 0) {
      setSelections(prev => prev.filter(s => s.id !== id))
    } else {
      setSelections(prev => {
        const exists = prev.find(s => s.id === id)
        if (exists) return prev.map(s => s.id === id ? { ...s, qty } : s)
        return [...prev, { id, qty }]
      })
    }
  }

  function getQty(id: number) {
    return selections.find(s => s.id === id)?.qty ?? 0
  }

  // ── Calculos ──
  const totalUnits = selections.reduce((s, x) => s + x.qty, 0)

  // Descuento por volumen
  const discount = totalUnits >= 100 ? 0.20 : totalUnits >= 50 ? 0.15 : totalUnits >= 20 ? 0.10 : 0

  const subtotalProductos = selections.reduce((s, sel) => {
    const p = EVENT_PRODUCTS.find(x => x.id === sel.id)
    if (!p) return s
    return s + p.event * sel.qty
  }, 0)

  const descuentoMonto = Math.round(subtotalProductos * discount)
  const subtotalConDescuento = subtotalProductos - descuentoMonto

  const totalLabels = wantLabels ? totalUnits * LABEL_PRICE : 0
  const total = subtotalConDescuento + totalLabels
  const anticipo = Math.ceil(total * DEPOSIT_PCT)
  const restante = total - anticipo

  // ── Ganancia estimada (para el owner, no se muestra al cliente) ──
  // const costo = selections.reduce((s, sel) => {
  //   const p = EVENT_PRODUCTS.find(x => x.id === sel.id)
  //   return s + (p?.cost ?? 0) * sel.qty
  // }, 0) + totalLabels
  // const ganancia = total - costo

  const cats = ["Todos", ...Array.from(new Set(EVENT_PRODUCTS.map(p => p.cat)))]
  const visibleProducts = activeCat === "Todos" ? EVENT_PRODUCTS : EVENT_PRODUCTS.filter(p => p.cat === activeCat)

  function generateWAMessage() {
    const lines: string[] = []
    lines.push("Hola! Quiero cotizar un pedido para evento con BOTA-NA.")
    lines.push("")
    lines.push("*DATOS DEL EVENTO*")
    if (contactName) lines.push("Nombre: " + contactName)
    if (eventName) lines.push("Evento: " + eventName)
    if (eventDate) lines.push("Fecha: " + eventDate)
    if (guests) lines.push("Invitados aprox: " + guests)
    lines.push("")
    lines.push("*PRODUCTOS SOLICITADOS*")
    selections.forEach(sel => {
      const p = EVENT_PRODUCTS.find(x => x.id === sel.id)
      if (p) lines.push("- " + p.name + " x" + String(sel.qty) + " = $" + String(p.event * sel.qty))
    })
    lines.push("")
    lines.push("*RESUMEN*")
    lines.push("Subtotal: $" + String(subtotalProductos))
    if (discount > 0) lines.push("Descuento " + String(Math.round(discount * 100)) + "%: -$" + String(descuentoMonto))
    if (wantLabels) lines.push("Etiquetas personalizadas (" + String(totalUnits) + " pzas): $" + String(totalLabels))
    lines.push("*TOTAL: $" + String(total) + "*")
    lines.push("Anticipo (50%): $" + String(anticipo))
    lines.push("Restante al entregar: $" + String(restante))
    if (wantLabels && labelText) lines.push("")
    if (wantLabels && labelText) lines.push("Texto para etiquetas: " + labelText)
    if (wantDelivery && deliveryAddress) lines.push("Entrega en: " + deliveryAddress)
    if (notes) lines.push("Notas: " + notes)
    return encodeURIComponent(lines.join("\n"))
  }

  if (!isOpen) return null

  const stepNum = step === "info" ? 1 : step === "products" ? 2 : step === "extras" ? 3 : 4

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
      <div
        className="relative bg-[#111] border border-white/10 rounded-[2rem] rounded-b-none sm:rounded-[2rem] w-full sm:max-w-lg max-h-[92vh] flex flex-col z-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header fijo */}
        <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-white/[.06]">
          <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mb-4 sm:hidden" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[.65rem] font-black uppercase tracking-[.2em] text-[#F97316] mb-0.5">
                Paso {stepNum} de 4
              </div>
              <h2 className="font-head text-[1.8rem] leading-none text-white">
                {step === "info" ? "Datos del Evento"
                  : step === "products" ? "Elige tus Botanas"
                  : step === "extras" ? "Extras y Entrega"
                  : "Tu Cotizacion"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all flex-shrink-0 mt-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F97316] to-[#E53E3E] rounded-full transition-all duration-500"
              style={{ width: String(stepNum * 25) + "%" }}
            />
          </div>
        </div>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* ── PASO 1: INFO ── */}
          {step === "info" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#F97316]/10 to-[#E53E3E]/10 border border-[#F97316]/20 rounded-2xl p-4">
                <p className="text-[.75rem] font-bold text-[#F97316] mb-1">Como funciona</p>
                <ul className="text-[.75rem] text-white/50 space-y-1 leading-relaxed">
                  <li>• Precio especial de evento (menor al precio normal)</li>
                  <li>• Descuento adicional por volumen desde 20 piezas</li>
                  <li>• Etiquetas personalizadas con tu nombre/tema</li>
                  <li>• 50% de anticipo para apartar la fecha</li>
                  <li>• Entrega a domicilio o recoger en La Salle</li>
                </ul>
              </div>
              <div>
                <label className="text-[.68rem] font-black uppercase tracking-widest text-white/30 block mb-1.5">
                  Tu nombre *
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#F97316] transition-colors placeholder:text-white/15"
                  placeholder="Nombre de quien pide"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[.68rem] font-black uppercase tracking-widest text-white/30 block mb-1.5">
                  Tipo de evento
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#F97316] transition-colors placeholder:text-white/15"
                  placeholder="Ej: Cumpleanos, Graduacion, Boda..."
                  value={eventName}
                  onChange={e => setEventName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[.68rem] font-black uppercase tracking-widest text-white/30 block mb-1.5">
                    Fecha del evento
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#F97316] transition-colors"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[.68rem] font-black uppercase tracking-widest text-white/30 block mb-1.5">
                    No. de invitados
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#F97316] transition-colors placeholder:text-white/15"
                    placeholder="Ej: 50"
                    value={guests}
                    onChange={e => setGuests(e.target.value)}
                    min="1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── PASO 2: PRODUCTOS ── */}
          {step === "products" && (
            <div>
              {/* Descuento por volumen */}
              <div className="mb-4 bg-white/[.04] border border-white/[.07] rounded-2xl p-3">
                <p className="text-[.65rem] font-black uppercase tracking-widest text-white/30 mb-2">
                  Descuento por volumen
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "20-49 pzas", pct: "10% OFF", active: totalUnits >= 20 && totalUnits < 50 },
                    { label: "50-99 pzas", pct: "15% OFF", active: totalUnits >= 50 && totalUnits < 100 },
                    { label: "100+ pzas",  pct: "20% OFF", active: totalUnits >= 100 },
                  ].map(tier => (
                    <div
                      key={tier.label}
                      className={
                        "rounded-xl p-2 text-center border transition-all " +
                        (tier.active
                          ? "bg-[#E53E3E]/15 border-[#E53E3E]/40"
                          : "bg-white/3 border-white/8")
                      }
                    >
                      <div className={"text-[.7rem] font-black " + (tier.active ? "text-[#FF5252]" : "text-white/30")}>
                        {tier.pct}
                      </div>
                      <div className="text-[.58rem] text-white/25 mt-0.5">{tier.label}</div>
                    </div>
                  ))}
                </div>
                {totalUnits > 0 && (
                  <p className="text-center text-[.7rem] text-white/40 mt-2 font-mono">
                    {String(totalUnits)} piezas seleccionadas
                    {discount > 0 ? " · " + String(Math.round(discount * 100)) + "% de descuento aplicado" : ""}
                  </p>
                )}
              </div>

              {/* Filtro categorias */}
              <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-3">
                {cats.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={
                      "flex-shrink-0 px-3 py-1.5 rounded-full text-[.65rem] font-black uppercase tracking-wider border transition-all " +
                      (cat === activeCat
                        ? "bg-[#E53E3E] border-[#E53E3E] text-white"
                        : "border-white/10 text-white/40 hover:text-white")
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Lista de productos */}
              <div className="space-y-2">
                {visibleProducts.map(p => {
                  const qty = getQty(p.id)
                  return (
                    <div
                      key={p.id}
                      className={
                        "flex items-center gap-3 p-3 rounded-2xl border transition-all " +
                        (qty > 0
                          ? "bg-[#E53E3E]/8 border-[#E53E3E]/30"
                          : "bg-white/[.03] border-white/[.07]")
                      }
                    >
                      <span className="text-2xl flex-shrink-0">{p.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[.82rem] text-white truncate">{p.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[.68rem] font-black text-[#FF5252] font-mono">${p.event}/pza</span>
                          <span className="text-[.62rem] text-white/20 line-through font-mono">${p.retail}</span>
                          <span className="text-[.58rem] text-white/25 uppercase tracking-wider">{p.cat}</span>
                        </div>
                      </div>
                      {/* Qty control */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setQty(p.id, qty - 5)}
                          className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all text-sm font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-sm text-white">
                          {qty > 0 ? String(qty) : "-"}
                        </span>
                        <button
                          onClick={() => setQty(p.id, qty + 5)}
                          className="w-7 h-7 rounded-full bg-[#E53E3E] flex items-center justify-center text-white hover:bg-[#FF5252] transition-all text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-center text-[.65rem] text-white/20 mt-3">
                Las cantidades se agregan de 5 en 5. Puedes ajustar antes de enviar.
              </p>
            </div>
          )}

          {/* ── PASO 3: EXTRAS ── */}
          {step === "extras" && (
            <div className="space-y-5">
              {/* Etiquetas */}
              <div className={
                "border rounded-2xl p-4 transition-all " +
                (wantLabels ? "bg-[#F97316]/8 border-[#F97316]/30" : "bg-white/[.03] border-white/[.07]")
              }>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-black text-white text-sm mb-0.5">Etiquetas Personalizadas</div>
                    <div className="text-[.72rem] text-white/40 leading-relaxed">
                      Etiqueta con el nombre/tema de tu evento en cada producto.
                      <span className="text-[#F97316] font-bold"> +${LABEL_PRICE} por pieza</span>
                      {wantLabels && totalUnits > 0 && (
                        <span className="text-white/60"> = ${totalLabels} total</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setWantLabels(v => !v)}
                    className={
                      "w-12 h-6 rounded-full transition-all flex-shrink-0 relative " +
                      (wantLabels ? "bg-[#F97316]" : "bg-white/10")
                    }
                  >
                    <span className={
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all " +
                      (wantLabels ? "left-7" : "left-1")
                    } />
                  </button>
                </div>
                {wantLabels && (
                  <input
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#F97316] transition-colors placeholder:text-white/15"
                    placeholder="Ej: Boda de Sofia y Diego / XV Anos Valentina"
                    value={labelText}
                    onChange={e => setLabelText(e.target.value)}
                  />
                )}
              </div>

              {/* Entrega */}
              <div className={
                "border rounded-2xl p-4 transition-all " +
                (wantDelivery ? "bg-[#E53E3E]/8 border-[#E53E3E]/30" : "bg-white/[.03] border-white/[.07]")
              }>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-black text-white text-sm mb-0.5">Entrega a Domicilio</div>
                    <div className="text-[.72rem] text-white/40 leading-relaxed">
                      Sin entrega: recoges en La Salle Bajio (gratis).
                      Con entrega: cotizamos el costo segun la distancia.
                    </div>
                  </div>
                  <button
                    onClick={() => setWantDelivery(v => !v)}
                    className={
                      "w-12 h-6 rounded-full transition-all flex-shrink-0 relative " +
                      (wantDelivery ? "bg-[#E53E3E]" : "bg-white/10")
                    }
                  >
                    <span className={
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all " +
                      (wantDelivery ? "left-7" : "left-1")
                    } />
                  </button>
                </div>
                {wantDelivery && (
                  <input
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#E53E3E] transition-colors placeholder:text-white/15"
                    placeholder="Direccion o colonia del evento"
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                  />
                )}
              </div>

              {/* Notas */}
              <div>
                <label className="text-[.68rem] font-black uppercase tracking-widest text-white/30 block mb-1.5">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-white/30 transition-colors placeholder:text-white/15 resize-none"
                  placeholder="Colores de etiqueta, horario de entrega, alergias, etc."
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* ── PASO 4: RESUMEN ── */}
          {step === "summary" && (
            <div className="space-y-4">
              {/* Datos evento */}
              <div className="bg-white/[.03] border border-white/[.07] rounded-2xl p-4">
                <p className="text-[.65rem] font-black uppercase tracking-widest text-white/30 mb-2">Evento</p>
                <div className="space-y-1">
                  {contactName && <div className="flex justify-between text-sm"><span className="text-white/50">Cliente</span><span className="font-bold">{contactName}</span></div>}
                  {eventName   && <div className="flex justify-between text-sm"><span className="text-white/50">Tipo</span><span className="font-bold">{eventName}</span></div>}
                  {eventDate   && <div className="flex justify-between text-sm"><span className="text-white/50">Fecha</span><span className="font-bold">{eventDate}</span></div>}
                  {guests      && <div className="flex justify-between text-sm"><span className="text-white/50">Invitados</span><span className="font-bold">{guests}</span></div>}
                </div>
              </div>

              {/* Productos */}
              <div className="bg-white/[.03] border border-white/[.07] rounded-2xl p-4">
                <p className="text-[.65rem] font-black uppercase tracking-widest text-white/30 mb-2">
                  Productos ({String(totalUnits)} piezas)
                </p>
                <div className="space-y-1.5">
                  {selections.map(sel => {
                    const p = EVENT_PRODUCTS.find(x => x.id === sel.id)
                    if (!p) return null
                    return (
                      <div key={sel.id} className="flex justify-between items-center text-sm">
                        <span className="text-white/60">{p.emoji} {p.name} x{String(sel.qty)}</span>
                        <span className="font-mono font-bold text-white">${p.event * sel.qty}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Totales */}
              <div className="bg-white/[.03] border border-white/[.07] rounded-2xl p-4 space-y-2">
                <p className="text-[.65rem] font-black uppercase tracking-widest text-white/30 mb-2">Desglose</p>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal productos</span>
                  <span className="font-mono">${subtotalProductos}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Descuento {String(Math.round(discount * 100))}% volumen</span>
                    <span className="font-mono text-green-400">-${descuentoMonto}</span>
                  </div>
                )}
                {wantLabels && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Etiquetas ({String(totalUnits)} pzas x ${LABEL_PRICE})</span>
                    <span className="font-mono">${totalLabels}</span>
                  </div>
                )}
                {wantDelivery && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Envio</span>
                    <span className="text-[#F97316] text-xs font-bold">A cotizar</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-2 mt-1">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-white">TOTAL</span>
                    <span className="font-head text-[1.8rem] leading-none text-white">${total}</span>
                  </div>
                </div>
              </div>

              {/* Anticipo */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#E53E3E]/10 border border-[#E53E3E]/25 rounded-2xl p-3 text-center">
                  <div className="text-[.6rem] font-black uppercase tracking-widest text-[#E53E3E] mb-1">Anticipo 50%</div>
                  <div className="font-head text-[1.6rem] leading-none text-white">${anticipo}</div>
                  <div className="text-[.62rem] text-white/30 mt-1">Para apartar la fecha</div>
                </div>
                <div className="bg-white/[.04] border border-white/[.07] rounded-2xl p-3 text-center">
                  <div className="text-[.6rem] font-black uppercase tracking-widest text-white/30 mb-1">Restante</div>
                  <div className="font-head text-[1.6rem] leading-none text-white">${restante}</div>
                  <div className="text-[.62rem] text-white/30 mt-1">Al entregar el pedido</div>
                </div>
              </div>

              {wantLabels && labelText && (
                <div className="bg-[#F97316]/8 border border-[#F97316]/20 rounded-xl p-3 text-center">
                  <div className="text-[.6rem] font-black uppercase tracking-widest text-[#F97316] mb-1">Texto de etiqueta</div>
                  <div className="text-sm text-white font-bold">{labelText}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer fijo con botones */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-white/[.06] space-y-2">
          {step !== "summary" ? (
            <div className="flex gap-2">
              {step !== "info" && (
                <button
                  onClick={() => {
                    if (step === "products") setStep("info")
                    else if (step === "extras") setStep("products")
                  }}
                  className="flex-1 py-3.5 rounded-full border border-white/10 text-white/60 font-black text-sm tracking-widest uppercase hover:text-white hover:border-white/30 transition-all"
                >
                  Atras
                </button>
              )}
              <button
                onClick={() => {
                  if (step === "info") setStep("products")
                  else if (step === "products") setStep("extras")
                  else if (step === "extras") setStep("summary")
                }}
                disabled={step === "products" && selections.length === 0}
                className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#E53E3E] text-white font-black text-sm tracking-widest uppercase hover:opacity-90 active:scale-95 transition-all disabled:opacity-25 disabled:cursor-not-allowed"
              >
                {step === "info" ? "Elegir Botanas"
                  : step === "products" ? "Continuar"
                  : "Ver Cotizacion"}
              </button>
            </div>
          ) : (
            <>
              <a
                href={"https://wa.me/" + WA + "?text=" + generateWAMessage()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2.5 py-4 rounded-full bg-[#22c55e] text-white font-black text-sm tracking-widest uppercase hover:bg-[#16a34a] active:scale-95 transition-all"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Enviar Cotizacion por WhatsApp
              </a>
              <button
                onClick={() => setStep("extras")}
                className="w-full py-3 rounded-full border border-white/10 text-white/50 font-black text-xs tracking-widest uppercase hover:text-white transition-all"
              >
                Editar pedido
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
