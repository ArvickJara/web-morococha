// Crear un nuevo componente PucaraSection.tsx
import { MapPin, Users, GraduationCap, Coins, Heart } from "lucide-react";

const PucaraSection = () => {
    const pucaraInfo = [
        {
            icon: MapPin,
            title: "Ubicación",
            description: "Centro poblado San Francisco de Asís de Pucará",
            details: [
                "Altitud: 4,259 m.s.n.m.",
                "Kilómetro 147 Carretera Central",
                "Coordenadas: 11°35'10.7\"S, 76°3'42\"W"
            ]
        },
        {
            icon: Users,
            title: "Población",
            description: "Comunidad resiliente del altiplano",
            details: [
                "Aproximadamente 300 habitantes",
                "184 viviendas",
                "Predominio población adulta y femenina"
            ]
        },
        {
            icon: Heart,
            title: "Cultura",
            description: "Tradiciones vivas del altiplano peruano",
            details: [
                "Famoso Torito de Pucará",
                "Fiesta Virgen del Rosario (octubre)",
                "Alfarería tradicional ancestral"
            ]
        },
        {
            icon: Coins,
            title: "Economía",
            description: "Actividades tradicionales y artesanía",
            details: [
                "39% ganadería y agricultura",
                "13.94% actividades comerciales",
                "Cerámica y artesanías"
            ]
        },
        {
            icon: GraduationCap,
            title: "Educación",
            description: "Instituciones educativas públicas",
            details: [
                "Escuela Primaria 31176 (45 estudiantes)",
                "Colegio Secundario CPED 31176 (63 alumnos)",
                "Modalidad multigrado"
            ]
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-secondary/10 to-accent/10">
            <div className="container mx-auto px-4">
                {/* Encabezado */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        San Francisco de Asís de{" "}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Pucará
                        </span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                        Centro poblado dentro del distrito de Morococha, a 4,392 msnm. Una comunidad que conserva
                        vivas las tradiciones del altiplano peruano y enfrenta los desafíos del desarrollo moderno
                        manteniendo su identidad cultural.
                    </p>
                </div>

                {/* Tarjetas de información */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pucaraInfo.map((info, index) => (
                        <div
                            key={index}
                            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                                    <info.icon className="h-6 w-6 text-primary-foreground" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground">{info.title}</h3>
                            </div>

                            <p className="text-muted-foreground mb-4">{info.description}</p>

                            <ul className="space-y-2">
                                {info.details.map((detail, detailIndex) => (
                                    <li key={detailIndex} className="flex items-center text-sm text-muted-foreground">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Historia expandida */}
                <div className="mt-16 bg-card border border-border rounded-xl p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Historia</h3>
                    <p className="text-muted-foreground leading-relaxed text-justify">
                        Pucará enfrenta impactos sociales significativos derivados del reasentamiento de Morococha
                        por el proyecto minero Toromocho, que comenzó a ejecutarse desde 2007 y reubicó a gran parte
                        de la población. A pesar de estos desafíos, la comunidad mantiene su identidad cultural y
                        sus tradiciones ancestrales, especialmente en la elaboración del famoso Torito de Pucará,
                        símbolo de protección, abundancia y prosperidad que forma parte de sus rituales ancestrales.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PucaraSection;