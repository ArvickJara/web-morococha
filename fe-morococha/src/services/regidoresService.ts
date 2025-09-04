// src/services/regidoresService.ts
import api, { BASE_URL } from "./api";
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

export type Regidor = {
    id: number;
    documentId: string;
    nombre: string;
    cargo: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    foto: Media[]; // Multiple Media (tomamos la primera en UI)
};

/* URL absoluta de imagen con el mejor formato disponible */
export function imageUrl(m?: Media) {
    if (!m) return "";
    const f = m.formats || {};
    const best =
        f.large?.url || f.medium?.url || f.small?.url || f.thumbnail?.url || m.url;
    return best?.startsWith("http") ? best : `${BASE_URL}${best}`;
}

/* Lista de regidores: usa exactamente /api/regidors?populate=foto */
export async function getRegidores(): Promise<Regidor[]> {
    const query = qs.stringify(
        {
            fields: [
                "documentId",
                "nombre",
                "cargo",
                "createdAt",
                "updatedAt",
                "publishedAt",
            ],
            populate: { foto: { fields: ["url", "alternativeText", "formats"] } },
            sort: ["createdAt:asc"],      // orden estable; ajusta si tienes "numero"
            pagination: { pageSize: 100 } // suficiente para pocos registros
        },
        { encodeValuesOnly: true }
    );

    const { data } = await api.get(`/regidors?${query}`);
    const rows = (data?.data ?? []) as Regidor[];

    // normalizamos (trim de cargo y nos aseguramos de que 'foto' sea array)
    return rows.map((r) => ({
        id: r.id,
        documentId: r.documentId,
        nombre: r.nombre,
        cargo: (r.cargo ?? "").trim(),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        publishedAt: r.publishedAt,
        foto: Array.isArray(r.foto) ? r.foto : [],
    }));
}
