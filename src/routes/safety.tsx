import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useT } from "@/lib/i18n";
import { linkDo, linkSigns, tips } from "@/lib/content";
import { PageTitle } from "@/components/SiteShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/safety")({
  head: () => seo("Online Safety Tips & Suspicious Link Guide — CyberHelp", "Simple safety habits, interactive link checker, and how to spot fake domains."),
  component: Page,
});

interface AnalysisResult {
  url: string;
  domain: string;
  isHttps: boolean;
  isIpAddress: boolean;
  isShortener: boolean;
  isOfficialGov: boolean;
  impersonatedBrand: string | null;
  foundKeywords: string[];
  riskLevel: "safe" | "caution" | "danger";
  reasons: { en: string; hi: string; mr: string }[];
}

function analyzeUrl(input: string): AnalysisResult | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  let urlStr = trimmed;
  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = "http://" + urlStr;
  }

  let parsed: URL;
  try {
    parsed = new URL(urlStr);
  } catch {
    return null;
  }

  const hostname = parsed.hostname.toLowerCase();
  const fullUrl = parsed.href.toLowerCase();
  const isHttps = parsed.protocol === "https:";
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

  const shorteners = ["bit.ly", "tinyurl.com", "is.gd", "cutt.ly", "t.co", "rb.gy", "wa.me", "chat.whatsapp.com"];
  const isShortener = shorteners.some((s) => hostname === s || hostname.endsWith("." + s));

  const isOfficialGov = hostname.endsWith(".gov.in") || hostname.endsWith(".nic.in");

  const riskyTlds = [".xyz", ".top", ".click", ".live", ".work", ".loan", ".cam", ".monster", ".vip", ".surf"];
  const hasRiskyTld = riskyTlds.some((tld) => hostname.endsWith(tld));

  const knownBrands = [
    { name: "SBI / State Bank", pattern: "sbi", official: "sbi.co.in" },
    { name: "HDFC Bank", pattern: "hdfc", official: "hdfcbank.com" },
    { name: "ICICI Bank", pattern: "icici", official: "icicibank.com" },
    { name: "Paytm", pattern: "paytm", official: "paytm.com" },
    { name: "PhonePe", pattern: "phonepe", official: "phonepe.com" },
    { name: "Income Tax", pattern: "incometax", official: "incometax.gov.in" },
    { name: "Aadhaar / UIDAI", pattern: "uidai", official: "uidai.gov.in" },
  ];

  let impersonatedBrand: string | null = null;
  for (const b of knownBrands) {
    if (hostname.includes(b.pattern) && !hostname.endsWith(b.official) && !hostname.endsWith("." + b.official)) {
      impersonatedBrand = b.name;
      break;
    }
  }

  const fraudKeywords = ["kyc", "pan", "otp", "cashback", "lottery", "reward", "bonus", "urgent", "apk", "gift", "electricity", "cut-off", "challan"];
  const foundKeywords = fraudKeywords.filter((kw) => fullUrl.includes(kw));

  const reasons: { en: string; hi: string; mr: string }[] = [];

  if (isOfficialGov) {
    reasons.push({
      en: "Official Government of India domain (.gov.in / .nic.in).",
      hi: "भारत सरकार का आधिकारिक डोमेन (.gov.in / .nic.in)।",
      mr: "भारत सरकारचे अधिकृत डोमेन (.gov.in / .nic.in).",
    });
  }

  if (!isHttps) {
    reasons.push({
      en: "Connection is unencrypted (HTTP). Real banks and services always use HTTPS.",
      hi: "कनेक्शन एन्क्रिप्टेड नहीं है (HTTP)। असली बैंक और सेवाएं हमेशा HTTPS का उपयोग करती हैं।",
      mr: "कनेक्शन सुरक्षित/एन्क्रिप्ट केलेले नाही (HTTP). खरे बँक नेहमी HTTPS वापरतात.",
    });
  }

  if (isIpAddress) {
    reasons.push({
      en: "Uses a raw numerical IP address instead of a domain name (classic phishing trait).",
      hi: "डोमेन नाम के बजाय न्यूमेरिकल IP एड्रेस का उपयोग करता है (फ़िशिंग का आम लक्षण)।",
      mr: "डोमेन नावाऐवजी थेट आयपी (IP) ॲड्रेस वापरत आहे (फसवणुकीचे मुख्य लक्षण).",
    });
  }

  if (impersonatedBrand) {
    reasons.push({
      en: `Suspicious brand imitation: mentions '${impersonatedBrand}' but does not match its official domain!`,
      hi: `संदिग्ध ब्रांड नकल: '${impersonatedBrand}' का नाम है लेकिन आधिकारिक वेबसाइट नहीं है!`,
      mr: `संशयास्पद ब्रँड नक्कल: '${impersonatedBrand}' चे नाव आहे पण अधिकृत वेबसाइट नाही!`,
    });
  }

  if (hasRiskyTld) {
    reasons.push({
      en: "Uses a high-risk generic extension frequently abused for scam links.",
      hi: "उच्च जोखिम वाले डोमेन एक्सटेंशन का उपयोग करता है जिसका उपयोग अक्सर घोटालों में होता है।",
      mr: "धोकादायक डोमेन एक्स्टेंशन वापरत आहे जे सहसा सायबर गुन्ह्यांमध्ये वापरले जाते.",
    });
  }

  if (isShortener) {
    reasons.push({
      en: "Shortened link hides the actual destination website.",
      hi: "छोटा किया गया लिंक (shortened link) असली वेबसाइट को छिपाता है।",
      mr: "शॉर्ट लिंक खरी वेबसाइट लपवते.",
    });
  }

  if (foundKeywords.length > 0) {
    reasons.push({
      en: `Contains suspicious urgency/financial keywords: ${foundKeywords.join(", ")}.`,
      hi: `संदिग्ध शब्द पाए गए: ${foundKeywords.join(", ")}।`,
      mr: `संशयास्पद शब्द आढळले: ${foundKeywords.join(", ")}.`,
    });
  }

  let riskLevel: "safe" | "caution" | "danger" = "safe";
  if (isIpAddress || impersonatedBrand || (hasRiskyTld && foundKeywords.length > 0)) {
    riskLevel = "danger";
  } else if (!isHttps || isShortener || hasRiskyTld || foundKeywords.length > 0) {
    riskLevel = "caution";
  }

  return {
    url: fullUrl,
    domain: hostname,
    isHttps,
    isIpAddress,
    isShortener,
    isOfficialGov,
    impersonatedBrand,
    foundKeywords,
    riskLevel,
    reasons,
  };
}

