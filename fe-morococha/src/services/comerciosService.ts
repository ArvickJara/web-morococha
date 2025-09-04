import type { LucideIcon } from "lucide-react";
import { Utensils, ShoppingBag, Wrench, Heart, Coffee, Briefcase, Store, FileText, Shield, Users, Calculator, ShieldCheck, FileUser, Car, Home, Laptop, Camera, Scissors, Pill, Building, Truck } from "lucide-react";

// Mapeo de iconos disponibles
export const iconMap: Record<string, LucideIcon> = {
    "Utensils": Utensils,
    "ShoppingBag": ShoppingBag,
    "Wrench": Wrench,
    "Heart": Heart,
    "Coffee": Coffee,
    "Briefcase": Briefcase,
    "Store": Store,
    "FileText": FileText,
    "Shield": Shield,
    "Users": Users,
    "Calculator": Calculator,
    "ShieldCheck": ShieldCheck,
    "FileUser": FileUser,
    "Car": Car,
    "Home": Home,
    "Laptop": Laptop,
    "Camera": Camera,
    "Scissors": Scissors,
    "Pill": Pill,
    "Building": Building,
    "Truck": Truck,
};

// Opciones de iconos para el selector
export const iconOptions = [
    { value: "Utensils", label: "Restaurante", icon: Utensils },
    { value: "ShoppingBag", label: "Tienda", icon: ShoppingBag },
    { value: "Wrench", label: "Ferretería", icon: Wrench },
    { value: "Heart", label: "Farmacia", icon: Heart },
    { value: "Coffee", label: "Café", icon: Coffee },
    { value: "Briefcase", label: "Oficina", icon: Briefcase },
    { value: "Store", label: "Comercio", icon: Store },
    { value: "Car", label: "Automotriz", icon: Car },
    { value: "Home", label: "Hogar", icon: Home },
    { value: "Laptop", label: "Tecnología", icon: Laptop },
    { value: "Camera", label: "Fotografía", icon: Camera },
    { value: "Scissors", label: "Belleza", icon: Scissors },
    { value: "Pill", label: "Salud", icon: Pill },
    { value: "Building", label: "Construcción", icon: Building },
    { value: "Truck", label: "Transporte", icon: Truck },
];

// Opciones de colores
export const colorOptions = [
    { value: "bg-red-500", label: "Rojo", class: "bg-red-500" },
    { value: "bg-blue-500", label: "Azul", class: "bg-blue-500" },
    { value: "bg-green-500", label: "Verde", class: "bg-green-500" },
    { value: "bg-yellow-500", label: "Amarillo", class: "bg-yellow-500" },
    { value: "bg-purple-500", label: "Morado", class: "bg-purple-500" },
    { value: "bg-orange-500", label: "Naranja", class: "bg-orange-500" },
    { value: "bg-pink-500", label: "Rosa", class: "bg-pink-500" },
    { value: "bg-indigo-500", label: "Índigo", class: "bg-indigo-500" },
    { value: "bg-gray-600", label: "Gris", class: "bg-gray-600" },
    { value: "bg-teal-500", label: "Verde Azulado", class: "bg-teal-500" },
];

// Tipos para la respuesta de Strapi
export interface ComercioStrapiResponse {
    id: number;
    documentId: string;
    nombre: string;
    categoria: string;
    descripcion: string;
    direccion: string;
    telefono: string;
    horario: string;
    icon: string;
    color: string;
    especialidades: string[];
    rating?: number;
    estado: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
}

