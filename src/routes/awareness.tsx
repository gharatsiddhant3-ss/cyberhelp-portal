import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { articles } from "@/lib/content";
import { PageTitle } from "@/components/SiteShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/awareness")({
  head: () => seo("Cybercrime Awareness Articles — CyberHelp", "Learn about UPI fraud, phishing, digital arrest scams, fake jobs and more."),
  component: Page,
});

function Page() {
  const t = useT();
  return (
    <div>
      <PageTitle
        title={t({ en: "Cybercrime awareness", hi: "साइबर अपराध जागरूकता", mr: "सायबर गुन्हे जागरूकता" })}
        sub={t({ en: "Know the most common scams before they reach you.", hi: "आम घोटालों को पहले से जानें।", mr: "सामान्य घोटाळे आधीच ओळखा." })}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((a, i) => (
          <article key={i} className="card-panel">
            <h2 className="text-xl font-bold text-primary">{t(a.title)}</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{t(a.body)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
