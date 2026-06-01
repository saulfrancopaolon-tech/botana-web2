"use client"
import { useState, useEffect } from "react"

const WA = "524774950232"

interface Props {
  isOpen: boolean
  onClose: () => void
  onEventOpen: () => void
}

type Tab = "overview" | "mayoreo" | "distribuidor" | "institucional"

const PRICING = [
  { name: "Cacahuates",         emoji: "🥜", retail: 15, mayoreo: 12, dist: 10 },
  { name: "Chips",              emoji: "🍠", retail: 25, mayoreo: 20, dist: 17 },
  { name: "Gomitas",            emoji: "🐻", retail: 15, mayoreo: 12, dist: 11 },
  { name: "Papas",              emoji: "🔥", retail: 20, mayoreo: 16, dist: 15 },
  { name: "Aguas 500ml", emoji: "🌺", retail: 22, mayoreo: 18, dist: 17 },
{ name: "Aguas 1 Litro", emoji: "🌺", retail: 35, mayoreo: 31, dist: 28 },
  { name: "Chamoyadas",         emoji: "🥭", retail: 30, mayoreo: 25, dist: 23 },
]

export function WholesaleModal({ isOpen, onClose, onEventOpen }: Props) {
  const [tab, setTab] = useState<Tab>("overview")

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) setTab("overview")
  }, [isOpen])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [onClose])

  if (!isOpen) return null

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: "overview",      label: "Opciones",     emoji: "🏠" },
    { id: "mayoreo",       label: "Mayoreo",       emoji: "📦" },
    { id: "distribuidor",  label: "Distribuidor",  emoji: "📈" },
    { id: "institucional", label: "Institucional", emoji: "🏫" },
  ]

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative bg-[#111] border border-white/10 rounded-t-[2rem] sm:rounded-[2rem] w-full sm:max-w-lg max-h-[92vh] flex flex-col z-10 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-white/10 rounded-full mx-auto mt-4 mb-0 sm:hidden flex-shrink-0" />

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="font-head text-[1.8rem] leading-none">Oportunidades</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 flex gap-1.5 px-5 pb-3 overflow-x-auto scrollbar-none">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={
                "flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[.68rem] font-black uppercase tracking-wider border transition-all " +
                (tab === t.id
                  ? "bg-[#E53E3E] border-[#E53E3E] text-white"
                  : "border-white/10 text-white/40 hover:text-white hover:border-white/25")
              }
            >
              <span>{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex-shrink-0 h-px bg-white/[.06] mx-5" />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div className="space-y-3">
              <p className="text-white/40 text-sm leading-relaxed mb-4">
                Elige la modalidad que mejor se adapte a lo que necesitas.
              </p>

              {/* Evento */}
              <div
                className="rounded-2xl p-4 border cursor-pointer hover:border-[#F97316]/50 active:scale-[.99] transition-all"
                style={{ background: "linear-gradient(135deg,rgba(249,115,22,0.1),rgba(229,62,62,0.1))", borderColor: "rgba(249,115,22,0.25)" }}
                onClick={() => { onClose(); onEventOpen() }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎉</span>
                  <div>
                    <div className="font-black text-white text-sm">Eventos y Fiestas</div>
                    <div className="text-[.68rem] text-[#F97316] font-bold">Cotizador automatico</div>
                  </div>
                  <div className="ml-auto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
                <p className="text-[.72rem] text-white/40 leading-relaxed">
                  Precios de evento, descuento por volumen, etiquetas personalizadas y anticipo del 50%. Calcula tu cotizacion en segundos.
                </p>
              </div>

              {/* Mayoreo */}
              <div
                className="rounded-2xl p-4 border border-white/[.07] bg-white/[.03] cursor-pointer hover:border-white/20 active:scale-[.99] transition-all"
                onClick={() => setTab("mayoreo")}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📦</span>
                  <div>
                    <div className="font-black text-white text-sm">Mayoreo</div>
                    <div className="text-[.68rem] text-white/35 font-bold">Desde 30 piezas</div>
                  </div>
                  <div className="ml-auto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" opacity="0.3">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
                <p className="text-[.72rem] text-white/40 leading-relaxed">
                  Compra en volumen para revender o surtir tu negocio. Sin contrato, sin compromiso de recurrencia.
                </p>
              </div>

              {/* Distribuidor */}
              <div
                className="rounded-2xl p-4 border border-white/[.07] bg-white/[.03] cursor-pointer hover:border-white/20 active:scale-[.99] transition-all"
                onClick={() => setTab("distribuidor")}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📈</span>
                  <div>
                    <div className="font-black text-white text-sm">Distribuidor</div>
                    <div className="text-[.68rem] text-white/35 font-bold">Desde 100 piezas</div>
                  </div>
                  <div className="ml-auto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" opacity="0.3">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
                <p className="text-[.72rem] text-white/40 leading-relaxed">
                  El mejor precio disponible para pedidos grandes o recurrentes. Ideal para emprendedores.
                </p>
              </div>

              {/* Institucional */}
              <div
                className="rounded-2xl p-4 border border-white/[.07] bg-white/[.03] cursor-pointer hover:border-white/20 active:scale-[.99] transition-all"
                onClick={() => setTab("institucional")}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🏫</span>
                  <div>
                    <div className="font-black text-white text-sm">Institucional</div>
                    <div className="text-[.68rem] text-white/35 font-bold">Escuelas y organizaciones</div>
                  </div>
                  <div className="ml-auto">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" opacity="0.3">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
                <p className="text-[.72rem] text-white/40 leading-relaxed">
                  Para cafeterias, kioscos y tiendas escolares. Facturacion disponible.
                </p>
              </div>

              {/* Comparativa rapida */}
              <div className="bg-white/[.02] border border-white/[.05] rounded-2xl p-4 mt-2">
                <p className="text-[.6rem] font-black uppercase tracking-[.2em] text-white/25 text-center mb-3">
                  Comparativa de precios (por pieza)
                </p>
                <div className="grid grid-cols-4 gap-1 text-center mb-2">
                  <div className="text-[.58rem] text-white/20 font-black uppercase">Producto</div>
                  <div className="text-[.58rem] text-white/20 font-black uppercase">Normal</div>
                  <div className="text-[.58rem] text-white/20 font-black uppercase">Mayoreo</div>
                  <div className="text-[.58rem] text-white/20 font-black uppercase">Distrib.</div>
                </div>
                {PRICING.map(p => (
                  <div key={p.name} className="grid grid-cols-4 gap-1 text-center py-1.5 border-t border-white/[.04]">
                    <div className="text-[.68rem] text-white/50">{p.emoji} {p.name}</div>
                    <div className="text-[.68rem] text-white/30 line-through font-mono">${p.retail}</div>
                    <div className="text-[.68rem] text-white font-mono font-bold">${p.mayoreo}</div>
                    <div className="text-[.68rem] text-[#22c55e] font-mono font-bold">${p.dist}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MAYOREO ── */}
          {tab === "mayoreo" && (
            <div className="space-y-4">
              <div className="bg-white/[.03] border border-white/[.07] rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#E53E3E]/15 flex items-center justify-center text-2xl">📦</div>
                  <div>
                    <div className="font-black text-white">Mayoreo BOTA-NA</div>
                    <div className="text-[.68rem] text-white/35">Para reventa o surtido de negocio</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Minimo", value: "30 pzas" },
                    { label: "Pago", value: "100% adelanto" },
                    { label: "Entrega", value: "3-5 dias" },
                  ].map(item => (
                    <div key={item.label} className="bg-white/5 rounded-xl p-2.5 text-center">
                      <div className="text-[.58rem] text-white/25 uppercase tracking-wider mb-1">{item.label}</div>
                      <div className="text-[.75rem] font-black text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5 mb-4">
                  {[
                    "Precio especial mayoreo en todos los productos",
                    "Puedes mezclar productos libremente",
                    "Recoger en La Salle o entrega a domicilio (costo adicional)",
                    "Sin contrato ni compromiso de recurrencia",
                    "Pago por transferencia o efectivo",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2 text-[.72rem] text-white/50">
                      <span className="text-[#22c55e] flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Precios mayoreo */}
              <div className="bg-white/[.03] border border-white/[.07] rounded-2xl p-4">
                <p className="text-[.62rem] font-black uppercase tracking-[.2em] text-white/30 mb-3">Precios de Mayoreo</p>
                {PRICING.map(p => (
                  <div key={p.name} className="flex items-center justify-between py-2 border-b border-white/[.04] last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{p.emoji}</span>
                      <span className="text-sm text-white/70 font-bold">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[.68rem] text-white/20 line-through font-mono">${p.retail}</span>
                      <span className="text-sm font-black font-mono text-white">${p.mayoreo}</span>
                      <span className="text-[.6rem] text-[#22c55e] font-black bg-[#22c55e]/10 px-1.5 py-0.5 rounded-full">
                        -{Math.round((1 - p.mayoreo / p.retail) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#F97316]/8 border border-[#F97316]/20 rounded-2xl p-4">
                <p className="text-[.68rem] font-black text-[#F97316] mb-1">Ejemplo de pedido</p>
                <p className="text-[.72rem] text-white/50 leading-relaxed">
                  30 cacahuates x $12 = $360 + 20 papas x $16 = $320. Total: $680 piezas mixtas con precio de mayoreo.
                </p>
              </div>
            </div>
          )}

          {/* ── DISTRIBUIDOR ── */}
          {tab === "distribuidor" && (
            <div className="space-y-4">
              <div className="bg-white/[.03] border border-white/[.07] rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#22c55e]/15 flex items-center justify-center text-2xl">📈</div>
                  <div>
                    <div className="font-black text-white">Distribuidor BOTA-NA</div>
                    <div className="text-[.68rem] text-white/35">Mejor precio para pedidos grandes</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Minimo", value: "100 pzas" },
                    { label: "Pago", value: "50% adelanto" },
                    { label: "Entrega", value: "5-7 dias" },
                  ].map(item => (
                    <div key={item.label} className="bg-white/5 rounded-xl p-2.5 text-center">
                      <div className="text-[.58rem] text-white/25 uppercase tracking-wider mb-1">{item.label}</div>
                      <div className="text-[.75rem] font-black text-white">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5 mb-4">
                  {[
                    "El precio mas bajo disponible por pieza",
                    "50% de anticipo, resto al entregar",
                    "Puedes revender entre $15 y $30 segun producto",
                    "Ganancia potencial de 50-100% sobre tu inversion",
                    "Soporte y acompañamiento para arrancar",
                    "Posibilidad de productos exclusivos con tu marca",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2 text-[.72rem] text-white/50">
                      <span className="text-[#22c55e] flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Precios distribuidor */}
              <div className="bg-white/[.03] border border-white/[.07] rounded-2xl p-4">
                <p className="text-[.62rem] font-black uppercase tracking-[.2em] text-white/30 mb-3">Precios de Distribuidor</p>
                {PRICING.map(p => (
                  <div key={p.name} className="flex items-center justify-between py-2 border-b border-white/[.04] last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{p.emoji}</span>
                      <div>
                        <span className="text-sm text-white/70 font-bold block">{p.name}</span>
                        <span className="text-[.6rem] text-white/25">Revende a ${p.retail}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-sm font-black font-mono text-[#22c55e] block">${p.dist}</span>
                        <span className="text-[.58rem] text-[#22c55e]/60">
                          +${p.retail - p.dist} ganancia
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ganancia ejemplo */}
              <div className="bg-[#22c55e]/8 border border-[#22c55e]/20 rounded-2xl p-4">
                <p className="text-[.68rem] font-black text-[#22c55e] mb-2">Ejemplo de ganancia</p>
                <p className="text-[.72rem] text-white/50 leading-relaxed mb-2">
                  100 cacahuates x $10 = inversion $1,000. Vendes a $15 c/u = $1,500. Ganancia: $500 (50%).
                </p>
                <p className="text-[.72rem] text-white/50 leading-relaxed">
                  100 papas x $15 = inversion $1,500. Vendes a $20 c/u = $2,000. Ganancia: $500 (33%).
                </p>
              </div>
            </div>
          )}

          {/* ── INSTITUCIONAL ── */}
          {tab === "institucional" && (
            <div className="space-y-4">
              <div className="bg-white/[.03] border border-white/[.07] rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/15 flex items-center justify-center text-2xl">🏫</div>
                  <div>
                    <div className="font-black text-white">Canal Institucional</div>
                    <div className="text-[.68rem] text-white/35">Escuelas, cafeterias y organizaciones</div>
                  </div>
                </div>
                <div className="space-y-1.5 mb-4">
                  {[
                    "Precios de distribuidor para pedidos institucionales",
                    "Facturacion disponible (RFC requerido)",
                    "Pedidos recurrentes con calendario fijo",
                    "Catalogo personalizado segun tus necesidades",
                    "Credito disponible para instituciones establecidas",
                    "Surtido en cafeterias, kioscos y tiendas internas",
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2 text-[.72rem] text-white/50">
                      <span className="text-[#3b82f6] flex-shrink-0 mt-0.5">✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/[.03] border border-white/[.07] rounded-2xl p-4">
                <p className="text-[.62rem] font-black uppercase tracking-[.2em] text-white/30 mb-3">Como funciona</p>
                <div className="space-y-4">
                  {[
                    { num: "01", title: "Nos contactas", desc: "Mandas WhatsApp con el nombre de tu institucion y volumen estimado mensual." },
                    { num: "02", title: "Acordamos catalogo", desc: "Definimos que productos, cantidades y frecuencia de surtido." },
                    { num: "03", title: "Primer pedido", desc: "Arrancamos con pago de contado. Con historial podemos ofrecer credito." },
                    { num: "04", title: "Surtido recurrente", desc: "Te contactamos periodicamente para renovar tu stock." },
                  ].map(step => (
                    <div key={step.num} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#3b82f6]/15 border border-[#3b82f6]/25 flex items-center justify-center flex-shrink-0">
                        <span className="text-[.6rem] font-black text-[#3b82f6]">{step.num}</span>
                      </div>
                      <div>
                        <div className="text-sm font-black text-white mb-0.5">{step.title}</div>
                        <div className="text-[.7rem] text-white/40 leading-relaxed">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-white/[.06]">
          {tab === "overview" && (
            <button
              onClick={() => { onClose(); onEventOpen() }}
              className="w-full py-3.5 rounded-full text-white font-black text-sm tracking-widest uppercase active:scale-95 transition-all"
              style={{ background: "linear-gradient(135deg,#F97316,#E53E3E)" }}
            >
              Cotizar Evento
            </button>
          )}
          {tab === "mayoreo" && (
            <a
              href={"https://wa.me/" + WA + "?text=" + encodeURIComponent("Hola! Me interesa hacer un pedido de MAYOREO con BOTA-NA. Quisiera informacion sobre precios y pedido minimo.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 py-3.5 rounded-full bg-[#22c55e] text-white font-black text-sm tracking-widest uppercase hover:bg-[#16a34a] active:scale-95 transition-all"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Hacer pedido de Mayoreo
            </a>
          )}
          {tab === "distribuidor" && (
            <a
              href={"https://wa.me/" + WA + "?text=" + encodeURIComponent("Hola! Me interesa ser DISTRIBUIDOR de BOTA-NA. Quisiera informacion sobre precios y condiciones para pedidos de 100+ piezas.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 py-3.5 rounded-full bg-[#22c55e] text-white font-black text-sm tracking-widest uppercase hover:bg-[#16a34a] active:scale-95 transition-all"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Quiero ser Distribuidor
            </a>
          )}
          {tab === "institucional" && (
            <a
              href={"https://wa.me/" + WA + "?text=" + encodeURIComponent("Hola! Soy de una institucion educativa u organizacion y me interesa BOTA-NA para venta institucional. Quisiera informacion sobre precios y facturacion.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 py-3.5 rounded-full bg-[#22c55e] text-white font-black text-sm tracking-widest uppercase hover:bg-[#16a34a] active:scale-95 transition-all"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Solicitar Informacion
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
