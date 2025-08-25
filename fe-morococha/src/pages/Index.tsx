import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";
import RadioPlayer from "@/components/RadioPlayer";


const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <HeroSection />
            <ServicesSection />
            <NewsSection />
            <Footer />
            <RadioPlayer />
        </div>
    );
};

export default Index;
