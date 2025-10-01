import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getNoticiaById, getNoticiaByDocumentId, imageUrl, type Noticia, FALLBACK_IMAGE } from "@/services/noticasService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function NewsDetail() {
    const { id } = useParams<{ id: string }>();
    const [noticia, setNoticia] = useState<Noticia | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Estado del carrusel
    const [slide, setSlide] = useState(0);

    useEffect(() => {
        let alive = true;
        (async () => {
            setError(null);
            const param = id ?? "";
            if (!param) return setError("Id inválido.");

            try {
                // Si es un número puro -> busca por id; si no, busca por documentId
                let n: Noticia | null = null;
                if (/^\d+$/.test(param)) {
                    n = await getNoticiaById(Number(param));
                } else {
                    n = await getNoticiaByDocumentId(param);
                }

                if (!alive) return;
                if (!n) setError("Noticia no encontrada o no publicada.");
                setNoticia(n);
                setSlide(0);
            } catch {
                if (!alive) return;
                setError("No se pudo cargar la noticia.");
            }
        })();
        return () => {
            alive = false;
        };
    }, [id]);

    // Asegura que el índice esté dentro del rango si cambia la cantidad de imágenes
    useEffect(() => {
        if (!noticia) return;
        const total = noticia.imagenes?.length ?? 0;
        if (total === 0) {
            setSlide(0);
        } else if (slide >= total) {
            setSlide(0);
        }
    }, [noticia, slide]);

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
                <div className="container mx-auto px-4 py-16 max-w-md text-center">
                    <div className="bg-card rounded-2xl p-8 shadow-xl border">
                        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ArrowLeft className="h-8 w-8 text-destructive" />
                        </div>
                        <h2 className="text-xl font-bold text-black mb-3">Oops! Algo salió mal</h2>
                        <p className="text-destructive font-medium mb-6">{error}</p>
                        <Link to="/#noticias">
                            <Button variant="default" className="w-full shadow-lg hover:shadow-xl transition-all duration-300">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver a noticias
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!noticia) {
        return (
            <div className="min-h-[80vh] bg-gradient-to-br from-background via-muted/20 to-background">
                <div className="container mx-auto px-4 py-16 max-w-4xl">
                    <div className="animate-pulse space-y-8">
                        {/* Header skeleton */}
                        <div className="flex items-center justify-between">
                            <div className="h-10 w-24 bg-muted rounded-lg" />
                        </div>

                        {/* Hero image skeleton */}
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                            <div className="aspect-[16/9] w-full bg-gradient-to-br from-muted via-muted/70 to-muted/40" />
                            <div className="absolute inset-x-0 bottom-0 p-6">
                                <div className="space-y-3">
                                    <div className="h-6 w-20 bg-muted rounded-full" />
                                    <div className="h-8 w-3/4 bg-muted rounded-lg" />
                                    <div className="h-4 w-1/3 bg-muted rounded" />
                                </div>
                            </div>
                        </div>

                        {/* Content skeleton */}
                        <div className="space-y-4">
                            <div className="h-6 w-full bg-muted rounded" />
                            <div className="h-6 w-4/5 bg-muted rounded" />
                            <div className="h-6 w-3/5 bg-muted rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const fechaStr = noticia.fecha
        ? new Date(noticia.fecha).toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
        : "";

    const imgs = noticia.imagenes ?? [];
    const total = imgs.length;
    const current = total > 0 ? imageUrl(imgs[slide]) : FALLBACK_IMAGE;

    const prev = () => setSlide((s) => (total ? (s - 1 + total) % total : 0));
    const next = () => setSlide((s) => (total ? (s + 1) % total : 0));

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
            <Header />
            <article className="container mx-auto mt-20 px-4 py-8 max-w-5xl">
                {/* Barra superior */}
                <div className="mb-8 flex items-center justify-between backdrop-blur-sm">
                    <Link to="/#noticias">
                        <Button
                            variant="ghost"
                            size="lg"
                            className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full px-6"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Volver a noticias
                        </Button>
                    </Link>
                </div>

                {/* Hero con carrusel de imágenes */}
                <section className="relative overflow-hidden rounded-3xl shadow-2xl border border-border/50 mb-12">
                    <div className="aspect-[16/9] w-full bg-gradient-to-br from-muted via-muted/80 to-muted/60 relative">
                        <img
                            src={current}
                            alt={noticia.titulo_noticia}
                            className="h-full w-full object-cover transition-transform duration-700"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                                e.currentTarget.src = FALLBACK_IMAGE;
                            }}
                        />

                        {/* Controles del carrusel */}
                        {total > 1 && (
                            <>
                                <button
                                    aria-label="Anterior"
                                    onClick={prev}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full border border-white/20"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    aria-label="Siguiente"
                                    onClick={next}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full border border-white/20"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>

                                {/* Indicadores */}
                                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                                    {imgs.map((_, i) => (
                                        <button
                                            key={i}
                                            aria-label={`Ir a imagen ${i + 1}`}
                                            onClick={() => setSlide(i)}
                                            className={`h-2.5 w-2.5 rounded-full border border-white/30 ${i === slide ? "bg-white" : "bg-white/40"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Overlay inferior con info */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                            <div className="max-w-4xl">

                                <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold leading-snug tracking-tight mb-4">
                                    {noticia.titulo_noticia}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-sm text-white/90">
                                    {fechaStr && (
                                        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                            <Calendar className="h-4 w-4" />
                                            <span className="font-medium">{fechaStr}</span>
                                        </span>
                                    )}
                                    {typeof noticia.tiempo_lectura_min === "number" && (
                                        <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                                            <Clock className="h-4 w-4" />
                                            <span className="font-medium">{noticia.tiempo_lectura_min} min de lectura</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Cuerpo */}
                <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-border/50 shadow-xl">
                    <div
                        style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
                        dangerouslySetInnerHTML={{ __html: noticia.cuerpo_noticia ?? "" }}
                    />
                </div>
            </article>
            <Footer />
        </div>
    );
}