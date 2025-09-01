import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConvocatoriaDetalleSection from "@/components/ConvocatoriaDetalleSection";

const ConvocatoriaDetalle = () => {
  const { documentId } = useParams<{ documentId: string }>();

  if (!documentId) return null;

  return (
    <div className="min-h-screen">
      <Header />
      <ConvocatoriaDetalleSection documentId={documentId} />
      <Footer />
    </div>
  );
};

export default ConvocatoriaDetalle;
