import api from "@/services/api";

export type Media = {
    id: number;
    url: string;
    alternativeText?: string | null;
};

export type Turismo = {
    id: number;
    documentId?: string;
    nombre_lugar_turistico: string;
    descripcion_lugar_turistico?: string;
    imagenes?: Media[]; // aplanadas desde el carrusel
};

// Fallback local como SVG embebido
export const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='800' height='460'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='#e5e7eb'/>
      <stop offset='100%' stop-color='#f3f4f6'/>
    </linearGradient>
  </defs>
  <rect width='100%' height='100%' fill='url(#g)'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        fill='#6b7280' font-family='sans-serif' font-size='24'>
    Sin imagen
  </text>
</svg>
`)}`;

function baseUrl() {
    // api.baseURL = http://host:1337/api -> base sin /api para archivos
    return (api.defaults.baseURL ?? "").replace(/\/api\/?$/, "");
}

export function imageUrl(m?: Media) {
    if (!m?.url) return FALLBACK_IMAGE;
    return m.url.startsWith("http") ? m.url : `${baseUrl()}${m.url}`;
}

// Type guards y helpers para soportar respuesta con o sin attributes/data sin usar any
type Dict = Record<string, unknown>;

function hasAttributes(obj: unknown): obj is { attributes: Dict } {
    return typeof obj === "object" && obj !== null && "attributes" in obj;
}

function getAttrs<T extends Dict>(node: unknown): T {
    if (hasAttributes(node)) return node.attributes as T;
    return (node ?? {}) as T;
}

function toArrayData(node: unknown): unknown[] {
    if (!node) return [];
    if (Array.isArray(node)) return node;
    if (typeof node === "object" && node !== null && "data" in node) {
        const d = (node as { data?: unknown }).data;
        return Array.isArray(d) ? d : [];
    }
    return [];
}

function mapMediaArray(input: unknown): Media[] {
    const arr = toArrayData(input);
    const result: Media[] = [];
    for (const m of arr) {
        const a = getAttrs<{ url?: string; alternativeText?: string | null; id?: number }>(m);
        if (!a?.url) continue;
        const idVal = (typeof (m as Dict)?.["id"] === "number" ? (m as Dict)["id"] : a.id) as number | undefined;
        result.push({ id: idVal ?? 0, url: a.url, alternativeText: a.alternativeText ?? null });
    }
    return result;
}

export async function getTurismos(page = 1, pageSize = 12) {
    // Trae turismos; si existe relación al carrusel la poblamos en la otra llamada
    const { data } = await api.get("/turismos", {
        params: {
            "pagination[page]": page,
            "pagination[pageSize]": pageSize,
            "sort[0]": "createdAt:desc",
            publicationState: "live",
        },
    });

    // Soporte de respuesta aplanada o con attributes
    const rawItems: unknown = data?.data ?? [];
    const items: Turismo[] = (Array.isArray(rawItems) ? rawItems : []).map((entry) => {
        const a = getAttrs<{
            id?: number;
            documentId?: string;
            nombre_lugar_turistico?: string;
            descripcion_lugar_turistico?: string;
        }>(entry);
        const entryId = typeof (entry as Dict)?.["id"] === "number" ? ((entry as Dict)["id"] as number) : a?.id;
        return {
            id: entryId ?? 0,
            documentId: a?.documentId,
            nombre_lugar_turistico: a?.nombre_lugar_turistico ?? "(Sin nombre)",
            descripcion_lugar_turistico: a?.descripcion_lugar_turistico ?? "",
            imagenes: [],
        };
    });

    const meta = data?.meta?.pagination ?? { pageCount: 1, page, pageSize };
    return { items, meta } as { items: Turismo[]; meta: { pageCount: number; page: number; pageSize: number } };
}

// Nota: endpoint se llama 'caruusel-turismos' (según el usuario); intentamos campos comunes por robustez
export async function getCaruuselTurismosByTurismoIds(keys: string[]) {
    if (!keys.length) return {} as Record<string, Media[]>;

    // populate correcto según tu esquema: imagen_turismo (media multiple) y turismo (relación)
    let resp;
    try {
        resp = await api.get("/caruusel-turismos", {
            params: {
                publicationState: "live",
                "pagination[pageSize]": 100,
                "populate[0]": "imagen_turismo",
                "populate[1]": "turismo",
            },
        });
    } catch (e) {
        // Fallback por si el populate específico falla
        resp = await api.get("/caruusel-turismos", {
            params: {
                publicationState: "live",
                "pagination[pageSize]": 100,
                populate: "*",
            },
        });
    }

    const list: unknown = resp.data?.data;
    const arr = Array.isArray(list) ? list : [];

    const mediasByKey: Record<string, Media[]> = {};

    const getIdFromNode = (node: unknown): number | undefined => {
        if (typeof node === "object" && node !== null) {
            const d = (node as { id?: unknown; data?: { id?: unknown } }).data;
            const ownId = (node as { id?: unknown }).id;
            if (typeof ownId === "number") return ownId;
            if (d && typeof d.id === "number") return d.id;
        }
        return undefined;
    };
    const getDocIdFromNode = (node: unknown): string | undefined => {
        const a = getAttrs<{ documentId?: unknown }>(node);
        if (typeof a?.documentId === "string") return a.documentId;
        if (typeof node === "object" && node !== null && "data" in node) {
            const d = (node as { data?: unknown }).data;
            const da = getAttrs<{ documentId?: unknown }>(d as unknown);
            if (typeof da?.documentId === "string") return da.documentId;
        }
        return undefined;
    };

    for (const row of arr) {
        const a = getAttrs<Dict>(row);

        // Imágenes del carrusel (campo real: imagen_turismo)
        const imgsRaw = toArrayData(a["imagen_turismo"]);
        const medias = mapMediaArray(imgsRaw);
        if (!medias.length) continue;

        // Relación al turismo: obtenemos posibles claves de asociación
        const turismoRel = a["turismo"];
        const relId = getIdFromNode(turismoRel);
        const relDocId = getDocIdFromNode(turismoRel);

        // También agregamos claves de seguridad por si se usan documentId/id del propio carrusel
        const selfDocId = (a["documentId"] as string | undefined);
        const selfId = typeof (row as { id?: unknown }).id === "number" ? String((row as { id?: number }).id) : undefined;

        const assocKeys = [
            relDocId,
            relId !== undefined ? String(relId) : undefined,
            selfDocId,
            selfId,
        ].filter(Boolean) as string[];

        for (const k of assocKeys) {
            if (!mediasByKey[k]) mediasByKey[k] = [];
            mediasByKey[k].push(...medias);
        }
    }

    return mediasByKey as Record<string, Media[]>;
}