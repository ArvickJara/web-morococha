import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import api, { ASSETS_URL } from "@/services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const estadoStyles: Record<string, string> = {
  en_planificacion: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  en_ejecucion: "bg-blue-100 text-blue-800 border border-blue-300",
  concluido: "bg-green-100 text-green-800 border border-green-300",
};

const ProyectoDetalleSection = ({ documentId }: { documentId: string }) => {
  const [proyecto, setProyecto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        const res = await api.get(
          `/proyectos?filters[documentId][$eq]=${documentId}&populate=*`
        );
        setProyecto(res.data.data[0]);
      } catch (error) {
        console.error("Error al obtener proyecto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProyecto();
  }, [documentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="text-center text-gray-500 py-10">
        No se encontró información del proyecto.
      </div>
    );
  }

  const { nombre, descripcion, estado, media, documentos } = proyecto;

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
    <div className="max-w-5xl mx-auto p-6">
      {/* Botón volver */}
      <Link
        to="/proyectos"
        className="inline-flex items-center mb-6 text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver a proyectos
      </Link>

      {/* Título */}
      <h1 className="text-3xl font-bold mb-3">{nombre}</h1>

      {/* Estado */}
      {estado && (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4 ${estadoStyles[estado] || "bg-gray-100 text-gray-800 border"
            }`}
        >
          {estado.replace("_", " ")}
        </span>
      )}

      {/* Media - Carrusel */}
      {media && Array.isArray(media) && media.length > 0 && (
        <div className="relative mb-6">
          <div className="overflow-hidden rounded-2xl shadow-lg h-[400px] flex items-center justify-center bg-black">
            {media[currentSlide].mime?.startsWith("image/") ? (
              <img
                src={`${ASSETS_URL}${media[currentSlide].url}`}
                alt={media[currentSlide].name || "Imagen del proyecto"}
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

          {/* Botones de navegación */}
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

          {/* Indicadores */}
          {media.length > 1 && (
            <div className="flex justify-center mt-3 space-x-2">
              {media.map((_: any, index: number) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full cursor-pointer ${index === currentSlide ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Descripción con Markdown */}
      {descripcion && (
        <div className="prose prose-lg max-w-none mb-6 break-words whitespace-pre-line">
          <ReactMarkdown
            children={descripcion}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          />
        </div>
      )}

      {/* Documentos como burbujas */}
      {documentos && documentos.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Documentos</h2>
          <div className="flex flex-wrap gap-3">
            {documentos.map((doc: any) => (
              <a
                key={doc.id}
                href={`${ASSETS_URL}${doc.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm hover:bg-blue-200 transition"
              >
                📄 {doc.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProyectoDetalleSection;
