import { createFileRoute, Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { hasSurveyForm, home, nav, surveyCta, surveyFormUrl } from "@/lib/content";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo("CyberHelp — Free cyber help in English, Hindi & Marathi", "Report cybercrime, learn safety tips, take a quiz and check if your email was leaked."),
  component: Index,
});

function Index() {
  const t = useT();
  return (
    <div>
      <section className="py-10 md:py-16 max-w-3xl">
        <span className="inline-block rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {t(home.badge)}
        </span>
        <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight">{t(home.title)}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{t(home.sub)}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/contact" className="btn-primary">{t(home.cta)}</Link>
          <Link to="/breach-check" className="btn-ghost">{t(home.check)}</Link>
        </div>
      </section>
      <div className="card-panel border-destructive/50 bg-destructive/10 flex flex-wrap items-center justify-between gap-4">
        <p className="font-semibold">{t(home.emergency)}</p>
        <a href="tel:1930" className="btn-primary">📞 1930</a>
      </div>
      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {nav.slice(1).map((n) => (
          <Link key={n.to} to={n.to} className="card-panel hover:border-primary transition-colors">
            <h3 className="text-lg font-bold">{t(n.label)} →</h3>
          </Link>
        ))}
      </section>
      {hasSurveyForm && (
        <section className="card-panel mt-4 flex flex-wrap items-center justify-between gap-4 border-primary/40 bg-primary/5">
          <div>
            <h2 className="text-lg font-bold">{t(surveyCta.title)}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t(surveyCta.sub)}</p>
          </div>
          <a href={surveyFormUrl} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
            {t(surveyCta.cta)} ↗
          </a>
        </section>
      )}
    </div>
  );
}
