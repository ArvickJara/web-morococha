import api from "./api";

export const getRadioStreamUrl = async (): Promise<string> => {
    const { data: responseData } = await api.get("/radio-link");
    return responseData.data?.enlace_stream || "";
};