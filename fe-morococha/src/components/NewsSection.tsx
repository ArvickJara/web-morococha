// src/sections/NewsSection.tsx
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getNoticias, imageUrl, type Noticia } from "@/services/noticasService";

const PAGE_SIZE = 4; // 1 destacada + 3 secundarias

const NewsSection = () => {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState<Noticia[]>([]);
    const [pageCount, setPageCount] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const { items, meta } = await getNoticias(page, PAGE_SIZE);
                if (!mounted) return;
                setItems(items);
                setPageCount(meta.pageCount || 1);
            } finally {
                setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [page]);

    const featured = items[0];
    const secondary = useMemo(() => items.slice(1), [items]);

    if (loading) {
        return (
            <section id="noticias" className="py-20">
                <div className="container mx-auto px-4 text-center text-muted-foreground">Cargando noticias…</div>
            </section>
        );
    }

    if (!featured) return null;

    return (
        <section id="noticias" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Encabezado */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Noticias y Eventos</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Mantente informado sobre las últimas novedades, proyectos y eventos de nuestra comunidad.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Destacada (izquierda) */}
                    <div className="lg:col-span-2">
                        <Card className="h-full group hover:shadow-hover transition-all duration-300 border-0 bg-gradient-card">
                            <div className="relative">
                                <div className="w-full rounded-t-lg overflow-hidden">
                                    <img
                                        src={imageUrl(featured.imagen_noticia?.[0])}
                                        alt={featured.titulo_noticia}
                                        className="w-full h-[380px] md:h-[460px] object-cover"
                                    />
                                </div>
                                {featured.categoria && (
                                    <Badge className="absolute top-4 left-4 bg-secondary">{featured.categoria}</Badge>
                                )}
                            </div>

                            <CardHeader>
                                <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                                    {featured.titulo_noticia}
                                </CardTitle>
                                {featured.breve_descripcion && (
                                    <CardDescription className="text-base">{featured.breve_descripcion}</CardDescription>
                                )}
                            </CardHeader>

                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        {featured.fecha && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {new Date(featured.fecha).toLocaleDateString("es-PE", {
                                                    day: "2-digit", month: "long", year: "numeric",
                                                })}
                                            </div>
                                        )}
                                        {typeof featured.tiempo_lectura_min === "number" && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {featured.tiempo_lectura_min} min de lectura
                                            </div>
                                        )}
                                    </div>

                                    <Link to={`/noticias/${featured.id}`}>
                                        <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                                            Leer más
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Secundarias (derecha) */}
                    <div className="space-y-6">
                        {secondary.map((n) => (
                            <Card key={n.id} className="group hover:shadow-card transition-all duration-300 border-0 bg-gradient-card">
                                <Link to={`/noticias/${n.id}`} className="w-full text-left block">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between mb-2">
                                            {n.categoria && <Badge variant="outline">{n.categoria}</Badge>}
                                        </div>
                                        <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                                            {n.titulo_noticia}
                                        </CardTitle>
                                        {n.breve_descripcion && (
                                            <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                                                {n.breve_descripcion}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                {n.fecha && (
                                                    <>
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(n.fecha).toLocaleDateString("es-PE", {
                                                            day: "2-digit", month: "long", year: "numeric",
                                                        })}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}

                        {/* Controles de paginación */}
                        {pageCount > 1 && (
                            <div className="flex items-center justify-between pt-2">
                                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                                    Anterior
                                </Button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`h-8 w-8 rounded-md text-sm border transition-colors ${p === page ? "bg-primary text-primary-foreground border-primary" : "hover:bg-accent"
                                                }`}
                                            aria-label={`Ir a página ${p}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>
                                    Siguiente
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
