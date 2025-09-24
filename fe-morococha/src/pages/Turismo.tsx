import Header from "@/components/Header";

const Turismo = () => {
    return (
        <>
            <Header />
            <main className="pt-28">
                <section className="container mx-auto px-4">
                    <h1 className="text-3xl font-semibold text-foreground mb-6">Turismo</h1>
                    <p className="text-muted-foreground mb-8">
                        Lugares turísticos, paisajes y experiencias que ofrece Morococha.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <article key={i} className="rounded-xl border border-border bg-card/80 backdrop-blur p-4 shadow-sm">
                                <div className="aspect-video w-full rounded-lg bg-muted mb-3" />
                                <h3 className="font-semibold text-foreground">Atractivo turístico {i}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Breve descripción del atractivo. Reemplaza con contenido real e imágenes.
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Turismo;