# 🌶 BOTA-NA — Sitio Web v2.0

Rediseño completo del sitio web de **BOTA-NA**, la marca de snacks artesanales de La Salle Bajío.

## ✨ Características

- **Catálogo dinámico** conectado a Google Sheets (disponibilidad en tiempo real)
- **Carrito + Pedidos por WhatsApp** — selección de productos y envío directo al número
- **BOTA-Card** — sistema de fidelidad con puntos via Supabase + Google Apps Script
- **Sección de Mayoreo** — captación de distribuidores y eventos
- **Diseño responsive** — optimizado para móvil (estudiantes)
- **Swipe táctil** — cambio de categorías con deslizamiento en celular

## 🚀 Setup Rápido

### 1. Clonar y configurar

```bash
git clone https://github.com/tu-usuario/bota-na.git
cd bota-na
npm install
```

### 2. Variables de entorno

Crea un archivo `.env.local` copiando `.env.example`:

```bash
cp .env.example .env.local
```

Llena tus credenciales de Supabase (las mismas de la versión anterior):

```
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

### 3. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📦 Deploy en Vercel

1. Sube el código a GitHub
2. Importa el repositorio en [vercel.com](https://vercel.com)
3. En **Settings > Environment Variables**, agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automático ✅

## 📊 Catálogo (Google Sheets)

El catálogo se conecta al mismo CSV público de Google Sheets que la versión anterior. La URL está en `app/page.tsx`:

```
SHEETS_CSV = "https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
```

**Formato del Sheet:**
| Columna A | Columna B | Columna C |
|-----------|-----------|-----------|
| id        | nombre    | SI/NO     |

- `SI` = producto disponible (se muestra)
- `NO` = agotado (aparece con badge "Agotado")

## 🎴 BOTA-Card (Fidelidad)

Funciona exactamente igual que antes:
- Base de datos: Supabase tabla `clientes_leales`
- Códigos: Google Apps Script (misma URL)
- Flujo: Login con Instagram → Seguir cuenta → Canjear códigos → 10 puntos = Premio

## 🏗 Estructura

```
bota-na/
├── app/
│   ├── page.tsx          # Página principal + lista de productos
│   ├── layout.tsx        # Layout y metadata SEO
│   └── globals.css       # Estilos globales + fuentes
├── components/
│   ├── marquee.tsx       # Banda animada superior
│   ├── navbar.tsx        # Barra de navegación
│   ├── hero.tsx          # Sección hero
│   ├── category-tabs.tsx # Tabs de categorías
│   ├── product-grid.tsx  # Grid + tarjetas de productos
│   ├── product-modal.tsx # Modal de detalle + agregar al carrito
│   ├── cart-context.tsx  # Estado global del carrito
│   ├── cart-modal.tsx    # Carrito + botón WhatsApp
│   ├── loyalty-modal.tsx # BOTA-Card completa
│   ├── wholesale-modal.tsx # Modal de mayoreo
│   └── ui-components.tsx # Toast, LoyaltyPromo, WholesaleSection, Footer
├── lib/
│   └── supabase.ts       # Cliente Supabase
├── public/images/        # Imágenes de productos (copiar de repo anterior)
└── ...config files
```

## 🖼 Imágenes

Copia la carpeta `public/images/` del repositorio anterior. Las imágenes tienen nombres del 2 al 70 (`.webp`) más `logo-botana.png`.

## 📞 Contacto

WhatsApp: +52 477 495 0232  
Instagram: [@bota.na.mx](https://instagram.com/bota.na.mx)

---

*Desarrollado con Next.js 15, Tailwind CSS, Supabase y ❤️*
