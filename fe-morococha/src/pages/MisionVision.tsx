import Header from "@/components/Header";

const MisionVision = () => {
    return (
        <>
            <Header />
            <main className="pt-28">
                <section className="container mx-auto px-4">
                    <h1 className="text-3xl font-semibold text-foreground mb-6">Misión y Visión</h1>
                    <p className="text-muted-foreground mb-8">Conoce el propósito y el rumbo de la Municipalidad Distrital de Morococha.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-xl border border-border bg-card/80 backdrop-blur p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-3">Misión</h2>
                            <p className="text-muted-foreground">
                                Brindar servicios públicos de calidad, promoviendo el desarrollo sostenible, la inclusión social
                                y la participación vecinal para mejorar la calidad de vida de nuestra población.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-card/80 backdrop-blur p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-3">Visión</h2>
                            <p className="text-muted-foreground">
                                Ser un distrito moderno, seguro y próspero, referente regional por su gestión eficiente y
                                transparente, con ciudadanos comprometidos con su desarrollo.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default MisionVision;