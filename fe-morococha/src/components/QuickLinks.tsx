import { MapPin, Users, UserRound, Network } from "lucide-react";

type Props = {
    /** Personaliza las URLs si quieres; si no, se usan las de abajo */
    links?: {
        organigrama?: string;
        alcalde?: string;
        regidores?: string;
        ubicacion?: string;
    };
};

export default function QuickLinks({ links }: Props) {
    const hrefs = {
        organigrama: links?.organigrama ?? "/organigrama",
        alcalde: links?.alcalde ?? "/alcalde",
        regidores: links?.regidores ?? "/regidores",
        ubicacion: links?.ubicacion ?? "/ubicacion",
    };

    const items = [
        { key: "organigrama", label: "Organigrama", href: hrefs.organigrama, Icon: Network },
        { key: "alcalde", label: "Alcalde", href: hrefs.alcalde, Icon: UserRound },
        { key: "regidores", label: "Regidores", href: hrefs.regidores, Icon: Users },
        { key: "ubicacion", label: "Ubicación", href: hrefs.ubicacion, Icon: MapPin },
    ];

    return (
        <section aria-label="Accesos rápidos" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {items.map(({ key, label, href, Icon }) => (
                        <a
                            key={key}
                            href={href}
                            className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-2xl"
                        >
                            <div className="flex flex-col items-center justify-center rounded-2xl border bg-card text-card-foreground shadow-sm p-6 h-full transition hover:shadow-lg hover:-translate-y-0.5">
                                <div className="mb-3 grid place-items-center rounded-full w-14 h-14 bg-indigo-100 group-hover:bg-indigo-200 transition">
                                    <Icon className="w-7 h-7 text-indigo-600" aria-hidden="true" />
                                </div>
                                <span className="text-sm font-medium">{label}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
