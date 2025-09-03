import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FolderKanban, Search } from "lucide-react";
import api, { ASSETS_URL } from "@/services/api";

interface Media {
  id: number;
  documentId: string;
  url: string;
  name: string;
}

interface Proyecto {
  id: number;
  documentId: string;
  nombre: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  media: Media[];
}

const ProyectosSection = () => {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("");
  const [fecha, setFecha] = useState("");

  const fetchProyectos = () => {
    let query = `/proyectos?populate[media][fields][0]=url&populate[media][fields][1]=name&sort=publishedAt:desc&pagination[page]=${page}&pagination[pageSize]=5`;

    if (search) query += `&filters[nombre][$containsi]=${search}`;
    if (estado) query += `&filters[estado][$eq]=${estado}`;
    if (fecha) query += `&filters[publishedAt][$gte]=${fecha}`;

    api
      .get<{ data: Proyecto[]; meta: { pagination: { pageCount: number } } }>(
        query
      )
      .then((res) => {
        setProyectos(res.data.data);
        setPageCount(res.data.meta.pagination.pageCount);
      })
      .catch((err) => {
        console.error("Error cargando proyectos", err);
      });
  };

  useEffect(() => {
    fetchProyectos();
  }, [page, search, estado, fecha]);

  // Mapeo de estado -> texto y color
  const estadoMap: Record<string, { label: string; color: string }> = {
    en_planificacion: { label: "En planificación", color: "bg-yellow-100 text-yellow-800" },
    en_ejecucion: { label: "En ejecución", color: "bg-blue-100 text-blue-800" },
    concluido: { label: "Concluido", color: "bg-green-100 text-green-800" },
  };

  return (
    <section id="proyectos" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Proyectos
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Conoce los proyectos en planificación, ejecución y concluidos de la municipalidad.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <div className="flex items-center gap-2 border rounded-lg px-3 py-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm"
            />
          </div>

          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="">Todos los estados</option>
            <option value="en_planificacion">En planificación</option>
            <option value="en_ejecucion">En ejecución</option>
            <option value="concluido">Concluido</option>
          </select>

          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm"
          />
        </div>

        {/* Lista de proyectos */}
        <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
          {proyectos.map((item) => {
            const imageUrl =
              item.media && item.media.length > 0
                ? `${ASSETS_URL}${item.media[0].url}`
                : null;

            const estadoInfo = estadoMap[item.estado] || {
              label: item.estado,
              color: "bg-gray-100 text-gray-800",
            };

            return (
              <div
                key={item.id}
                className="bg-card border border-border/50 rounded-xl p-3 shadow-sm hover:shadow-md transition flex items-center gap-3"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={item.media[0]?.name}
                    className="w-12 h-12 object-cover rounded-lg border"
                  />
                ) : (
                  <FolderKanban className="h-8 w-8 text-primary" />
                )}

                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground">
                    {item.nombre}
                  </h3>
                  <p
                    className={`inline-block text-xs font-medium px-2 py-0.5 rounded-lg ${estadoInfo.color}`}
                  >
                    {estadoInfo.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Publicado: {new Date(item.publishedAt).toLocaleDateString()}
                  </p>
                </div>

                <Link
                  to={`/proyectos/${item.documentId}`}
                  className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg shadow hover:bg-primary/80 transition"
                >
                  Ver
                </Link>
              </div>
            );
          })}
        </div>

        {/* Paginación */}
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg border text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-3 py-1 text-sm">
            Página {page} de {pageCount}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
            disabled={page === pageCount}
            className="px-3 py-1 rounded-lg border text-sm disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProyectosSection;
