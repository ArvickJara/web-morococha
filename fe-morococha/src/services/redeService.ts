import api from "./api";

export interface RedeData {
    WhatsApp: string;
    facebook: string;
    Twitter: string;
    Instagram: string;
    YouTube: string;
    Telefono: string;
    Email: string;
}

export const getRedeData = async (): Promise<RedeData> => {
    const { data: responseData } = await api.get("/api/rede");
    return responseData.data;
};