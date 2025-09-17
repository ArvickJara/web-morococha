import { useState, useEffect, useRef } from "react";
// --- 1. Importa los nuevos iconos ---
import { Menu, X, ChevronDown, Building2, Home, Landmark, ClipboardList, Eye, Target, BookOpen, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import EscudoImage from "@/assets/logo_transparent.png";
import api from "@/services/api";
import { AnimatePresence, motion } from "framer-motion";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(true);
    const [isGerenciasOpen, setIsGerenciasOpen] = useState(false);
    const [gerencias, setGerencias] = useState<Array<{ nombre: string, documentId: string }>>([]);
    const gerenciasRef = useRef<HTMLDivElement>(null);
    const [isMunicipalidadOpen, setIsMunicipalidadOpen] = useState(false);
    const municipalidadRef = useRef<HTMLDivElement>(null);

    // --- 2. Añade "Inicio" y los iconos al array del menú ---
    const menuItems = [
        { name: "Pucará", href: "/pucara", icon: Landmark, external: false },
        { name: "Convocatorias", href: "/convocatorias", icon: ClipboardList, external: false },
        { name: "Transparencia", href: "https://www.transparencia.gob.pe/enlaces/pte_transparencia_enlaces.aspx?id_entidad=11294", icon: Eye, external: true },
    ];

    const municipalidadItems = [
        { name: "Misión y Visión", href: "/mision-vision", icon: Target },
        { name: "Historia", href: "/historia", icon: BookOpen },
        { name: "Turismo", href: "/turismo", icon: Mountain },
    ];

    /* useEffect(() => { ... }); */ // El useEffect del scroll sigue comentado

    useEffect(() => {
        const fetchGerencias = async () => {
            try {
                const response = await api.get('/subgerencias');
                setGerencias(response.data.data);
            } catch (error) {
                console.error('Error al cargar gerencias:', error);
                setGerencias([]);
            }
        };
        fetchGerencias();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (gerenciasRef.current && !gerenciasRef.current.contains(event.target as Node)) {
                setIsGerenciasOpen(false);
            }
            if (municipalidadRef.current && !municipalidadRef.current.contains(event.target as Node)) {
                setIsMunicipalidadOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'mx-4 md:mx-12 lg:mx-24 mt-1' : 'w-full mt-0'}`}>
            <div className={`h-20 flex items-center justify-between px-4 transition-all duration-500 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 ${isScrolled ? 'rounded-xl shadow-lg' : 'rounded-none border-b border-border'}`}>
                <div className="flex items-center gap-3">
                    <a href="/">
                        <img
                            src={EscudoImage}
                            alt="Escudo de Morococha"
                            className="h-16 w-auto object-contain"
                        />
                    </a>
                </div>

                <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                    {/* --- 3. Renderiza los nuevos items del menú con iconos --- */}

                    <div className="relative" ref={municipalidadRef}>
                        <button onClick={() => setIsMunicipalidadOpen(!isMunicipalidadOpen)} className="flex items-center gap-2 text-sm xl:text-base text-foreground hover:text-primary transition-colors duration-300 font-medium group">
                            <Building2 className="h-4 w-4" />
                            <span>Municipalidad</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isMunicipalidadOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isMunicipalidadOpen && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2, ease: "easeInOut" }} className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-64 bg-background border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                                    <div className="p-2">
                                        {municipalidadItems.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <a key={item.name} href={item.href} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors duration-200 group" onClick={() => setIsMunicipalidadOpen(false)}>
                                                    <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                                                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="relative" ref={gerenciasRef}>
                        <button
                            onClick={() => setIsGerenciasOpen(!isGerenciasOpen)}
                            className="flex items-center gap-2 text-sm xl:text-base text-foreground hover:text-primary transition-colors duration-200 font-medium"
                        >
                            <Building2 className="h-4 w-4" />
                            <span>Gerencias</span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isGerenciasOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isGerenciasOpen && (
                            <div className="absolute top-full left-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50 py-2">
                                {gerencias.length > 0 ? (
                                    gerencias.map((gerencia) => (
                                        <a
                                            key={gerencia.documentId}
                                            href={`/gerencias/${gerencia.documentId}`}
                                            className="block px-4 py-3 text-sm text-foreground hover:text-primary hover:bg-muted transition-colors duration-200"
                                            onClick={() => setIsGerenciasOpen(false)}
                                        >
                                            {gerencia.nombre}
                                        </a>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-muted-foreground">
                                        Gerencias en mantenimiento
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {menuItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            target={item.external ? "_blank" : undefined}
                            rel={item.external ? "noopener noreferrer" : undefined}
                            className="flex items-center gap-2 text-sm xl:text-base text-foreground hover:text-primary transition-colors duration-200 font-medium"
                        >
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                        </a>
                    ))}



                </nav>

                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>

                {/* Menú móvil */}
                {isMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-border">
                        <nav className="flex flex-col space-y-2">
                            {/* Municipalidad en móvil */}
                            <div>
                                <button onClick={() => setIsMunicipalidadOpen(!isMunicipalidadOpen)} className="w-full flex items-center justify-between text-lg font-medium p-3 rounded-md hover:bg-muted">
                                    <span>Municipalidad</span>
                                    <ChevronDown className={`h-5 w-5 transition-transform ${isMunicipalidadOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isMunicipalidadOpen && (
                                    <div className="mt-2 ml-4 flex flex-col space-y-1 border-l-2 border-border pl-4">
                                        {municipalidadItems.map(item => (
                                            <a key={item.name} href={item.href} className="block p-2 text-muted-foreground hover:text-primary rounded-md" onClick={() => setIsMenuOpen(false)}>{item.name}</a>
                                        ))}
                                    </div>
                                )}
                            </div>

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
                                        {gerencias.length > 0 ? (
                                            gerencias.map((gerencia) => (
                                                <a
                                                    key={gerencia.documentId}
                                                    href={`/gerencias/${gerencia.documentId}`}
                                                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors duration-200"
                                                    onClick={() => {
                                                        setIsMenuOpen(false);
                                                        setIsGerenciasOpen(false);
                                                    }}
                                                >
                                                    {gerencia.nombre}
                                                </a>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-muted-foreground">
                                                Gerencias en mantenimiento
                                            </div>
                                        )}
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