import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import { FALLBACK_IMAGE, getCaruuselTurismosByTurismoIds, getTurismos, imageUrl } from "@/services/turismoService";
import type { Turismo, Media } from "@/services/turismoService";

type Paginacion = { page: number; pageCount: number; pageSize: number };

const Turismo = () => {
    const [items, setItems] = useState<Turismo[]>([]);
    // Si se necesita paginación futura, aquí guardamos meta
    const [_meta, setMeta] = useState<Paginacion>({ page: 1, pageCount: 1, pageSize: 12 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lightbox, setLightbox] = useState<{ item: Turismo; index: number } | null>(null);

    useEffect(() => {
        let mounted = true;
        async function fetchAll() {
            try {
                setLoading(true);
                setError(null);
                const { items: turis, meta } = await getTurismos(1, 12);
                if (!mounted) return;

                // Asociar carruseles a cada turismo por documentId o id
                const docIds = turis.map((t) => t.documentId).filter(Boolean) as string[];
                const ids = turis.map((t) => String(t.id));
                const keys = Array.from(new Set([...docIds, ...ids]));
                const byKey = await getCaruuselTurismosByTurismoIds(keys);

                const merged = turis.map((t) => {
                    const fromDoc = t.documentId ? byKey[t.documentId] : undefined;
                    const fromId = byKey[String(t.id)];
                    const imgs = (fromDoc && fromDoc.length ? fromDoc : fromId) ?? t.imagenes ?? [];
                    return { ...t, imagenes: imgs };
                });

                setItems(merged);
                setMeta(meta);
            } catch (e) {
                setError("No se pudieron cargar los lugares turísticos.");
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <>
            <Header />
            <main className="pt-28">
                <section className="container mx-auto px-4">
                    <h1 className="text-3xl font-semibold text-foreground mb-6">Turismo</h1>
                    <p className="text-muted-foreground mb-8">
                        Lugares turísticos, paisajes y experiencias que ofrece Morococha.
                    </p>

                    {loading && (
                        <div className="text-muted-foreground">Cargando lugares…</div>
                    )}
                    {error && (
                        <div className="text-red-500">{error}</div>
                    )}

                    {!loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {items.map((t) => (
                                <TurismoCard
                                    key={`${t.documentId ?? t.id}`}
                                    item={t}
                                    onOpenLightbox={(index) => setLightbox({ item: t, index })}
                                />
                            ))}
                        </div>
                    )}
                </section>
                {lightbox && (
                    <LightboxModal
                        images={lightbox.item.imagenes ?? []}
                        title={lightbox.item.nombre_lugar_turistico}
                        startIndex={lightbox.index}
                        onClose={() => setLightbox(null)}
                    />
                )}
            </main>
        </>
    );
};

export default Turismo;

function TurismoCard({ item, onOpenLightbox }: { item: Turismo; onOpenLightbox: (index: number) => void }) {
    // Carrusel simple: auto-rotación leve + controles básicos
    const imgs = useMemo(() => item.imagenes ?? [], [item.imagenes]);
    const [idx, setIdx] = useState(0);
    const total = imgs.length;

    useEffect(() => {
        if (total <= 1) return;
        const id = setInterval(() => setIdx((p) => (p + 1) % total), 3500);
        return () => clearInterval(id);
    }, [total]);

    const currentUrl = total > 0 ? imageUrl(imgs[idx]) : FALLBACK_IMAGE;

    return (
        <article className="rounded-xl border border-border bg-card/80 backdrop-blur p-4 shadow-sm">
            <div
                className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted mb-3 cursor-zoom-in"
                onClick={() => onOpenLightbox(idx)}
            >
                <img
                    src={currentUrl}
                    alt={imgs[idx]?.alternativeText ?? item.nombre_lugar_turistico}
                    className="h-full w-full object-cover"
                    onError={(e) => ((e.currentTarget.src = FALLBACK_IMAGE))}
                />
                {total > 1 && (
                    <div className="absolute bottom-2 right-2 flex gap-1">
                        {imgs.map((_, i) => (
                            <button
                                key={i}
                                aria-label={`Ir a imagen ${i + 1}`}
                                className={`h-2 w-2 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`}
                                onClick={() => setIdx(i)}
                            />)
                        )}
                    </div>
                )}
            </div>
            <h3 className="font-semibold text-foreground line-clamp-2">{item.nombre_lugar_turistico}</h3>
            {item.descripcion_lugar_turistico && (
                <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                    {item.descripcion_lugar_turistico}
                </p>
            )}
        </article>
    );
}

function LightboxModal({ images, title, startIndex = 0, onClose }: { images: Media[]; title: string; startIndex?: number; onClose: () => void }) {
    const [idx, setIdx] = useState(startIndex);
    const total = images.length;
    const current = images[idx];
    const url = current ? imageUrl(current) : FALLBACK_IMAGE;

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") setIdx((p) => (p + 1) % total);
            if (e.key === "ArrowLeft") setIdx((p) => (p - 1 + total) % total);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose, total]);

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`Imagen de ${title}`}
        >
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
                <img src={url} alt={current?.alternativeText ?? title} className="w-full max-h-[80vh] object-contain rounded-lg" />
                {/* Controles */}
                {total > 1 && (
                    <>
                        <button
                            className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white text-black"
                            onClick={() => setIdx((p) => (p - 1 + total) % total)}
                            aria-label="Anterior"
                        >
                            ‹
                        </button>
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 hover:bg-white text-black"
                            onClick={() => setIdx((p) => (p + 1) % total)}
                            aria-label="Siguiente"
                        >
                            ›
                        </button>
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    className={`h-2 w-2 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`}
                                    onClick={() => setIdx(i)}
                                    aria-label={`Ir a imagen ${i + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
                <button
                    className="absolute top-2 right-2 h-9 px-3 rounded-md bg-white/80 hover:bg-white text-black"
                    onClick={onClose}
                    aria-label="Cerrar"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}