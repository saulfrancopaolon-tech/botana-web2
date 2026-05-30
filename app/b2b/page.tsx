"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"

const WA = "524774950232"

function wa(msg: string) {
  return "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg)
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("b2b-visible"); obs.unobserve(e.target) } }),
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Reveal({ 
  children, 
  delay = 0, 
  className = "", 
  style 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
  style?: React.CSSProperties; // <-- Agregamos el tipo para style
}) {
  const ref = useReveal()
  return (
    <div 
      ref={ref} 
      className={"b2b-reveal " + className} 
      // Combinamos el delay con cualquier otro estilo que le pases
      style={{ transitionDelay: String(delay) + "ms", ...style }} 
    >
      {children}
    </div>
  )
}

// ── STATS (edita estos números con los reales) ──
const STATS = [
  { num: "500+", label: "Pedidos entregados" },
  { num: "30+",  label: "Eventos realizados" },
  { num: "2h",   label: "Tiempo de respuesta" },
  { num: "100%", label: "Entregas a tiempo" },
]

// ── PAQUETES ──
const PACKAGES = [
  {
    id: "facil",
    name: "Paquete Fácil",
    emoji: "🎈",
    desc: "Ideal para reuniones pequeñas, oficinas o mesas de snacks hasta 30 personas.",
    pieces: "50 piezas",
    price: "$550",
    priceNote: "precio base",
    color: "#F97316",
    includes: [
      "Mix de cacahuates y gomitas",
      "Empaque individual cada pieza",
      "Entrega en La Salle o domicilio*",
      "Listo en 3 días hábiles",
    ],
    msg: "Hola! Me interesa el PAQUETE FACIL de 50 piezas para mi evento. Quisiera mas informacion.",
  },
  {
    id: "fiesta",
    name: "Paquete Fiesta",
    emoji: "🎉",
    desc: "Perfecto para cumpleaños, XV años, graduaciones y fiestas de 50-100 personas.",
    pieces: "100 piezas",
    price: "$980",
    priceNote: "incluye etiquetas",
    color: "#E53E3E",
    badge: "MAS POPULAR",
    includes: [
      "Mix completo de toda la variedad",
      "Etiquetas personalizadas con tu tema",
      "Empaque individual cada pieza",
      "Entrega a domicilio incluida*",
      "Listo en 5 días hábiles",
    ],
    msg: "Hola! Me interesa el PAQUETE FIESTA de 100 piezas con etiquetas personalizadas. Quisiera cotizar mi evento.",
  },
  {
    id: "pro",
    name: "Paquete Pro",
    emoji: "🏆",
    desc: "Para bodas, congresos, ferias y eventos corporativos de 100+ personas.",
    pieces: "200+ piezas",
    price: "Cotizar",
    priceNote: "precio especial",
    color: "#22c55e",
    includes: [
      "Catalogo completo a tu eleccion",
      "Etiquetas con diseño personalizado",
      "Entrega coordinada al venue",
      "Anticipo 50% — resto al entregar",
      "Soporte directo antes y durante",
    ],
    msg: "Hola! Me interesa el PAQUETE PRO para un evento grande. Quisiera una cotizacion personalizada.",
  },
]

