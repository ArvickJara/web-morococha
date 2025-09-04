import api, { BASE_URL } from "./api"; // baseURL de api.ts = `${BASE_URL}/api`
import qs from "qs";

/* ===== Tipos según tu respuesta ===== */
type MediaFormat = { url: string; width?: number; height?: number };
export type Media = {
    id: number;
    url: string;
    alternativeText?: string | null;
    formats?: Partial<
        Record<"large" | "medium" | "small" | "thumbnail", MediaFormat>
    >;
};

export type OrganigramaItem = {
    id: number;
    documentId: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    organigrama?: Media | null; // en tu API viene como un objeto
};

/** Devuelve una URL absoluta de imagen priorizando el mejor formato disponible */
export function mediaUrl(m?: Media | null) {
    if (!m) return "";
    const f = m.formats || {};
    const best =
        f.large?.url || f.medium?.url || f.small?.url || f.thumbnail?.url || m.url;
    return best?.startsWith("http") ? best : `${BASE_URL}${best}`;
}

/** Trae los organigramas (por si tienes histórico). El más reciente primero. */
export async function getOrganigramas(): Promise<OrganigramaItem[]> {
    const query = qs.stringify(
        {
            populate: { organigrama: { fields: ["url", "alternativeText", "formats"] } },
            sort: ["createdAt:desc"],
            pagination: { pageSize: 25 },
            fields: ["documentId", "createdAt", "updatedAt", "publishedAt"],
        },
        { encodeValuesOnly: true }
    );

    const { data } = await api.get(`/organigramas?${query}`);
    const rows: OrganigramaItem[] = (data?.data ?? []);
    return rows.map((r) => ({
        id: r.id,
        documentId: r.documentId,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        publishedAt: r.publishedAt,
        organigrama: r.organigrama ?? null,
    }));
}

/** Sencillo helper: devuelve el organigrama más reciente (o null) */
export async function getOrganigramaActual(): Promise<OrganigramaItem | null> {
    const list = await getOrganigramas();
    return list[0] ?? null;
}
