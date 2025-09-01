import { useEffect, useState } from "react";
import api, { ASSETS_URL } from "@/services/api";
import { ArrowLeft } from "lucide-react";

interface Archivo {
    id: number;
    name: string;
    url: string;
}

interface TipoConvocatoria {
    nombre: string;
}

interface Convocatoria {
    id: number;
    nombre_de_proceso: string;
    tipos_convocatoria: TipoConvocatoria;
    bases: Archivo[];
    resultado_final: Archivo[];
    estado: "no_iniciado" | "en_proceso" | "culminado";
}

interface Props {
    documentId: string;
}

const ConvocatoriaDetalleSection = ({ documentId }: Props) => {
    const [convocatorias, setConvocatorias] = useState<Convocatoria[]>([]);
    const [tipoNombre, setTipoNombre] = useState<string>("");

    useEffect(() => {
        if (!documentId) return;

        api
            .get<{ data: Convocatoria[] }>(
                `/convocatorias?filters[tipos_convocatoria][documentId][$eq]=${documentId}&fields[0]=nombre_de_proceso&fields[1]=estado&populate[tipos_convocatoria][fields][0]=nombre&populate[bases][fields][0]=id&populate[bases][fields][1]=name&populate[bases][fields][2]=url&populate[resultado_final][fields][0]=id&populate[resultado_final][fields][1]=name&populate[resultado_final][fields][2]=url`
            )
            .then((res) => {
                setConvocatorias(res.data.data);
                if (res.data.data.length > 0) {
                    setTipoNombre(res.data.data[0].tipos_convocatoria?.nombre || "");
                }
            })
            .catch((err) => console.error("Error cargando convocatoria", err));
    }, [documentId]);

    const renderArchivos = (archivos: Archivo[], emptyText: string) => {
        if (!archivos || archivos.length === 0) {
            return (
                <span className="text-muted-foreground text-sm italic">
                    No hay {emptyText}
                </span>
            );
        }

        return (
            <div className="flex flex-wrap gap-2">
                {archivos.map((archivo) => (
                    <button
                        key={archivo.id}
                        onClick={() => window.open(`${ASSETS_URL}${archivo.url}`, "_blank")}
                        className="px-4 py-2 border border-primary text-primary rounded-full text-sm shadow min-w-[200px] text-center hover:bg-primary/10 transition"
                    >
                        {archivo.name}
                    </button>
                ))}
            </div>
        );
    };

    const renderEstado = (estado: Convocatoria["estado"]) => {
        let color = "";
        let text = "";

        switch (estado) {
            case "no_iniciado":
                color = "bg-green-500";
                text = "No iniciado";
                break;
            case "en_proceso":
                color = "bg-yellow-500";
                text = "En proceso";
                break;
            case "culminado":
                color = "bg-red-500";
                text = "Culminado";
                break;
            default:
                color = "bg-gray-400";
                text = "Desconocido";
        }

        return (
            <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-white text-xs font-semibold ${color}`}
            >
                {text}
            </span>
        );
    };

    return (
        <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
                {/* Botón volver */}
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-primary hover:underline mb-6"
                >
                    <ArrowLeft size={18} />
                    Volver atrás
                </button>

                <h2 className="text-2xl font-bold mb-6">
                    {tipoNombre ? `Convocatorias de ${tipoNombre}` : "Convocatorias"}
                </h2>

                {convocatorias.length === 0 ? (
                    <p className="text-muted-foreground">
                        No hay convocatorias para este tipo.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border border-border/50 rounded-lg shadow bg-card">
                            <thead className="bg-muted text-sm">
                                <tr>
                                    <th className="px-4 py-2 w-1/5 text-left">Nombre de Proceso</th>
                                    <th className="px-4 py-2 w-1/6 text-left">Bases</th>
                                    <th className="px-4 py-2 w-1/6 text-left">Resultado Curricular</th>
                                    <th className="px-4 py-2 w-1/6 text-left">Resultado Entrevista</th>
                                    <th className="px-4 py-2 w-1/6 text-left">Resultado Final</th>
                                    <th className="px-4 py-2 w-1/6 text-left">Comunicados</th>
                                </tr>
                            </thead>
                            <tbody>
                                {convocatorias.map((convocatoria) => (
                                    <tr key={convocatoria.id} className="border-t border-border/30">
                                        <td className="px-4 py-3 font-medium text-sm">
                                            <div>{convocatoria.nombre_de_proceso}</div>
                                            {renderEstado(convocatoria.estado)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {renderArchivos(convocatoria.bases, "bases")}
                                        </td>
                                        <td className="px-4 py-3">
                                            {renderArchivos([], "resultado curricular")}
                                        </td>
                                        <td className="px-4 py-3">
                                            {renderArchivos([], "resultado entrevista")}
                                        </td>
                                        <td className="px-4 py-3">
                                            {renderArchivos(convocatoria.resultado_final, "resultado final")}
                                        </td>
                                        <td className="px-4 py-3">
                                            {renderArchivos([], "comunicados")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ConvocatoriaDetalleSection;
