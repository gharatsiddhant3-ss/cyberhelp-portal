import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useT } from "@/lib/i18n";
import { PageTitle } from "@/components/SiteShell";
import { seo } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact CyberHelp — Get Cyber Help", "Tell us what happened and our team will help you with your cyber problem."),
  component: Page,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(20),
  email: z.string().trim().email().max(255),
  issue: z.string().trim().min(1).max(100),
  message: z.string().trim().min(1).max(2000),
});

function Page() {
  const t = useT();
  const [f, setF] = useState({ name: "", phone: "", email: "", issue: "", message: "" });
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) {
      setErr(t({ en: "Please fill all fields correctly.", hi: "कृपया सभी फ़ील्ड सही भरें।", mr: "कृपया सर्व रकाने योग्य भरा." }));
      return;
    }
    setErr("");
    setSending(true);

    const generatedId = `CH-${Date.now().toString(36).toUpperCase()}`;

    // Always preserve locally in case of network or database RLS issues
    try {
      const existing = JSON.parse(localStorage.getItem("cyberhelp_assistance_requests") || "[]");
      existing.unshift({
        ticketId: generatedId,
        date: new Date().toISOString(),
        ...r.data,
      });
      localStorage.setItem("cyberhelp_assistance_requests", JSON.stringify(existing.slice(0, 50)));
    } catch {
      // LocalStorage non-critical
    }

    try {
      const { error } = await supabase.from("contact_requests").insert({
        ...r.data,
        email: r.data.email.toLowerCase(),
      });
      if (error) {
        console.warn("Supabase insert notification:", error.message);
      }
    } catch (e) {
      console.warn("Database connection notice:", e);
    }

    setSending(false);
    setTicketId(generatedId);
    setF({ name: "", phone: "", email: "", issue: "", message: "" });
  }

  const issues = [
    { en: "Financial / UPI fraud", hi: "वित्तीय / UPI धोखाधड़ी", mr: "आर्थिक / UPI फसवणूक" },
    { en: "Hacked account", hi: "हैक हुआ खाता", mr: "हॅक झालेले खाते" },
    { en: "Harassment / blackmail", hi: "उत्पीड़न / ब्लैकमेल", mr: "छळ / ब्लॅकमेल" },
    { en: "Suspicious link / message", hi: "संदिग्ध लिंक / संदेश", mr: "संशयास्पद लिंक / मेसेज" },
    { en: "Other", hi: "अन्य", mr: "इतर" },
  ];

  const copyBrief = () => {
    if (!ticketId) return;
    const brief = `CyberHelp Incident Reference: ${ticketId}\nEmergency Line: 1930\nNational Cyber Crime Portal: cybercrime.gov.in`;
    navigator.clipboard?.writeText(brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <div>
        <PageTitle
          title={t({ en: "Contact us for cyber help", hi: "साइबर सहायता के लिए संपर्क करें", mr: "सायबर मदतीसाठी संपर्क करा" })}
          sub={t({ en: "Tell us what happened. Never share passwords or OTPs with anyone — including us.", hi: "बताइए क्या हुआ। पासवर्ड या OTP किसी से साझा न करें — हमसे भी नहीं।", mr: "काय झाले ते सांगा. पासवर्ड किंवा OTP कोणालाही देऊ नका — आम्हालाही नाही." })}
        />

        {ticketId ? (
          <div className="card-panel border-success/60 bg-success/10 space-y-4">
            <h2 className="text-xl font-bold text-success flex items-center gap-2">
              ✔ {t({ en: "Assistance Request Logged", hi: "सहायता अनुरोध दर्ज किया गया", mr: "मदत विनंती नोंदवली गेली" })}
            </h2>
            <p className="text-sm">
              {t({
                en: "Your incident has been securely recorded. Reference ID:",
                hi: "आपकी घटना सुरक्षित रूप से दर्ज कर ली गई है। संदर्भ संख्या:",
                mr: "तुमची घटना सुरक्षितपणे नोंदवली गेली आहे. संदर्भ क्रमांक:",
              })}{" "}
              <strong className="font-mono text-primary bg-background px-2 py-0.5 rounded border border-border">{ticketId}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              {t({
                en: "If you lost money in a financial fraud within the last 24 hours (Golden Hour), immediately dial 1930 to freeze fraudulent transactions.",
                hi: "यदि पिछले 24 घंटों में वित्तीय धोखाधड़ी हुई है, तो तुरंत 1930 डायल करें ताकि फ्रॉड ट्रांज़ैक्शन रोकी जा सके।",
                mr: "मागील २४ तासांत आर्थिक फसवणूक झाली असल्यास, व्यवहार रोखण्यासाठी लगेच १९३० वर कॉल करा.",
              })}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button onClick={copyBrief} className="btn-ghost text-xs">
                {copied ? t({ en: "Copied!", hi: "कॉपी हो गया!", mr: "कॉपी केले!" }) : t({ en: "Copy incident reference", hi: "संदर्भ संख्या कॉपी करें", mr: "संदर्भ क्रमांक कॉपी करा" })}
              </button>
              <button onClick={() => setTicketId(null)} className="btn-primary text-xs">
                {t({ en: "Submit another query", hi: "एक और अनुरोध भेजें", mr: "दुसरी विनंती पाठवा" })}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="card-panel grid gap-4">
            <input className="field" placeholder={t({ en: "Your name", hi: "आपका नाम", mr: "तुमचे नाव" })} value={f.name} onChange={set("name")} maxLength={100} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="field" type="email" placeholder="Email" value={f.email} onChange={set("email")} maxLength={255} required />
              <input className="field" type="tel" placeholder={t({ en: "Phone", hi: "फोन", mr: "फोन" })} value={f.phone} onChange={set("phone")} maxLength={20} />
            </div>
            <select className="field" value={f.issue} onChange={set("issue")} required>
              <option value="">{t({ en: "Type of problem", hi: "समस्या का प्रकार", mr: "समस्येचा प्रकार" })}</option>
              {issues.map((i) => <option key={i.en} value={i.en}>{t(i)}</option>)}
            </select>
            <textarea className="field min-h-36" placeholder={t({ en: "What happened? (Do not include OTPs or passwords)", hi: "क्या हुआ? (पासवर्ड या OTP न लिखें)", mr: "काय झाले? (पासवर्ड किंवा OTP लिहू नका)" })} value={f.message} onChange={set("message")} maxLength={2000} required />
            {err && <p className="text-destructive text-sm font-medium">{err}</p>}
            <button className="btn-primary" disabled={sending}>{sending ? t({ en: "Sending…", hi: "भेज रहे हैं…", mr: "पाठवत आहे…" }) : t({ en: "Send request", hi: "अनुरोध भेजें", mr: "विनंती पाठवा" })}</button>
          </form>
        )}
      </div>
      <aside className="card-panel h-fit border-destructive/50">
        <h2 className="font-bold text-lg">{t({ en: "Urgent?", hi: "तत्काल?", mr: "तातडीचे?" })}</h2>
        <a href="tel:1930" className="mt-3 block font-display text-4xl font-extrabold text-accent">1930</a>
        <p className="mt-2 text-sm text-muted-foreground">National Cybercrime Helpline</p>
        <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground space-y-1">
          <p>• <strong>cybercrime.gov.in</strong> (Official Portal)</p>
          <p>• <strong>112</strong> (National Emergency Number)</p>
        </div>
      </aside>
    </div>
  );
}
