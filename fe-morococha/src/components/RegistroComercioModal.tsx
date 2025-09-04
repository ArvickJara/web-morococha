import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Store, Plus, Trash2, Loader2, CheckCircle } from "lucide-react";
import { crearComercio, iconOptions, colorOptions, type NuevoComercio } from "@/services/comerciosService";

interface RegistroComercioModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const categorias = [
    "Restaurantes",
    "Abarrotes",
    "Ferretería",
    "Farmacia",
    "Servicios",
    "Servicios Profesionales",
    "Automotriz",
    "Belleza",
    "Tecnología",
    "Construcción",
    "Transporte",
    "Salud",
    "Educación"
];

export default function RegistroComercioModal({ isOpen, onClose, onSuccess }: RegistroComercioModalProps) {
    const [formData, setFormData] = useState<NuevoComercio>({
        nombre: "",
        categoria: "",
        descripcion: "",
        direccion: "",
        telefono: "",
        horario: "",
        icon: "Store",
        color: "bg-blue-500",
        especialidades: [""]
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Manejar cambios en inputs
    const handleInputChange = (field: keyof NuevoComercio, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Manejar especialidades
    const handleEspecialidadChange = (index: number, value: string) => {
        const nuevasEspecialidades = [...formData.especialidades];
        nuevasEspecialidades[index] = value;
        setFormData(prev => ({
            ...prev,
            especialidades: nuevasEspecialidades
        }));
    };

    const agregarEspecialidad = () => {
        setFormData(prev => ({
            ...prev,
            especialidades: [...prev.especialidades, ""]
        }));
    };

    const eliminarEspecialidad = (index: number) => {
        if (formData.especialidades.length > 1) {
            const nuevasEspecialidades = formData.especialidades.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                especialidades: nuevasEspecialidades
            }));
        }
    };

    // Validar formulario
    const validarFormulario = (): boolean => {
        if (!formData.nombre.trim()) return false;
        if (!formData.categoria) return false;
        if (!formData.descripcion.trim()) return false;
        if (!formData.direccion.trim()) return false;
        if (!formData.telefono.trim()) return false;
        if (!formData.horario.trim()) return false;
        if (formData.especialidades.filter(e => e.trim()).length === 0) return false;
        return true;
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validarFormulario()) {
            setError("Por favor, completa todos los campos obligatorios");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Filtrar especialidades vacías
            const comercioData: NuevoComercio = {
                ...formData,
                especialidades: formData.especialidades.filter(e => e.trim())
            };

            await crearComercio(comercioData);
            setSuccess(true);

            // Resetear formulario después de un breve delay
            setTimeout(() => {
                setSuccess(false);
                setFormData({
                    nombre: "",
                    categoria: "",
                    descripcion: "",
                    direccion: "",
                    telefono: "",
                    horario: "",
                    icon: "Store",
                    color: "bg-blue-500",
                    especialidades: [""]
                });
                onSuccess?.();
                onClose();
            }, 2000);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al registrar el comercio");
        } finally {
            setLoading(false);
        }
    };

    // Obtener icono seleccionado
    const iconSeleccionado = iconOptions.find(option => option.value === formData.icon);
    const IconComponent = iconSeleccionado?.icon || Store;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Store className="h-5 w-5 text-primary" />
                        Registrar Comercio
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                        disabled={loading}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>

                <CardContent>
                    {success ? (
                        <div className="text-center py-8">
                            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                ¡Comercio registrado exitosamente!
                            </h3>
                            <p className="text-muted-foreground">
                                Tu comercio está pendiente de aprobación. Será visible una vez que sea revisado por nuestro equipo.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                                    <p className="text-destructive text-sm">{error}</p>
                                </div>
                            )}

                            {/* Información básica */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre del comercio *</Label>
                                    <Input
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                                        placeholder="Ej: Restaurante Los Andes"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="categoria">Categoría *</Label>
                                    <Select
                                        value={formData.categoria}
                                        onValueChange={(value) => handleInputChange("categoria", value)}
                                        disabled={loading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona una categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categorias.map((categoria) => (
                                                <SelectItem key={categoria} value={categoria}>
                                                    {categoria}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción *</Label>
                                <Textarea
                                    id="descripcion"
                                    value={formData.descripcion}
                                    onChange={(e) => handleInputChange("descripcion", e.target.value)}
                                    placeholder="Describe tu comercio y los servicios que ofreces"
                                    rows={3}
                                    disabled={loading}
                                />
                            </div>

                            {/* Contacto y ubicación */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="direccion">Dirección *</Label>
                                    <Input
                                        id="direccion"
                                        value={formData.direccion}
                                        onChange={(e) => handleInputChange("direccion", e.target.value)}
                                        placeholder="Ej: Jr. Lima 123"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefono">Teléfono *</Label>
                                    <Input
                                        id="telefono"
                                        value={formData.telefono}
                                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                                        placeholder="Ej: 987654321"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="horario">Horario de atención *</Label>
                                <Input
                                    id="horario"
                                    value={formData.horario}
                                    onChange={(e) => handleInputChange("horario", e.target.value)}
                                    placeholder="Ej: 8:00 AM - 6:00 PM"
                                    disabled={loading}
                                />
                            </div>

                            {/* Personalización visual */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Icono</Label>
                                    <Select
                                        value={formData.icon}
                                        onValueChange={(value) => handleInputChange("icon", value)}
                                        disabled={loading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue>
                                                <div className="flex items-center gap-2">
                                                    <IconComponent className="h-4 w-4" />
                                                    {iconSeleccionado?.label}
                                                </div>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {iconOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        <option.icon className="h-4 w-4" />
                                                        {option.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Color</Label>
                                    <Select
                                        value={formData.color}
                                        onValueChange={(value) => handleInputChange("color", value)}
                                        disabled={loading}
                                    >
                                        <SelectTrigger>
                                            <SelectValue>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full ${formData.color}`}></div>
                                                    {colorOptions.find(c => c.value === formData.color)?.label}
                                                </div>
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {colorOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 rounded-full ${option.class}`}></div>
                                                        {option.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Especialidades */}
                            <div className="space-y-2">
                                <Label>Especialidades *</Label>
                                <div className="space-y-2">
                                    {formData.especialidades.map((especialidad, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={especialidad}
                                                onChange={(e) => handleEspecialidadChange(index, e.target.value)}
                                                placeholder="Ej: Comida típica"
                                                disabled={loading}
                                            />
                                            {formData.especialidades.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => eliminarEspecialidad(index)}
                                                    disabled={loading}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={agregarEspecialidad}
                                        disabled={loading}
                                        className="w-full"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar especialidad
                                    </Button>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="space-y-2">
                                <Label>Vista previa</Label>
                                <Card className="p-4 bg-muted/20">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-12 h-12 ${formData.color} rounded-xl flex items-center justify-center`}>
                                            <IconComponent className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">
                                                {formData.nombre || "Nombre del comercio"}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {formData.categoria || "Categoría"}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading || !validarFormulario()}
                                    className="flex-1"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Registrando...
                                        </>
                                    ) : (
                                        <>
                                            <Store className="h-4 w-4 mr-2" />
                                            Registrar comercio
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}