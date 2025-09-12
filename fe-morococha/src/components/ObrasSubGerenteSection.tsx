import { useEffect, useState } from "react";
import api, { ASSETS_URL } from "@/services/api";
import Modal from "@/components/Modal";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface Media {
  id: number;
  name: string;
  url: string;
  mime: string;
}

interface MediaWithFile {
  id: number;
  documentId: string;
  name: string;
  url: string;
  file?: File;
}

interface Obra {
  id: number;
  nombre: string;
  descripcion: string;
  estado: string;
  documentId: string;
  media: Array<number | MediaWithFile>;
}

const ObrasSection = () => {
  const [obras, setObras] = useState<Obra[]>([]);
  const [error, setError] = useState("");
  const [documentId, setDocumentId] = useState<string>("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedObra, setSelectedObra] = useState<Obra | null>(null);
  const [newObra, setNewObra] = useState({
    nombre: "",
    descripcion: "",
    estado: "en_planificacion",
    media: [] as (number | File)[],
  });
  const [markdownPreview, setMarkdownPreview] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [availableMedia, setAvailableMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelectingMedia, setIsSelectingMedia] = useState(true);

  // Cargar subgerencia
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

  // Cargar obras
  useEffect(() => {
    if (!documentId) return;
    const fetchObras = async () => {
      setIsLoading(true);
      try {
        const obrasResponse = await api.get(
          `/obras-subgerencias?filters[subgerencia][documentId][$eq]=${documentId}&populate=media`
        );
        const mappedObras = obrasResponse.data.data.map((obra: any) => ({
          id: obra.id,
          documentId: obra.documentId,
          nombre: obra.nombre,
          descripcion: obra.descripcion,
          estado: obra.estado,
          media: obra.media?.map((mediaItem: any) => ({
            id: mediaItem.id,
            documentId: mediaItem.documentId,
            name: mediaItem.name,
            url: mediaItem.url,
          })) || [],
        }));
        setObras(mappedObras);
      } catch (err) {
        setError("Error al cargar las obras.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchObras();
  }, [documentId]);

  // Fetch available media
  useEffect(() => {
    const fetchMedia = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return;

      try {
        const response = await api.get("/upload/files", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setAvailableMedia(response.data);
      } catch (error) {
        console.error("Error al obtener los medios disponibles:", error);
      }
    };

    fetchMedia();
  }, []);

  // Agregar obra
  const handleAddObra = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    let uploadedMediaIds: number[] = [];

    const filesToUpload = newObra.media.filter((item): item is File => item instanceof File);

    if (filesToUpload.length > 0) {
      const formData = new FormData();
      filesToUpload.forEach((file) => {
        formData.append("files", file);
      });

      try {
        const uploadResponse = await api.post("/upload", formData, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        uploadedMediaIds = uploadResponse.data.map((media: Media) => media.id);

        // Refresh available media after uploading
        const updatedMediaResponse = await api.get("/upload/files", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setAvailableMedia(updatedMediaResponse.data);
      } catch (error) {
        console.error("Error al subir archivos:", error);
        return;
      }
    }

    const obraData = {
      nombre: newObra.nombre,
      descripcion: newObra.descripcion,
      estado: newObra.estado,
      subgerencia: {
        connect: [{ documentId }],
      },
      media: [...uploadedMediaIds, ...newObra.media.filter((item): item is number => typeof item === "number")],
    };

    try {
      await api.post("/obras-subgerencias", { data: obraData }, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      await refreshObras();
      setIsAddModalOpen(false);
      setNewObra({ nombre: "", descripcion: "", estado: "en_planificacion", media: [] });
    } catch (error) {
      console.error("Error al agregar obra:", error);
    }
  };

  // Editar obra
  const handleEditObra = async () => {
    if (!selectedObra) return;
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;

    const filesToUpload = selectedObra.media.filter(
      (item): item is MediaWithFile => typeof item === "object" && "file" in item && item.file instanceof File
    );
    let uploadedMediaIds: number[] = [];

    if (filesToUpload.length > 0) {
      const formData = new FormData();
      filesToUpload.forEach((fileWrapper) => {
        formData.append("files", fileWrapper.file!);
      });

      try {
        const uploadResponse = await api.post("/upload", formData, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        uploadedMediaIds = uploadResponse.data.map((media: Media) => media.id);
      } catch (error) {
        console.error("Error al subir archivos:", error);
        return;
      }
    }

    const obraData = {
      nombre: selectedObra.nombre,
      descripcion: selectedObra.descripcion,
      estado: selectedObra.estado,
      media: [
        ...uploadedMediaIds,
        ...selectedObra.media
          .filter((item): item is number | MediaWithFile => typeof item === "number" || (typeof item === "object" && !("file" in item)))
          .map((item) => (typeof item === "number" ? item : item.id)),
      ],
    };

    try {
      await api.put(
        `/obras-subgerencias/${selectedObra.documentId}`,
        { data: obraData },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      await refreshObras();
      setIsEditModalOpen(false);
      setSelectedObra(null);
    } catch (error) {
      console.error("Error al editar obra:", error);
    }
  };

  // Eliminar obra
  const handleDeleteObra = async () => {
    if (!selectedObra) return;
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return;
    try {
      await api.delete(`/obras-subgerencias/${selectedObra.documentId}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setObras(obras.filter((obra) => obra.id !== selectedObra.id));
      setIsDeleteModalOpen(false);
      setSelectedObra(null);
    } catch (error) {
      console.error("Error al eliminar obra:", error);
    }
  };

  const handleFileInput = (files: FileList) => {
    const newFiles = Array.from(files).map((file) => ({
      id: Date.now(), // Temporary unique ID
      documentId: "temp",
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));
    setSelectedObra({
      ...selectedObra!,
      media: [...selectedObra!.media, ...newFiles],
    });
  };

  const renderMediaItem = (mediaItem: number | MediaWithFile) => {
    if (typeof mediaItem === "number") return null;

    const url = "file" in mediaItem ? mediaItem.url : `${ASSETS_URL}${mediaItem.url}`;
    const name = "file" in mediaItem ? mediaItem.name : mediaItem.name;

    return url.endsWith(".mp4") ? (
      <div
        key={mediaItem.id}
        className="w-16 h-16 object-cover rounded cursor-pointer border bg-black flex items-center justify-center"
        onClick={() => setImagePreview(url)}
      >
        <span className="text-white text-sm">Video</span>
      </div>
    ) : (
      <img
        key={mediaItem.id}
        src={url}
        alt={name}
        className="w-16 h-16 object-cover rounded cursor-pointer border"
        onClick={() => setImagePreview(url)}
      />
    );
  };

  // Added refresh logic after adding or editing an obra
  const refreshObras = async () => {
    setIsLoading(true);
    try {
      const obrasResponse = await api.get(
        `/obras-subgerencias?filters[subgerencia][documentId][$eq]=${documentId}&populate=media`
      );
      const mappedObras = obrasResponse.data.data.map((obra: any) => ({
        id: obra.id,
        documentId: obra.documentId,
        nombre: obra.nombre,
        descripcion: obra.descripcion,
        estado: obra.estado,
        media: obra.media?.map((mediaItem: any) => ({
          id: mediaItem.id,
          documentId: mediaItem.documentId,
          name: mediaItem.name,
          url: mediaItem.url,
        })) || [],
      }));
      setObras(mappedObras);
    } catch (err) {
      setError("Error al cargar las obras.");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter available media to show only images and videos
  const filteredAvailableMedia = availableMedia.filter(
    (media) => media.mime.startsWith("image") || media.mime.startsWith("video")
  );

  if (error) return <p className="text-red-500">{error}</p>;
  if (isLoading) return <p className="text-center py-12">Cargando...</p>;

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
          <h2 className="text-2xl font-bold mb-6 text-center">GESTIONAR OBRAS</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mb-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Agregar Obra
          </button>

          {obras.length === 0 ? (
            <p className="text-center">No hay obras disponibles.</p>
          ) : (
            <table className="w-full border text-center">
              <thead>
                <tr>
                  <th className="px-4 py-2">Nombre</th>
                  <th className="px-4 py-2">Descripción</th>
                  <th className="px-4 py-2">Estado</th>
                  <th className="px-4 py-2">Imágenes</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {obras.map((obra) => (
                  <tr key={obra.id}>
                    <td className="px-4 py-2">{obra.nombre}</td>
                    <td className="px-4 py-2 max-w-xs truncate">
                      {obra.descripcion ? (
                        <>
                          <ReactMarkdown>{obra.descripcion}</ReactMarkdown>
                          <button
                            onClick={() => setMarkdownPreview(obra.descripcion)}
                            className="text-blue-500 underline mt-2"
                          >
                            Ver descripción completa
                          </button>
                        </>
                      ) : (
                        <p className="text-gray-500 italic">Sin descripción</p>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          obra.estado === "en_planificacion"
                            ? "bg-yellow-500"
                            : obra.estado === "en_ejecucion"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      >
                        {obra.estado === "en_planificacion"
                          ? "En Planificación"
                          : obra.estado === "en_ejecucion"
                          ? "En Ejecución"
                          : "Concluido"}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2 justify-center">
                      {obra.media.filter((item): item is { id: number; documentId: string; name: string; url: string } =>
                        typeof item !== "number" && "documentId" in item
                      ).map((mediaItem) =>
                        renderMediaItem(mediaItem)
                      )}
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => {
                          setSelectedObra(obra);
                          setIsEditModalOpen(true);
                        }}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-400"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedObra(obra);
                          setIsDeleteModalOpen(true);
                        }}
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

      {/* Modal de imagen */}
      {imagePreview && (
        <Modal onClose={() => setImagePreview(null)}>
          {imagePreview.endsWith(".mp4") ? (
            <video
              src={imagePreview}
              controls
              autoPlay
              className="max-w-full max-h-[80vh] mx-auto rounded"
            >
              Tu navegador no soporta la reproducción de video.
            </video>
          ) : (
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-[80vh] mx-auto rounded"
            />
          )}
        </Modal>
      )}

      {/* Modal para agregar */}
      {isAddModalOpen && (
        <Modal onClose={() => setIsAddModalOpen(false)}>
          <h2>Agregar Obra</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddObra();
            }}
          >
            <input
              type="text"
              value={newObra.nombre}
              onChange={(e) => setNewObra({ ...newObra, nombre: e.target.value })}
              placeholder="Nombre de la obra"
              className="w-full mb-4 px-4 py-2 border rounded"
            />
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
              >
                {isPreview ? "Editar" : "Previsualizar"}
              </button>
              {isPreview ? (
                <div className="prose border p-4 rounded">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {newObra.descripcion}
                  </ReactMarkdown>
                </div>
              ) : (
                <textarea
                  value={newObra.descripcion}
                  onChange={(e) =>
                    setNewObra({ ...newObra, descripcion: e.target.value })
                  }
                  placeholder="Descripción (Markdown soportado)"
                  className="w-full px-4 py-2 border rounded"
                ></textarea>
              )}
            </div>
            {/* Media selection and upload */}
            <div className="mb-4">
              <p className="font-semibold mb-2">Multimedia:</p>
              <div className="flex items-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setIsSelectingMedia(true)}
                  className={`px-4 py-2 rounded ${isSelectingMedia ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  Seleccionar existente
                </button>
                <button
                  type="button"
                  onClick={() => setIsSelectingMedia(false)}
                  className={`px-4 py-2 rounded ${!isSelectingMedia ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  Cargar nuevo
                </button>
              </div>
              {isSelectingMedia ? (
                <div className="flex gap-2 flex-wrap mb-4">
                  {filteredAvailableMedia.map((media) => (
                    <div
                      key={media.id}
                      className={`w-16 h-16 border rounded cursor-pointer ${
                        newObra.media?.includes(media.id) ? "border-blue-500" : "border-gray-300"
                      }`}
                      onClick={() => {
                        if (newObra.media?.includes(media.id)) {
                          setNewObra({
                            ...newObra,
                            media: newObra.media.filter((id) => id !== media.id),
                          });
                        } else {
                          setNewObra({
                            ...newObra,
                            media: [...(newObra.media || []), media.id],
                          });
                        }
                      }}
                    >
                      {media.mime.startsWith("image") ? (
                        <img
                          src={`${ASSETS_URL}${media.url}`}
                          alt={media.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <video
                          src={`${ASSETS_URL}${media.url}`}
                          className="w-full h-full object-cover rounded"
                          controls
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      setNewObra({ ...newObra, media: [...newObra.media, ...Array.from(e.target.files)] });
                    }
                  }}
                  className="w-full px-4 py-2 border rounded"
                />
              )}
            </div>
            <select
              value={newObra.estado}
              onChange={(e) => setNewObra({ ...newObra, estado: e.target.value })}
              className="w-full mb-4 px-4 py-2 border rounded"
            >
              <option value="en_planificacion">En Planificación</option>
              <option value="en_ejecucion">En Ejecución</option>
              <option value="concluido">Concluido</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
              Guardar
            </button>
          </form>
        </Modal>
      )}

      {/* Modal para editar */}
      {isEditModalOpen && selectedObra && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <h2>Editar Obra</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleEditObra();
            }}
          >
            <input
              type="text"
              value={selectedObra.nombre}
              onChange={(e) =>
                setSelectedObra({ ...selectedObra, nombre: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border rounded"
            />
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="px-4 py-2 bg-blue-500 text-white rounded mb-2"
              >
                {isPreview ? "Editar" : "Previsualizar"}
              </button>
              {isPreview ? (
                <div className="prose border p-4 rounded">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                    {selectedObra.descripcion}
                  </ReactMarkdown>
                </div>
              ) : (
                <textarea
                  value={selectedObra.descripcion}
                  onChange={(e) =>
                    setSelectedObra({ ...selectedObra, descripcion: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                ></textarea>
              )}
            </div>
            <select
              value={selectedObra.estado}
              onChange={(e) =>
                setSelectedObra({ ...selectedObra, estado: e.target.value })
              }
              className="w-full mb-4 px-4 py-2 border rounded"
            >
              <option value="en_planificacion">En Planificación</option>
              <option value="en_ejecucion">En Ejecución</option>
              <option value="concluido">Concluido</option>
            </select>
            {/* Media selection and upload */}
            <div className="mb-4">
              <p className="font-semibold mb-2">Seleccionar o cargar multimedia:</p>
              <div className="flex items-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setIsSelectingMedia(true)}
                  className={`px-4 py-2 rounded ${isSelectingMedia ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  Seleccionar existente
                </button>
                <button
                  type="button"
                  onClick={() => setIsSelectingMedia(false)}
                  className={`px-4 py-2 rounded ${!isSelectingMedia ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  Cargar nuevo
                </button>
              </div>
              {isSelectingMedia ? (
                <div className="flex gap-2 flex-wrap mb-4">
                  {filteredAvailableMedia.map((media) => (
                    <div
                      key={media.id}
                      className={`w-16 h-16 border rounded cursor-pointer ${
                        selectedObra?.media.some(
                          (item) => typeof item === "number" ? item === media.id : item.id === media.id
                        ) ? "border-blue-500" : "border-gray-300"
                      }`}
                      onClick={() => {
                        if (selectedObra?.media.some(
                          (item) => typeof item === "number" ? item === media.id : item.id === media.id
                        )) {
                          setSelectedObra({
                            ...selectedObra,
                            media: selectedObra.media.filter(
                              (item) => typeof item === "number" ? item !== media.id : item.id !== media.id
                            ),
                          });
                        } else {
                          setSelectedObra({
                            ...selectedObra,
                            media: [...selectedObra.media, media.id],
                          });
                        }
                      }}
                    >
                      {media.mime.startsWith("image") ? (
                        <img
                          src={`${ASSETS_URL}${media.url}`}
                          alt={media.name}
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <video
                          src={`${ASSETS_URL}${media.url}`}
                          className="w-full h-full object-cover rounded"
                          controls
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleFileInput(e.target.files);
                    }
                  }}
                  className="w-full px-4 py-2 border rounded"
                />
              )}
            </div>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
              Guardar
            </button>
          </form>
        </Modal>
      )}

      {/* Modal para eliminar */}
      {isDeleteModalOpen && (
        <Modal onClose={() => setIsDeleteModalOpen(false)}>
          <h2>Confirmar Eliminación</h2>
          <p>¿Estás seguro de que deseas eliminar esta obra?</p>
          <button
            onClick={handleDeleteObra}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Eliminar
          </button>
        </Modal>
      )}

      {/* Modal para vista completa de descripción */}
      {markdownPreview && (
        <Modal onClose={() => setMarkdownPreview(null)}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[90%] h-[80%] bg-white rounded-lg shadow-lg overflow-y-auto p-8">
              <h2 className="text-3xl font-bold mb-6">Descripción Completa</h2>
              <div className="prose max-w-none break-words">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{markdownPreview}</ReactMarkdown>
              </div>
              <button
                onClick={() => setMarkdownPreview(null)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ObrasSection;
