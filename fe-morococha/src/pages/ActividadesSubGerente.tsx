import Footer from "@/components/Footer";
import HeaderAdmin from "@/components/HeaderAdmin";

import ActividadesSection from "@/components/ActividadesSubGerenteSection";

const Actividades = () => {
  return (
    <div className="min-h-screen">
      <HeaderAdmin />
      <ActividadesSection />
      <Footer />
    </div>
  );
};

export default Actividades;