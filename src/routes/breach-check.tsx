import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useT } from "@/lib/i18n";
import { checkEmailBreach } from "@/lib/breach.functions";
import { PageTitle } from "@/components/SiteShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/breach-check")({
  head: () => seo("Has My Email Been Leaked? — CyberHelp", "Check if your email address appeared in known data breaches of companies and websites."),
  component: Page,
});

function Page() {
  const t = useT();
  const check = useServerFn(checkEmailBreach);
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("email");
      return q ? q.trim() : "";
    }
    return "";
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; breaches: string[] } | null>(null);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setResult(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setErr(t({ en: "Enter a valid email", hi: "सही ईमेल डालें", mr: "योग्य ईमेल टाका" })); return; }
    setLoading(true);
    try { setResult(await check({ data: { email: email.trim() } })); }
    catch { setResult({ ok: false, breaches: [] }); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-2xl">
      <PageTitle
        title={t({ en: "Has your email been leaked?", hi: "क्या आपका ईमेल लीक हुआ है?", mr: "तुमचा ईमेल लीक झाला आहे का?" })}
        sub={t({ en: "We check public data-breach records from companies and websites. We don't store your email.", hi: "हम कंपनियों और वेबसाइटों के सार्वजनिक डेटा-लीक रिकॉर्ड जांचते हैं। हम आपका ईमेल सेव नहीं करते।", mr: "आम्ही कंपन्या व वेबसाइट्सच्या सार्वजनिक डेटा-लीक नोंदी तपासतो. आम्ही तुमचा ईमेल साठवत नाही." })}
      />
      <form onSubmit={onSubmit} noValidate className="card-panel flex flex-col sm:flex-row gap-3">
        <input className="field" type="email" inputMode="email" placeholder="you@example.com" value={email} maxLength={255} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" className="btn-primary" disabled={loading}>{loading ? t({ en: "Checking…", hi: "जांच रहे हैं…", mr: "तपासत आहे…" }) : t({ en: "Check", hi: "जांचें", mr: "तपासा" })}</button>
      </form>
      {loading && <p className="mt-3 text-muted-foreground">{t({ en: "Searching breach records, this can take up to 15 seconds…", hi: "लीक रिकॉर्ड खोज रहे हैं, 15 सेकंड तक लग सकते हैं…", mr: "लीक नोंदी शोधत आहे, 15 सेकंदांपर्यंत लागू शकतात…" })}</p>}
      {err && <p className="mt-3 text-destructive">{err}</p>}
      {result && !result.ok && <p className="mt-6 text-destructive">{t({ en: "Service unavailable, try again later.", hi: "सेवा उपलब्ध नहीं, बाद में प्रयास करें।", mr: "सेवा उपलब्ध नाही, नंतर प्रयत्न करा." })}</p>}
      {result?.ok && result.breaches.length === 0 && (
        <div className="mt-6 card-panel border-success/60 bg-success/10">
          <h2 className="text-xl font-bold text-success">✔ {t({ en: "Good news — no leaks found", hi: "अच्छी खबर — कोई लीक नहीं मिला", mr: "चांगली बातमी — कोणताही लीक आढळला नाही" })}</h2>
        </div>
      )}
      {result?.ok && result.breaches.length > 0 && (
        <div className="mt-6 card-panel border-destructive/60 bg-destructive/10">
          <h2 className="text-xl font-bold text-destructive">
            ⚠ {t({ en: `Found in ${result.breaches.length} data breaches`, hi: `${result.breaches.length} डेटा लीक में मिला`, mr: `${result.breaches.length} डेटा लीकमध्ये आढळला` })}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.breaches.map((b) => <span key={b} className="rounded-full bg-secondary px-3 py-1 text-sm">{b}</span>)}
          </div>
          <p className="mt-5 text-sm">{t({ en: "Change your password on these sites and anywhere you reused it, and turn on 2-step verification.", hi: "इन साइटों पर और जहां वही पासवर्ड इस्तेमाल किया, पासवर्ड बदलें और 2-स्टेप वेरिफिकेशन चालू करें।", mr: "या साइट्सवर आणि जिथे तोच पासवर्ड वापरला तिथे पासवर्ड बदला आणि 2-स्टेप व्हेरिफिकेशन सुरू करा." })}</p>
        </div>
      )}
      <p className="mt-6 text-xs text-muted-foreground">Data source: XposedOrNot</p>
    </div>
  );
}
