import api from "./api";

export interface ModalCarruselImage {
    id: number;
    url: string;
    alternativeText?: string | null;
}

export interface ModalCarruselItem {
    id: number;
    nombre: string;
    imagen: ModalCarruselImage[];
}

export const getModalCarrusel = async (): Promise<ModalCarruselItem[]> => {
    const { data } = await api.get("/modal-carrusels?populate=imagen");
    type ApiImage = {
        id: number;
        url: string;
        alternativeText?: string | null;
        formats?: {
            large?: { url: string };
        };
    };

    type ApiModalCarruselItem = {
        id: number;
        nombre: string;
        imagen?: ApiImage[];
    };

    return data.data.map((item: ApiModalCarruselItem) => ({
        id: item.id,
        nombre: item.nombre,
        imagen: (item.imagen || []).map((img: ApiImage) => ({
            id: img.id,
            url: img.formats?.large?.url || img.url, // Usa formato grande si existe, si no el original
            alternativeText: img.alternativeText,
        })),
    }));
};