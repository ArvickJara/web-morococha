import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import api, { ASSETS_URL } from "@/services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const ObraDetalle = () => {
    const { documentId } = useParams();
    const [obra, setObra] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchObra = async () => {
            try {
                const res = await api.get(
                    `/obras-subgerencias?filters[documentId][$eq]=${documentId}&populate=*`
                );
                setObra(res.data.data[0]);
            } catch (error) {
                console.error("Error al obtener obra:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchObra();
    }, [documentId]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
                </div>
                <Footer />
            </>
        );
    }

    if (!obra) {
        return (
            <>
                <Header />
                <div className="text-center text-gray-500 py-10">
                    No se encontró información de la obra.
                </div>
                <Footer />
            </>
        );
    }

    const { nombre, descripcion, estado, media } = obra;

    const handlePrev = () => {
        if (media && Array.isArray(media)) {
            setCurrentSlide((prev) => (prev === 0 ? media.length - 1 : prev - 1));
        }
    };

    const handleNext = () => {
        if (media && Array.isArray(media)) {
            setCurrentSlide((prev) => (prev === media.length - 1 ? 0 : prev + 1));
        }
    };

    return (
        <>
            <Header />
            <div className="max-w-5xl mx-auto p-6">
                <Link
                    to={`/gerencias/${obra.subgerencia.documentId}`}
                    className="inline-flex items-center mb-6 text-blue-600 hover:underline"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Volver a la gerencia
                </Link>

                <h1 className="text-3xl font-bold mb-3">{nombre}</h1>

                {estado && (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4 bg-blue-100 text-blue-800 border border-blue-300">
                        {estado.replace("_", " ")}
                    </span>
                )}

                {media && Array.isArray(media) && media.length > 0 && (
                    <div className="relative mb-6">
                        <div className="overflow-hidden rounded-2xl shadow-lg h-[400px] flex items-center justify-center bg-black">
                            {media[currentSlide].mime?.startsWith("image/") ? (
                                <img
                                    src={`${ASSETS_URL}${media[currentSlide].url}`}
                                    alt={media[currentSlide].name || "Imagen de la obra"}
                                    className="w-full h-[400px] object-cover"
                                />
                            ) : media[currentSlide].mime?.startsWith("video/") ? (
                                <video
                                    controls
                                    className="w-full h-[400px] object-contain bg-black"
                                >
                                    <source
                                        src={`${ASSETS_URL}${media[currentSlide].url}`}
                                        type={media[currentSlide].mime}
                                    />
                                    Tu navegador no soporta la reproducción de video.
                                </video>
                            ) : (
                                <div className="text-white text-center">
                                    Archivo no soportado: {media[currentSlide].name}
                                </div>
                            )}
                        </div>

                        {media.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-700" />
                                </button>
                            </>
                        )}

                        {media.length > 1 && (
                            <div className="flex justify-center mt-3 space-x-2">
                                {media.map((_: any, index: number) => (
                                    <div
                                        key={index}
                                        className={`w-3 h-3 rounded-full cursor-pointer ${
                                            index === currentSlide ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                        onClick={() => setCurrentSlide(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {descripcion && (
                    <div className="prose prose-lg max-w-none mb-6">
                        <ReactMarkdown
                            children={descripcion}
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                        />
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default ObraDetalle;
