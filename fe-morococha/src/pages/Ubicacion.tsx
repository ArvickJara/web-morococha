import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Navigation, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function UbicacionPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
            <Header />
            <section className="container mx-auto px-4 py-12 max-w-7xl">
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
                        <MapPin className="h-5 w-5 text-primary" />
                        <span className="text-primary font-semibold">Ubicación</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                        Municipalidad de Morococha
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Visítanos en nuestras oficinas y conoce cómo llegar a nuestra sede principal
                    </p>
                </header>

                {/* Contenido principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Mapa - Ocupa 2 columnas */}
                    <div className="lg:col-span-2">
                        <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-2xl rounded-3xl overflow-hidden">
                            <CardContent className="p-0">
                                <div className="relative">
                                    <div className="absolute top-4 left-4 z-10">
                                        <div className="bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50 shadow-lg">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Navigation className="h-4 w-4 text-primary" />
                                                <span>Morococha, Yauli, Junín</span>
                                            </div>
                                        </div>
                                    </div>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4070.551849200146!2d-76.14185684208812!3d-11.597257721773143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9108b6f1229f93d3%3A0x5f8c7b8a1e199812!2sMorococha%2012596!5e1!3m2!1ses!2spe!4v1756927346085!5m2!1ses!2spe"
                                        width="100%"
                                        height="500"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        className="rounded-3xl"
                                        title="Ubicación de la Municipalidad de Morococha"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Información de contacto - 1 columna */}
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
                                            Morococha 12596<br />
                                            Distrito de Morococha<br />
                                            Provincia de Yauli<br />
                                            Región Junín, Perú
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Horarios de atención */}
                        <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground mb-2">Horarios de Atención</h3>
                                        <div className="space-y-1 text-muted-foreground">
                                            <p><span className="font-medium">Lunes a Viernes:</span> 8:00 AM - 5:00 PM</p>
                                            <p><span className="font-medium">Sábados:</span> 8:00 AM - 1:00 PM</p>
                                            <p><span className="font-medium">Domingos:</span> Cerrado</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contacto */}
                        <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">Teléfono</h4>
                                            <p className="text-muted-foreground">(064) 123-456</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">Email</h4>
                                            <p className="text-muted-foreground">contacto@munimorococha.gob.pe</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Cómo llegar */}
                        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 shadow-lg rounded-2xl">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                                    <Navigation className="h-5 w-5 text-primary" />
                                    Cómo llegar
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                    Desde Lima, tomar la Carretera Central hacia Huancayo.
                                    En La Oroya, continuar por la carretera hacia Morococha.
                                </p>
                                <a
                                    href="https://www.google.com/maps/dir//Morococha+12596/@-11.5972577,-76.1418568,17z"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block"
                                >
                                    <Button size="sm" className="w-full">
                                        <Navigation className="mr-2 h-4 w-4" />
                                        Ver ruta en Google Maps
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}