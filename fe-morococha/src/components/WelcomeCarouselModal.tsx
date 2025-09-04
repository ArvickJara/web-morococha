import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getModalCarrusel } from "@/services/modalCarruselService";
import type { ModalCarruselItem } from "@/services/modalCarruselService";

// URL base del backend Strapi (sin slash final)
const BASE = (import.meta.env?.VITE_STRAPI_URL ?? "http://localhost:1337").replace(/\/+$/, "");

type MediaFormat = { url: string; width: number; height: number };
type Media = {
    id: number;
    url: string;
    alternativeText?: string | null;
    formats?: Partial<Record<"thumbnail" | "small" | "medium" | "large", MediaFormat>>;
};

function resolveUrl(img: Media): string {
    const f = img.formats || {};
    const best = f.large?.url || f.medium?.url || f.small?.url || f.thumbnail?.url || img.url;
    return best.startsWith("http") ? best : `${BASE}${best}`;
}

const AUTOPLAY_MS = 10000; // 10000 para autoplay cada 10s; 0 desactiva

// Ajusta un rectángulo (imagen) a un contenedor máx. sin deformar
function fitRect(w: number, h: number, maxW: number, maxH: number) {
    if (!w || !h) return { w: Math.min(640, maxW), h: Math.min(360, maxH) };
    const scale = Math.min(maxW / w, maxH / h, 1);
    return { w: Math.round(w * scale), h: Math.round(h * scale) };
}