export interface StrapiApiResponse {
    data: ComercioStrapiResponse[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

// Tipo para el comercio procesado en el frontend
export interface Comercio {
    id: number;
    nombre: string;
    categoria: string;
    descripcion: string;
    direccion: string;
    telefono: string;
    horario: string;
    especialidades: string[];
    rating: number;
    icon: LucideIcon;
    color: string;
    estado: boolean;
}

// Tipo para crear un nuevo comercio
export interface NuevoComercio {
    nombre: string;
    categoria: string;
    descripcion: string;
    direccion: string;
    telefono: string;
    horario: string;
    icon: string;
    color: string;
    especialidades: string[];
}

// URL base de la API
const BASE_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";
const API_URL = `${BASE_URL}/api/comercios`;

// Función para transformar datos de Strapi al formato del frontend
function transformComercio(strapiComercio: ComercioStrapiResponse): Comercio {
    return {
        id: strapiComercio.id,
        nombre: strapiComercio.nombre,
        categoria: strapiComercio.categoria,
        descripcion: strapiComercio.descripcion,
        direccion: strapiComercio.direccion,
        telefono: strapiComercio.telefono,
        horario: strapiComercio.horario,
        especialidades: Array.isArray(strapiComercio.especialidades)
            ? strapiComercio.especialidades
            : [],
        rating: strapiComercio.rating || 4.0,
        icon: iconMap[strapiComercio.icon] || Store,
        color: strapiComercio.color || "bg-primary",
        estado: strapiComercio.estado,
    };
}

// Función principal para obtener comercios (solo los activos)
export async function getComercios(): Promise<Comercio[]> {
    try {
        const response = await fetch(`${API_URL}?filters[estado][$eq]=true&populate=*`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const result: StrapiApiResponse = await response.json();
        return result.data.map(transformComercio);

    } catch (error) {
        console.error("Error al obtener comercios:", error);
        throw new Error(
            error instanceof Error
                ? `No se pudo cargar los comercios: ${error.message}`
                : "Error desconocido al cargar los comercios"
        );
    }
}

// Función para obtener comercios por categoría (solo los activos)
export async function getComerciosByCategoria(categoria: string): Promise<Comercio[]> {
    try {
        const baseFilter = "filters[estado][$eq]=true";
        const url = categoria === "Todos"
            ? `${API_URL}?${baseFilter}&populate=*`
            : `${API_URL}?${baseFilter}&filters[categoria][$eq]=${encodeURIComponent(categoria)}&populate=*`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const result: StrapiApiResponse = await response.json();
        return result.data.map(transformComercio);

    } catch (error) {
        console.error("Error al obtener comercios por categoría:", error);
        throw new Error(
            error instanceof Error
                ? `No se pudo cargar los comercios: ${error.message}`
                : "Error desconocido al cargar los comercios"
        );
    }
}

// Función para verificar si Strapi está disponible
async function checkStrapiConnection(): Promise<boolean> {
    try {
        const response = await fetch(`${BASE_URL}/api/comercios?pagination[limit]=1`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.ok;
    } catch (error) {
        console.error('Strapi no está disponible:', error);
        return false;
    }
}

export async function crearComercio(comercio: NuevoComercio): Promise<Comercio> {
    try {
        // Verificar conexión con Strapi primero
        const strapiDisponible = await checkStrapiConnection();
        if (!strapiDisponible) {
            throw new Error('No se puede conectar con el servidor. Verifica que Strapi esté ejecutándose en http://localhost:1337');
        }

        // Estructura correcta para Strapi v4
        const payload = {
            data: {
                nombre: comercio.nombre,
                categoria: comercio.categoria,
                descripcion: comercio.descripcion,
                direccion: comercio.direccion,
                telefono: comercio.telefono,
                horario: comercio.horario,
                icon: comercio.icon,
                color: comercio.color,
                especialidades: comercio.especialidades,
                estado: false, // Por defecto false hasta que lo apruebe un administrador
            }
        };

        console.log('Enviando a:', API_URL);
        console.log('Payload:', JSON.stringify(payload, null, 2));

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);

            let errorMessage = `Error HTTP: ${response.status}`;

            try {
                const errorData = JSON.parse(errorText);
                if (errorData.error?.message) {
                    errorMessage = errorData.error.message;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error?.details) {
                    errorMessage = `Errores de validación: ${JSON.stringify(errorData.error.details)}`;
                }
            } catch (parseError) {
                errorMessage = `${errorMessage} - ${errorText}`;
            }

            throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Comercio creado exitosamente:', result);

        return transformComercio(result.data);

    } catch (error) {
        console.error("Error completo al crear comercio:", error);

        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            throw new Error('No se puede conectar con el servidor. Verifica que Strapi esté ejecutándose y que no haya problemas de red.');
        }

        throw new Error(
            error instanceof Error
                ? error.message
                : "Error desconocido al crear el comercio"
        );
    }
}

// Función para obtener un comercio específico por ID
export async function getComercioById(id: number): Promise<Comercio | null> {
    try {
        const response = await fetch(`${API_URL}/${id}?populate=*`);

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        return transformComercio(result.data);

    } catch (error) {
        console.error(`Error al obtener comercio ${id}:`, error);
        throw new Error(
            error instanceof Error
                ? `No se pudo cargar el comercio: ${error.message}`
                : "Error desconocido al cargar el comercio"
        );
    }
}