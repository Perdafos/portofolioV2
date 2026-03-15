import { useMemo, type ReactNode } from "react";
import ClickSpark from "../ClickSpark";
import LoadingScreen from "./LoadingScreen";
import PublicLayoutHeader from "./PublicLayoutHeader";
import PublicFooter from "./PublicFooter";
import { Bot } from "lucide-react";

const ORB_COLOR = '#3b82f6';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const glowOrbs = useMemo(() => {
        // Disabled on mobile for performance (Total Blocking Time)
        if (isMobile) return [];
        
        const count = 4;
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            top: `${Math.random() * 85 + 5}%`,
            left: `${Math.random() * 85 + 5}%`,
            size: Math.floor(Math.random() * 100 + 100),
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
                sparkCount={isMobile ? 0 : 8}
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

                <main
                    className="z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-start px-4 pt-24 pb-24 sm:px-6 md:pt-28 md:pb-0"
                >
                    {children}
                </main>

                <PublicFooter />

                {/* Floating AI Button */}
                <a
                    href="https://ai.perdafos.my.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-6 right-6 z-99 p-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 animate-pulse-glow text-white rounded-full shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group"
                    title="Visit AI Perdafos"
                >
                    <Bot className="w-6 h-6" />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out whitespace-nowrap text-sm font-medium">
                        Ask AI
                    </span>
                </a>
            </div>
        </ClickSpark>
    </>
    )
}