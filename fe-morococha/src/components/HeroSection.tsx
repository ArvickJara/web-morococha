import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Building, Leaf } from "lucide-react";
import heroVideo from "@/assets/morococha.mp4";
import heroImage from "@/assets/fondo-morococha.jpg";

const HeroSection = () => {
    const stats = [
        { icon: Users, label: "Ciudadanos", value: "50,000+" },
        { icon: Building, label: "Servicios", value: "25+" },
        { icon: Leaf, label: "Proyectos Verdes", value: "15" },
    ];

    return (
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">

            {/* <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-hero"></div>
            </div> */}

            <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src={heroVideo} type="video/mp4" />

            </video>

            <div className="absolute inset-0 bg-gradient-hero">

            </div>

            {/* Contenido */}
            <div className="relative z-10 container mx-auto px-4 py-20">
                <div className="max-w-4xl">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Construyendo el{" "}
                        <span className="bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent">
                            futuro
                        </span>{" "}
                        de nuestra ciudad
                    </h2>

                    <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl leading-relaxed">
                        Trabajamos cada día para mejorar la calidad de vida de nuestros ciudadanos
                        a través de servicios eficientes y proyectos innovadores.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-12">
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-hero">
                            Ver Servicios
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white hover:text-primary backdrop-blur-sm"
                        >
                            Contactar
                        </Button>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                        <stat.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                                        <div className="text-white/80 text-sm">{stat.label}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Indicador de scroll */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;