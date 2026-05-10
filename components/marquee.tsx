"use client"
export function Marquee() {
  const items = ["BOTA-NA","SNACKS PREMIUM","LEÓN. GTO","CACAHUATES","CHIPS VEGETALES","GOMITAS","PAPAS","BEBIDAS","MAYOREO"]
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden whitespace-nowrap bg-[#E53E3E] py-2 border-y border-white/10" aria-hidden="true">
      <div className="inline-flex animate-marquee">
        {doubled.map((item, i) => (
          <span key={i} className="font-head text-[.9rem] tracking-[.15em] text-white px-8 opacity-95">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
