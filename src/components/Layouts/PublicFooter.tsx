export default function PublicFooter() {
  return (
    <footer className="w-full text-center py-4 text-xs text-muted-foreground/70 border-t border-border bg-background/80 md:mt-40 mt-24">
      &copy; {new Date().getFullYear()} Perdafos. All rights reserved.
    </footer>
  );
}
