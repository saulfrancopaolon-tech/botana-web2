"use client"
import { X, Truck, TrendingUp } from "lucide-react"

export function WholesaleModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Fondo oscuro con desenfoque */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[2rem] p-6 sm:p-8 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-2 mt-4 sm:mt-0">Oportunidades de Negocio</h2>
        <p className="text-zinc-400 text-sm mb-8 font-medium">Lleva el sabor de BOTA-NA a otro nivel.</p>

        <div className="space-y-6 sm:space-y-8">

          {/* SECCIÓN MAYOREO */}
          <div className="bg-white/5 rounded-2xl p-5 sm:p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="text-orange-500 h-6 w-6" />
              <h3 className="font-black text-white uppercase tracking-widest text-base sm:text-lg">Venta de Mayoreo</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              Ideal para fiestas, eventos o mesas de snacks. Para conocer nuestros precios de mayoreo y cotizar tu pedido, ponte en contacto con nosotros.
            </p>

            <a
              href="https://wa.me/524774950232?text=Hola!%20Me%20interesa%20pedir%20información%20sobre%20MAYOREO%20para%20un%20evento%20con%20BOTA-NA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center w-full py-3.5 sm:py-4 bg-zinc-800 border border-white/10 text-white text-[11px] sm:text-xs font-black uppercase rounded-xl hover:bg-zinc-700 transition-colors shadow-lg active:scale-95"
            >
              Contactar con Saúl
            </a>
          </div>

          {/* SECCIÓN DISTRIBUIDOR */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-2xl p-5 sm:p-6 border border-orange-500/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-red-500 h-6 w-6" />
              <h3 className="font-black text-white uppercase tracking-widest text-base sm:text-lg">Sé Distribuidor</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Únete a la familia BOTA-NA. Obtén precios especiales de socio para iniciar tu propio negocio. Contáctanos para recibir el catálogo de distribuidores.
            </p>

            <a
              href="https://wa.me/524774950232?text=Hola!%20Me%20interesa%20ser%20DISTRIBUIDOR%20de%20BOTA-NA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center w-full py-3.5 sm:py-4 bg-white text-black text-[11px] sm:text-xs font-black uppercase rounded-xl hover:scale-105 transition-transform shadow-lg active:scale-95"
            >
              Contactar con Saúl
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
