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

const AUTOPLAY_MS = 4000; // 5000 para autoplay cada 5s; 0 desactiva

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

    // viewport
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
                const data = await getModalCarrusel(); // trae imagen[] poblado
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

    // Cerrar al clickear fuera (overlay)
    const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) setOpen(false);
    };

    const prev = useCallback(
        () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1)),
        [slides.length]
    );
    const next = useCallback(
        () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1)),
        [slides.length]
    );

    // límites máximos del “marco” donde cabe la imagen (dejamos aire para título/dots)
    const maxW = Math.min(vw * 0.92, 1024);   // coincide con tu w-[92%] y max-w-2xl aprox
    const maxH = Math.min(vh * 0.85, 800);    // 85% de alto de viewport

    const box = fitRect(imgDims?.w ?? 0, imgDims?.h ?? 0, maxW, maxH);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 "
            aria-modal="true"

            onClick={onOverlayClick}
        >
            <div
                ref={modalRef}
                className="relative  rounded-xl shadow-xl w-[92%] max-w-2xl p-4 sm:p-6"
                // El modal ajusta el ancho al de la imagen calculada
                style={{ width: box.w ? Math.min(box.w + 32, maxW) : undefined }} // +32 por paddings
            >


                {/* Estados */}
                {loading && (
                    <div className="flex items-center justify-center text-gray-500" style={{ height: Math.min(maxH, 360) }}>
                        Cargando…
                    </div>
                )}
                {err && !loading && (
                    <div className="flex items-center justify-center text-red-600" style={{ height: Math.min(maxH, 360) }}>
                        {err}
                    </div>
                )}
                {!loading && !err && slides.length === 0 && (
                    <div className="flex items-center justify-center text-gray-500" style={{ height: Math.min(maxH, 360) }}>
                        No hay imágenes para mostrar.
                    </div>
                )}

                {!loading && !err && slides.length > 0 && (
                    <div className="flex flex-col items-center">
                        {/* Contenedor que se adapta a la imagen */}
                        <div
                            className="relative flex items-center justify-center"
                            style={{
                                width: box.w || "100%",
                                height: box.h || Math.min(maxH, 360),
                            }}
                        >

                            <button
                                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                                onClick={() => setOpen(false)}
                                aria-label="Cerrar"
                            >
                                <X className="h-6 w-6" />
                            </button>

                            <img
                                key={slides[current].key}
                                src={resolveUrl(slides[current].media)}
                                alt={slides[current].media.alternativeText || slides[current].title || "Slide"}
                                className="rounded-lg object-contain"
                                style={{ width: "100%", height: "100%" }}
                                loading="lazy"
                                decoding="async"
                                onLoad={(e) => {
                                    const el = e.currentTarget;
                                    // guardamos tamaño natural para adaptar el modal
                                    if (el.naturalWidth && el.naturalHeight) {
                                        setImgDims({ w: el.naturalWidth, h: el.naturalHeight });
                                    }
                                }}
                            />

                            {slides.length > 1 && (
                                <>
                                    <button
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
                                        onClick={prev}
                                        aria-label="Anterior"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
                                        onClick={next}
                                        aria-label="Siguiente"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Dots */}
                        {slides.length > 1 && (
                            <div className="flex gap-2 mt-4">
                                {slides.map((s, i) => (
                                    <button
                                        key={s.key}
                                        className={`w-3 h-3 rounded-full ${i === current ? "bg-primary" : "bg-gray-300"}`}
                                        onClick={() => setCurrent(i)}
                                        aria-label={`Ir al slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}


                    </div>
                )}
            </div>
        </div>
    );
};

export default WelcomeCarouselModal;
