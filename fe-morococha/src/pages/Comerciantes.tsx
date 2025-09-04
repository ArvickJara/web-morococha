import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Store, MapPin, Clock, Phone, Star, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegistroComercioModal from "@/components/RegistroComercioModal";
import { useEffect, useState } from "react";
import { getComercios, type Comercio } from "@/services/comerciosService";

export default function ComerciantesPage() {
    const [comercios, setComercios] = useState<Comercio[]>([]);
    const [comerciosFiltrados, setComerciosFiltrados] = useState<Comercio[]>([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("Todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalRegistroAbierto, setModalRegistroAbierto] = useState(false);

    // Obtener categorías únicas de los comercios cargados
    const categorias = [
        { nombre: "Todos", count: comercios.length, color: "bg-primary" },
        ...Array.from(new Set(comercios.map(c => c.categoria))).map(categoria => ({
            nombre: categoria,
            count: comercios.filter(c => c.categoria === categoria).length,
            color: comercios.find(c => c.categoria === categoria)?.color || "bg-gray-500"
        }))
    ];

    // Cargar comercios al montar el componente
    useEffect(() => {
        const cargarComercios = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getComercios();
                setComercios(data);
                setComerciosFiltrados(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar comercios");
                console.error("Error cargando comercios:", err);
            } finally {
                setLoading(false);
            }
        };

        cargarComercios();
    }, []);

    // Filtrar por categoría
    const filtrarPorCategoria = (categoria: string) => {
        setCategoriaSeleccionada(categoria);

        if (categoria === "Todos") {
            setComerciosFiltrados(comercios);
        } else {
            const filtrados = comercios.filter(comercio => comercio.categoria === categoria);
            setComerciosFiltrados(filtrados);
        }
    };

    // Función para recargar comercios después del registro
    const handleRegistroExitoso = async () => {
        try {
            const data = await getComercios();
            setComercios(data);
            if (categoriaSeleccionada === "Todos") {
                setComerciosFiltrados(data);
            } else {
                setComerciosFiltrados(data.filter(c => c.categoria === categoriaSeleccionada));
            }
        } catch (err) {
            console.error("Error recargando comercios:", err);
        }
    };

    // Estado de carga
    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background pt-20 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-lg text-muted-foreground">Cargando comercios...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Estado de error
    if (error) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background pt-20">
                    <div className="container mx-auto px-4 py-12 max-w-4xl">
                        <div className="text-center">
                            <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-6" />
                            <h1 className="text-2xl font-bold text-foreground mb-4">Error al cargar comercios</h1>
                            <p className="text-muted-foreground mb-6">{error}</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button onClick={() => window.location.reload()}>
                                    Intentar de nuevo
                                </Button>
                                <Link to="/">
                                    <Button variant="outline">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Volver al inicio
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background ">
                <Header />
                <section className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
                    {/* Barra superior */}
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

                    {/* Header */}
                    <header className="mb-12 text-center">
                        <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-2 mb-6">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                            <span className="text-primary font-semibold">Comercio Local</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                            Comercios de Morococha
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Descubre los comercios locales que ofrecen productos y servicios de calidad para nuestra comunidad
                        </p>
                    </header>

                    {/* Filtros por categoría */}
                    {categorias.length > 1 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Categorías</h3>
                            <div className="flex flex-wrap gap-3">
                                {categorias.map((categoria) => (
                                    <Badge
                                        key={categoria.nombre}
                                        variant={categoriaSeleccionada === categoria.nombre ? "default" : "secondary"}
                                        className="cursor-pointer hover:scale-105 transition-transform duration-200 px-4 py-2"
                                        onClick={() => filtrarPorCategoria(categoria.nombre)}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${categoria.color} mr-2`} />
                                        {categoria.nombre} ({categoria.count})
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Grid de comercios */}
                    {comerciosFiltrados.length === 0 ? (
                        <div className="text-center py-12">
                            <Store className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                No hay comercios disponibles
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {categoriaSeleccionada === "Todos"
                                    ? "Aún no se han registrado comercios en la plataforma."
                                    : `No hay comercios en la categoría "${categoriaSeleccionada}".`
                                }
                            </p>
                            <Button onClick={() => setModalRegistroAbierto(true)}>
                                <Store className="mr-2 h-4 w-4" />
                                Ser el primero en registrarse
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {comerciosFiltrados.map((comercio) => (
                                <Card
                                    key={comercio.id}
                                    className="group bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                >
                                    <CardContent className="p-6">
                                        {/* Header del comercio */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-12 h-12 ${comercio.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                                    <comercio.icon className="h-6 w-6 text-white" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-200">
                                                        {comercio.nombre}
                                                    </h3>
                                                    <Badge variant="outline" className="text-xs mt-1">
                                                        {comercio.categoria}
                                                    </Badge>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Descripción */}
                                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                                            {comercio.descripcion}
                                        </p>

                                        {/* Especialidades */}
                                        {comercio.especialidades.length > 0 && (
                                            <div className="mb-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {comercio.especialidades.map((especialidad, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground"
                                                        >
                                                            {especialidad}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Información de contacto */}
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                                <span className="truncate">{comercio.direccion}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4 flex-shrink-0" />
                                                <span>{comercio.horario}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Phone className="h-4 w-4 flex-shrink-0" />
                                                <a
                                                    href={`tel:${comercio.telefono}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    {comercio.telefono}
                                                </a>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Información para comerciantes */}
                    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 shadow-lg rounded-2xl">
                        <CardContent className="p-6 sm:p-8">
                            <div className="text-center mb-6">
                                <Store className="h-12 w-12 text-primary mx-auto mb-4" />
                                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                                    ¿Tienes un comercio en Morococha?
                                </h3>
                                <p className="text-muted-foreground">
                                    Únete a nuestro directorio comercial y llega a más clientes
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Store className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h4 className="font-semibold text-foreground mb-2">Registro Gratuito</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Incluye tu negocio sin costo alguno
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Star className="h-6 w-6 text-green-600 " />
                                    </div>
                                    <h4 className="font-semibold text-foreground mb-2">Mayor Visibilidad</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Aparece en búsquedas de la comunidad
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <Phone className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h4 className="font-semibold text-foreground mb-2">Contacto Directo</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Los clientes pueden contactarte fácilmente
                                    </p>
                                </div>
                            </div>

                            <div className="text-center">
                                <Button
                                    size="lg"
                                    className="shadow-lg hover:shadow-xl transition-all duration-300"
                                    onClick={() => setModalRegistroAbierto(true)}
                                >
                                    <Store className="mr-2 h-5 w-5" />
                                    Registrar mi comercio
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
            <Footer />

            {/* Modal de registro */}
            <RegistroComercioModal
                isOpen={modalRegistroAbierto}
                onClose={() => setModalRegistroAbierto(false)}
                onSuccess={handleRegistroExitoso}
            />
        </>
    );
}