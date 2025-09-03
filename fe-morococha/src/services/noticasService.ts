import api, { BASE_URL } from "./api";
import qs from "qs";

export type Media = {
    id: number;
    url: string;
    alternativeText?: string | null;
    formats?: { large?: { url: string }; medium?: { url: string }; small?: { url: string }; thumbnail?: { url: string } };
};

export type Noticia = {
    id: number;
    documentId?: string;
    titulo_noticia: string;
    breve_descripcion?: string;
    cuerpo_noticia?: string;
    fecha?: string;
    tiempo_lectura_min?: number;
    categoria?: string;
    imagen_noticia?: Media[];
};

export function imageUrl(m?: Media) {
    if (!m) return "";
    const u =
        m.formats?.large?.url ||
        m.formats?.medium?.url ||
        m.formats?.small?.url ||
        m.url;
    return u?.startsWith("http") ? u : `${BASE_URL}${u}`;
}


export async function getNoticias(page = 1, pageSize = 4) {
    const query = qs.stringify(
        {
            sort: ["publishedAt:desc"],
            pagination: { page, pageSize },
            fields: ["titulo_noticia", "breve_descripcion", "fecha", "tiempo_lectura_min", "categoria"],
            populate: {
                imagen_noticia: { fields: ["url", "alternativeText", "formats"] }, // <-- array de strings
            },
        },
        { encodeValuesOnly: true } // <-- importante para Strapi
    );

    const { data } = await api.get(`/noticias?${query}`);
    return { items: (data?.data ?? []) as Noticia[], meta: data?.meta?.pagination };
}

export async function getNoticiaById(id: number, opts?: { preview?: boolean }) {
    const q = qs.stringify(
        {
            filters: { id: { $eq: id } },
            pagination: { pageSize: 1 },
            populate: { imagen_noticia: { fields: ["url", "alternativeText", "formats"] } },
            ...(opts?.preview ? { publicationState: "preview" } : {}),
        },
        { encodeValuesOnly: true }
    );

    const { data } = await api.get(`/noticias?${q}`);
    return (data?.data?.[0] ?? null) as Noticia | null;
}




