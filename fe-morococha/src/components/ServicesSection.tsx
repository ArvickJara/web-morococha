import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    FileText,
    CreditCard,
    Building,
    Truck,
    Users,
    Heart,
    ArrowRight,
    Phone
} from "lucide-react";

const ServicesSection = () => {
    const services = [
        {
            icon: FileText,
            title: "Trámites en Línea",
            description: "Realiza tus gestiones municipales desde casa, de forma rápida y segura.",
            features: ["Certificados", "Permisos", "Licencias"],
            color: "bg-primary"
        },
        {
            icon: CreditCard,
            title: "Pagos Municipales",
            description: "Paga tus impuestos y servicios municipales en línea o en nuestras oficinas.",
            features: ["Impuestos", "Multas", "Servicios"],
            color: "bg-secondary"
        },
        {
            icon: Building,
            title: "Obras y Construcción",
            description: "Solicita permisos de construcción y conoce los proyectos en desarrollo.",
            features: ["Permisos", "Planos", "Inspecciones"],
            color: "bg-accent"
        },
        {
            icon: Truck,
            title: "Servicios Públicos",
            description: "Reporta problemas y solicita servicios de mantenimiento urbano.",
            features: ["Limpieza", "Alumbrado", "Bacheo"],
            color: "bg-primary"
        },
        {
            icon: Users,
            title: "Programas Sociales",
            description: "Accede a programas de apoyo social y comunitario para familias.",
            features: ["Becas", "Capacitación", "Apoyo"],
            color: "bg-secondary"
        },
        {
            icon: Heart,
            title: "Salud Comunitaria",
            description: "Servicios de salud preventiva y campañas de bienestar ciudadano.",
            features: ["Vacunación", "Prevención", "Bienestar"],
            color: "bg-accent"
        }
    ];

    return (
        <section id="servicios" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Servicios Municipales
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Ofrecemos una amplia gama de servicios para facilitar tu vida cotidiana y
                        mejorar la calidad de vida en nuestra comunidad.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {services.map((service, index) => (
                        <Card key={index} className="group hover:shadow-hover transition-all duration-300 border-0 bg-gradient-card">
                            <CardHeader className="pb-4">
                                <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <service.icon className="h-6 w-6 text-white" />
                                </div>
                                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {service.title}
                                </CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    {service.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 mb-6">
                                    {service.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    Acceder
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sección de contacto rápido */}
                <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                            ¿Necesitas ayuda con algún trámite?
                        </h3>
                        <p className="text-primary-foreground/90 text-lg mb-8">
                            Nuestro equipo está listo para asistirte en cualquier consulta o procedimiento.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary">
                                <Phone className="mr-2 h-5 w-5" />
                                Llamar Ahora
                            </Button>
                            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                                Chat en Línea
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;