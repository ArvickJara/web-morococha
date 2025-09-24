import Header from "@/components/Header";

const Historia = () => {
    return (
        <>
            <Header />
            <main className="pt-28">
                <section className="container mx-auto px-4">
                    <h1 className="text-3xl font-semibold text-foreground mb-6">Historia</h1>
                    <p className="text-muted-foreground mb-8">
                        Un recorrido por los orígenes y la evolución del distrito de Morococha.
                    </p>

                    <div className="space-y-6">
                        <div className="rounded-xl border border-border bg-card/80 backdrop-blur p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-2">Orígenes</h2>
                            <p className="text-muted-foreground">
                                Texto histórico introductorio. Agrega aquí la información oficial, fechas clave y antecedentes.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-card/80 backdrop-blur p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-2">Línea de tiempo</h2>
                            <ul className="space-y-3 text-muted-foreground">
                                <li>• Año XXXX — Hito importante 1</li>
                                <li>• Año XXXX — Hito importante 2</li>
                                <li>• Año XXXX — Hito importante 3</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Historia;