import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Target, Eye, Users, Building2, Leaf, Shield, Heart, Globe } from "lucide-react";

const MisionVision = () => {
    const misionPuntos = [
        {
            icon: Building2,
            titulo: "Desarrollo Integral",
            descripcion: "Promover el desarrollo integral y sostenible de la población del distrito"
        },
        {
            icon: Users,
            titulo: "Servicios de Calidad",
            descripcion: "Brindar servicios públicos de calidad como saneamiento y vías"
        },
        {
            icon: Shield,
            titulo: "Transparencia y Participación",
            descripcion: "Generar espacios de transparencia en la gestión pública y fomentar la participación ciudadana"
        },
        {
            icon: Heart,
            titulo: "Atención Vulnerable",
            descripcion: "Atender a la población vulnerable y priorizar la educación y cultura ambiental para formar ciudadanos responsables"
        }
    ];

    const visionPuntos = [
        {
            icon: Globe,
            titulo: "Desarrollo Humano Integral",
            descripcion: "Un desarrollo humano integral dentro de un marco de igualdad de oportunidades"
        },
        {
            icon: Leaf,
            titulo: "Ciudadanía Ambiental",
            descripcion: "Ser un distrito con ciudadanos conscientes que ejercen su ciudadanía ambiental con responsabilidad y contribuyen al Desarrollo Sostenible"
        },
        {
            icon: Shield,
            titulo: "Gestión Transparente",
            descripcion: "Una gestión sin corrupción ni discriminación, que mejora la calidad de vida a través de la satisfacción total de los servicios básicos (agua, alcantarillado) y la mejora de las vías de transitabilidad"
        }
    ];

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                    <div className="container mx-auto px-4 relative">
                        <div className="text-center max-w-4xl mx-auto mb-16">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                                Misión y <span className="text-primary">Visión</span>
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                Conoce el propósito y el rumbo de la Municipalidad Distrital de Morococha hacia un futuro próspero y sostenible
                            </p>
                        </div>
                    </div>
                </section>

                {/* Misión Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="bg-gradient-to-br from-card via-card/90 to-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
                            {/* Header de Misión */}
                            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 md:p-12 border-b border-border/30">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
                                        <Target className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Misión</h2>
                                        <p className="text-lg text-muted-foreground">Razón de Ser</p>
                                    </div>
                                </div>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    La misión de la Municipalidad Distrital de Morococha es ser una institución al servicio de la comunidad, enfocada en:
                                </p>
                            </div>

                            {/* Puntos de Misión */}
                            <div className="p-8 md:p-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {misionPuntos.map((punto, index) => (
                                        <div key={index} className="group">
                                            <div className="bg-gradient-to-br from-background/50 to-muted/30 rounded-2xl p-6 border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-lg h-full">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                                                        <punto.icon className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-foreground mb-2 text-lg">
                                                            {punto.titulo}
                                                        </h3>
                                                        <p className="text-muted-foreground leading-relaxed">
                                                            {punto.descripcion}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Visión Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="bg-gradient-to-br from-card via-card/90 to-card/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
                            {/* Header de Visión */}
                            <div className="bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent p-8 md:p-12 border-b border-border/30">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center">
                                        <Eye className="h-8 w-8 text-secondary" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Visión</h2>
                                        <p className="text-lg text-muted-foreground">Aspiración a Futuro</p>
                                    </div>
                                </div>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    La Municipalidad Distrital de Morococha se proyecta a futuro como un distrito que logra:
                                </p>
                            </div>

                            {/* Puntos de Visión */}
                            <div className="p-8 md:p-12">
                                <div className="space-y-6">
                                    {visionPuntos.map((punto, index) => (
                                        <div key={index} className="group">
                                            <div className="bg-gradient-to-r from-background/50 to-muted/30 rounded-2xl p-6 border border-border/30 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                                                        <punto.icon className="h-6 w-6 text-secondary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-foreground mb-2 text-lg">
                                                            {punto.titulo}
                                                        </h3>
                                                        <p className="text-muted-foreground leading-relaxed">
                                                            {punto.descripcion}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 rounded-3xl p-8 md:p-12 text-center border border-border/50">
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                                Comprometidos con Nuestro Futuro
                            </h3>
                            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Trabajamos cada día para hacer realidad esta visión, construyendo un Morococha próspero,
                                sostenible y lleno de oportunidades para todos sus habitantes.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-4">
                                <div className="flex items-center gap-2 bg-background/50 rounded-full px-4 py-2 border border-border/30">
                                    <Target className="h-5 w-5 text-primary" />
                                    <span className="font-medium">Desarrollo Sostenible</span>
                                </div>
                                <div className="flex items-center gap-2 bg-background/50 rounded-full px-4 py-2 border border-border/30">
                                    <Users className="h-5 w-5 text-primary" />
                                    <span className="font-medium">Participación Ciudadana</span>
                                </div>
                                <div className="flex items-center gap-2 bg-background/50 rounded-full px-4 py-2 border border-border/30">
                                    <Shield className="h-5 w-5 text-primary" />
                                    <span className="font-medium">Transparencia</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default MisionVision;