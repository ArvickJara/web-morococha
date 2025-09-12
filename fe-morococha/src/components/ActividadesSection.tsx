import { useEffect, useState } from "react";
import api from "@/services/api";
import Modal from "@/components/Modal";

interface Actividad {
  id: number;
  descripcion: string;
  documentId: string;
}

const ActividadesSection = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [error, setError] = useState("");
  const [documentId, setDocumentId] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState<Actividad | null>(null);
  const [newActividad, setNewActividad] = useState({ descripcion: "" });

  useEffect(() => {
    const fetchSubgerencia = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        setError("No tienes acceso a esta sección.");
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      try {
        const userResponse = await api.get("/users/me?populate=subgerencia");
        const subgerenciaDocumentId = userResponse.data.subgerencia?.documentId;

        if (!subgerenciaDocumentId) {
          setError("No tienes una subgerencia asignada.");
          return;
        }

        setDocumentId(subgerenciaDocumentId);
      } catch (err) {
        setError("Error al obtener la subgerencia.");
      }
    };

    fetchSubgerencia();
  }, []);

  useEffect(() => {
    if (!documentId) return;

    const fetchActividades = async () => {
      try {
        const actividadesResponse = await api.get(
          `/actividades-subgerencias?filters[subgerencia][documentId][$eq]=${documentId}&populate=*&sort=createdAt:desc`
        );
        setActividades(actividadesResponse.data.data);
      } catch (err) {
        setError("Error al cargar las actividades.");
      }
    };

    fetchActividades();
  }, [documentId]);

  const handleAdd = () => setIsAddModalOpen(true);
  const handleEdit = (actividad: Actividad) => {
    setSelectedActividad(actividad);
    setIsEditModalOpen(true);
  };
  const handleDelete = (actividad: Actividad) => {
    setSelectedActividad(actividad);
    setIsDeleteModalOpen(true);
  };

  const handleAddActividad = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
      const response = await api.post("/actividades-subgerencias", {
        data: {
          descripcion: newActividad.descripcion,
          subgerencia: {
            connect: [{ documentId }],
          },
        },
      });
      setActividades([response.data.data, ...actividades]);
      setIsAddModalOpen(false);
      setNewActividad({ descripcion: "" });
    } catch (error) {
      console.error("Error al agregar actividad:", error);
    }
  };

  const handleDeleteActividad = async () => {
    if (!selectedActividad) return;

    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
      await api.delete(`/actividades-subgerencias/${selectedActividad.documentId}`);
      setActividades(actividades.filter((actividad) => actividad.id !== selectedActividad.id));
      setIsDeleteModalOpen(false);
      setSelectedActividad(null);
    } catch (error) {
      console.error("Error al eliminar actividad:", error);
    }
  };

  const handleEditActividad = async () => {
    if (!selectedActividad) return;

    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
      const response = await api.put(`/actividades-subgerencias/${selectedActividad.documentId}`, {
        data: {
          descripcion: selectedActividad.descripcion,
        },
      });
      setActividades(
        actividades.map((actividad) =>
          actividad.id === selectedActividad.id ? response.data.data : actividad
        )
      );
      setIsEditModalOpen(false);
      setSelectedActividad(null);
    } catch (error) {
      console.error("Error al editar actividad:", error);
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4">
      <main className="flex-grow w-full max-w-4xl">
        <section className="py-12">
          <button
            onClick={() => window.location.href = '/panel'}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400"
          >
            Volver
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center">GESTIONAR ACTIVIDADES</h2>
          <button
            onClick={handleAdd}
            className="mb-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Agregar Actividad
          </button>
          {actividades.length === 0 ? (
            <p className="text-center">No hay actividades disponibles.</p>
          ) : (
            <table className="w-full border text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2">Descripción</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {actividades.map((actividad) => (
                  <tr key={actividad.id}>
                    <td className="px-4 py-2">{actividad.descripcion}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(actividad)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-400"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(actividad)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-400"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {/* Modal para agregar */}
      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <h2>Agregar Actividad</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleAddActividad(); }}>
            <textarea
              value={newActividad.descripcion}
              onChange={(e) => setNewActividad({ descripcion: e.target.value })}
              placeholder="Descripción de la actividad"
              className="w-full mb-4 px-4 py-2 border rounded"
            ></textarea>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Guardar
            </button>
          </form>
        </Modal>
      )}

      {/* Modal para editar */}
      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <h2>Editar Actividad</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditActividad();
            }}
          >
            <textarea
              value={selectedActividad?.descripcion || ""}
              onChange={(e) =>
                setSelectedActividad({ ...selectedActividad, descripcion: e.target.value } as Actividad)
              }
              className="w-full mb-4 px-4 py-2 border rounded"
            ></textarea>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded"
            >
              Guardar
            </button>
          </form>
        </Modal>
      )}

      {/* Modal para eliminar */}
      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <h2>Confirmar Eliminación</h2>
          <p>¿Estás seguro de que deseas eliminar esta actividad?</p>
          <button
            onClick={handleDeleteActividad}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Eliminar
          </button>
        </Modal>
      )}
    </div>
  );
};

export default ActividadesSection;