import { useMemo, useState, type ReactNode } from "react";
import { useTheme } from "@/components/theme-provider";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Github, Menu, Moon, Sun, X } from "lucide-react";
import ClickSpark from "../ClickSpark";
import { motion, AnimatePresence } from "motion/react";

const ORB_COLOR = '#3b82f6';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/blog", label: "Blog" },
    ];

    const glowOrbs = useMemo(() =>
        Array.from({ length: 12 }, (_, i) => ({
            id: i,
            top: `${Math.random() * 85 + 5}%`,
            left: `${Math.random() * 85 + 5}%`,
            size: Math.floor(Math.random() * 300 + 250),
            delay: `${(Math.random() * 7).toFixed(2)}s`,
            duration: `${(Math.random() * 4 + 3).toFixed(2)}s`,
            color: ORB_COLOR,
        }))
        , []);

    return (
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
                <header className="fixed top-4 left-1/2 z-50 w-[calc(100%-1rem)] max-w-5xl -translate-x-1/2 rounded-md border border-border bg-background/50 px-3 py-3 backdrop-blur-md sm:top-5 sm:w-[calc(100%-2rem)] sm:px-4 md:px-6 md:py-4">
                    <div className="relative flex w-full items-center gap-2 sm:gap-3">
                        <h1 className="shrink-0 cursor-pointer text-xl font-bold text-foreground sm:text-2xl">
                            <span className="brand-glitch" data-text-hover="Dafa Ghaitsa Yogatama" aria-label="Perdafos">
                                <span className="brand-glitch-base">Perdafos</span>
                            </span>
                        </h1>
                        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-6 font-bold text-foreground lg:flex">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.to}
                                    className="text-foreground transition-colors hover:text-primary"
                                    to={item.to}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-lg cursor-pointer"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            >
                                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            </Button>

                            <Button variant="outline" size="sm" className="hidden gap-2 lg:inline-flex" asChild>
                                <a href="https://github.com/perdafos" target="_blank" rel="noopener noreferrer">
                                    <Github className="w-4 h-4" /> GitHub
                                </a>
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="lg:hidden"
                                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                                aria-label="Toggle navigation menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden lg:hidden"
                            >
                                <div className="mt-3 border-t border-border pt-3">
                                    <nav className="flex flex-col gap-2 font-bold text-foreground">
                                        {navLinks.map((item) => (
                                            <Link
                                                key={item.to}
                                                className="rounded-md px-2 py-1.5 text-foreground transition-colors hover:text-primary"
                                                to={item.to}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </nav>

                                    <Button variant="outline" size="sm" className="mt-3 w-full gap-2" asChild>
                                        <a href="https://github.com/perdafos" target="_blank" rel="noopener noreferrer">
                                            <Github className="h-4 w-4" /> GitHub
                                        </a>
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>

                <motion.main
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-start px-4 pt-24 pb-24 sm:px-6 md:pt-28 md:pb-0"
                >
                    {children}
                </motion.main>

                <footer className="w-full text-center py-4 text-xs text-muted-foreground/70 border-t border-border bg-background/80 md:mt-40 mt-24">
                    &copy; {new Date().getFullYear()} Perdafos. All rights reserved.
                </footer>
            </div>
        </ClickSpark>
    )
}