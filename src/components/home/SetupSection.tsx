import {
    Cpu,
    HardDrive,
    Monitor,
    MemoryStick,
    Mouse,
    Code2,
    Laptop,
    Dot,
    Microchip,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSetupItems } from "@/backend/services/setupService";
import type { SetupItem } from "@/backend/types/setup";
import setup1Image from "@/assets/images/setup1.jpg";
import setup2Image from "@/assets/images/setup2.jpg";
import { motion } from "motion/react";

function getHardwareIcon(label: string) {
    switch (label.toLowerCase()) {
        case "laptop":
            return <Laptop className="size-5" />;
        case "cpu":
            return <Cpu className="size-5" />;
        case "gpu":
            return <Microchip className="size-5" />;
        case "ram":
            return <MemoryStick className="size-5" />;
        case "storage":
            return <HardDrive className="size-5" />;
        case "display":
            return <Monitor className="size-5" />;
        default:
            return <Cpu className="size-5" />;
    }
}

export default function SetupSection() {
    const [setupItems, setSetupItems] = useState<SetupItem[]>([]);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isActive = true;

        const loadSetupItems = async () => {
            try {
                const remoteItems = await getSetupItems();

                if (!isActive) {
                    return;
                }

                setSetupItems(remoteItems);
                setHasError(false);
                setErrorMessage("");
            } catch (error) {
                console.error("Failed to load setup data from Supabase", error);
                if (isActive) {
                    setHasError(true);
                    if (error instanceof Error) {
                        setErrorMessage(error.message);
                    } else {
                        setErrorMessage("Unknown Supabase error.");
                    }
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        loadSetupItems();

        return () => {
            isActive = false;
        };
    }, []);

    const hardwareSpecs = useMemo(
        () => setupItems.filter((item) => item.category === "hardware"),
        [setupItems]
    );

    const peripherals = useMemo(
        () => setupItems.filter((item) => item.category === "peripherals"),
        [setupItems]
    );

    const software = useMemo(
        () => setupItems.filter((item) => item.category === "software"),
        [setupItems]
    );

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-full flex flex-col"
        >
            <div className="w-full flex flex-wrap justify-between items-end gap-3">
                <div className="flex flex-col gap-2">
                    <p className="text-sm uppercase tracking-[0.3em] text-primary/90">Setup</p>
                    <h2 className="text-4xl font-bold text-primary">My Workspace</h2>
                </div>
            </div>
            <hr className="my-4 w-1/4" />
            {hasError && !isLoading ? (
                <p className="text-sm text-destructive mb-4">
                    {errorMessage}
                </p>
            ) : null}

            {/* Hardware Banner */}
            <Card className="w-full p-6 mb-6 flex flex-col md:flex-row gap-6 md:items-center">
                <div className="flex flex-col gap-2 min-w-fit">
                    <div className="bg-foreground rounded-full p-3 w-fit h-fit">
                        <Laptop className="size-8 text-background" />
                    </div>
                    <h2 className="text-2xl font-bold mt-2">Hardware</h2>
                    <Badge variant="outline" className="w-fit">Daily Driver</Badge>
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {hardwareSpecs.length === 0 && !isLoading ? (
                        <p className="text-sm text-muted-foreground">Belum ada data hardware di Supabase.</p>
                    ) : (
                        hardwareSpecs.map((spec) => (
                            <div
                                key={spec.id}
                                className="flex items-center gap-3 bg-muted/50 rounded-lg px-4 py-3"
                            >
                                <span className="text-muted-foreground shrink-0">{getHardwareIcon(spec.label)}</span>
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">{spec.label}</span>
                                    <span className="text-sm font-semibold">{spec.value}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card className="overflow-hidden group cursor-pointer">
                    <div className="relative w-full h-64 bg-muted flex items-center justify-center">
                        <img
                            src={setup1Image}
                            alt="Setup Overview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "flex";
                            }}
                        />
                        <div className="hidden absolute inset-0 flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Laptop className="size-10 opacity-30" />
                            <span className="text-sm opacity-50">setup2.jpg</span>
                        </div>
                    </div>
                    <div className="px-4 py-3">
                        <p className="font-semibold">Desk Overview</p>
                        <p className="text-sm text-muted-foreground">My workspace</p>
                    </div>
                </Card>

                <Card className="overflow-hidden group cursor-pointer">
                    <div className="relative w-full h-64 bg-muted flex items-center justify-center">
                        <img
                            src={setup2Image}
                            alt="Setup Close-up"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = "none";
                                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "flex";
                            }}
                        />
                        <div className="hidden absolute inset-0 flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Monitor className="size-10 opacity-30" />
                            <span className="text-sm opacity-50">setup1.jpg</span>
                        </div>
                    </div>
                    <div className="px-4 py-3">
                        <p className="font-semibold">Desk Overview</p>
                        <p className="text-sm text-muted-foreground">A full view of my workspace.</p>
                    </div>
                </Card>


            </div>

            {/* Peripherals & Software */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Peripherals */}
                <Card className="py-6 px-4 flex flex-col gap-4">
                    <div className="bg-foreground rounded-full p-2 w-fit h-fit">
                        <Mouse className="size-8 text-background" />
                    </div>
                    <h2 className="text-2xl font-bold">Peripherals</h2>
                    <div className="flex flex-col">
                        {peripherals.length === 0 && !isLoading ? (
                            <p className="text-sm text-muted-foreground">Belum ada data peripherals di Supabase.</p>
                        ) : (
                            peripherals.map((item) => (
                                <p key={item.id} className="text-xl flex justify-start items-center gap-1">
                                    <Dot />
                                    <span className="text-muted-foreground text-base">{item.label}:</span>
                                    <span className="text-base font-medium">{item.value}</span>
                                </p>
                            ))
                        )}
                    </div>
                </Card>

                {/* Software */}
                <Card className="py-6 px-4 flex flex-col gap-4">
                    <div className="bg-foreground rounded-full p-2 w-fit h-fit">
                        <Code2 className="size-8 text-background" />
                    </div>
                    <h2 className="text-2xl font-bold">Software</h2>
                    <div className="flex flex-col">
                        {software.length === 0 && !isLoading ? (
                            <p className="text-sm text-muted-foreground">Belum ada data software di Supabase.</p>
                        ) : (
                            software.map((item) => (
                                <p key={item.id} className="text-xl flex justify-start items-center gap-1">
                                    <Dot />
                                    <span className="text-muted-foreground text-base">{item.label}:</span>
                                    <span className="text-base font-medium">{item.value}</span>
                                </p>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </motion.section>
    );
}