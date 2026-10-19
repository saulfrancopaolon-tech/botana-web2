  "use client";
  import { useEffect, useRef } from "react";
  import type { Product } from "@/lib/products";
  import { Icon } from "./icons";
  import { ProductGallery } from "./product-gallery";

  export interface HeroProps {
    products: Product[];
    onMenuClick: () => void;
    onPickProduct: (product: Product) => void;
  }

  export function Hero({ products, onMenuClick, onPickProduct }: HeroProps) {
    const textRef = useRef<HTMLDivElement>(null);
    const galRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleScroll = () => {
        if (!textRef.current || !galRef.current) return;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        // Parallax suave para texto
        if (textRef.current) {
          const textSpeed = 0.3;
          const textY = scrollY * textSpeed;
          textRef.current.style.transform = `translate3d(0, ${textY}px, 0)`;
          textRef.current.style.opacity = `${Math.max(0, 1 - scrollY / (windowHeight * 1.5))}`;
        }

        // Efecto de escala sutil para galería
        if (galRef.current) {
          const galSpeed = 0.15;
          const galScale = 1 + scrollY * galSpeed * 0.001;
          galRef.current.style.transform = `scale(${galScale})`;
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
      <section className="relative overflow-hidden px-4 pb-12 pt-10 sm:pt-16 sm:pb-20">
        {/* Aurora mejorada */}
        <div className="aurora" aria-hidden="true">
          <div className="aurora-layer" style={{
            background: "linear-gradient(135deg, rgba(48, 209, 88, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(168, 85, 237, 0.1) 100%)",
            animation: "auroraMove 120s ease infinite"
          }}></div>
          <div className="aurora-layer" style={{
            background: "linear-gradient(135deg, rgba(255, 59, 48, 0.1) 0%, rgba(255, 149, 0, 0.1) 50%, rgba(255, 204, 0, 0.1) 100%)",
            animation: "auroraMove 100s ease infinite reverse"
          }}></div>
          <div className="aurora-layer" style={{
            background: "linear-gradient(135deg, rgba(52, 199, 89, 0.08) 0%, rgba(0, 122, 255, 0.08) 50%, rgba(175, 82, 222, 0.08) 100%)",
            animation: "auroraMove 80s ease infinite"
          }}></div>
        </div>

        <div className="relative z-10 mx-auto grid max-w-[500px] w-full items-center gap-8 sm:gap-12 lg:max-w-[600px]">
          {/* Contenido textual */}
          <div ref={textRef} className="text-center items-center space-y-4 sm:text-left sm:space-y-6">
            {/* Badge de novedad */}
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide">
              <span className="h-2 w-2 rounded-full bg-[#30D158]" />
              <span className="text-[var(--ios-label)] dark:text-[var(--ios-label-dark)]">Nuevo · Takis, Barcel, Vualá y Coca-Cola</span>
            </div>

            {/* Título principal */}
            <h1 className="text-[clamp(2.2rem,6vw,3.5rem)] font-bold tracking-tight leading-tight bg-gradient-to-r from-[#FF3B30] via-[#FF9500] to-[#FFCC00] bg-clip-text
  text-transparent">
              Snacks que<br /><span className="block">rompen.</span>
            </h1>

            {/* Descripción */}
            <p className="text-[clamp(0.95rem,4vw,1.1rem)] text-[var(--ios-secondary-label)] dark:text-[var(--ios-secondary-label-dark)] leading-relaxed max-w-md">
              Tus botanas favoritas, a un toque. Pide por WhatsApp y recógelas en La Salle Bajío.
            </p>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={onMenuClick}
                className="btn-ios btn-ios-primary flex-1 py-3 text-sm font-medium rounded-lg tap-feedback hover:bg-[#007aff/e6] transition-colors"
              >
                Ver el menú <Icon d={I.arrowDown} s={16} className="ml-1.5" />
              </button>
              <a
                href="/b2b"
                className="btn-ios btn-ios-outline flex-1 py-3 text-sm font-medium rounded-lg tap-feedback hover:bg-[var(--ios-label)/0.05]
  dark:hover:bg-[var(--ios-label-dark)/0.05] transition-colors"
              >
                Compra por mayoreo
              </a>
            </div>
          </div>

          {/* Galería de productos mejorada */}
          <div ref={galRef} className="relative">
            <ProductGallery
              products={products}
              onPick={onPickProduct}
              className="aspect-[3/4] w-full rounded-lg overflow-hidden shadow-lg"
            />

            {/* Efecto de brillo sutil */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
              pointerEvents: "none"
            }} />
          </div>
        </div>
      </section>
    );
  }

  /* Animaciones CSS adicionales */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes auroraMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .aurora-layer {
      position: absolute;
      inset: 0;
      opacity: 0.6;
      filter: blur(80px);
      animation-delay: calc(var(--delay, 0s) * -1);
    }

    .aurora {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);