// ── CASOS DE USO ──
const USE_CASES = [
  {
    icon: "🏫",
    title: "Cafeterías y Kioscos",
    desc: "Surte tu cafetería escolar o kiosco con snacks que los estudiantes realmente quieren. Pedidos recurrentes con precio de distribuidor.",
    cta: "Quiero surtir mi negocio",
    msg: "Hola! Tengo una cafeteria/kiosco y me interesa surtirme con BOTA-NA de forma recurrente. Quisiera informacion de precios.",
  },
  {
    icon: "🎂",
    title: "Eventos Sociales",
    desc: "Cumpleaños, XV años, bodas y graduaciones. Mesa de botanas temática con etiquetas personalizadas que sorprenden a tus invitados.",
    cta: "Cotizar mi evento",
    msg: "Hola! Quiero botanas para un evento social (cumpleanos/XV/boda). Me interesa la opcion con etiquetas personalizadas.",
  },
  {
    icon: "🏢",
    title: "Eventos Corporativos",
    desc: "Congresos, reuniones de equipo, ferias y expos. Snacks premium para impresionar a tus clientes o colaboradores.",
    cta: "Cotizar evento corporativo",
    msg: "Hola! Necesito botanas para un evento corporativo/empresarial. Quisiera una cotizacion para mi organizacion.",
  },
  {
    icon: "📦",
    title: "Distribuidores",
    desc: "Inicia tu propio negocio de snacks. Precios preferenciales para pedidos de 100+ piezas. Ganancia del 30-50% sobre tu inversión.",
    cta: "Quiero ser distribuidor",
    msg: "Hola! Me interesa ser DISTRIBUIDOR de BOTA-NA. Quisiera informacion sobre precios y condiciones para pedidos grandes.",
  },
]

// ── PROCESO ──
const STEPS = [
  { num: "01", title: "Nos contactas", desc: "Mándanos WhatsApp con el tipo de evento, número de personas y fecha aproximada." },
  { num: "02", title: "Te cotizamos", desc: "En menos de 2 horas recibes tu cotización personalizada con precios y opciones de paquete." },
  { num: "03", title: "Aparta con anticipo", desc: "50% de anticipo asegura tu fecha y nos permite preparar todo con tiempo." },
  { num: "04", title: "Entrega perfecta", desc: "Recibimos el resto al entregar. Puntual, completo y listo para impresionar." },
]

// ── FAQ ──
const FAQS = [
  {
    q: "¿Cuánto tiempo de anticipación necesitan?",
    a: "Para paquetes de hasta 100 piezas, necesitamos mínimo 3 días hábiles. Para eventos grandes o con etiquetas personalizadas, 5-7 días. Entre más tiempo, mejor resultado.",
  },
  {
    q: "¿Hacen entregas a domicilio?",
    a: "Sí, en León, Guanajuato. El costo de entrega depende de la distancia y se cotiza por separado. Recoger en La Salle Bajío es siempre sin costo.",
  },
  {
    q: "¿Puedo personalizar los productos del paquete?",
    a: "Completamente. Los paquetes son base — puedes cambiar las variedades, eliminar lo que no te guste o agregar productos específicos. Te adaptamos al gusto.",
  },
  {
    q: "¿Hacen etiquetas personalizadas?",
    a: "Sí. Las etiquetas llevan el nombre, tema o diseño de tu evento. Se cobran $4 por pieza adicional. Para el Paquete Fiesta y Pro ya están incluidas.",
  },
  {
    q: "¿Cómo es el pago?",
    a: "50% de anticipo al confirmar el pedido (transferencia o efectivo) y el 50% restante al momento de la entrega. Para distribuidores recurrentes podemos negociar crédito.",
  },
  {
    q: "¿Tienen facturación?",
    a: "Sí, emitimos factura. Necesitamos tu RFC y datos fiscales al momento de confirmar el pedido. Aplica para personas físicas y morales.",
  },
]

