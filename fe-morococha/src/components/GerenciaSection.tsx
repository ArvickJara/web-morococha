import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api, { ASSETS_URL } from "@/services/api";
import { Loader2 } from "lucide-react";

interface Gerencia {
    nombre: string;
    descripcion: string;
}

interface Actividad {
    documentId: string;
    descripcion: string;
}

interface Servicio {
    documentId: string;
    nombre: string;
}

interface Media {
    url: string;
    mime: string;
    formats?: {
        small?: { url: string };
    };
}

interface Obra {
    documentId: string;
    nombre: string;
    descripcion: string;
    estado: string;
    media: Media[];
}

const GerenciaSection = () => {
    const { documentId } = useParams();
    const [gerencia, setGerencia] = useState<Gerencia | null>(null);
    const [actividades, setActividades] = useState<Actividad[]>([]);
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [obras, setObras] = useState<Obra[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('actividades');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [gerenciaRes, actividadesRes, serviciosRes, obrasRes] = await Promise.all([
                    api.get(`/subgerencias?filters[documentId][$eq]=${documentId}`),
                    api.get(`/actividades-subgerencias?filters[subgerencia][documentId][$eq]=${documentId}`),
                    api.get(`/servicios-subgerencias?filters[subgerencia][documentId][$eq]=${documentId}`),
                    api.get(`/obras-subgerencias?filters[subgerencia][documentId][$eq]=${documentId}&populate=*`),
                ]);

                if (gerenciaRes.data.data.length > 0) {
                    setGerencia(gerenciaRes.data.data[0]);
                    setActividades(actividadesRes.data.data);
                    setServicios(serviciosRes.data.data);
                    setObras(obrasRes.data.data);
                } else {
                    setError("Gerencia no encontrada");
                }
            } catch (err) {
                setError("Error al cargar la información");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [documentId]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error || !gerencia) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <p className="text-lg text-muted-foreground">{error || "Gerencia no encontrada"}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Elemento decorativo superior */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-50 to-transparent" />

            <div className="container mx-auto px-4 py-12 relative">
                <div className="max-w-4xl mx-auto">
                    {/* Título con decoración */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">{gerencia.nombre}</h1>
                        <div className="w-20 h-1 bg-blue-500 mx-auto" />
                    </div>

                    {/* Descripción con diseño mejorado */}
                    <div className="bg-white shadow-lg rounded-xl p-8 mb-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -mr-20 -mt-20" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-50 rounded-full -ml-16 -mb-16" />
                        <p className="text-lg text-gray-700 text-center leading-relaxed relative z-10">
                            {gerencia.descripcion}
                        </p>
                    </div>

                    {/* Tabs con diseño mejorado */}
                    <div className="bg-white rounded-xl shadow-md mb-8">
                        <nav className="flex justify-center border-b">
                            {['actividades', 'servicios', 'obras'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-8 text-sm font-medium capitalize relative
                                        ${activeTab === tab
                                            ? 'text-blue-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }
                                    `}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Contenido de tabs mejorado */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        {activeTab === 'actividades' && (
                            <div className="space-y-4">
                                {actividades.map((actividad) => (
                                    <div 
                                        key={actividad.documentId}
                                        className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
                                    >
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                                <span className="text-blue-600 font-semibold">A</span>
                                            </div>
                                            <p className="text-gray-700">{actividad.descripcion}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'servicios' && (
                            <div className="grid gap-4 md:grid-cols-2">
                                {servicios.map((servicio) => (
                                    <div
                                        key={servicio.documentId}
                                        className="p-4 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100"
                                    >
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                                <span className="text-blue-600 text-lg">⚡</span>
                                            </div>
                                            <h3 className="text-gray-700 font-medium">
                                                {servicio.nombre}
                                            </h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'obras' && (
                            <div className="grid gap-6 md:grid-cols-2">
                                {obras.map((obra) => (
                                    <Link 
                                        to={`/obras/${obra.documentId}`}
                                        key={obra.documentId} 
                                        className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {obra.media?.length > 0 && (
                                            <div className="relative h-48">
                                                {obra.media[0].mime.startsWith('image') ? (
                                                    <img
                                                        src={`${ASSETS_URL}${obra.media[0].formats?.small?.url || obra.media[0].url}`}
                                                        alt={obra.nombre}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : obra.media[0].mime.startsWith('video') && (
                                                    <video
                                                        className="w-full h-full object-cover"
                                                    >
                                                        <source src={`${ASSETS_URL}${obra.media[0].url}`} type={obra.media[0].mime} />
                                                        Tu navegador no soporta el elemento de video.
                                                    </video>
                                                )}
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold mb-2">{obra.nombre}</h3>
                                            <p className="text-gray-600 line-clamp-3">{obra.descripcion}</p>
                                            <div className="mt-4">
                                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                                                    {obra.estado.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GerenciaSection;

