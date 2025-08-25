import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Radio as RadioIcon } from "lucide-react";
import Escudo from "@/assets/escudo.jpeg";
import { cn } from "@/lib/utils";
import { getRadioStreamUrl } from "@/services/radioService";

const DEFAULT_STREAM = "https://icesdfscast.radiofrance.fr/fip-midfi.mp3?id=radiofrance";

const RadioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [streamUrl, setStreamUrl] = useState<string>(DEFAULT_STREAM);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [isMinimized, setIsMinimized] = useState(true);

    useEffect(() => {
        getRadioStreamUrl()
            .then(url => {
                if (url) setStreamUrl(url);
            })
            .catch(() => setStreamUrl(DEFAULT_STREAM));
    }, []);

    useEffect(() => {
        const a = audioRef.current;
        if (!a) return;
        a.volume = volume;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onVol = () => setIsMuted(a.muted || a.volume === 0);
        const onErr = () => setIsPlaying(false);

        a.addEventListener("play", onPlay);
        a.addEventListener("pause", onPause);
        a.addEventListener("volumechange", onVol);
        a.addEventListener("error", onErr);

        return () => {
            a.removeEventListener("play", onPlay);
            a.removeEventListener("pause", onPause);
            a.removeEventListener("volumechange", onVol);
            a.removeEventListener("error", onErr);
        };
    }, []);

    const togglePlayPause = () => {
        const a = audioRef.current;
        if (!a) return;
        if (a.paused) {
            a.play().catch((e) => console.error("Error al reproducir:", e));
        } else {
            a.pause();
        }
    };

    const toggleMute = () => {
        const a = audioRef.current;
        if (!a) return;
        a.muted = !a.muted;
        setIsMuted(a.muted);
    };

    const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseFloat(e.target.value);
        setVolume(v);
        const a = audioRef.current;
        if (a) {
            a.volume = v;
            if (v > 0 && (a.muted || isMuted)) {
                a.muted = false;
                setIsMuted(false);
            }
        }
    };

    return (
        <>
            <audio ref={audioRef} src={streamUrl} preload="none" />

            <div
                className={cn(
                    "fixed bottom-5 right-5 z-50 transition-all duration-500 ease-in-out",
                    "w-fit max-w-[calc(100vw-2.5rem)]"
                )}
            >
                <div className="flex items-center justify-start gap-7 rounded-full px-4 py-2 backdrop-blur-xl bg-white/80 dark:bg-slate-900/70 border border-black/5 dark:border-white/10 shadow-lg">
                    <button
                        onClick={togglePlayPause}
                        className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white shadow hover:scale-105 transition"
                        aria-label={isPlaying ? "Pausar" : "Reproducir"}
                    >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                    </button>

                    <div className="flex items-center gap-3 min-w-0">
                        <div className="relative h-9 w-9 rounded-full overflow-hidden ring-2 ring-primary/30 shadow">
                            <img src={Escudo} alt="Logo Radio" className={cn("h-full w-full object-cover", isPlaying && "animate-[spin_10s_linear_infinite]")} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">Radio Municipal</p>
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <span className="relative flex h-2 w-2">
                                    <span className={cn("absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75", isPlaying && "animate-ping")} />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                                </span>
                                <span>En vivo</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleMute}
                            className="p-2 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 transition"
                            aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                        >
                            {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={isMuted ? 0 : volume}
                            onChange={handleVolume}
                            className="w-24 h-2 rounded-lg appearance-none bg-slate-200 dark:bg-slate-700 accent-primary cursor-pointer"
                            aria-label="Volumen"
                        />
                        <span className="relative inline-flex h-5 w-5 items-center justify-center">
                            <span className={cn("absolute inline-flex h-full w-full rounded-full bg-red-500/50", isPlaying && "animate-ping")} />
                            <RadioIcon className="relative h-4 w-4 text-red-600" />
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RadioPlayer;