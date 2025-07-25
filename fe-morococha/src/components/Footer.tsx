import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    ArrowRight
} from "lucide-react";

const Footer = () => {
    const quickLinks = [
        { name: "Trámites en Línea", href: "#" },
        { name: "Pagos Municipales", href: "#" },
        { name: "Directorio", href: "#" },
        { name: "Transparencia", href: "#" }
    ];

    const services = [
        { name: "Licencias de Construcción", href: "#" },
        { name: "Registro Civil", href: "#" },
        { name: "Servicios Públicos", href: "#" },
        { name: "Programas Sociales", href: "#" }
    ];

    const socialLinks = [
        { name: "Facebook", icon: Facebook, href: "#" },
        { name: "Twitter", icon: Twitter, href: "#" },
        { name: "Instagram", icon: Instagram, href: "#" },
        { name: "YouTube", icon: Youtube, href: "#" }
    ];

    return (
        <footer className="bg-foreground text-background">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Información de contacto */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
                                M
                            </div>
                            <div>
                                <h3 className="font-bold text-xl">Municipalidad</h3>
                                <p className="text-sm text-background/70">Ciudad Ejemplo</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Dirección</p>
                                    <p className="text-background/70 text-sm">Av. Principal 123<br />Ciudad Ejemplo, CP 12345</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Teléfono</p>
                                    <p className="text-background/70 text-sm">(555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Email</p>
                                    <p className="text-background/70 text-sm">info@municipalidad.gov</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium">Horarios</p>
                                    <p className="text-background/70 text-sm">Lunes a Viernes<br />8:00 - 17:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enlaces rápidos */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Enlaces Rápidos</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-background/70 hover:text-primary transition-colors duration-200 flex items-center group"
                                    >
                                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Servicios */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Servicios</h4>
                        <ul className="space-y-3">
                            {services.map((service, index) => (
                                <li key={index}>
                                    <a
                                        href={service.href}
                                        className="text-background/70 hover:text-primary transition-colors duration-200 flex items-center group"
                                    >
                                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {service.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter y redes sociales */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Mantente Informado</h4>
                        <p className="text-background/70 text-sm mb-4">
                            Suscríbete a nuestro boletín para recibir las últimas noticias y actualizaciones.
                        </p>

                        <div className="flex gap-2 mb-6">
                            <Input
                                type="email"
                                placeholder="Tu email"
                                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                            />
                            <Button size="icon" className="bg-primary hover:bg-primary-variant flex-shrink-0">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div>
                            <h5 className="font-medium mb-4">Síguenos</h5>
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="w-10 h-10 bg-background/10 rounded-lg flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-200"
                                        aria-label={social.name}
                                    >
                                        <social.icon className="h-5 w-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Línea divisoria */}
                <div className="border-t border-background/20 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-background/70 text-sm">
                            © 2024 Municipalidad de Ciudad Ejemplo. Todos los derechos reservados.
                        </div>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="text-background/70 hover:text-primary transition-colors">
                                Política de Privacidad
                            </a>
                            <a href="#" className="text-background/70 hover:text-primary transition-colors">
                                Términos de Uso
                            </a>
                            <a href="#" className="text-background/70 hover:text-primary transition-colors">
                                Accesibilidad
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;