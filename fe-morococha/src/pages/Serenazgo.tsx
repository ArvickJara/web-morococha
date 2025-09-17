import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShieldCheck, Phone, MapPin, Clock, Users, AlertTriangle, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SerenazgoPage() {
    return (

        <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
            <Header />
            <section className="container mt-20 mx-auto px-4 py-12 max-w-6xl">
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
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <span className="text-primary font-semibold">Seguridad Ciudadana</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                        Serenazgo Morococha
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Servicio de seguridad ciudadana las 24 horas para garantizar el orden y la tranquilidad de nuestros vecinos
                    </p>
                </header>

                {/* Información de emergencia destacada */}
                <div className="mb-12">
                    <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-red-800 mb-2">
                                        Línea de Emergencia
                                    </h3>
                                    <p className="text-red-700 mb-4">
                                        Para situaciones de emergencia, comunícate inmediatamente con nuestro equipo de serenazgo.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <a href="tel:911" className="inline-block">
                                            <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                                                <Phone className="h-4 w-4" />
                                                911 - Emergencias
                                            </Button>
                                        </a>
                                        <a href="tel:105" className="inline-block">
                                            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50 gap-2">
                                                <Phone className="h-4 w-4" />
                                                105 - Serenazgo
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Servicios principales */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Patrullaje</h3>
                                    <p className="text-muted-foreground">
                                        Vigilancia permanente en las principales calles y zonas de nuestra localidad.
                                    </p>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <span className="text-muted-foreground">Rondas programadas cada 2 horas</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <span className="text-muted-foreground">Cobertura en todo el distrito</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <span className="text-muted-foreground">Vehículos equipados con radio comunicación</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Users className="h-7 w-7 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Apoyo Ciudadano</h3>
                                    <p className="text-muted-foreground">
                                        Asistencia inmediata a los vecinos en situaciones de riesgo o emergencia.
                                    </p>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    <span className="text-muted-foreground">Respuesta en menos de 10 minutos</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    <span className="text-muted-foreground">Personal capacitado en primeros auxilios</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                    <span className="text-muted-foreground">Coordinación con PNP y bomberos</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Horarios y contacto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground mb-3">Horarios de Atención</h3>
                                    <div className="space-y-2 text-muted-foreground">
                                        <div className="flex justify-between">
                                            <span className="font-medium">Lunes a Domingo:</span>
                                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                24 Horas
                                            </Badge>
                                        </div>
                                        <p className="text-sm">Servicio ininterrumpido todos los días del año</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg rounded-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground mb-3">Central de Serenazgo</h3>
                                    <div className="space-y-2 text-muted-foreground">
                                        <p>Plaza Principal de Morococha</p>
                                        <p>Distrito de Morococha</p>
                                        <p className="text-sm">Oficina principal donde coordinamos todas las operaciones</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Consejos de seguridad */}
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20 shadow-lg rounded-2xl">
                    <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                            Consejos de Seguridad Ciudadana
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className="font-semibold text-foreground">En la vía pública:</h4>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Mantente alerta y evita usar dispositivos móviles en lugares poco transitados</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Camina por lugares bien iluminados y con afluencia de personas</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Si notas algo sospechoso, comunícate inmediatamente con serenazgo</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-semibold text-foreground">En tu hogar:</h4>
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Verifica la identidad de las personas antes de abrir la puerta</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Mantén las puertas y ventanas cerradas durante la noche</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Organízate con tus vecinos para vigilancia mutua</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
            <Footer />
        </div>
    );
}