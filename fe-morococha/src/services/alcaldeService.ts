import api, { BASE_URL } from "./api";
import qs from "qs";

export type Media = {
    id: number;
    url: string;
    alternativeText?: string | null;
    formats?: {
        large?: { url: string };
        medium?: { url: string };
        small?: { url: string };
        thumbnail?: { url: string };
    };
};

export type Alcalde = {
    id: number;
    documentId?: string;
    nombre: string;
    biografia?: string;
    foto?: Media[]; // Multiple Media (toma la primera)
};

export function mediaUrl(m?: Media) {
    if (!m) return "";
    const u = m.formats?.large?.url || m.formats?.medium?.url || m.formats?.small?.url || m.url;
    return u?.startsWith("http") ? u : `${BASE_URL}${u}`;
}

/** Single Type: devuelve un único objeto o null */
export async function getAlcalde(): Promise<Alcalde | null> {
    const query = qs.stringify(
        { populate: { foto: { fields: ["url", "alternativeText", "formats"] } } },
        { encodeValuesOnly: true }
    );
    const { data } = await api.get(`/alcalde?${query}`);
    return (data?.data ?? null) as Alcalde | null;
}
