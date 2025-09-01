import api from './api';

export interface HeroSectionType {
    id?: number;
    documentId?: string;
    Titulo_principal: string;
    Descripcion: string;
    Ciudadanos: number;
    Servicios: number;
    Proyectos: number;
    Lema_institucional: string;
    imgenVideo?: {
        url: string;
        mime: string;
    };
    locale?: string;
}

export const getHeroSection = async (): Promise<HeroSectionType> => {
    try {
        // Usamos la instancia de api (axios) en lugar de fetch
        const { data: responseData } = await api.get('/hero-section?populate=imgenVideo');
        const data = responseData.data;

        // Si no hay datos, lanzar un error
        if (!data) {
            throw new Error('No se encontraron datos para la sección principal');
        }

        return {
            id: data.id,
            documentId: data.documentId,
            Titulo_principal: data.Titulo_principal,
            Descripcion: data.Descripcion,
            Ciudadanos: data.Ciudadanos,
            Servicios: data.Servicios,
            Proyectos: data.Proyectos,
            Lema_institucional: data.Lema_institucional,
            imgenVideo: data.imgenVideo ? {
                url: data.imgenVideo.url,
                mime: data.imgenVideo.mime
            } : undefined,
            locale: data.locale
        };
    } catch (error) {
        console.error('Error al obtener datos de la sección principal:', error);
        throw error;
    }
};