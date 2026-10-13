import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LANGS, useLang, useT } from "@/lib/i18n";
import { nav } from "@/lib/content";

export function SiteShell({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLang();
  const t = useT();
  return (
    <div className="min-h-screen flex flex-col">
      <a href="tel:1930" className="block bg-destructive text-destructive-foreground text-center text-sm font-semibold py-2 px-4">
        {t({ en: "Cyber fraud emergency? Call 1930", hi: "साइबर धोखाधड़ी आपातकाल? 1930 पर कॉल करें", mr: "सायबर फसवणूक आपत्कालीन? 1930 वर कॉल करा" })}
      </a>
      <header className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-4 py-3 flex flex-wrap items-center gap-3">
          <Link to="/" className="font-display text-xl font-extrabold">
            Cyber<span className="text-primary">Help</span>
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm order-3 w-full md:order-none md:w-auto md:ml-6">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground"
                activeProps={{ className: "px-3 py-1.5 rounded-md bg-secondary text-primary" }}
                activeOptions={{ exact: true }}
              >
                {t(n.label)}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex rounded-md border border-border overflow-hidden text-sm">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={lang === l.code ? "px-3 py-1.5 bg-primary text-primary-foreground font-bold" : "px-3 py-1.5 text-muted-foreground hover:bg-secondary"}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10">{children}</main>
      <footer className="border-t border-border text-sm text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4 py-6 flex flex-wrap gap-4 justify-between">
          <span>© CyberHelp</span>
          <span>1930 · cybercrime.gov.in · 112</span>
        </div>
      </footer>
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
      {sub && <p className="mt-2 text-muted-foreground max-w-2xl">{sub}</p>}
    </div>
  );
}
