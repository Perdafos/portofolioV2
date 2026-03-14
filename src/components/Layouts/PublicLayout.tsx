import { useMemo, type ReactNode } from "react";
import ClickSpark from "../ClickSpark";
import { motion } from "motion/react";
import LoadingScreen from "./LoadingScreen";
import PublicLayoutHeader from "./PublicLayoutHeader";
import PublicFooter from "./PublicFooter";

const ORB_COLOR = '#3b82f6';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const glowOrbs = useMemo(() => {
        // Reduced orbs for mobile to save CPU/TBT
        const count = isMobile ? 2 : 4;
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            top: `${Math.random() * 85 + 5}%`,
            left: `${Math.random() * 85 + 5}%`,
            size: Math.floor(Math.random() * 100 + 100), // even smaller
            delay: `${(Math.random() * 7).toFixed(2)}s`,
            duration: `${(Math.random() * 4 + 3).toFixed(2)}s`,
            color: ORB_COLOR,
        }));
    }, [isMobile]);

    return (
        <>
            <LoadingScreen />
            <ClickSpark
                sparkColor='#fff'
                sparkSize={10}
                sparkRadius={15}
                sparkCount={8}
                duration={400}
            >
                <div className="min-h-dvh w-full flex flex-col bg-background relative overflow-x-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {glowOrbs.map(orb => (
                        <div
                            key={orb.id}
                            className="glow-orb absolute rounded-full"
                            style={{
                                top: orb.top,
                                left: orb.left,
                                width: orb.size,
                                height: orb.size,
                                backgroundColor: orb.color,
                                filter: 'blur(70px)',
                                '--orb-delay': orb.delay,
                                '--orb-duration': orb.duration,
                            } as React.CSSProperties}
                        />
                    ))}
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-size-[50px_50px] pointer-events-none" />
                <div
                    className="absolute -top-50 -right-50 w-125 h-125 bg-blue-500 rounded-full blur-[180px] opacity-50 z-0 pointer-events-none"
                    style={{ pointerEvents: 'none' }}
                />
                
                <PublicLayoutHeader />

                <motion.main
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-start px-4 pt-24 pb-24 sm:px-6 md:pt-28 md:pb-0"
                >
                    {children}
                </motion.main>

                <PublicFooter />
            </div>
        </ClickSpark>
    </>
    )
}