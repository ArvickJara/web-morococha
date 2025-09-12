import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeaderAdmin from "@/components/HeaderAdmin";
import Footer from "@/components/Footer";
import api from "@/services/api";
import { Building, ClipboardList, Activity } from "lucide-react";

const Panel = () => {
  const [subgerencia, setSubgerencia] = useState<string>("");
  const [descripcionSubgerencia, setDescripcionSubgerencia] = useState<string>("");

  useEffect(() => {
    const fetchSubgerencia = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return;

      api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

      try {
        const response = await api.get("/users/me?populate=subgerencia");
        setSubgerencia(response.data.subgerencia?.nombre || "Sin asignar");
        setDescripcionSubgerencia(response.data.subgerencia?.descripcion || "Sin descripción");
      } catch (err) {
        console.error("Error al obtener la subgerencia:", err);
      }
    };

    fetchSubgerencia();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderAdmin />
      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-lg text-gray-600">SUBGERENCIA: {subgerencia}</p>
          <p className="text-md text-gray-500 italic bg-gray-200 px-4 py-2 rounded-lg inline-block max-w-md">
            {descripcionSubgerencia}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <Link
            to="/panel/obras"
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition"
          >
            <Building className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold">Obras</h2>
          </Link>
          <Link
            to="/panel/servicios"
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition"
          >
            <ClipboardList className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold">Servicios</h2>
          </Link>
          <Link
            to="/panel/actividades"
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-lg transition"
          >
            <Activity className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold">Actividades</h2>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Panel;