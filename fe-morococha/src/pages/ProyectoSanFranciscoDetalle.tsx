// ProyectoSanFranciscoDetalle.tsx
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProyectoSanFranciscoDetalleSection from "@/components/ProyectoSanFranciscoDetalleSection";

const ProyectoSanFranciscoDetalle = () => {
  const { documentId } = useParams<{ documentId: string }>();

  if (!documentId) return null;

  return (
    <div className="min-h-screen">
      <Header />
      <ProyectoSanFranciscoDetalleSection documentId={documentId} />
      <Footer />
    </div>
  );
};

export default ProyectoSanFranciscoDetalle;
