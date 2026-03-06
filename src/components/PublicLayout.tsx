import type { ReactNode } from "react";
import { useTheme } from "@/components/theme-provider";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Github, Moon, Sun } from "lucide-react";

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { theme, setTheme } = useTheme();

    return (
        <div className="min-h-screen justify-center items-center flex flex-col bg-background relative overflow-x-hidden">
            <div className="absolute top-0 right-0 top-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-500 rounded-full opacity-50 blur-[180px] z-0 pointer-events-auto-none:"
                style={{ pointerEvents: 'none' }} />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

            <header className="fixed flex px-6 py-4 top-5 md:top-5 bg-background/50 backdrop-blur-md border-b border-border max-w-5xl w-full rounded-none md:rounded-md z-99">
                <div className="flex w-full justify-between items-center">
                    <h1 className="font-bold text-2xl text-foreground w-full mx-0 justify-center items-center cursor-pointer">
                        <span className="glitch" data-text-hover="Dafa Ghaitsa">
                            <span className="glitch-text">Perdafos</span>
                        </span>
                    </h1>
                    <nav className="flex gap-6 font-bold w-full mx-0 justify-center items-center text-foreground">
                        <Link className="text-foreground hover:text-primary transition-colors" to="/">Home</Link>
                        <Link className="text-foreground hover:text-primary transition-colors" to="/about">About</Link>
                        <Link className="text-foreground hover:text-primary transition-colors" to="/contact">Contact</Link>
                    </nav>
                    <div className="flex ml-auto w-full mx-0 justify-end items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-lg cursor-pointer"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>

                        <Button variant="outline" size="sm" className="gap-2" asChild>
                            <a href="https://github.com/perdafos" target="_blank" rel="noopener noreferrer">
                                <Github className="w-4 h-4" /> GitHub
                            </a>
                        </Button>
                    </div>
                </div>
            </header>


            <main className="flex flex-1 flex-col items-center justify-center py-10 w-full max-w-6xl gap-20 mt-20 mb-20">
                {children}
            </main>

            <footer className="w-full text-center py-4 text-xs text-muted-foreground/70 border-t border-border bg-background/80">
                &copy; {new Date().getFullYear()} Perdafos. All rights reserved.
            </footer>
        </div>
    )
}