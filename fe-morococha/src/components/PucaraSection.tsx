import { MapPin, Users, GraduationCap, Coins, Heart, Mountain, BookOpen, ArrowRight, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/services/api";

// TODO: Reemplaza estas rutas con imágenes reales de Pucará
import pucaraVistaGeneral from "@/assets/pucara-morococha.jpg";
import toritoPucara from "@/assets/pucara-torito.webp";
import ganaderiaPucara from "@/assets/ganaderia-pucara.jpg";
import escuelaPucara from "@/assets/escuela-pucara.jpg";

const PucaraSection = () => {
    const [totalProyectos, setTotalProyectos] = useState<number>(0);

    useEffect(() => {
        const fetchTotalProyectos = async () => {
            try {
                const response = await api.get('/proyectos-san-franciscos?pagination[pageSize]=1');
                const total = response.data?.meta?.pagination?.total || 0;
                setTotalProyectos(total);
            } catch (error) {
                console.error("Error al obtener el total de proyectos:", error);
            }
        };

        fetchTotalProyectos();
    }, []);

    const stats = [
        { 
            icon: Folder, // Cambiamos el icono
            label: "Proyectos", 
            value: `${totalProyectos}+`, 
            link: "/pucara/proyectos", // Agregamos el enlace
            description: "Ver todos los proyectos" // Texto adicional
        },
        { 
            icon: Mountain, 
            label: "Ubicación", 
            value: "Ver ubicación", 
            link: "/pucara/ubicacion", // ahora es enlace a nueva página
            description: "Ver ubicación en el mapa" 
        },
        { icon: Users, label: "Habitantes", value: "+ 300" },
    ];

    const features = [
        {
            icon: BookOpen,
            title: "Una Historia de Resiliencia",
            description: "Pucará enfrenta impactos sociales significativos derivados del reasentamiento de Morococha por el proyecto minero Toromocho. A pesar de los desafíos, la comunidad mantiene su identidad y tradiciones ancestrales, demostrando una notable fortaleza y capacidad de adaptación.",
            image: pucaraVistaGeneral,
            imageAlt: "Vista panorámica de la comunidad de Pucará en los Andes.",
            align: "left"
        },
        {
            icon: Heart,
            title: "Cultura Viva y Tradición",
            description: "La comunidad conserva vivas las expresiones culturales del altiplano. Destaca la alfarería y el famoso Torito de Pucará, símbolo de protección y prosperidad. Sus fiestas patronales combinan música, danzas folklóricas y torneos, manteniendo un rico legado cultural.",
            image: toritoPucara,
            imageAlt: "Primer plano de un Torito de Pucará de cerámica.",
            align: "right"
        },
        {
            icon: Coins,
            title: "Economía Local y Sostenible",
            description: "La economía se basa en la ganadería y agricultura de subsistencia, que representa casi el 40% del empleo. La cerámica y la fabricación de artesanías también generan ingresos significativos, complementados por el comercio y servicios locales.",
            image: ganaderiaPucara,
            imageAlt: "Ganado pastando en las alturas de Pucará.",
            align: "left"
        },
        {
            icon: GraduationCap,
            title: "Educación para el Futuro",
            description: "En Pucará funcionan dos instituciones educativas públicas: la Escuela Primaria 31176 y el Colegio Secundario CPED 31176. Juntas, atienden a más de 100 estudiantes, asegurando la formación de las nuevas generaciones de la comunidad.",
            image: escuelaPucara,
            imageAlt: "Fachada de una de las escuelas públicas en Pucará.",
            align: "right"
        }
    ];

    return (
        <section id="pucara" className="py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                {/* --- ENCABEZADO Y STATS --- */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Conoce San Francisco de Asís de{" "}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Pucará
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Un centro poblado que fusiona la riqueza de su herencia cultural con los desafíos del presente.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-4xl mx-auto">
                    {stats.map((stat, index) => (
                        <div 
                            key={index} 
                            className="bg-card border border-border/50 rounded-xl p-6 text-center flex flex-col items-center justify-center hover:bg-card/80 transition-colors"
                        >
                            <stat.icon className="h-10 w-10 text-primary mb-3" />
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>

                            {/* link / action handling */}
                            {stat.link && (
                                <Link 
                                    to={stat.link} 
                                    className="text-muted-foreground text-sm mt-3 flex items-center gap-1 hover:underline"
                                >
                                    {stat.description}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>

                {/* --- SECCIONES DE CARACTERÍSTICAS CON IMAGEN --- */}
                <div className="space-y-24">
                    {features.map((feature, index) => (
                        <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
                            <div className={`relative ${feature.align === 'right' ? 'lg:order-last' : ''}`}>
                                <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
                                    <img
                                        src={feature.image}
                                        alt={feature.imageAlt}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl -z-10"></div>
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl -z-10"></div>
                            </div>

                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">
                                    <feature.icon className="h-5 w-5" />
                                    <span>{feature.title}</span>
                                </div>
                                <h3 className="text-3xl font-bold text-foreground leading-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PucaraSection;