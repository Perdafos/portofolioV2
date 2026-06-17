import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Github, Menu, Moon, Search, Sun, X, FileText, Loader2 } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence } from "motion/react";
import { searchBlogPosts } from "@/backend/services/blogService";
import { type BlogPostPreview } from "@/backend/types/blog";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type NavLink = { to: string; label: string };

export default function PublicLayoutHeader({
  navLinks,
}: {
  navLinks?: NavLink[];
}) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  
  const defaultNavLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/#videos", label: t("nav.videos") },
    { to: "/blog", label: t("nav.blog") },
  ];
  
  const activeNavLinks = navLinks || defaultNavLinks;

  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BlogPostPreview[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && !searchRef.current.contains(event.target as Node) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search logic with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        setShowResults(true);
        try {
          const results = await searchBlogPosts(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (slug: string) => {
    navigate(`/blog/${slug}`);
    setShowResults(false);
    setSearchQuery("");
    setIsMobileMenuOpen(false);
  };

  const SearchResultsList = ({ results, loading }: { results: BlogPostPreview[], loading: boolean }) => (
    <div className="absolute top-[calc(100%+0.75rem)] left-0 right-0 max-h-80 overflow-y-auto rounded-md border border-border bg-background/95 p-1 shadow-lg backdrop-blur-md z-50">
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : results.length > 0 ? (
        <div className="flex flex-col">
          <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50 text-left">
            Blog Posts
          </p>
          {results.map((post) => (
            <button
              key={post.id}
              onClick={() => handleResultClick(post.slug)}
              className="flex w-full items-start gap-3 rounded-sm p-3 text-left transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              <div className="mt-0.5 rounded bg-primary/10 p-1">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <span className="text-sm font-medium line-clamp-1">{post.title}</span>
                <span className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-muted-foreground">
          No results found for "{searchQuery}"
        </div>
      )}
    </div>
  );

  return (
    <header className="fixed top-4 left-1/2 z-[40] w-[calc(100%-1rem)] max-w-5xl -translate-x-1/2 rounded-md border border-border bg-background/50 px-3 py-3 backdrop-blur-md sm:top-5 sm:w-[calc(100%-2rem)] sm:px-4 md:px-6 md:py-4">
      <div className="relative flex w-full items-center gap-2 sm:gap-3">
        <h1 className="shrink-0 cursor-pointer text-xl font-bold text-foreground sm:text-2xl">
          <span className="brand-glitch" data-text-hover="Dafa Ghaitsa Yogatama" aria-label="Perdafos">
            <Link to="/"><span className="brand-glitch-base">Perdafos</span></Link>
          </span>
        </h1>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-6 font-bold text-foreground lg:flex">
          {activeNavLinks.map((item) => (
            <Link key={item.to} className="text-foreground transition-colors hover:text-primary" to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
          <div className="relative flex items-center lg:flex hidden" ref={searchRef}>
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              className="h-9 w-32 rounded-md border border-border bg-background/50 pl-10 pr-4 text-sm transition-all focus:w-48 focus:outline-none focus:ring-1 focus:ring-primary sm:w-40 sm:focus:w-60"
            />
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-7 right-0 w-full"
                >
                  <SearchResultsList results={searchResults} loading={isSearching} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={cn("rounded-lg cursor-pointer", isMobileMenuOpen && "hidden lg:flex")}
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
              <div className="relative mb-4 flex items-center lg:hidden" ref={mobileSearchRef}>
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  className="h-9 w-full rounded-full border border-border bg-background/50 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <AnimatePresence>
                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-0 left-0 w-full"
                    >
                      <SearchResultsList results={searchResults} loading={isSearching} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <nav className="flex flex-col gap-2 font-bold text-foreground">
                {activeNavLinks.map((item) => (
                  <Link key={item.to} className="rounded-md px-2 py-1.5 text-foreground transition-colors hover:text-primary" to={item.to} onClick={() => setIsMobileMenuOpen(false)}>
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
  );
}
