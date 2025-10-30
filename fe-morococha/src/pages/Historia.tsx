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
                                La historia de Morococha como centro poblado comenzó a tomar forma al menos desde el siglo XVIII, con el desarrollo de una importante actividad minera en la zona. Esto llevó incluso a la apertura de una Caja Real (oficina fiscal) en San Juan de Matucana en 1721.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-card/80 backdrop-blur p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-2">Creación Distrital</h2>
                            <p className="text-muted-foreground">
                                Creación Distrital: El Distrito de Morococha fue creado oficialmente por Ley N° 682 el 21 de noviembre de 1907, durante el gobierno de José Pardo y Barreda, en la provincia de Yauli (Departamento de Junín).
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-card/80 backdrop-blur p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-2">El Proyecto Toromocho</h2>
                            <p className="text-muted-foreground">
                                El Proyecto Toromocho: La empresa china Minera Chinalco Perú adquirió el proyecto, cuya explotación a tajo abierto requería la reubicación de la ciudad. A partir del año 2006 se iniciaron las negociaciones para el reasentamiento de los aproximadamente 5,000 habitantes.
                            </p>
                        </div>

                        <div className="rounded-xl border border-border bg-card/80 backdrop-blur p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-2">Construcción de Nueva Morococha</h2>
                            <p className="text-muted-foreground">
                                Construcción de Nueva Morococha: Chinalco construyó una nueva ciudad, conocida como Nueva Morococha (oficialmente en el sector de Carhuacoto, a unos 12 km de la antigua). La nueva ciudad fue inaugurada en octubre de 2012, dando inicio al proceso de traslado.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Historia;