export default function B2BPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeCase, setActiveCase] = useState(0)

  return (
    <>
      <style>{`
        /* B2B page animations */
        .b2b-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.65s cubic-bezier(0.16,1,0.3,1), transform 0.65s cubic-bezier(0.16,1,0.3,1);
        }
        .b2b-visible { opacity: 1 !important; transform: none !important; }
        .b2b-card {
          transition: transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.3s cubic-bezier(0.25,0.46,0.45,0.94), border-color 0.3s ease;
        }
        .b2b-card:hover { transform: translateY(-4px); box-shadow: 0 20px 48px rgba(0,0,0,0.55); }
        button, a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        @keyframes b2bFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .b2b-float { animation: b2bFloat 3s ease-in-out infinite; }
        @keyframes b2bPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:0.5} }
        .b2b-pulse { animation: b2bPulse 1.5s ease-in-out infinite; }
        @keyframes b2bGlow { 0%,100%{box-shadow:0 0 20px rgba(229,62,62,0.3)} 50%{box-shadow:0 0 40px rgba(229,62,62,0.6)} }
        .b2b-glow { animation: b2bGlow 2.5s ease-in-out infinite; }
        .b2b-faq-body {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.38s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .b2b-faq-body.open { grid-template-rows: 1fr; }
        .b2b-faq-body > div { overflow: hidden; }
      `}</style>

      <div className="min-h-screen" style={{ background: "#0A0A0A", color: "#FAFAFA", fontFamily: "'DM Sans',sans-serif", WebkitFontSmoothing: "antialiased" }}>

        {/* ── NAV ── */}
        <nav style={{ position: "sticky", top: 0, zIndex: 100, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.25rem", background: "rgba(10,10,10,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.7rem", letterSpacing: ".04em", color: "white", textDecoration: "none" }}>
            BOTA<span style={{ color: "#E53E3E" }}>-</span>NA
            <span style={{ marginLeft: 8, fontSize: ".55rem", fontFamily: "'DM Sans',sans-serif", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "#F97316", verticalAlign: "middle" }}>B2B</span>
          </Link>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link href="/" style={{ padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
              Ver Menu
            </Link>
            <a href={wa("Hola! Vi la pagina de BOTA-NA para negocios y me interesa conocer mas sobre sus opciones de mayoreo/eventos.")} target="_blank" rel="noopener noreferrer"
              style={{ padding: "8px 16px", borderRadius: 999, background: "#E53E3E", fontSize: ".7rem", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "white", textDecoration: "none" }}>
              Contactar
            </a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "5rem 1.25rem 4rem", overflow: "hidden" }}>
          {/* Glows */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(229,62,62,0.15),transparent 70%)", top: "10%", left: "50%", transform: "translateX(-50%)" }} />
            <div style={{ position: "absolute", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(249,115,22,0.08),transparent 70%)", top: "40%", left: "20%" }} />
          </div>

          {/* Big bg text */}
          <div style={{ position: "absolute", fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(8rem,20vw,20rem)", color: "rgba(255,255,255,0.02)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", whiteSpace: "nowrap", letterSpacing: "-.02em", pointerEvents: "none", userSelect: "none" }}>
            MAYOREO
          </div>

          <div style={{ position: "relative", zIndex: 1, maxWidth: 860 }}>
            {/* Badge */}
            <div className="b2b-float" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.3)", borderRadius: 999, padding: "6px 16px", fontSize: ".68rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "#E53E3E", marginBottom: "1.75rem" }}>
              <span className="b2b-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#E53E3E", display: "inline-block" }} />
              Para Negocios y Eventos · Leon, Gto.
            </div>

            <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(3.5rem,10vw,8rem)", lineHeight: .92, letterSpacing: ".02em", color: "white", marginBottom: "1.25rem" }}>
              Lleva BOTA-NA<br />a tu <span style={{ color: "#E53E3E" }}>Negocio</span><br />o <span style={{ color: "#F97316" }}>Evento</span>
            </h1>

            <p style={{ fontSize: "clamp(.95rem,2.5vw,1.15rem)", color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "0 auto 2.5rem", fontWeight: 300, lineHeight: 1.75 }}>
              Snacks premium con precio de mayoreo, etiquetas personalizadas para tu evento y entrega puntual. Sin complicaciones.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <a
                href={wa("Hola! Quiero cotizar botanas para mi evento/negocio con BOTA-NA.")}
                target="_blank" rel="noopener noreferrer"
                className="b2b-glow"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 999, background: "#E53E3E", color: "white", fontWeight: 800, fontSize: ".9rem", letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "none" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                Cotizar por WhatsApp
              </a>
              <a
                href="#paquetes"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.15)", color: "white", fontWeight: 600, fontSize: ".9rem", letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "none" }}
              >
                Ver Paquetes
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", justifyContent: "center", gap: "3rem", marginTop: "4rem", flexWrap: "wrap" }}>
              {STATS.map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2.5rem", color: "white", lineHeight: 1 }}>{s.num}</div>
                  <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,0.3)", letterSpacing: ".14em", textTransform: "uppercase", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARA QUIEN ── */}
        <section style={{ padding: "5rem 1.25rem", background: "#111" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <Reveal>
              <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".2em", textTransform: "uppercase", color: "#E53E3E", marginBottom: 8 }}>Para quién es</div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.5rem,5vw,4.5rem)", lineHeight: .95, marginBottom: "3rem" }}>
                Soluciones para<br />cada necesidad
              </h2>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
              {USE_CASES.map((uc, i) => (
                <Reveal key={uc.title} delay={i * 80}>
                  <div
                    className="b2b-card"
                    style={{ background: "#181818", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: "1.5rem", height: "100%" }}
                  >
                    <div style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>{uc.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: "1rem", color: "white", marginBottom: 8 }}>{uc.title}</div>
                    <p style={{ fontSize: ".78rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: "1.25rem" }}>{uc.desc}</p>
                    <a
                      href={wa(uc.msg)}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: ".68rem", fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "#E53E3E", textDecoration: "none" }}
                    >
                      {uc.cta}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E53E3E" strokeWidth="2.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PAQUETES ── */}
        <section id="paquetes" style={{ padding: "5rem 1.25rem" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <Reveal style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".2em", textTransform: "uppercase", color: "#F97316", marginBottom: 8 }}>Paquetes</div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.5rem,5vw,4.5rem)", lineHeight: .95, marginBottom: 12 }}>
                Elige tu Paquete
              </h2>
              <p style={{ fontSize: ".9rem", color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto" }}>
                Diseñados para cada escala. Todos personalizables — dinos lo que necesitas y lo armamos a tu medida.
              </p>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
              {PACKAGES.map((pkg, i) => (
                <Reveal key={pkg.id} delay={i * 100}>
                  <div
                    className="b2b-card"
                    style={{
                      position: "relative",
                      background: "#111",
                      border: "1px solid",
                      borderColor: pkg.badge ? pkg.color + "55" : "rgba(255,255,255,0.08)",
                      borderRadius: 28,
                      padding: "2rem",
                      height: "100%",
                    }}
                  >
                    {pkg.badge && (
                      <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: pkg.color, color: "white", fontSize: ".6rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>
                        {pkg.badge}
                      </div>
                    )}

                    <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{pkg.emoji}</div>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.8rem", letterSpacing: ".03em", color: "white", marginBottom: 6 }}>
                      {pkg.name}
                    </div>
                    <p style={{ fontSize: ".78rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                      {pkg.desc}
                    </p>

                    {/* Price */}
                    <div style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontFamily: "'Space Mono',monospace", fontSize: "2.2rem", fontWeight: 700, color: pkg.color }}>
                          {pkg.price}
                        </span>
                        <span style={{ fontSize: ".7rem", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: ".1em" }}>
                          {pkg.priceNote}
                        </span>
                      </div>
                      <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                        {pkg.pieces}
                      </div>
                    </div>

                    {/* Includes */}
                    <div style={{ marginBottom: "2rem" }}>
                      {pkg.includes.map(item => (
                        <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                          <span style={{ color: pkg.color, flexShrink: 0, marginTop: 1, fontSize: ".85rem" }}>✓</span>
                          <span style={{ fontSize: ".78rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                      <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,0.2)", marginTop: 8 }}>
                        *Costo de entrega cotizado por separado segun distancia
                      </div>
                    </div>

                    <a
                      href={wa(pkg.msg)}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 999, background: pkg.badge ? pkg.color : "transparent", border: pkg.badge ? "none" : "1px solid " + pkg.color + "55", color: pkg.badge ? "white" : pkg.color, fontWeight: 800, fontSize: ".78rem", letterSpacing: ".1em", textTransform: "uppercase", textDecoration: "none", transition: "all 0.2s" }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      Pedir este paquete
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={300}>
              <div style={{ textAlign: "center", marginTop: "2.5rem", padding: "1.5rem", background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 20 }}>
                <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,0.5)" }}>
                  ¿Necesitas algo diferente? <strong style={{ color: "white" }}>Todos los paquetes son personalizables.</strong> Contactanos y armamos exactamente lo que necesitas.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── COMO FUNCIONA ── */}
        <section style={{ padding: "5rem 1.25rem", background: "#111" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <Reveal style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".2em", textTransform: "uppercase", color: "#E53E3E", marginBottom: 8 }}>Proceso</div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.5rem,5vw,4.5rem)", lineHeight: .95 }}>
                Así de Sencillo
              </h2>
            </Reveal>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 24 }}>
              {STEPS.map((step, i) => (
                <Reveal key={step.num} delay={i * 100}>
                  <div style={{ textAlign: "center" }}>
                    {/* Step number */}
                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: ".85rem", fontWeight: 700, color: "#E53E3E" }}>{step.num}</span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ position: "absolute", top: 28, left: "calc(50% + 28px)", width: "calc(100% - 56px)", height: 1, background: "rgba(229,62,62,0.15)" }} />
                    )}
                    <div style={{ fontWeight: 800, fontSize: ".95rem", color: "white", marginBottom: 8 }}>{step.title}</div>
                    <p style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARATIVA PRECIOS ── */}
        <section style={{ padding: "5rem 1.25rem" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <Reveal style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".2em", textTransform: "uppercase", color: "#22c55e", marginBottom: 8 }}>Precios</div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.5rem,5vw,4rem)", lineHeight: .95, marginBottom: 12 }}>
                Transparencia Total
              </h2>
              <p style={{ fontSize: ".85rem", color: "rgba(255,255,255,0.4)" }}>
                Sin sorpresas. Estos son los precios por nivel de compra.
              </p>
            </Reveal>

            <Reveal>
              <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, overflow: "hidden" }}>
                {/* Table header */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "1rem 1.5rem", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: ".6rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Producto</div>
                  <div style={{ fontSize: ".6rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", textAlign: "center" }}>Normal</div>
                  <div style={{ fontSize: ".6rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "#F97316", textAlign: "center" }}>Mayoreo</div>
                  <div style={{ fontSize: ".6rem", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "#22c55e", textAlign: "center" }}>Distribuidor</div>
                </div>
                {[
                  { emoji: "🥜", name: "Cacahuates", retail: 15, may: 12, dist: 10 },
                  { emoji: "🍠", name: "Chips",      retail: 25, may: 20, dist: 17 },
                  { emoji: "🐻", name: "Gomitas",    retail: 15, may: 12, dist: 11 },
                  { emoji: "🔥", name: "Papas",      retail: 20, may: 16, dist: 15 },
                  { emoji: "🌺", name: "Aguas",      retail: 22, may: 18, dist: 17 },
                  { emoji: "🥭", name: "Chamoyadas", retail: 30, may: 25, dist: 23 },
                ].map((row, i) => (
                  <div key={row.name} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "1rem 1.5rem", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: "1.3rem" }}>{row.emoji}</span>
                      <span style={{ fontSize: ".82rem", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{row.name}</span>
                    </div>
                    <div style={{ textAlign: "center", fontFamily: "'Space Mono',monospace", fontSize: ".82rem", color: "rgba(255,255,255,0.25)", textDecoration: "line-through" }}>${row.retail}</div>
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: ".9rem", fontWeight: 700, color: "white" }}>${row.may}</span>
                      <span style={{ display: "block", fontSize: ".58rem", color: "#F97316", fontWeight: 700 }}>-{Math.round((1-row.may/row.retail)*100)}%</span>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontFamily: "'Space Mono',monospace", fontSize: ".9rem", fontWeight: 700, color: "#22c55e" }}>${row.dist}</span>
                      <span style={{ display: "block", fontSize: ".58rem", color: "#22c55e", fontWeight: 700, opacity: .7 }}>-{Math.round((1-row.dist/row.retail)*100)}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
                {[
                  { label: "Evento", min: "1 pieza", color: "#F97316", note: "precio especial" },
                  { label: "Mayoreo", min: "30 piezas", color: "#F97316", note: "pago 100% anticipo" },
                  { label: "Distribuidor", min: "100 piezas", color: "#22c55e", note: "50% anticipo" },
                ].map(tier => (
                  <div key={tier.label} style={{ background: "#111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "1rem", textAlign: "center" }}>
                    <div style={{ fontSize: ".62rem", fontWeight: 800, letterSpacing: ".15em", textTransform: "uppercase", color: tier.color, marginBottom: 6 }}>{tier.label}</div>
                    <div style={{ fontSize: ".85rem", fontWeight: 800, color: "white" }}>{tier.min}</div>
                    <div style={{ fontSize: ".62rem", color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{tier.note}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: "5rem 1.25rem", background: "#111" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <Reveal style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{ fontSize: ".68rem", fontWeight: 800, letterSpacing: ".2em", textTransform: "uppercase", color: "#E53E3E", marginBottom: 8 }}>Preguntas frecuentes</div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(2.5rem,5vw,4rem)", lineHeight: .95 }}>
                Todo lo que necesitas saber
              </h2>
            </Reveal>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FAQS.map((faq, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div style={{ background: "#181818", border: "1px solid", borderColor: openFaq === i ? "rgba(229,62,62,0.3)" : "rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden", transition: "border-color 0.3s ease" }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 1.25rem", gap: 12, textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <span style={{ fontSize: ".88rem", fontWeight: 700, color: "white", lineHeight: 1.4 }}>{faq.q}</span>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: openFaq === i ? "#E53E3E" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", transform: openFaq === i ? "rotate(45deg)" : "none" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8">
                          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </div>
                    </button>
                    <div className={"b2b-faq-body" + (openFaq === i ? " open" : "")}>
                      <div>
                        <p style={{ padding: "0 1.25rem 1.1rem", fontSize: ".8rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ padding: "6rem 1.25rem" }}>
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
            <Reveal>
              <div style={{ display: "inline-block", fontSize: "4rem", marginBottom: "1.5rem" }} className="b2b-float">🌶</div>
              <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(3rem,7vw,6rem)", lineHeight: .93, marginBottom: "1.25rem" }}>
                Listo para<br /><span style={{ color: "#E53E3E" }}>Arrancar?</span>
              </h2>
              <p style={{ fontSize: ".95rem", color: "rgba(255,255,255,0.45)", maxWidth: 420, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
                Mandanos WhatsApp ahora. En menos de 2 horas tienes tu cotizacion lista.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
                <a
                  href={wa("Hola! Vi la pagina de BOTA-NA para negocios y quiero cotizar. Me puedes ayudar?")}
                  target="_blank" rel="noopener noreferrer"
                  className="b2b-glow"
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "18px 36px", borderRadius: 999, background: "#22c55e", color: "white", fontWeight: 800, fontSize: "1rem", letterSpacing: ".06em", textTransform: "uppercase", textDecoration: "none" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  Escribir por WhatsApp
                </a>
                <Link href="/" style={{ fontSize: ".75rem", color: "rgba(255,255,255,0.25)", letterSpacing: ".1em", textTransform: "uppercase", fontWeight: 700, textDecoration: "none" }}>
                  Ver catalogo para estudiantes →
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "2.5rem 1.25rem", textAlign: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "2rem", letterSpacing: ".05em", color: "white", marginBottom: 4 }}>
            BOTA<span style={{ color: "#E53E3E" }}>-</span>NA
          </div>
          <p style={{ fontSize: ".65rem", color: "rgba(255,255,255,0.2)", letterSpacing: ".2em", textTransform: "uppercase" }}>
            Snacks Premium · Leon, Gto. · 2025
          </p>
        </footer>

      </div>
    </>
  )
}
