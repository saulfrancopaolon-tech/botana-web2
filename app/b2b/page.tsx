"use client"
import { useState, useEffect, useRef, useMemo } from "react"
import Link from "next/link"
import { NavBar } from "@/components/navbar"
import { EventModal } from "@/components/event-modal"
import { Ico, CategoryIcon } from "@/components/icons"

const WA = "524774950232"
const wa = (msg: string) => "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg)

/* ───────────── Hooks / utilidades de animación ───────────── */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, seen] as const
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, seen] = useInView<HTMLDivElement>(0.12)
  return (
    <div ref={ref} className={"reveal " + (seen ? "visible " : "") + className} style={{ transitionDelay: delay + "ms" }}>
      {children}
    </div>
  )
}

function CountUp({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const [ref, seen] = useInView<HTMLSpanElement>(0.4)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); return }
    const t0 = performance.now(), dur = 1400
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1)
      setN(Math.round(to * (1 - Math.pow(1 - p, 4))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return <span ref={ref}>{prefix}{n}{suffix}</span>
}

/* ───────────── CONTENIDO (edita aquí) ───────────── */

// Números de confianza — cámbialos por los reales
const STATS = [
  { to: 500, suffix: "+", label: "Pedidos entregados" },
  { to: 30,  suffix: "+", label: "Eventos realizados" },
  { to: 2,   suffix: "h", label: "Respuesta promedio" },
  { to: 100, suffix: "%", label: "Entregas a tiempo" },
]

const BRANDS = ["Takis", "Barcel", "Runners", "Vualá", "BOTA-NA Artesanal", "Cacahuates", "Chips Vegetales", "Gomitas", "Chamoyadas", "Aguas Frescas"]

const BENTO = [
  { icon: "trend", title: "Margen de 30–50%", desc: "Precio de distribuidor para que tu negocio gane desde la primera caja.", span: "sm:col-span-2", bg: "linear-gradient(135deg,#0f3d24,#0b1f15)" },
  { icon: "tag", title: "Etiquetas con tu tema", desc: "Nombre, colores o logo de tu evento en cada pieza.", span: "", bg: "linear-gradient(135deg,#3b1d5a,#1a0f2a)" },
  { icon: "zap", title: "Respuesta en 2 horas", desc: "Cotización lista por WhatsApp, sin vueltas.", span: "", bg: "linear-gradient(135deg,#5a2a0c,#26120a)" },
  { icon: "receipt", title: "Factura incluida", desc: "Personas físicas y morales. Solo manda tu RFC.", span: "", bg: "linear-gradient(135deg,#0c3a5a,#0a1a26)" },
  { icon: "sparkles", title: "Marcas que ya se venden solas", desc: "Takis, Barcel, Runners y Vualá junto a nuestras botanas artesanales: variedad para todos los gustos.", span: "sm:col-span-2", bg: "linear-gradient(135deg,#5a0f14,#26090b)" },
]

const CASES = [
  { id: "cafe",  icon: "coffee", tab: "Cafeterías",    title: "Surte tu cafetería o kiosco", desc: "Snacks que los estudiantes realmente piden, con pedidos recurrentes y precio de distribuidor. Tus vitrinas siempre llenas.", cta: "Quiero surtir mi negocio", msg: "Hola! Tengo una cafeteria/kiosco y me interesa surtirme con BOTA-NA de forma recurrente. Quisiera informacion de precios." },
  { id: "social",icon: "cake", tab: "Fiestas",       title: "Mesa de botanas para tu fiesta", desc: "Cumpleaños, XV años, bodas y graduaciones con etiquetas personalizadas que sorprenden a tus invitados.", cta: "Cotizar mi evento", msg: "Hola! Quiero botanas para un evento social (cumpleanos/XV/boda). Me interesa la opcion con etiquetas personalizadas." },
  { id: "corp",  icon: "building", tab: "Empresas",      title: "Snacks para tu empresa o congreso", desc: "Reuniones de equipo, ferias y expos. Una mesa premium para impresionar a clientes y colaboradores.", cta: "Cotizar evento corporativo", msg: "Hola! Necesito botanas para un evento corporativo/empresarial. Quisiera una cotizacion para mi organizacion." },
  { id: "dist",  icon: "box", tab: "Distribuidores",title: "Empieza tu negocio de snacks", desc: "Precios preferenciales desde 100 piezas. Ganancia del 30–50% sobre tu inversión y soporte directo.", cta: "Quiero ser distribuidor", msg: "Hola! Me interesa ser DISTRIBUIDOR de BOTA-NA. Quisiera informacion sobre precios y condiciones para pedidos grandes." },
]

// Precios por nivel — ya eran tuyos. Agrega aquí las botanas de marca cuando tengas tus precios.
const TIERS = [
  { name: "Cacahuates", retail: 15, may: 12, dist: 10 },
  { name: "Chips",      retail: 25, may: 20, dist: 17 },
  { name: "Gomitas",    retail: 15, may: 12, dist: 11 },
  { name: "Papas",      retail: 20, may: 16, dist: 15 },
  { name: "Aguas",      retail: 22, may: 18, dist: 17 },
  { name: "Chamoyadas", retail: 30, may: 25, dist: 23 },
]

const TIER_CAT: Record<string, string> = { Cacahuates: "Cacahuates", Chips: "Chips", Gomitas: "Gomitas", Papas: "Papas", Aguas: "Bebidas", Chamoyadas: "Bebidas" }

const PACKAGES = [
  { id: "facil",  name: "Paquete Fácil",  icon: "gift", desc: "Reuniones pequeñas, oficinas o mesas de snacks de hasta 30 personas.", pieces: "50 piezas", price: "$550", note: "precio base", color: "#FF9F0A",
    includes: ["Mix de cacahuates y gomitas", "Empaque individual por pieza", "Entrega en La Salle o a domicilio*", "Listo en 3 días hábiles"],
    msg: "Hola! Me interesa el PAQUETE FACIL de 50 piezas para mi evento. Quisiera mas informacion." },
  { id: "fiesta", name: "Paquete Fiesta", icon: "sparkles", desc: "Cumpleaños, XV años, graduaciones y fiestas de 50–100 personas.", pieces: "100 piezas", price: "$980", note: "incluye etiquetas", color: "#FF3B30", badge: "Más popular",
    includes: ["Mix completo de toda la variedad", "Etiquetas personalizadas con tu tema", "Empaque individual por pieza", "Entrega a domicilio incluida*", "Listo en 5 días hábiles"],
    msg: "Hola! Me interesa el PAQUETE FIESTA de 100 piezas con etiquetas personalizadas. Quisiera cotizar mi evento." },
  { id: "pro",    name: "Paquete Pro",    icon: "trophy", desc: "Bodas, congresos, ferias y eventos corporativos de 100+ personas.", pieces: "200+ piezas", price: "Cotizar", note: "precio especial", color: "#30D158",
    includes: ["Catálogo completo a tu elección", "Etiquetas con diseño personalizado", "Entrega coordinada al venue", "Anticipo 50% — resto al entregar", "Soporte directo antes y durante"],
    msg: "Hola! Me interesa el PAQUETE PRO para un evento grande. Quisiera una cotizacion personalizada." },
]

const STEPS = [
  { n: "1", title: "Nos escribes", desc: "Cuéntanos tipo de evento, número de personas y fecha." },
  { n: "2", title: "Te cotizamos", desc: "En menos de 2 horas tienes precios y opciones." },
  { n: "3", title: "Apartas con 50%", desc: "El anticipo asegura tu fecha y nos deja preparar todo." },
  { n: "4", title: "Entrega perfecta", desc: "Puntual, completo y listo para impresionar." },
]

const FAQS = [
  { q: "¿Cuánto tiempo de anticipación necesitan?", a: "Para paquetes de hasta 100 piezas, mínimo 3 días hábiles. Para eventos grandes o con etiquetas personalizadas, 5–7 días. Entre más tiempo, mejor resultado." },
  { q: "¿Hacen entregas a domicilio?", a: "Sí, en León, Guanajuato. El costo depende de la distancia y se cotiza por separado. Recoger en La Salle Bajío siempre es sin costo." },
  { q: "¿Puedo personalizar los productos del paquete?", a: "Por completo. Los paquetes son una base: cambia variedades, quita lo que no te guste o agrega productos específicos, como Takis, Barcel, Runners o Vualá." },
  { q: "¿Hacen etiquetas personalizadas?", a: "Sí. Llevan el nombre, tema o diseño de tu evento. Cuestan $4 por pieza adicional; en los paquetes Fiesta y Pro ya están incluidas." },
  { q: "¿Cómo es el pago?", a: "50% de anticipo al confirmar (transferencia o efectivo) y el 50% restante al entregar. Para distribuidores recurrentes podemos negociar crédito." },
  { q: "¿Tienen facturación?", a: "Sí. Necesitamos tu RFC y datos fiscales al confirmar el pedido. Aplica para personas físicas y morales." },
]

const WaIcon = ({ s = 18 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
)

function Eyebrow({ children, color = "#FF9F0A" }: { children: React.ReactNode; color?: string }) {
  return <div className="text-xs font-semibold uppercase tracking-[.18em]" style={{ color }}>{children}</div>
}
function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-head mt-2 text-[clamp(2.2rem,6vw,3.8rem)] text-white" style={{ lineHeight: 1.02 }}>{children}</h2>
}

/* ───────────── PÁGINA ───────────── */
export default function B2BPage() {
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [caseId, setCaseId] = useState(CASES[0].id)
  const [tier, setTier] = useState<"may" | "dist">("may")
  const [showStickyCta, setShowStickyCta] = useState(false)
  const [stepsRef, stepsSeen] = useInView<HTMLDivElement>(0.3)

  // Calculadora de ganancia
  const [calcCat, setCalcCat] = useState(0)
  const [calcQty, setCalcQty] = useState(100)
  const calc = useMemo(() => {
    const t = TIERS[calcCat]
    const invest = calcQty * t.dist
    const revenue = calcQty * t.retail
    return { invest, revenue, profit: revenue - invest, pct: Math.round(((revenue - invest) / invest) * 100) }
  }, [calcCat, calcQty])

  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > 520)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const activeCase = CASES.find(c => c.id === caseId) ?? CASES[0]

  return (
    <div className="min-h-screen overflow-x-clip bg-[#0A0A0B] text-white">
      <NavBar onCartOpen={() => {}} onLoyaltyOpen={() => {}} />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden px-5 pb-16 pt-12 sm:pt-20">
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div className="text-center lg:text-left">
            <div className="rise inline-flex items-center gap-2 rounded-full glass-2 px-4 py-1.5 text-[.72rem] font-semibold text-white/80">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#30D158]" />
              Para negocios y eventos · León, Gto.
            </div>
            <h1 className="rise font-head mt-6 text-[clamp(2.9rem,10vw,6.4rem)] text-grad-soft" style={{ animationDelay: "100ms", lineHeight: 0.98 }}>
              Surte tu negocio.<br /><span className="text-grad">Sorprende a todos.</span>
            </h1>
            <p className="rise mx-auto mt-6 max-w-lg text-[clamp(1rem,2.4vw,1.2rem)] leading-relaxed text-white/60 lg:mx-0" style={{ animationDelay: "200ms" }}>
              Takis, Barcel, Runners, Vualá y snacks artesanales a precio de mayoreo, con etiquetas personalizadas y entrega puntual.
            </p>
            <div className="rise mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start justify-center" style={{ animationDelay: "300ms" }}>
              <button onClick={() => setQuoteOpen(true)} className="btn-primary w-full sm:w-auto">
                Cotizar mi pedido en 2 min
                <Ico name="arrowRight" size={16} strokeWidth={2.6} />
              </button>
              <a href={wa("Hola! Quiero cotizar botanas para mi evento/negocio con BOTA-NA.")} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full sm:w-auto">
                <WaIcon s={17} /> WhatsApp
              </a>
            </div>
          </div>

          {/* Tarjeta de cotización de muestra (flotante) */}
          <div className="rise relative mx-auto w-full max-w-sm" style={{ animationDelay: "380ms" }}>
            <div className="glass-2 rounded-[32px] p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,.9)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[.14em] text-white/45">Tu cotización</span>
                <span className="rounded-full bg-[#30D158]/15 px-2.5 py-1 text-[.65rem] font-bold text-[#30D158]">Lista en 2h</span>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  ["Papas", "Takis Fuego", "x 40"],
                  ["Papas", "Chips Barcel", "x 30"],
                  ["Dulces", "Vualá Sorpresa", "x 20"],
                  ["Cacahuates", "Cacahuates", "x 10"],
                ].map(([c, n, q]) => (
                  <div key={n} className="flex items-center justify-between rounded-2xl bg-white/[.06] px-3.5 py-2.5">
                    <span className="flex items-center gap-2.5 text-sm font-medium text-white/90"><span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-white/80"><CategoryIcon cat={c} size={18} /></span>{n}</span>
                    <span className="text-sm font-semibold text-white/50">{q}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
                <span className="text-sm text-white/45">100 piezas · etiquetas incluidas</span>
                <span className="text-grad text-3xl font-extrabold tracking-tight">Tu precio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="relative z-10 mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-head text-[2.6rem] sm:text-5xl text-white"><CountUp to={s.to} suffix={s.suffix} /></div>
              <div className="mt-1 text-[.7rem] font-medium uppercase tracking-[.12em] text-white/35">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ MARCAS (marquee) ═══ */}
      <div className="marquee-wrap overflow-hidden border-y border-white/[.06] bg-white/[.02] py-4" aria-label="Marcas y productos que manejamos">
        <div className="marquee-track">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="px-7 text-lg font-bold tracking-tight text-white/30">{b}<span className="ml-14 text-white/15">•</span></span>
          ))}
        </div>
      </div>

      {/* ═══ POR QUÉ ═══ */}
      <section className="cv-auto px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 max-w-2xl"><Eyebrow>Por qué BOTA-NA</Eyebrow><H2>Todo lo que necesitas para vender (o celebrar) sin complicarte.</H2></Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {BENTO.map((b, i) => (
              <Reveal key={b.title} delay={i * 70} className={b.span}>
                <div className="bento h-full p-6 sm:p-7" style={{ background: b.bg }}>
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-white"><Ico name={b.icon} size={28} strokeWidth={1.7} /></div>
                  <h3 className="mt-5 text-xl font-bold tracking-tight text-white">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PARA QUIÉN (tabs) ═══ */}
      <section className="cv-auto bg-[#0f0f11] px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-8 text-center"><Eyebrow color="#FF3B30">Para quién es</Eyebrow><H2>Una solución para cada necesidad</H2></Reveal>
          <Reveal>
            <div className="mb-6 flex justify-center">
              <div className="flex max-w-full gap-1 overflow-x-auto scrollbar-none rounded-full bg-white/[.06] p-1" role="tablist">
                {CASES.map(c => (
                  <button key={c.id} role="tab" aria-selected={c.id === caseId} onClick={() => setCaseId(c.id)}
                    className={"flex-shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 " + (c.id === caseId ? "bg-white text-black shadow-lg" : "text-white/55 hover:text-white")}>
                    {c.tab}
                  </button>
                ))}
              </div>
            </div>
            <div key={activeCase.id} className="bento rise grid items-center gap-8 p-8 sm:grid-cols-[auto_1fr] sm:p-12" style={{ background: "linear-gradient(135deg,#1c1c1f,#141416)" }}>
              <div className="float-a mx-auto grid h-28 w-28 place-items-center rounded-[34px] glass-2 text-white sm:h-36 sm:w-36" aria-hidden="true"><Ico name={activeCase.icon} size={64} strokeWidth={1.3} /></div>
              <div>
                <h3 className="font-head text-[clamp(1.7rem,4vw,2.6rem)] text-white">{activeCase.title}</h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-white/55">{activeCase.desc}</p>
                <a href={wa(activeCase.msg)} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6">{activeCase.cta}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ PRECIOS ═══ */}
      <section className="cv-auto px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal className="mb-8 text-center">
            <Eyebrow color="#30D158">Precios</Eyebrow><H2>Transparencia total</H2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/45">Mira cuánto ahorras por nivel de compra. Sin letras chiquitas.</p>
          </Reveal>

          <Reveal>
            <div className="mb-5 flex justify-center">
              <div className="ios-segmented">
                <button data-active={tier === "may"} onClick={() => setTier("may")}>Mayoreo · 30+ pzs</button>
                <button data-active={tier === "dist"} onClick={() => setTier("dist")}>Distribuidor · 100+ pzs</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TIERS.map(r => {
                const price = tier === "may" ? r.may : r.dist
                const off = Math.round((1 - price / r.retail) * 100)
                return (
                  <div key={r.name} className="bento p-5 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/[.07] text-white"><CategoryIcon cat={TIER_CAT[r.name]} size={26} /></div>
                    <div className="mt-2 text-sm font-semibold text-white/80">{r.name}</div>
                    <div className="mt-3 flex items-baseline justify-center gap-2">
                      <span className="text-3xl font-extrabold tracking-tight text-white">${price}</span>
                      <span className="text-xs text-white/30 line-through">${r.retail}</span>
                    </div>
                    <span className={"mt-2 inline-block rounded-full px-2.5 py-0.5 text-[.65rem] font-bold " + (tier === "may" ? "bg-[#FF9F0A]/15 text-[#FF9F0A]" : "bg-[#30D158]/15 text-[#30D158]")}>-{off}%</span>
                  </div>
                )
              })}
              {/* Botanas de marca: precio por cotización */}
              <div className="bento col-span-2 flex flex-col items-center justify-between gap-3 p-5 text-center sm:col-span-3 sm:flex-row sm:text-left" style={{ background: "linear-gradient(135deg,#3b1d5a,#1a0f2a)" }}>
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-white/10 text-white"><Ico name="flame" size={24} /></span>
                  <div>
                    <div className="font-bold text-white">Takis · Barcel · Runners · Vualá</div>
                    <div className="text-sm text-white/50">Precio de mayoreo según volumen — cotiza y te respondemos hoy.</div>
                  </div>
                </div>
                <a href={wa("Hola! Quiero precios de mayoreo de Takis, Barcel, Runners y Vuala.")} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-shrink-0 !py-2.5">Pedir precios</a>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-white/30">Evento: precio especial desde 1 pieza · Mayoreo: pago 100% por adelantado · Distribuidor: 50% de anticipo</p>
          </Reveal>
        </div>
      </section>

      {/* ═══ CALCULADORA DE GANANCIA ═══ */}
      <section className="cv-auto bg-[#0f0f11] px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-8 text-center"><Eyebrow>Distribuidores</Eyebrow><H2>Calcula tu ganancia</H2></Reveal>
          <Reveal>
            <div className="bento p-6 sm:p-9">
              <div className="flex flex-wrap justify-center gap-2">
                {TIERS.map((t, i) => (
                  <button key={t.name} onClick={() => setCalcCat(i)} className="cat-chip" data-active={i === calcCat}><CategoryIcon cat={TIER_CAT[t.name]} size={16} /> {t.name}</button>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="qty" className="text-sm font-medium text-white/55">Piezas</label>
                  <span className="font-head text-4xl text-white">{calcQty}</span>
                </div>
                <input id="qty" type="range" min={100} max={1000} step={50} value={calcQty} onChange={e => setCalcQty(+e.target.value)}
                  className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-[#FF3B30]" />
                <div className="mt-1 flex justify-between text-[.65rem] text-white/30"><span>100</span><span>1,000</span></div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-white/[.05] p-4"><div className="text-[.65rem] uppercase tracking-wider text-white/40">Inviertes</div><div className="mt-1 text-xl font-bold text-white sm:text-2xl">${calc.invest.toLocaleString("es-MX")}</div></div>
                <div className="rounded-2xl bg-white/[.05] p-4"><div className="text-[.65rem] uppercase tracking-wider text-white/40">Vendes a</div><div className="mt-1 text-xl font-bold text-white sm:text-2xl">${calc.revenue.toLocaleString("es-MX")}</div></div>
                <div className="rounded-2xl bg-[#30D158]/15 p-4"><div className="text-[.65rem] uppercase tracking-wider text-[#30D158]/80">Ganas</div><div className="mt-1 text-xl font-extrabold text-[#30D158] sm:text-2xl">${calc.profit.toLocaleString("es-MX")}</div></div>
              </div>
              <p className="mt-4 text-center text-xs text-white/35">Estimado con precio de distribuidor vs. precio normal · {calc.pct}% de retorno sobre tu inversión.</p>
              <a href={wa("Hola! Hice mi calculo de " + calcQty + " piezas de " + TIERS[calcCat].name + " como distribuidor. Quisiera mas informacion.")} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 w-full">Quiero ser distribuidor</a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ PAQUETES ═══ */}
      <section id="paquetes" className="cv-auto px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 text-center">
            <Eyebrow>Paquetes para eventos</Eyebrow><H2>Elige el tuyo</H2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/45">Todos son personalizables: cambia sabores, agrega Takis o Vualá y lo armamos a tu medida.</p>
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-3">
            {PACKAGES.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 90}>
                <div className="bento relative flex h-full flex-col p-7 sm:p-8" style={pkg.badge ? { borderColor: pkg.color + "66", boxShadow: "0 0 0 1px " + pkg.color + "33, 0 30px 80px -30px " + pkg.color + "66" } : undefined}>
                  {pkg.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-1 text-[.65rem] font-bold uppercase tracking-wider text-white" style={{ background: pkg.color }}>{pkg.badge}</span>}
                  <div className="grid h-14 w-14 place-items-center rounded-2xl text-white" style={{ background: pkg.color + "33", color: pkg.color }}><Ico name={pkg.icon} size={28} strokeWidth={1.8} /></div>
                  <h3 className="font-head mt-4 text-2xl text-white">{pkg.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/45">{pkg.desc}</p>
                  <div className="my-6 border-y border-white/[.07] py-5">
                    <div className="flex items-baseline gap-2"><span className="text-4xl font-extrabold tracking-tight" style={{ color: pkg.color }}>{pkg.price}</span><span className="text-xs uppercase tracking-wider text-white/35">{pkg.note}</span></div>
                    <div className="mt-1 text-sm text-white/45">{pkg.pieces}</div>
                  </div>
                  <ul className="flex-1 space-y-2.5">
                    {pkg.includes.map(it => (
                      <li key={it} className="flex gap-2.5 text-sm text-white/65"><Ico name="check" size={16} strokeWidth={3} className="mt-0.5 flex-shrink-0" style={{ color: pkg.color }} />{it}</li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[.65rem] text-white/25">*Entrega cotizada por separado según distancia</p>
                  <a href={wa(pkg.msg)} target="_blank" rel="noopener noreferrer" className={(pkg.badge ? "btn-primary" : "btn-ghost") + " mt-5 w-full"}>
                    <WaIcon s={16} /> Pedir este paquete
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESO ═══ */}
      <section className="cv-auto bg-[#0f0f11] px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-14 text-center"><Eyebrow color="#FF3B30">Proceso</Eyebrow><H2>Así de sencillo</H2></Reveal>
          <div ref={stepsRef} className="relative grid gap-10 sm:grid-cols-4 sm:gap-6">
            <div className={"step-line absolute left-[12%] right-[12%] top-7 hidden h-px bg-gradient-to-r from-[#FF9F0A] to-[#FF3B30] sm:block " + (stepsSeen ? "visible" : "")} aria-hidden="true" />
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <div className="relative text-center">
                  <div className="relative z-10 mx-auto grid h-14 w-14 place-items-center rounded-full text-xl font-extrabold text-white shadow-[0_10px_30px_-6px_rgba(255,59,48,.6)]" style={{ background: "var(--grad-brand)" }}>{s.n}</div>
                  <h3 className="mt-5 text-base font-bold tracking-tight text-white">{s.title}</h3>
                  <p className="mx-auto mt-1.5 max-w-[220px] text-sm leading-relaxed text-white/45">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="cv-auto px-5 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <Reveal className="mb-10 text-center"><Eyebrow>Preguntas frecuentes</Eyebrow><H2>Todo lo que necesitas saber</H2></Reveal>
          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const open = openFaq === i
              return (
                <Reveal key={f.q} delay={i * 50}>
                  <div className="overflow-hidden rounded-[22px] border transition-colors duration-300" style={{ background: "#141416", borderColor: open ? "rgba(255,255,255,.2)" : "rgba(255,255,255,.07)" }}>
                    <button onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                      <span className="text-[.95rem] font-semibold leading-snug text-white">{f.q}</span>
                      <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full transition-all duration-500 [transition-timing-function:var(--spring)]" style={{ background: open ? "#fff" : "rgba(255,255,255,.1)", color: open ? "#000" : "#fff", transform: open ? "rotate(45deg)" : "none" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                      </span>
                    </button>
                    <div className={"accordion-body " + (open ? "open" : "")}>
                      <div><p className="px-5 pb-5 text-sm leading-relaxed text-white/55">{f.a}</p></div>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="relative overflow-hidden px-5 py-24 sm:py-32">
        <div className="aurora" aria-hidden="true"><i /><i /><i /></div>
        <Reveal className="relative z-10 mx-auto max-w-2xl text-center">
          <div className="float-a mx-auto mb-5 grid h-16 w-16 place-items-center rounded-[22px] text-white" style={{ background: "var(--grad-brand)" }} aria-hidden="true"><Ico name="flame" size={32} /></div>
          <h2 className="font-head text-[clamp(2.6rem,8vw,5rem)] text-grad-soft" style={{ lineHeight: 1 }}>¿Listo para<br /><span className="text-grad">arrancar?</span></h2>
          <p className="mx-auto mt-5 max-w-md text-base text-white/55">Escríbenos hoy. En menos de 2 horas tienes tu cotización lista.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={wa("Hola! Vi la pagina de BOTA-NA para negocios y quiero cotizar. Me puedes ayudar?")} target="_blank" rel="noopener noreferrer" className="btn-primary w-full sm:w-auto" style={{ background: "#25D366", boxShadow: "0 10px 30px -8px rgba(37,211,102,.55)" }}>
              <WaIcon s={19} /> Escribir por WhatsApp
            </a>
            <button onClick={() => setQuoteOpen(true)} className="btn-ghost w-full sm:w-auto">Usar el cotizador</button>
          </div>
          <Link href="/" className="mt-8 inline-block text-sm text-white/35 transition-colors hover:text-white">← Ver el catálogo de la tienda</Link>
        </Reveal>
      </section>

      <footer className="border-t border-white/[.06] px-5 pb-28 pt-10 text-center sm:pb-10">
        <div className="font-head text-3xl text-white">BOTA<span className="text-grad">-</span>NA</div>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[.2em] text-white/25">Snacks Premium · León, Gto. · 2025</p>
      </footer>

      {/* Barra de acción pegajosa (móvil) */}
      <div
        className={"fixed inset-x-0 bottom-0 z-40 px-4 transition-all duration-500 [transition-timing-function:var(--ease-apple)] sm:hidden " + (showStickyCta ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0")}
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
      >
        <button onClick={() => setQuoteOpen(true)} className="btn-primary w-full shadow-[0_20px_50px_-10px_rgba(0,0,0,.9)]">Cotizar mi pedido</button>
      </div>

      <EventModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  )
}
