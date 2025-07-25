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
import EscudoGray from "@/assets/escudo_grayscale.png";

const Footer = () => {
    const quickLinks = [
        { name: "Trámites en Línea", href: "#" },
        { name: "Pagos Municipales", href: "#" },
        { name: "Directorio", href: "#" },
        { name: "Transparencia", href: "#" }
    ];

    const services = [
        { name: "Licencias de funcionamiento" },
        { name: "Codisec 2025" },
        { name: "Participación Vecinal" },
        { name: "Administración Tributaria" },
        { name: "Serenazgo Morococha" },
        { name: "Registros Civiles" },
        { name: "Comercialización" }
    ];

    const socialLinks = [
        { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/munidemorococha" },
        { name: "Twitter", icon: Twitter, href: "#" },
        { name: "Instagram", icon: Instagram, href: "#" },
        { name: "YouTube", icon: Youtube, href: "#" }
    ];

    return (
        <footer className="bg-foreground text-background">
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {/* Información de contacto */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                src={EscudoGray}
                                alt="Escudo de Morococha"
                                className="h-12 w-12 object-contain"
                            />
                            <div>
                                <h3 className="font-bold text-xl">Municipalidad</h3>
                                <p className="text-sm text-background/70">Morococha</p>
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
                                    <p className="text-background/70 text-sm">mesadepartesmdm2023.2026@gmail.com</p>
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
                    {/* <div>
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
                    </div> */}

                    {/* Servicios */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Servicios</h4>
                        <ul className="space-y-3">
                            {services.map((service, index) => (
                                <li key={index}>
                                    <div className="text-background/70 hover:text-primary transition-colors duration-200 flex items-center group cursor-pointer">
                                        <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {service.name}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter y redes sociales */}
                    <div>
                        <h4 className="font-bold text-lg mb-6">Mantente Informado</h4>


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
                            © 2024 Imagen Institucional - Municipalidad de Morococha. Todos los derechos reservados.
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;