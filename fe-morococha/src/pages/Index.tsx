import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";
import RadioPlayer from "@/components/RadioPlayer";
import WelcomeCarouselModal from "@/components/WelcomeCarouselModal";
import QuickLinks from "@/components/QuickLinks";

const Index = () => {
    return (
        <>
            <WelcomeCarouselModal />
            <Header />
            <div className="min-h-screen bg-background overflow-x-hidden">
                <HeroSection />
                <QuickLinks />
                <ServicesSection />
                <NewsSection />
                <Footer />
                <RadioPlayer />
            </div>
        </>
    );
};

export default Index;