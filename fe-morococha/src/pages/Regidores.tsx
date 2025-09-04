import { useEffect, useMemo, useState } from "react";
import { getRegidores, imageUrl, type Regidor } from "@/services/regidoresService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, User, MapPin } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

/** Nombre con fallback */
function nombreCompleto(r: Regidor) {
    return r.nombre?.trim() || "Regidor/a";
}

/** Avatar mejorado con diseño más elegante */
function Avatar({ r }: { r: Regidor }) {
    const src = r.foto?.[0] ? imageUrl(r.foto[0]) : undefined;
    const alt = r.foto?.[0]?.alternativeText || nombreCompleto(r);

    if (!src) {
        const initials = nombreCompleto(r)
            .split(" ")
            .map((s) => s[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
        return (
            <div className="relative">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border-2 border-border/50 shadow-lg">
                    <span className="text-2xl font-bold text-primary">{initials}</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-muted rounded-full border-2 border-background flex items-center justify-center">
                    <User className="h-3 w-3 text-muted-foreground" />
                </div>
            </div>
        );
    }

    return (
        <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <img
                src={src}
                alt={alt}
                className="h-25 w-25 rounded-2xl object-cover border-2 border-border/50 shadow-lg transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
            />
        </div>
    );
}

export default function RegidoresPage() {
    const [items, setItems] = useState<Regidor[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setErr(null);
                setLoading(true);
                const data = await getRegidores();
                if (!alive) return;
                setItems(data);
            } catch {
                if (!alive) return;
                setErr("No se pudieron cargar los regidores.");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    // Orden estable: por id asc
    const ordered = useMemo(() => [...items].sort((a, b) => a.id - b.id), [items]);

    // Estado de Error Mejorado
    if (err) {
        return (
            <div className="min-h-[60vh] bg-gradient-to-br from-background to-muted/30">
                <div className="container mx-auto px-4 py-16 max-w-md">
                    <div className="bg-card rounded-2xl p-8 shadow-xl border text-center">
                        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-destructive" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-3">Error al cargar regidores</h2>
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

    // Estado de Carga Mejorado
    if (loading) {
        return (
            <div className="min-h-[80vh] bg-gradient-to-br from-background via-muted/20 to-background">
                <div className="container mx-auto px-4 py-16 max-w-6xl">
                    <div className="animate-pulse space-y-8">
                        {/* Header skeleton */}
                        <div className="text-center space-y-4">
                            <div className="h-12 w-64 bg-muted rounded-lg mx-auto" />
                            <div className="h-6 w-80 bg-muted rounded mx-auto" />
                        </div>

                        {/* Grid skeleton */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="bg-card rounded-2xl p-6 border shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-muted rounded-2xl" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-6 w-32 bg-muted rounded" />
                                            <div className="h-4 w-24 bg-muted rounded" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
            <Header />
            <section className="container mx-auto px-4 py-12 max-w-6xl">
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
                        <Users className="h-5 w-5 text-primary" />
                        <span className="text-primary font-semibold">Concejo Municipal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                        Regidores
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
                        Conoce a los miembros del Concejo Municipal que representan a nuestra comunidad
                    </p>

                    {/* Estadística de regidores */}
                    <div className="inline-flex items-center gap-2 bg-card/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
                        <Badge variant="secondary" className="text-sm">
                            {ordered.length} {ordered.length === 1 ? 'Regidor' : 'Regidores'}
                        </Badge>
                    </div>
                </header>

                {/* Grid de regidores mejorado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ordered.map((r) => (
                        <Card
                            key={r.id}
                            className="group bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <Avatar r={r} />
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div>
                                            <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-200">
                                                {nombreCompleto(r)}
                                            </h3>
                                        </div>

                                        {r.cargo && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs bg-primary/5 text-primary border-primary/20 font-medium"
                                            >
                                                {r.cargo.trim()}
                                            </Badge>
                                        )}

                                        {/* Información adicional si existe */}
                                        <div className="pt-2">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                                <span>Morococha</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Mensaje si no hay regidores */}
                {ordered.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            No hay regidores registrados
                        </h3>
                        <p className="text-muted-foreground">
                            La información de los regidores estará disponible próximamente.
                        </p>
                    </div>
                )}
            </section>
            <Footer />
        </div>
    );
}