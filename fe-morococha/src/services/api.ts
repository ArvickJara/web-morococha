import axios, { AxiosError } from 'axios';

// instancia de axios con la configuración base
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:1337/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// URL base para assets (imágenes, archivos, etc.)
export const ASSETS_URL =
  import.meta.env.VITE_ASSETS_URL || 'http://localhost:1337';

// Interceptor para manejo global de errores
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Lógica centralizada de manejo de errores
        const status = error.response?.status;

        if (status === 401) {
            // Manejo de errores de autenticación
            console.error('Error de autenticación:', error);
            // Aquí podrías redirigir a la página de login si es necesario
        } else if (status === 404) {
            console.error('Recurso no encontrado:', error);
        } else {
            console.error('Error en la petición:', error);
        }

        return Promise.reject(error);
    }
);

export default api;