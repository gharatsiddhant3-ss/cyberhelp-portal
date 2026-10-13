import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { helplines, reportSteps } from "@/lib/content";
import { PageTitle } from "@/components/SiteShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/report")({
  head: () => seo("How to Report Cybercrime & Emergency Helplines — CyberHelp", "Step-by-step reporting instructions plus 1930, 112 and other helpline numbers."),
  component: Page,
});

function Page() {
  const t = useT();
  return (
    <div>
      <PageTitle title={t({ en: "Report cybercrime", hi: "साइबर अपराध की रिपोर्ट करें", mr: "सायबर गुन्ह्याची तक्रार करा" })} />
      <ol className="space-y-3">
        {reportSteps.map((s, i) => (
          <li key={i} className="card-panel flex gap-4">
            <span className="font-display text-2xl font-extrabold text-primary">{i + 1}</span>
            <p className="pt-1">{t(s)}</p>
          </li>
        ))}
      </ol>
      <h2 className="mt-12 mb-4 text-2xl font-bold">{t({ en: "Emergency helplines", hi: "आपातकालीन हेल्पलाइन", mr: "आपत्कालीन हेल्पलाइन" })}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {helplines.map((h) => (
          <a key={h.num} href={h.href} target={h.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="card-panel hover:border-primary">
            <div className="font-display text-2xl font-extrabold text-accent break-all">{h.num}</div>
            <div className="mt-1 text-muted-foreground">{t(h.name)}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
