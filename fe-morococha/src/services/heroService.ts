import api from "./api";

export type HeroSectionType = {
    Titulo_principal?: string;
    Descripcion?: string;
    Lema_institucional?: string;
    Ciudadanos?: number;
    Servicios?: number;
    Proyectos?: number;
    imgenVideo?: { url: string; mime?: string }; // o imagenVideo si ese es el nombre correcto
};

export async function getHeroSection(): Promise<HeroSectionType> {
    const { data } = await api.get("/hero-section", {
        params: {
            populate: {
                imgenVideo: { fields: ["url", "mime"] }, // ⬅️ ajusta el nombre si es imagenVideo
            },
        },
    });
    // single type → v5: data.data contiene el objeto
    return data?.data ?? null;
}
