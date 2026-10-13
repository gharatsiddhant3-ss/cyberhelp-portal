import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getSurveyStats } from "@/lib/survey.functions";
import { PageTitle } from "@/components/SiteShell";
import { useT } from "@/lib/i18n";
import { seo } from "@/lib/seo";
import { hasSurveyForm, surveyCta, surveyFormUrl } from "@/lib/content";

// Question 15 is answered in the survey but is not charted on the site.
const HIDDEN_QUESTIONS = ["Which features would you like in a cyber-safety app?"];

const statsQuery = queryOptions({
  queryKey: ["survey-stats"],
  queryFn: () => getSurveyStats(),
  staleTime: 5 * 60 * 1000,
  refetchInterval: 5 * 60 * 1000,
});

export const Route = createFileRoute("/survey")({
  head: () => seo("Cyber Awareness Survey Results — CyberHelp", "Live results from our public survey on cybercrime awareness, reporting habits and online safety in India."),
  loader: ({ context }) => context.queryClient.ensureQueryData(statsQuery),
  component: Page,
  errorComponent: () => <p className="text-destructive">Survey results are unavailable right now. Please try again later.</p>,
});

function Page() {
  const t = useT();
  const { data } = useSuspenseQuery(statsQuery);
  const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);
  const byStart = (start: string) => data.questions.find((q) => q.question.startsWith(start));
  const highlight = (start: string, answer: string) => {
    const q = byStart(start);
    const a = q?.answers.find((x) => x.label === answer);
    return q ? pct(a?.count ?? 0, q.responses) : 0;
  };
  const cards = [
    { v: data.total, s: "", l: t({ en: "People surveyed", hi: "सर्वे में शामिल लोग", mr: "सर्वेक्षणातील लोक" }) },
    { v: highlight("Are you aware of the 1930", "Yes"), s: "%", l: t({ en: "Know the 1930 helpline", hi: "1930 हेल्पलाइन जानते हैं", mr: "1930 हेल्पलाइन माहीत आहे" }) },
    { v: highlight("Have you received a suspicious", "Yes"), s: "%", l: t({ en: "Got a suspicious call/SMS/link", hi: "संदिग्ध कॉल/SMS/लिंक मिला", mr: "संशयास्पद कॉल/SMS/लिंक आला" }) },
    { v: highlight("Do you know where to report", "Yes"), s: "%", l: t({ en: "Know where to report", hi: "जानते हैं कहां रिपोर्ट करें", mr: "तक्रार कुठे करायची माहीत" }) },
  ];

  return (
    <div>
      <PageTitle
        title={t({ en: "Survey results", hi: "सर्वे परिणाम", mr: "सर्वेक्षण निकाल" })}
        sub={t({ en: "Live results from our cyber-awareness survey. Names and emails are never shown.", hi: "हमारे साइबर-जागरूकता सर्वे के लाइव परिणाम। नाम और ईमेल कभी नहीं दिखाए जाते।", mr: "आमच्या सायबर-जागरूकता सर्वेक्षणाचे थेट निकाल. नावे व ईमेल कधीही दाखवले जात नाहीत." })}
      />
      {hasSurveyForm && (
        <div className="card-panel mb-6 flex flex-wrap items-center justify-between gap-4 border-primary/40 bg-primary/5">
          <div>
            <h2 className="font-bold">{t(surveyCta.title)}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t(surveyCta.sub)}</p>
          </div>
          <a href={surveyFormUrl} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
            {t(surveyCta.cta)} ↗
          </a>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.l} className="card-panel">
            <div className="text-4xl font-bold text-primary">{c.v}{c.s}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.l}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 grid md:grid-cols-2 gap-5">
        {data.questions.filter((q) => !HIDDEN_QUESTIONS.includes(q.question)).map((q) => (
          <div key={q.question} className="card-panel">
            <h2 className="font-semibold">{q.question}</h2>
            <p className="text-xs text-muted-foreground mt-1">{q.responses} {t({ en: "responses", hi: "जवाब", mr: "प्रतिसाद" })}</p>
            <div className="mt-4 space-y-3">
              {q.answers.map((a) => {
                const p = pct(a.count, q.responses);
                return (
                  <div key={a.label}>
                    <div className="flex justify-between gap-3 text-sm"><span>{a.label}</span><span className="text-muted-foreground shrink-0">{p}%</span></div>
                    <div className="mt-1 h-2 rounded-full bg-secondary overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${p}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">{t({ en: "Updates automatically as new responses arrive.", hi: "नए जवाब आने पर अपने आप अपडेट होता है।", mr: "नवीन प्रतिसाद आल्यावर आपोआप अपडेट होते." })}</p>
    </div>
  );
}
