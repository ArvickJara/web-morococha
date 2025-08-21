import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building, Pickaxe } from "lucide-react";
import { getHeroSection } from '@/services/heroService';
import type { HeroSectionType } from '@/services/heroService';
import { useEffect, useState } from "react";
import heroVideoFallback from "@/assets/morococha.mp4";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1337";

const HeroSection = () => {
    const [heroData, setHeroData] = useState<HeroSectionType | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getHeroSection();
                setHeroData(data);
            } catch (error) {
                console.error('Error en componente:', error);
            }
        };

        fetchData();
    }, []);

    const stats = [
        {
            icon: Users,
            label: "Ciudadanos",
            value: heroData?.Ciudadanos ? `${heroData.Ciudadanos.toLocaleString()}+` : "5,155+"
        },
        {
            icon: Building,
            label: "Servicios",
            value: heroData?.Servicios ? `${heroData.Servicios}+` : "7+"
        },
        {
            icon: Pickaxe,
            label: "Proyectos",
            value: heroData?.Proyectos ? `${heroData.Proyectos}+` : "3+"
        },
    ];

    const videoSrc = heroData?.imgenVideo?.url
        ? `${API_URL}${heroData.imgenVideo.url}`
        : heroVideoFallback;

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden">
            {/* --- FONDO DE VIDEO Y OVERLAY --- */}
            <div className="absolute inset-0 z-0">
                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/path/to/poster-image.jpg"
                >
                    <source src={videoSrc} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-start text-left">
                <div className="max-w-3xl">
                    {/* Título principal */}
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight animate-fade-in-down">
                        {heroData?.Titulo_principal || (
                            <>
                                Construyendo el{" "}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    futuro
                                </span>{" "}
                                de nuestra ciudad
                            </>
                        )}
                    </h1>

                    {/* Descripción */}
                    <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed animate-fade-in-up animation-delay-300">
                        {heroData?.Descripcion ||
                            "Trabajamos cada día para mejorar la calidad de vida de nuestros ciudadanos a través de servicios eficientes y proyectos innovadores."}
                    </p>

                    {/* Botones de Acción */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-start mb-16 animate-fade-in-up animation-delay-700">
                        <Button
                            size="lg"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 transform hover:scale-105"
                            onClick={() => document.getElementById('servicios')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Explorar Servicios
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                            onClick={() => document.getElementById('noticias')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Últimas Noticias
                        </Button>
                    </div>
                </div>

                {/* --- ESTADÍSTICAS --- */}
                <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up animation-delay-[900ms]">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 
                                       transition-all duration-300 ease-in-out group
                                       hover:bg-white/20 hover:border-white/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/10"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center
                                            transition-colors duration-300">
                                    <stat.icon className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-white/70 text-sm">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lema institucional con rebote */}
            <p className="absolute z-20 bottom-8 inset-x-0 text-center text-lg md:text-xl text-white font-semibold italic animate-bounce">
                "{heroData?.Lema_institucional || "Gestión con oportunidad para todos"}"
            </p>
        </section>
    );
};

export default HeroSection;