function Page() {
  const t = useT();
  const [inputUrl, setInputUrl] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [checked, setChecked] = useState(false);

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    setChecked(true);
    setAnalysis(analyzeUrl(inputUrl));
  }

  return (
    <div className="space-y-12">
      <div>
        <PageTitle
          title={t({ en: "Safety tips & tools", hi: "सुरक्षा टिप्स और उपकरण", mr: "सुरक्षा टिप्स आणि साधने" })}
          sub={t({ en: "Practical habits and automated link analysis to safeguard yourself online.", hi: "ऑनलाइन सुरक्षित रहने के लिए व्यावहारिक आदतें और स्वचालित लिंक विश्लेषण।", mr: "ऑनलाइन सुरक्षित राहण्यासाठी उपयुक्त सवयी आणि स्वयंचलित लिंक तपासणी." })}
        />
        <div className="grid gap-3 md:grid-cols-2">
          {tips.map((s, i) => (
            <div key={i} className="card-panel flex gap-3"><span className="text-success font-bold">✔</span><p>{t(s)}</p></div>
          ))}
        </div>
      </div>

      {/* Interactive Link & Domain Authenticity Inspector */}
      <section className="card-panel border-primary/30 bg-primary/5">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🔍 {t({ en: "Interactive Link & Domain Authenticity Checker", hi: "संदिग्ध लिंक एवं डोमेन जांच टूल", mr: "संशयास्पद लिंक व डोमेन तपासणी टूल" })}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t({
            en: "Paste any link, SMS URL, or domain to instantly analyze its structure, security certificates, and deception risks.",
            hi: "किसी भी संदिग्ध लिंक, SMS URL या डोमेन को पेस्ट करके उसकी सुरक्षा और फ़िशिंग जोखिम तुरंत जांचें।",
            mr: "कोणतीही संशयास्पद लिंक, SMS URL किंवा डोमेन पेस्ट करून त्याची सुरक्षा व फसवणुकीचा धोका त्वरित तपासा.",
          })}
        </p>

        <form onSubmit={handleCheck} className="mt-5 flex flex-col sm:flex-row gap-3">
          <input
            className="field flex-1"
            placeholder="e.g. sbi-kyc-verify.xyz/login or https://cybercrime.gov.in"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary shrink-0">
            {t({ en: "Inspect Link", hi: "जांच करें", mr: "तपासा" })}
          </button>
        </form>

        {checked && analysis && (
          <div className="mt-6 space-y-4">
            <div className={`p-4 rounded-lg border ${
              analysis.riskLevel === "danger"
                ? "border-destructive/60 bg-destructive/15 text-destructive"
                : analysis.riskLevel === "caution"
                ? "border-accent/60 bg-accent/15 text-foreground"
                : "border-success/60 bg-success/15 text-success"
            }`}>
              <div className="flex items-center gap-2 text-lg font-bold">
                {analysis.riskLevel === "danger" && "🚨 " + t({ en: "High Risk / Likely Phishing Link", hi: "उच्च जोखिम / संभावित फ़िशिंग लिंक", mr: "अति धोकादायक / बनावट लिंक" })}
                {analysis.riskLevel === "caution" && "⚠ " + t({ en: "Suspicious Signs Detected — Proceed With Caution", hi: "संदिग्ध संकेत मिले — सावधानी बरतें", mr: "संशयास्पद लक्षणे आढळली — सावध राहा" })}
                {analysis.riskLevel === "safe" && "✔ " + t({ en: "No Obvious Deceptive Red Flags Found", hi: "कोई स्पष्ट संदिग्ध संकेत नहीं मिला", mr: "कोणतेही स्पष्ट फसवणुकीचे लक्षण आढळले नाही" })}
              </div>
              <p className="mt-1 text-sm font-mono text-muted-foreground break-all">
                Domain: <strong>{analysis.domain}</strong>
              </p>
            </div>

            {analysis.reasons.length > 0 ? (
              <div className="card-panel bg-background">
                <h3 className="font-semibold text-sm text-muted-foreground mb-3">{t({ en: "Analysis Breakdown:", hi: "विश्लेषण विवरण:", mr: "तपासणी तपशील:" })}</h3>
                <ul className="space-y-2 text-sm">
                  {analysis.reasons.map((r, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className="text-primary">•</span>
                      <span>{t(r)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t({
                  en: "This domain follows common standard safety indicators. Always verify before entering bank credentials or OTPs.",
                  hi: "यह डोमेन सामान्य सुरक्षा मानकों का पालन करता है। बैंक क्रेडेंशियल या OTP डालने से पहले हमेशा पुष्टि करें।",
                  mr: "हे डोमेन सामान्य सुरक्षा निकष पूर्ण करते. बँक माहिती किंवा OTP भरण्यापूर्वी खात्री करा.",
                })}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Warning signs & What to do */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">{t({ en: "Suspicious-link safety guidelines", hi: "संदिग्ध लिंक सुरक्षा दिशानिर्देश", mr: "संशयास्पद लिंक सुरक्षा मार्गदर्शक" })}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card-panel border-destructive/50">
            <h3 className="font-bold text-destructive mb-3">{t({ en: "Warning signs", hi: "चेतावनी संकेत", mr: "धोक्याची लक्षणे" })}</h3>
            <ul className="space-y-2 list-disc pl-5">{linkSigns.map((s, i) => <li key={i}>{t(s)}</li>)}</ul>
          </div>
          <div className="card-panel border-primary/50">
            <h3 className="font-bold text-primary mb-3">{t({ en: "What to do", hi: "क्या करें", mr: "काय करावे" })}</h3>
            <ul className="space-y-2 list-disc pl-5">{linkDo.map((s, i) => <li key={i}>{t(s)}</li>)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
}
