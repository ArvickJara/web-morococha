import api from "@/services/api";

export type Media = {
    id: number;
    url: string;
    alternativeText?: string | null;
};

export type Noticia = {
    id: number;
    documentId?: string;
    titulo_noticia: string;
    breve_descripcion?: string;
    cuerpo_noticia?: string;
    fecha?: string | null;
    tiempo_lectura_min?: number | null;
    categoria?: string;
    imagenes?: Media[]; // todas las imágenes del carrusel aplanadas
};

// Fallback local (sin red)
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

// Helpers para soportar respuesta con o sin attributes/data
function attrs<T = any>(node: any): T {
    return (node && (node.attributes ?? node)) as T;
}
function toArrayData(node: any): any[] {
    if (!node) return [];
    if (Array.isArray(node)) return node;
    const d = node.data;
    return Array.isArray(d) ? d : [];
}

function mapMediaArray(list: any): Media[] {
    const arr: any[] = toArrayData(list);
    return arr
        .map((m) => {
            const a = attrs(m);
            if (!a?.url) return null;
            return {
                id: m?.id ?? a?.id ?? 0,
                url: a.url,
                alternativeText: a.alternativeText ?? null,
            } as Media;
        })
        .filter(Boolean) as Media[];
}

function mapNoticia(entry: any): Noticia {
    const a = attrs(entry);

    // Carrusel: soporta objeto {data:[...]} o arreglo directo
    const carruselItems = toArrayData(a.carrusel_noticias);

    // imagen_noticia también puede venir como {data:[...]} o arreglo directo
    const allImageNodes = carruselItems.flatMap((c: any) => {
        const ca = attrs(c);
        return toArrayData(ca.imagen_noticia);
    });

    return {
        id: entry?.id ?? a?.id,
        documentId: a?.documentId,
        titulo_noticia: a?.titulo_noticia ?? "(Sin título)",
        breve_descripcion: a?.breve_descripcion ?? "",
        cuerpo_noticia: a?.cuerpo_noticia ?? "",
        fecha: a?.fecha ?? null,
        tiempo_lectura_min: a?.tiempo_lectura_min ?? null,
        categoria: a?.categoria ?? "",
        imagenes: mapMediaArray(allImageNodes),
    };
}

export async function getNoticias(page = 1, pageSize = 4) {
    const { data } = await api.get("/noticias", {
        params: {
            // Dos formas de populate para máxima compatibilidad
            "populate[carrusel_noticias][populate]": "imagen_noticia",
            "populate[0]": "carrusel_noticias.imagen_noticia",
            // Orden y paginación
            "sort[0]": "fecha:desc",
            "sort[1]": "createdAt:desc",
            "pagination[page]": page,
            "pagination[pageSize]": pageSize,
            publicationState: "live",
        },
    });

    const items: Noticia[] = (data?.data ?? []).map(mapNoticia);
    const meta = data?.meta?.pagination ?? { pageCount: 1, page: 1, pageSize };
    return { items, meta };
}

export async function getNoticiaByDocumentId(documentId: string) {
    const { data } = await api.get("/noticias", {
        params: {
            "filters[documentId][$eq]": documentId,
            "populate[carrusel_noticias][populate]": "imagen_noticia",
            "populate[0]": "carrusel_noticia.imagen_noticia",
            publicationState: "live",
            "pagination[pageSize]": 1,
        },
    });
    const item = (data?.data ?? [])[0];
    return item ? mapNoticia(item) : null;
}

export async function getNoticiaById(id: number) {
    const { data } = await api.get(`/noticias/${id}`, {
        params: {
            "populate[carrusel_noticias][populate]": "imagen_noticia",
            "populate[0]": "carrusel_noticias.imagen_noticia",
            publicationState: "live",
        },
    });
    const item = data?.data;
    return item ? mapNoticia(item) : null;
}

// Construye URL absoluta o usa fallback
export function imageUrl(m?: Media) {
    if (!m?.url) return FALLBACK_IMAGE;
    const base = (api.defaults.baseURL ?? "").replace(/\/api\/?$/, "");
    return m.url.startsWith("http") ? m.url : `${base}${m.url}`;
}