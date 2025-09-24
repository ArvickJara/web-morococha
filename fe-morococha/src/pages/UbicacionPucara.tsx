import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Navigation, Mountain } from "lucide-react"; // ajustado
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function UbicacionPucara() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
            <Header />
            <section className="container mx-auto mt-20 px-4 py-12 max-w-7xl">
                {/* Barra superior */}
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/pucara">
                        <Button
                            variant="ghost"
                            size="lg"
                            className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-full px-6"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Volver a Pucará
                        </Button>
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-12 text-center">
                    <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-2 mb-6">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span className="text-primary font-semibold">Ubicación</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                        San Francisco de Asís de Pucará
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Ubicación de la comunidad Pucará.
                    </p>
                </header>

                {/* Contenido principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Mapa - ocupa 2 columnas */}
                    <div className="lg:col-span-2">
                        <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl rounded-3xl overflow-hidden">
                            <CardContent className="p-0">
                                <div className="relative">
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50 shadow-lg">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Navigation className="h-4 w-4 text-primary" />
                                                <span>Pucará, Yauli, Junín</span>
                                            </div>
                                        </div>
                                    </div>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d121064.80781536867!2d-75.1894162115487!3d-12.175341624609802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x910e9b02976aa995%3A0x3cfab682c4503276!2sPucara!5e1!3m2!1ses-419!2spe!4v1758156643363!5m2!1ses-419!2spe"
                                        width="100%"
                                        height="500"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="rounded-3xl"
                                        title="Ubicación de Pucará"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Información de ubicación - 1 columna (reemplazadas las tarjetas) */}
                    <div className="space-y-6">
                        {/* Dirección */}
                        <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-2">Dirección</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Pucará<br />
                                            Distrito de Yauli<br />
                                            Provincia de Yauli<br />
                                            Región Junín, Perú
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Coordenadas */}
                        <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-2">Coordenadas</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Latitud: -12.175342<br />
                                            Longitud: -75.189416
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Altitud y Servicios */}
                        <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Mountain className="h-6 w-6 text-secondary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-2">Altitud & Servicios</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            Altitud: 4,259 msnm<br />
                                            Servicios cercanos: escuela, puesto de salud, mercado y talleres de artesanía.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