const WelcomeCarouselModal = () => {
    const [open, setOpen] = useState(true);
    const [items, setItems] = useState<ModalCarruselItem[]>([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // viewport responsivo
    const [vw, setVw] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
    const [vh, setVh] = useState<number>(typeof window !== "undefined" ? window.innerHeight : 800);

    useEffect(() => {
        const onResize = () => {
            setVw(window.innerWidth);
            setVh(window.innerHeight);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // dims naturales de la imagen activa
    const [imgDims, setImgDims] = useState<{ w: number; h: number } | null>(null);

    // Cargar data
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const data = await getModalCarrusel();
                if (mounted) setItems(Array.isArray(data) ? data : []);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : "No se pudo cargar el carrusel.";
                if (mounted) setErr(message);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    // Aplanar: cada imagen de cada item es un slide
    const slides = useMemo(() => {
        const out: Array<{ key: string; title: string; media: Media }> = [];
        for (const it of items) {
            const imgs = (it.imagen || []) as Media[];
            for (const img of imgs) {
                out.push({ key: `${it.id}-${img.id}`, title: it.nombre ?? "", media: img });
            }
        }
        return out;
    }, [items]);

    // Si cambia el tamaño de slides, asegura que current esté dentro de rango
    useEffect(() => {
        if (slides.length === 0) return;
        setCurrent((c) => (c >= slides.length ? 0 : c));
    }, [slides.length]);

    // Autoplay opcional
    useEffect(() => {
        if (!AUTOPLAY_MS || slides.length <= 1) return;
        const id = setInterval(() => {
            setCurrent((c) => (c + 1) % slides.length);
        }, AUTOPLAY_MS);
        return () => clearInterval(id);
    }, [slides.length]);

    // Teclado: ESC cierra, ← → navegan
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
            if (slides.length > 1) {
                if (e.key === "ArrowLeft") setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
                if (e.key === "ArrowRight") setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, slides.length]);

    // Cerrar al clickear fuera (overlay) - CORREGIDO
    const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        // Solo cerrar si se hace clic exactamente en el overlay, no en sus hijos
        if (e.target === e.currentTarget) {
            setOpen(false);
        }
    }, []);

    // Función para cerrar modal
    const closeModal = useCallback(() => {
        setOpen(false);
    }, []);

    const prev = useCallback(
        () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1)),
        [slides.length]
    );
    const next = useCallback(
        () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1)),
        [slides.length]
    );

    // Límites máximos responsivos del "marco" donde cabe la imagen
    const isMobile = vw < 640;
    const isTablet = vw >= 640 && vw < 1024;

    const maxW = isMobile
        ? vw * 0.95  // Móvil: 95% del ancho
        : isTablet
            ? vw * 0.85  // Tablet: 85% del ancho
            : Math.min(vw * 0.75, 1200); // Desktop: 75% del ancho, máx. 1200px

    const maxH = isMobile
        ? vh * 0.75   // Móvil: 75% de alto (más espacio para UI)
        : vh * 0.85;  // Tablet/Desktop: 85% de alto

    const box = fitRect(imgDims?.w ?? 0, imgDims?.h ?? 0, maxW, maxH);

    // Si no está abierto, no renderizar nada
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            aria-modal="true"
            role="dialog"
            onClick={handleOverlayClick}
        >

            {/* Botón cerrar - MEJORADO */}


            {/* Contenido principal */}
            <div className="p-4 sm:p-6 md:p-8">


                {/* Estados de carga y error */}
                {loading && (
                    <div
                        className="flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-xl"
                        style={{ height: Math.min(maxH * 0.8, isMobile ? 300 : 400) }}
                    >
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-sm sm:text-base">Cargando imágenes...</p>
                    </div>
                )}

                {err && !loading && (
                    <div
                        className="flex flex-col items-center justify-center text-destructive bg-destructive/10 rounded-xl p-4"
                        style={{ height: Math.min(maxH * 0.8, isMobile ? 300 : 400) }}
                    >
                        <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
                            <X className="h-6 w-6" />
                        </div>
                        <p className="text-sm sm:text-base text-center">{err}</p>
                    </div>
                )}

                {!loading && !err && slides.length === 0 && (
                    <div
                        className="flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-xl p-4"
                        style={{ height: Math.min(maxH * 0.8, isMobile ? 300 : 400) }}
                    >
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                            <ChevronLeft className="h-6 w-6" />
                        </div>
                        <p className="text-sm sm:text-base text-center">No hay imágenes para mostrar.</p>
                    </div>
                )}

                {/* Carrusel principal */}
                {!loading && !err && slides.length > 0 && (
                    <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                        {/* Contenedor de imagen responsivo */}
                        <div
                            className="relative bg-muted/10 rounded-xl overflow-hidden group"
                            style={{
                                width: box.w || "100%",
                                height: box.h || Math.min(maxH * 0.7, isMobile ? 280 : 400),
                                minHeight: isMobile ? 250 : 320,
                                maxWidth: "100%"
                            }}
                        >
                            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                                <button
                                    className="bg-white/95 dark:bg-black/95 rounded-full p-2 sm:p-3 
                                  shadow-xl hover:bg-white dark:hover:bg-black 
                                  transition-all duration-200 hover:scale-110 
                                  border border-gray-200 dark:border-gray-700"
                                    onClick={closeModal}
                                    aria-label="Cerrar modal"
                                    type="button"
                                >
                                    <X className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-gray-700 dark:text-gray-200`} />
                                </button>
                            </div>
                            <img
                                key={slides[current].key}
                                src={resolveUrl(slides[current].media)}
                                alt={slides[current].media.alternativeText || slides[current].title || "Slide"}
                                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                                loading="lazy"
                                decoding="async"
                                onLoad={(e) => {
                                    const el = e.currentTarget;
                                    if (el.naturalWidth && el.naturalHeight) {
                                        setImgDims({ w: el.naturalWidth, h: el.naturalHeight });
                                    }
                                }}
                            />

                            {/* Botones de navegación - MEJORADOS */}
                            {slides.length > 1 && (
                                <>
                                    <button
                                        className={`absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 
                                                      bg-white/95 dark:bg-black/95 rounded-full shadow-xl 
                                                      hover:bg-white dark:hover:bg-black transition-all duration-200 
                                                      hover:scale-110 border border-gray-200 dark:border-gray-700
                                                      ${isMobile ? 'p-2' : 'p-3'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            prev();
                                        }}
                                        aria-label="Imagen anterior"
                                        type="button"
                                    >
                                        <ChevronLeft className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-gray-700 dark:text-gray-200`} />
                                    </button>
                                    <button
                                        className={`absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 
                                                      bg-white/95 dark:bg-black/95 rounded-full shadow-xl 
                                                      hover:bg-white dark:hover:bg-black transition-all duration-200 
                                                      hover:scale-110 border border-gray-200 dark:border-gray-700
                                                      ${isMobile ? 'p-2' : 'p-3'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            next();
                                        }}
                                        aria-label="Imagen siguiente"
                                        type="button"
                                    >
                                        <ChevronRight className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-gray-700 dark:text-gray-200`} />
                                    </button>
                                </>
                            )}

                            {/* Contador de imágenes - MEJORADO */}
                            {slides.length > 1 && (
                                <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs sm:text-sm px-3 py-1.5 rounded-full font-medium">
                                    {current + 1} / {slides.length}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default WelcomeCarouselModal;