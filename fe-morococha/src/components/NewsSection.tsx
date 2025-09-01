import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, ExternalLink } from "lucide-react";
import imagenNoticia from "@/assets/imagen_noticia.webp";

const NewsSection = () => {
    const news = [
        {
            category: "Obras Públicas",
            title: "Inauguración del Nuevo Parque Central",
            description: "Un espacio verde de 5 hectáreas con juegos infantiles, áreas deportivas y senderos ecológicos.",
            date: "15 de Enero, 2024",
            readTime: "3 min",
            featured: true
        },
        {
            category: "Servicios",
            title: "Nuevos Horarios de Atención",
            description: "A partir del próximo mes, ampliamos nuestros horarios de atención para servir mejor a la comunidad.",
            date: "12 de Enero, 2024",
            readTime: "2 min",
            featured: false
        },
        {
            category: "Eventos",
            title: "Festival Cultural de Primavera",
            description: "Tres días de música, arte y gastronomía local en la plaza principal.",
            date: "10 de Enero, 2024",
            readTime: "4 min",
            featured: false
        },
        {
            category: "Medio Ambiente",
            title: "Programa de Reciclaje Comunitario",
            description: "Nueva iniciativa para reducir residuos y promover la economía circular en nuestra ciudad.",
            date: "8 de Enero, 2024",
            readTime: "5 min",
            featured: false
        }
    ];

    return (
        <section id="noticias" className="py-20 bg-background">
            <div className="container mx-auto px-4">

                {/* Noticias */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Noticias y Eventos
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Mantente informado sobre las últimas novedades, proyectos y eventos
                        que están transformando nuestra comunidad.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Noticia destacada */}
                    <div className="lg:col-span-2">
                        <Card className="h-full group hover:shadow-hover transition-all duration-300 border-0 bg-gradient-card">
                            <div className="relative">
                                <div className="h-64 bg-gradient-primary rounded-t-lg flex items-center justify-center">
                                    <div className="h-64 bg-gradient-primary rounded-t-lg overflow-hidden">
                                        <img
                                            src={imagenNoticia}
                                            alt="Imagen del evento"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <Badge className="absolute top-4 left-4 bg-secondary">
                                    {news[0].category}
                                </Badge>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {news[0].title}
                                </CardTitle>
                                <CardDescription className="text-muted-foreground text-base">
                                    {news[0].description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {news[0].date}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {news[0].readTime} de lectura
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        Leer más
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Noticias secundarias */}
                    <div className="space-y-6">
                        {news.slice(1).map((item, index) => (
                            <Card key={index} className="group hover:shadow-card transition-all duration-300 border-0 bg-gradient-card">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <Badge variant="outline">{item.category}</Badge>
                                    </div>
                                    <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                        {item.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                                        {item.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {item.date}
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
                                            <ExternalLink className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Botón ver todas las noticias */}
                {/* <div className="text-center mt-12">
                    <Button size="lg" variant="outline">
                        Ver Todas las Noticias
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div> */}
            </div>
        </section>
    );
};

export default NewsSection;