import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Shield,
    Users,
    Calculator,
    ShieldCheck,
    FileUser,
    ShoppingCart,
} from "lucide-react";

const WhatsAppIcon = () => (
    <svg className="mr-2 h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
    </svg>
);

const ServicesSection = () => {
    const services = [
        {
            icon: FileText,
            title: "Licencias de funcionamiento",
            description: "Obtén tu licencia de funcionamiento para establecimientos comerciales de manera ágil y transparente.",
            features: ["Licencia Municipal", "Inspección Técnica", "Certificado ITSDC"],
            color: "bg-primary"
        },
        {
            icon: Shield,
            title: "Codisec 2025",
            description: "Comité Distrital de Seguridad Ciudadana para la prevención y control de la criminalidad.",
            features: ["Seguridad Ciudadana", "Prevención", "Coordinación Policial"],
            color: "bg-secondary"
        },
        {
            icon: Users,
            title: "Participación Vecinal",
            description: "Espacios de diálogo y participación ciudadana para el desarrollo comunitario y toma de decisiones.",
            features: ["Asambleas Vecinales", "Presupuesto Participativo", "Organizaciones Sociales"],
            color: "bg-accent"
        },
        {
            icon: Calculator,
            title: "Administración Tributaria",
            description: "Gestión de tributos municipales, fiscalización y orientación para el cumplimiento de obligaciones tributarias.",
            features: ["Predial", "Arbitrios", "Licencias"],
            color: "bg-primary"
        },
        {
            icon: ShieldCheck,
            title: "Serenazgo Morococha",
            description: "Servicio de seguridad ciudadana y vigilancia municipal para garantizar el orden y la tranquilidad.",
            features: ["Patrullaje", "Emergencias", "Apoyo Policial"],
            color: "bg-secondary"
        },
        {
            icon: FileUser,
            title: "Registros Civiles",
            description: "Tramitación de documentos de identidad, certificados y registro de hechos vitales de la población.",
            features: ["Certificados", "Actas", "Documentación"],
            color: "bg-accent"
        },
        {
            icon: ShoppingCart,
            title: "Comercialización",
            description: "Promoción y apoyo al desarrollo comercial local, ferias y mercados para emprendedores.",
            features: ["Ferias Locales", "Mercados", "Emprendimiento"],
            color: "bg-primary"
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
                        <Card key={index} className="group hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 border-0 bg-card hover:bg-card/95 hover:scale-[1.02]">                            <CardHeader className="pb-4">
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
                            <Button
                                size="lg"
                                style={{ backgroundColor: '#447E4E' }}
                                className="animate-bounce hover:opacity-90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                                onClick={() => window.open('https://wa.me/51918363299?text=Hola,%20necesito%20ayuda%20con%20un%20trámite', '_blank')}
                            >
                                <WhatsAppIcon />
                                Contactar por WhatsApp
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;