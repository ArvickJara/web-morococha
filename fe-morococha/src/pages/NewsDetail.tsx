import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getNoticiaById, imageUrl, type Noticia } from "@/services/noticasService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export default function NewsDetail() {
    const { id } = useParams<{ id: string }>();
    const [noticia, setNoticia] = useState<Noticia | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            setError(null);
            if (!id) return setError("Id inválido.");

            const numId = Number(id);
            if (Number.isNaN(numId)) return setError("El id debe ser numérico.");

            try {
                const n = await getNoticiaById(numId);
                if (!alive) return;
                if (!n) setError("Noticia no encontrada o no publicada.");
                setNoticia(n);
            } catch {
                if (!alive) return;
                setError("No se pudo cargar la noticia.");
            }
        })();
        return () => {
            alive = false;
        };
    }, [id]);

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-background to-muted/30">
                <div className="container mx-auto px-4 py-16 max-w-md text-center">
                    <div className="bg-card rounded-2xl p-8 shadow-xl border">
                        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ArrowLeft className="h-8 w-8 text-destructive" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-3">Oops! Algo salió mal</h2>
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

    const img = noticia.imagen_noticia?.[0];
    const cover = img ? imageUrl(img) : undefined;

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
            <article className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Barra superior mejorada */}
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

                {/* Hero mejorado con imagen 16:9 + overlay */}
                <section className="relative overflow-hidden rounded-3xl shadow-2xl border border-border/50 mb-12">
                    <div className="aspect-[16/9] w-full bg-gradient-to-br from-muted via-muted/80 to-muted/60">
                        {cover && (
                            <img
                                src={cover}
                                alt={noticia.titulo_noticia}
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                loading="lazy"
                                decoding="async"
                            />
                        )}
                    </div>

                    {/* Overlay inferior con gradiente mejorado */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                            <div className="max-w-4xl">
                                <div className="flex items-center gap-3 mb-4">
                                    {noticia.categoria && (
                                        <Badge className="pointer-events-auto bg-primary/90 text-primary-foreground px-4 py-1.5 text-sm font-semibold backdrop-blur-sm border border-white/20">
                                            {noticia.categoria}
                                        </Badge>
                                    )}
                                </div>
                                <h1 className="text-white text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 drop-shadow-2xl">
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

                {/* Lead / resumen mejorado */}
                {noticia.breve_descripcion && (
                    <div className="mb-12">
                        <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg">
                            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light italic break-words overflow-hidden"
                                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                "{noticia.breve_descripcion}"
                            </p>
                        </div>
                    </div>
                )}

                {/* Cuerpo mejorado */}
                <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-border/50 shadow-xl">
                    {noticia.cuerpo_noticia ? (
                        <div
                            className="prose prose-xl prose-neutral dark:prose-invert max-w-none 
             prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight
             prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg
             prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-border/50
             prose-a:text-primary prose-a:font-semibold hover:prose-a:text-primary/80 prose-a:no-underline hover:prose-a:underline
             prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:rounded-r-lg prose-blockquote:p-4
             prose-code:bg-muted prose-code:rounded prose-code:px-2 prose-code:py-1
             prose-pre:bg-muted prose-pre:rounded-xl prose-pre:border prose-pre:border-border
             prose-li:text-muted-foreground prose-li:text-lg
             prose-strong:text-foreground prose-strong:font-bold
             overflow-hidden break-words word-wrap"
                            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                            dangerouslySetInnerHTML={{ __html: noticia.cuerpo_noticia }}
                        />

                    ) : (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground text-lg">No hay contenido disponible.</p>
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}