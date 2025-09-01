import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import api, { ASSETS_URL } from "@/services/api";
interface Imagen {
    id: number;
    documentId: string;
    url: string;
    name: string;
}

interface Convocatoria {
    id: number;
    documentId: string;
    nombre: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    imagen: Imagen | null;
}

const ConvocatoriasSection = () => {
    const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);

    useEffect(() => {
        api
            .get<{ data: Convocatoria[] }>(
                `/tipo-convocatorias?populate[imagen][fields][0]=url&populate[imagen][fields][1]=name`
            )
            .then((res) => {
                setConvocatorias(res.data.data);
            })
            .catch((err) => {
                console.error("Error cargando convocatorias", err);
            });
    }, []);

    return (
        <section id="convocatorias" className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                        Convocatorias
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Explora los diferentes tipos de convocatorias disponibles.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
                    {convocatorias.map((item) => {
                        const imageUrl = item.imagen
                            ? `${ASSETS_URL}${item.imagen.url}`
                            : null;

                        return (
                            <div
                                key={item.id}
                                className="bg-card border border-border/50 rounded-xl p-3 shadow-sm hover:shadow-md transition flex items-center gap-3"
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={item.imagen?.name}
                                        className="w-12 h-12 object-cover rounded-lg border"
                                    />
                                ) : (
                                    <Megaphone className="h-8 w-8 text-primary" />
                                )}

                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-foreground">
                                        {item.nombre}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        Convocatoria disponible.
                                    </p>
                                </div>

                                <Link
                                    to={`/convocatorias/${item.documentId}`}
                                    className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg shadow hover:bg-primary/80 transition"
                                >
                                    Ver
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ConvocatoriasSection;
