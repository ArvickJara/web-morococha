import { useEffect, useState } from "react";
import api from "@/services/api";
import Modal from "@/components/Modal";

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  documentId: string;
}

const ServiciosSection = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [error, setError] = useState("");
  const [documentId, setDocumentId] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [newServicio, setNewServicio] = useState({ nombre: "", descripcion: "" });

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

    const fetchServicios = async () => {
      try {
        const serviciosResponse = await api.get(
          `/servicios-subgerencias?filters[subgerencia][documentId][$eq]=${documentId}&populate=*`
        );
        setServicios(serviciosResponse.data.data);
      } catch (err) {
        setError("Error al cargar los servicios.");
      }
    };

    fetchServicios();
  }, [documentId]);

  const handleAdd = () => setIsAddModalOpen(true);
  const handleEdit = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setIsEditModalOpen(true);
  };
  const handleDelete = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setIsDeleteModalOpen(true);
  };

  const handleAddServicio = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
      const response = await api.post("/servicios-subgerencias", {
        data: {
          ...newServicio,
          subgerencia: {
            connect: [{ documentId }],
          },
        },
      });
      setServicios([response.data.data, ...servicios]);
      setIsAddModalOpen(false);
      setNewServicio({ nombre: "", descripcion: "" });
    } catch (error) {
      console.error("Error al agregar servicio:", error);
    }
  };

  const handleEditServicio = async () => {
    if (!selectedServicio) return;

    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
      const response = await api.put(`/servicios-subgerencias/${selectedServicio.documentId}`, {
        data: {
          nombre: selectedServicio.nombre,
          descripcion: selectedServicio.descripcion,
        },
      });
      setServicios(
        servicios.map((servicio) =>
          servicio.id === selectedServicio.id ? response.data.data : servicio
        )
      );
      setIsEditModalOpen(false);
      setSelectedServicio(null);
    } catch (error) {
      console.error("Error al editar servicio:", error);
    }
  };

  const handleDeleteServicio = async () => {
    if (!selectedServicio) return;

    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
      await api.delete(`/servicios-subgerencias/${selectedServicio.documentId}`);
      setServicios(servicios.filter((servicio) => servicio.id !== selectedServicio.id));
      setIsDeleteModalOpen(false);
      setSelectedServicio(null);
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
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
          <h2 className="text-2xl font-bold mb-6 text-center">GESTIONAR SERVICIOS</h2>
          <button
            onClick={handleAdd}
            className="mb-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Agregar Servicio
          </button>
          {servicios.length === 0 ? (
            <p className="text-center">No hay servicios disponibles.</p>
          ) : (
            <table className="w-full border text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Descripción</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((servicio) => (
                  <tr key={servicio.id}>
                    <td className="px-4 py-2">{servicio.nombre}</td>
                    <td className="px-4 py-2">{servicio.descripcion}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(servicio)}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-400"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(servicio)}
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
          <h2>Agregar Servicio</h2>
          <input
            type="text"
            value={newServicio.nombre}
            onChange={(e) => setNewServicio({ ...newServicio, nombre: e.target.value })}
            placeholder="Nombre del servicio"
            className="w-full mb-4 px-4 py-2 border rounded"
          />
          <textarea
            value={newServicio.descripcion}
            onChange={(e) => setNewServicio({ ...newServicio, descripcion: e.target.value })}
            placeholder="Descripción"
            className="w-full mb-4 px-4 py-2 border rounded"
          />
          <button
            onClick={handleAddServicio}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Guardar
          </button>
        </Modal>
      )}

      {/* Modal para editar */}
      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <h2>Editar Servicio</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditServicio();
            }}
          >
            <input
              type="text"
              value={selectedServicio?.nombre || ""}
              onChange={(e) =>
                setSelectedServicio({ ...selectedServicio, nombre: e.target.value } as Servicio)
              }
              className="w-full mb-4 px-4 py-2 border rounded"
            />
            <textarea
              value={selectedServicio?.descripcion || ""}
              onChange={(e) =>
                setSelectedServicio({ ...selectedServicio, descripcion: e.target.value } as Servicio)
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
          <p>¿Estás seguro de que deseas eliminar este servicio?</p>
          <button
            onClick={handleDeleteServicio}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Eliminar
          </button>
        </Modal>
      )}
    </div>
  );
};

export default ServiciosSection;