import api from "@/services/api";

export type EnlaceInteres = {
    id: number;
    documentId: string;
    link: string;
    imagen?: {
        id: number;
        url: string;
        alternativeText?: string | null;
        formats?: {
            thumbnail?: { url: string };
        };
    };
};

function mapEnlace(entry: any): EnlaceInteres {
    // La respuesta viene sin attributes (aplanada)
    const firstImage = entry?.imagen?.[0]; // Tomar la primera imagen del array

    return {
        id: entry.id,
        documentId: entry.documentId,
        link: entry.link ?? "#",
        imagen: firstImage ? {
            id: firstImage.id,
            url: firstImage.url,
            alternativeText: firstImage.alternativeText,
            formats: firstImage.formats,
        } : undefined,
    };
}

export async function getEnlacesInteres() {
    try {
        const { data } = await api.get("/enlaces-de-interes", {
            params: {
                populate: "imagen",
                publicationState: "live",
            },
        });

        const items: EnlaceInteres[] = (data?.data ?? []).map(mapEnlace);
        return items;
    } catch (error) {
        console.error("Error al cargar enlaces de interés:", error);
        return [];
    }
}

// Helper para construir URL absoluta de imagen
export function enlaceImageUrl(enlace: EnlaceInteres): string {
    if (!enlace.imagen?.url) return "";
    const base = (api.defaults.baseURL ?? "").replace(/\/api\/?$/, "");
    return enlace.imagen.url.startsWith("http")
        ? enlace.imagen.url
        : `${base}${enlace.imagen.url}`;
}