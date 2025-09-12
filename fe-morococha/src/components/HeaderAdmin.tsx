import { useNavigate } from "react-router-dom";
import { Building, ClipboardList, Activity, LogOut, Home } from "lucide-react";
import EscudoImage from "@/assets/logo_transparent.png";

const HeaderAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/login");
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/panel">
          <img
            src={EscudoImage}
            alt="Escudo de Morococha"
            className="h-12 w-auto object-contain"
          />
        </a>

        {/* Navegación */}
        <nav className="flex items-center space-x-6">
          <a
            href="/panel"
            className="flex items-center gap-2 text-sm xl:text-base text-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            <Home className="h-5 w-5" /> Inicio
          </a>
          <a
            href="/panel/obras"
            className="flex items-center gap-2 text-sm xl:text-base text-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            <Building className="h-5 w-5" /> Obras
          </a>
          <a
            href="/panel/servicios"
            className="flex items-center gap-2 text-sm xl:text-base text-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            <ClipboardList className="h-5 w-5" /> Servicios
          </a>
          <a
            href="/panel/actividades"
            className="flex items-center gap-2 text-sm xl:text-base text-foreground hover:text-primary transition-colors duration-200 font-medium"
          >
            <Activity className="h-5 w-5" /> Actividades
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm xl:text-base text-red-500 hover:text-red-700 transition-colors duration-200 font-medium"
          >
            <LogOut className="h-5 w-5" /> Cerrar sesión
          </button>
        </nav>
      </div>
    </header>
  );
};

export default HeaderAdmin;