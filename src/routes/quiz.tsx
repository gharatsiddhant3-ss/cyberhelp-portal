import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { quiz } from "@/lib/content";
import { PageTitle } from "@/components/SiteShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/quiz")({
  head: () => seo("Cyber-Safety Quiz — CyberHelp", "Test how well you can spot online scams with a quick quiz."),
  component: Page,
});

function Page() {
  const t = useT();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const done = i >= quiz.length;

  const q = quiz[i];
  if (done || !q)
    return (
      <div className="card-panel max-w-xl text-center">
        <h1 className="text-3xl font-bold">{t({ en: "Your score", hi: "आपका स्कोर", mr: "तुमचे गुण" })}</h1>
        <p className="mt-4 font-display text-6xl font-extrabold text-primary">{score}/{quiz.length}</p>
        <button className="btn-primary mt-6" onClick={() => { setI(0); setScore(0); setPicked(null); }}>
          {t({ en: "Try again", hi: "फिर से खेलें", mr: "पुन्हा खेळा" })}
        </button>
      </div>
    );

  return (
    <div className="max-w-2xl">
      <PageTitle title={t({ en: "Cyber-safety quiz", hi: "साइबर सुरक्षा क्विज़", mr: "सायबर सुरक्षा प्रश्नमंजुषा" })} sub={`${i + 1} / ${quiz.length}`} />
      <div className="card-panel">
        <h2 className="text-xl font-bold">{t(q.q)}</h2>
        <div className="mt-5 space-y-2">
          {t(q.options).map((o, idx) => {
            const state = picked === null ? "" : idx === q.answer ? "border-success bg-success/10" : idx === picked ? "border-destructive bg-destructive/10" : "opacity-60";
            return (
              <button key={idx} disabled={picked !== null}
                onClick={() => { setPicked(idx); if (idx === q.answer) setScore((s) => s + 1); }}
                className={`w-full text-left rounded-md border border-border px-4 py-3 hover:bg-secondary ${state}`}>
                {o}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className={picked === q.answer ? "text-success font-semibold" : "text-destructive font-semibold"}>
              {picked === q.answer ? "✔ " : "✘ "}{t(q.why)}
            </p>
            <button className="btn-primary" onClick={() => { setI(i + 1); setPicked(null); }}>
              {t({ en: "Next", hi: "आगे", mr: "पुढे" })} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
