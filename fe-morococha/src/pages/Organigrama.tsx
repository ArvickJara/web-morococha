import { useEffect, useState } from "react";
import {
    getOrganigramaActual,
    mediaUrl,
    type OrganigramaItem,
} from "@/services/organigramaService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Network, Calendar, FileImage } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function OrganigramaPage() {
    const [item, setItem] = useState<OrganigramaItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setErr(null);
                setLoading(true);
                const data = await getOrganigramaActual();
                if (!alive) return;
                if (!data) setErr("No se encontró el organigrama publicado.");
                setItem(data);
            } catch {
                if (!alive) return;
                setErr("No se pudo cargar el organigrama.");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    // Estado de Carga Mejorado
    if (loading) {
        return (
            <div className="min-h-[80vh] bg-gradient-to-br from-background via-muted/20 to-background">
                <div className="container mx-auto px-4 py-16 max-w-6xl">
                    <div className="animate-pulse space-y-8">
                        {/* Header skeleton */}
                        <div className="flex items-center justify-between">
                            <div className="h-10 w-24 bg-muted rounded-lg" />
                        </div>

                        {/* Title skeleton */}
                        <div className="text-center space-y-4">
                            <div className="h-12 w-64 bg-muted rounded-lg mx-auto" />
                            <div className="h-6 w-80 bg-muted rounded mx-auto" />
                        </div>

                        {/* Content skeleton */}
                        <div className="bg-card rounded-3xl p-8 border shadow-sm">
                            <div className="aspect-[4/3] w-full bg-gradient-to-br from-muted via-muted/70 to-muted/40 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Estado de Error Mejorado
    if (err) {
        return (
            <div className="min-h-[60vh] bg-gradient-to-br from-background to-muted/30">
                <div className="container mx-auto px-4 py-16 max-w-md">
                    <div className="bg-card rounded-2xl p-8 shadow-xl border text-center">
                        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Network className="h-8 w-8 text-destructive" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-3">Error al cargar organigrama</h2>
                        <p className="text-destructive font-medium mb-6">{err}</p>
                        <Link to="/">
                            <Button variant="default" className="w-full shadow-lg hover:shadow-xl transition-all duration-300">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver al inicio
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const img = item?.organigrama ?? null;
    const src = mediaUrl(img);
    const srcFull = mediaUrl({
        ...(img as any),
        formats: undefined,
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
            <Header />
            <section className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Barra superior mejorada */}
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/">
                        <Button
                            variant="ghost"
                            size="lg"
                            className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full px-6"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Volver al inicio
                        </Button>
                    </Link>
                </div>

                {/* Header rediseñado */}
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-2 mb-6">
                        <Network className="h-5 w-5 text-primary" />
                        <span className="text-primary font-semibold">Estructura Organizacional</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                        Organigrama
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Conoce la estructura organizacional de la Municipalidad de Morococha
                    </p>
                </header>

                {/* Información y acciones */}
                <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {item?.publishedAt && (
                            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-muted-foreground">
                                    Actualizado el{" "}
                                    {new Date(item.publishedAt).toLocaleDateString("es-PE", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        )}
                        <Badge variant="secondary" className="text-xs">
                            Documento oficial
                        </Badge>
                    </div>


                </div>

                {/* Contenedor principal mejorado */}
                <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl rounded-3xl overflow-hidden">
                    <CardContent className="p-0">
                        <div className="relative">
                            {src ? (
                                <div className="group relative">
                                    {/* Overlay sutil */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                    {/* Contenedor de imagen con scroll */}
                                    <div className="w-full overflow-auto bg-gradient-to-br from-muted/20 to-background/20 p-6 md:p-8">
                                        <img
                                            src={src}
                                            alt={img?.alternativeText || "Organigrama institucional"}
                                            className="mx-auto h-auto max-h-[85vh] w-full object-contain rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-[1.02] border border-border/20"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>


                                </div>
                            ) : (
                                <div className="h-[420px] bg-gradient-to-br from-muted/30 to-muted/10 flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                        <FileImage className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Organigrama no disponible
                                    </h3>
                                    <p className="text-muted-foreground">
                                        La imagen del organigrama estará disponible próximamente.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Información adicional */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Network className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Estructura Clara</h3>
                            <p className="text-sm text-muted-foreground">
                                Organización jerárquica bien definida
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Actualizado</h3>
                            <p className="text-sm text-muted-foreground">
                                Información vigente y oficial
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
            <Footer />
        </div>
    );
}