import { useEffect, useState } from "react";
import { getAlcalde, mediaUrl, type Alcalde } from "@/services/alcaldeService";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AlcaldePage() {
    const [alcalde, setAlcalde] = useState<Alcalde | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setError(null);
                const data = await getAlcalde();
                if (!alive) return;
                if (!data) setError("No se encontró información del alcalde.");
                setAlcalde(data);
            } catch {
                if (!alive) return;
                setError("No se pudo cargar la información del alcalde.");
            }
        })();
        return () => { alive = false; };
    }, []);

    // Estado de Error Mejorado
    if (error) {
        return (
            <div className="min-h-[60vh] bg-gradient-to-br from-background to-muted/30">
                <div className="container mx-auto px-4 py-16 max-w-md">
                    <div className="bg-card rounded-2xl p-8 shadow-xl border text-center">
                        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="h-8 w-8 text-destructive" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-3">Error al cargar información</h2>
                        <p className="text-destructive font-medium mb-6">{error}</p>
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

    // Estado de Carga Mejorado
    if (!alcalde) {
        return (
            <div className="min-h-[80vh] bg-gradient-to-br from-background via-muted/20 to-background">
                <div className="container mx-auto px-4 py-16 max-w-5xl">
                    <div className="animate-pulse space-y-8">
                        {/* Header skeleton */}
                        <div className="flex items-center justify-between">
                            <div className="h-10 w-24 bg-muted rounded-lg" />
                        </div>

                        {/* Hero skeleton */}
                        <div className="space-y-4">
                            <div className="h-8 w-48 bg-muted rounded-lg" />
                            <div className="h-4 w-80 bg-muted rounded" />
                        </div>

                        {/* Content skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1">
                                <div className="aspect-[3/4] w-full bg-gradient-to-br from-muted via-muted/70 to-muted/40 rounded-2xl" />
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <div className="h-8 w-2/3 bg-muted rounded-lg" />
                                <div className="space-y-3">
                                    <div className="h-4 w-full bg-muted rounded" />
                                    <div className="h-4 w-4/5 bg-muted rounded" />
                                    <div className="h-4 w-3/5 bg-muted rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const foto = alcalde.foto?.[0];
    const src = mediaUrl(foto);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
            <Header />
            <section className="container mt-20 mx-auto px-4 py-12 max-w-6xl">
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

                {/* Header mejorado */}
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-2 mb-4">
                        <User className="h-5 w-5 text-primary" />
                        <span className="text-primary font-semibold">Autoridad Municipal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                        Alcalde de Morococha
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Conoce a la máxima autoridad de nuestra municipalidad y su trayectoria al servicio de la comunidad
                    </p>
                </header>

                {/* Card principal mejorado */}
                <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-border/50 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                        {/* Foto del alcalde */}
                        <div className="lg:col-span-2">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative overflow-hidden rounded-2xl border-2 border-border/50 shadow-xl">
                                    {src ? (
                                        <img
                                            src={src}
                                            alt={foto?.alternativeText || alcalde.nombre}
                                            className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : (
                                        <div className="w-full aspect-[3/4] bg-gradient-to-br from-muted via-muted/80 to-muted/60 flex flex-col items-center justify-center">
                                            <User className="h-16 w-16 text-muted-foreground/50 mb-4" />
                                            <p className="text-muted-foreground font-medium">Sin fotografía disponible</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Información del alcalde */}
                        <div className="lg:col-span-3 space-y-6">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
                                    {alcalde.nombre}
                                </h2>
                                <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full" />
                            </div>

                            <div className="bg-muted/30 rounded-xl p-6 border border-border/30">
                                {alcalde.biografia ? (
                                    <div
                                        className="prose prose-lg prose-neutral dark:prose-invert max-w-none
                                                 prose-p:text-foreground prose-p:leading-relaxed prose-p:text-lg
                                                 prose-strong:text-foreground prose-strong:font-semibold"
                                    >
                                        <p className="text-foreground leading-relaxed whitespace-pre-line text-lg">
                                            {alcalde.biografia}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground text-lg">
                                            La biografía del alcalde estará disponible próximamente.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}