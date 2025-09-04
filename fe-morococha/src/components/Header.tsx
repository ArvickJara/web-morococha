import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import EscudoImage from "@/assets/logo_transparent.png";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isGerenciasOpen, setIsGerenciasOpen] = useState(false);
    const gerenciasRef = useRef<HTMLDivElement>(null);

    const gerencias = [
        { name: "Subgerencia de Asesoría Jurídica", href: "/gerencias/asesoria-juridica" },
        { name: "Subgerencia de Planeamiento y Presupuesto", href: "/gerencias/planeamiento-presupuesto" },
        { name: "Subgerencia de Administración y Rentas", href: "/gerencias/administracion-rentas" },
        { name: "Subgerencia de Desarrollo Económico y Seguridad Ciudadana", href: "/gerencias/desarrollo-economico" },
        { name: "Subgerencia de Servicios Públicos y Sociales", href: "/gerencias/servicios-publicos" },
        { name: "Subgerencia de Infraestructura y Desarrollo Territorial", href: "/gerencias/infraestructura" },
    ];

    const menuItems = [
        { name: "San Francisco", href: "/pucara", external: false },
        { name: "Convocatorias", href: "/convocatorias", external: false },
        { name: "Transparencia", href: "https://www.transparencia.gob.pe/enlaces/pte_transparencia_enlaces.aspx?id_entidad=11294", external: true },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (gerenciasRef.current && !gerenciasRef.current.contains(event.target as Node)) {
                setIsGerenciasOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className={`bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border transition-all duration-500 ${isScrolled ? 'mx-4 md:mx-12 lg:mx-24 mt-4 md:mt-8 rounded-xl shadow-lg' : ''}`}>
            {/* Navegación principal */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <a href="/">
                            <img
                                src={EscudoImage}
                                alt="Escudo de Morococha"
                                className="h-16 w-auto object-contain"
                            />
                        </a>
                    </div>

                    {/* Menú desktop */}
                    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                        {/* Inicio */}
                        <a
                            href="/"
                            className="text-sm xl:text-base text-foreground hover:text-primary transition-colors duration-200 font-medium"
                        >
                            Inicio
                        </a>

                        {/* Dropdown de Gerencias */}
                        <div className="relative" ref={gerenciasRef}>
                            <button
                                onClick={() => setIsGerenciasOpen(!isGerenciasOpen)}
                                className="flex items-center gap-1 text-sm xl:text-base text-foreground hover:text-primary transition-colors duration-200 font-medium"
                            >
                                Gerencias
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isGerenciasOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown menu */}
                            {isGerenciasOpen && (
                                <div className="absolute top-full left-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50 py-2">
                                    {gerencias.map((gerencia) => (
                                        <a
                                            key={gerencia.name}
                                            href={gerencia.href}
                                            className="block px-4 py-3 text-sm text-foreground hover:text-primary hover:bg-muted transition-colors duration-200"
                                            onClick={() => setIsGerenciasOpen(false)}
                                        >
                                            {gerencia.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Otros elementos del menú */}
                        {menuItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                target={item.external ? "_blank" : undefined}
                                rel={item.external ? "noopener noreferrer" : undefined}
                                className="text-sm xl:text-base text-foreground hover:text-primary transition-colors duration-200 font-medium"
                            >
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    {/* Botón menú móvil */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>

                {/* Menú móvil */}
                {isMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-border">
                        <nav className="flex flex-col space-y-2">
                            {/* Inicio en móvil */}
                            <a
                                href="/"
                                className="px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Inicio
                            </a>

                            {/* Gerencias en móvil */}
                            <div>
                                <button
                                    onClick={() => setIsGerenciasOpen(!isGerenciasOpen)}
                                    className="flex items-center justify-between w-full px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200"
                                >
                                    Gerencias
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isGerenciasOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isGerenciasOpen && (
                                    <div className="mt-2 ml-4 space-y-1">
                                        {gerencias.map((gerencia) => (
                                            <a
                                                key={gerencia.name}
                                                href={gerencia.href}
                                                className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200"
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    setIsGerenciasOpen(false);
                                                }}
                                            >
                                                {gerencia.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Otros elementos del menú móvil */}
                            {menuItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target={item.external ? "_blank" : undefined}
                                    rel={item.external ? "noopener noreferrer" : undefined}
                                    className="px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;