import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";
import WelcomeCarouselModal from "@/components/WelcomeCarouselModal";
import QuickLinks from "@/components/QuickLinks";
import Header from "@/components/Header";


const Index = () => {
    return (
        <>


            <div className="min-h-screen bg-background overflow-x-hidden">

                <Header />
                {/* --- NUEVO CONTENEDOR --- */}
                <div className="relative">

                    <HeroSection />
                </div>
                {/* --- FIN DEL CONTENEDOR --- */}
                <WelcomeCarouselModal />
                <QuickLinks />
                <ServicesSection />
                <NewsSection />
                <Footer />
            </div>
        </>
    );
};

export default Index;