// ProyectoDetalle.tsx
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProyectoDetalleSection from "@/components/ProyectoDetalleSection";

const ProyectoDetalle = () => {
  const { documentId } = useParams<{ documentId: string }>();

  if (!documentId) return null;

  return (
    <div className="min-h-screen">
      <Header />
      <ProyectoDetalleSection documentId={documentId} />
      <Footer />
    </div>
  );
};

export default ProyectoDetalle;
