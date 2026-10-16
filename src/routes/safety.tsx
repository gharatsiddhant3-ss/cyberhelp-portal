import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useT } from "@/lib/i18n";
import { linkDo, linkSigns, tips } from "@/lib/content";
import { PageTitle } from "@/components/SiteShell";
import { seo } from "@/lib/seo";
import {
  inspectLinkDomain,
  performDeepAnalysis,
  type DetailedLinkAnalysis,
} from "@/lib/safety.functions";

export const Route = createFileRoute("/safety")({
  head: () =>
    seo(
      "Online Safety Tips & Interactive Domain Authenticity Inspector — CyberHelp",
      "Verify domains and links with deep DNS, SSL/TLS certificate verification, redirect unmasking, and anti-phishing brand checks."
    ),
  component: Page,
});

const SAMPLE_LINKS = [
  { label: "google.com", url: "google.com" },
  { label: "cybercrime.gov.in", url: "cybercrime.gov.in" },
  { label: "onlinesbi.sbi", url: "onlinesbi.sbi" },
  { label: "helpdesk@cybercrime.gov.in (Official Email)", url: "helpdesk@cybercrime.gov.in" },
  { label: "support@sbi-fraud-kyc.xyz (Fake Email)", url: "support@sbi-fraud-kyc.xyz" },
  { label: "sbi-kyc-verify.xyz/login (Phishing URL)", url: "sbi-kyc-verify.xyz/login" },
];


function Page() {
  const t = useT();
  const inspectServer = useServerFn(inspectLinkDomain);
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DetailedLinkAnalysis | null>(null);
  const [checked, setChecked] = useState(false);
  const [activeStep, setActiveStep] = useState<string>("");

  async function handleCheck(e?: React.FormEvent, overrideUrl?: string) {
    if (e) e.preventDefault();
    const targetUrl = (overrideUrl !== undefined ? overrideUrl : inputUrl).trim();
    if (!targetUrl) return;

    if (overrideUrl !== undefined) {
      setInputUrl(targetUrl);
    }

    setLoading(true);
    setChecked(true);
    setActiveStep(
      t({
        en: "Resolving DNS & Host records…",
        hi: "DNS और होस्ट रिकॉर्ड की जांच हो रही है…",
        mr: "DNS आणि होस्ट रेकॉर्ड तपासत आहे…",
      })
    );

    try {
      // Execute the server function for real DNS, SSL handshake & redirect inspection
      const result = await inspectServer({ data: { url: targetUrl } });
      setAnalysis(result);
    } catch {
      // Fallback in offline or sandboxed environment
      try {
        const fallback = await performDeepAnalysis(targetUrl);
        setAnalysis(fallback);
      } catch {
        setAnalysis(null);
      }
    } finally {
      setLoading(false);
      setActiveStep("");
    }
  }

  function getVerdictDetails(verdict: DetailedLinkAnalysis["safetyVerdict"]) {
    switch (verdict) {
      case "safe_verified":
        return {
          title: t({
            en: "Verified Authentic & Secure Portal",
            hi: "सत्यापित आधिकारिक एवं सुरक्षित पोर्टल",
            mr: "खात्रीशीर अधिकृत व सुरक्षित पोर्टल",
          }),
          desc: t({
            en: "This domain is an authenticated official website (Government of India or verified financial/tech entity) with active encryption.",
            hi: "यह डोमेन एक प्रमाणित आधिकारिक वेबसाइट है (भारत सरकार या अधिकृत बैंक/संस्था) और सुरक्षित एन्क्रिप्शन से सुरक्षित है।",
            mr: "हे डोमेन एक अधिकृत व खात्रीशीर संकेतस्थळ आहे (भारत सरकार किंवा अधिकृत संस्था) आणि सुरक्षित एन्क्रिप्शनसह उपलब्ध आहे.",
          }),
          borderClass: "border-success/60 bg-success/10 text-success",
          icon: "🛡️",
          badge: t({ en: "Verified Official", hi: "सत्यापित आधिकारिक", mr: "अधिकृत संस्था" }),
        };
      case "safe":
        return {
          title: t({
            en: "No Suspicious Deceptive Flags Found",
            hi: "कोई स्पष्ट संदिग्ध संकेत नहीं मिला",
            mr: "कोणतेही फसवणुकीचे लक्षण आढळले नाही",
          }),
          desc: t({
            en: "Domain passed standard security checks: valid SSL/TLS certificate, active DNS, and clean structural reputation.",
            hi: "डोमेन ने सामान्य सुरक्षा जांच पास की: वैध SSL/TLS प्रमाणपत्र, सक्रिय DNS, और कोई संदिग्ध पैटर्न नहीं मिला।",
            mr: "डोमेनने सामान्य सुरक्षा निकष पूर्ण केले: वैध SSL प्रमाणपत्र, सक्रिय DNS आणि कोणताही संशयास्पद प्रकार आढळला नाही.",
          }),
          borderClass: "border-success/60 bg-success/10 text-success",
          icon: "✔",
          badge: t({ en: "Standard Secure", hi: "सामान्य सुरक्षित", mr: "सामान्य सुरक्षित" }),
        };
      case "caution":
        return {
          title: t({
            en: "Suspicious Warning Signs Detected — Exercise Caution",
            hi: "संदिग्ध संकेत मिले — अतिरिक्त सावधानी बरतें",
            mr: "संशयास्पद लक्षणे आढळली — अधिक काळजी घ्या",
          }),
          desc: t({
            en: "Contains warning signals such as URL shortening, high-risk extension, unencrypted protocol, or urgency/fraud keywords.",
            hi: "इसमें चेतावनी संकेत मिले हैं जैसे छोटा किया गया लिंक, जोखिम भरा एक्सटेंशन, असुरक्षित कनेक्शन या संदिग्ध शब्द।",
            mr: "यामध्ये संशयास्पद लक्षणे आढळली आहेत जसे की शॉर्ट लिंक, धोकादायक एक्स्टेंशन, असुरक्षित कनेक्शन किंवा संशयास्पद शब्द.",
          }),
          borderClass: "border-accent/80 bg-accent/15 text-foreground",
          icon: "⚠",
          badge: t({ en: "Caution Advised", hi: "सावधानी जरूरी", mr: "सावध राहा" }),
        };
      case "danger":
      default:
        return {
          title: t({
            en: "High Risk Phishing / Scam Alert",
            hi: "उच्च जोखिम: संभावित फ़िशिंग / घोटाला लिंक",
            mr: "अति धोका: संभाव्य बनावट / सायबर फसवणूक",
          }),
          desc: t({
            en: "Severe red flags detected! Indicators suggest brand impersonation, deceptive subdomain spoofing, missing SSL, or unresolvable fake domain.",
            hi: "गंभीर खतरे के संकेत मिले! यह किसी बैंक या ब्रांड की नकल, नकली सबडोमेन, या फर्जी फ़िशिंग लिंक हो सकती है।",
            mr: "गंभीर धोक्याचे संकेत! ही लिंक एखाद्या नामांकित बँकेची किंवा ब्रँडची नक्कल, बनावट सबडोमेन किंवा खोटी फिशिंग लिंक असू शकते.",
          }),
          borderClass: "border-destructive/80 bg-destructive/15 text-destructive",
          icon: "🚨",
          badge: t({ en: "High Threat", hi: "उच्च खतरा", mr: "अति धोका" }),
        };
    }
  }

  return (
    <div className="space-y-12">
      <div>
        <PageTitle
          title={t({
            en: "Safety tips & tools",
            hi: "सुरक्षा टिप्स और उपकरण",
            mr: "सुरक्षा टिप्स आणि साधने",
          })}
          sub={t({
            en: "Practical digital hygiene habits and live multi-vector link authenticity verification.",
            hi: "व्यावहारिक डिजिटल सुरक्षा आदतें और लाइव बहु-स्तरीय लिंक प्रमाणीकरण।",
            mr: "उपयुक्त डिजिटल सुरक्षा सवयी आणि थेट बहु-स्तरीय लिंक तपासणी.",
          })}
        />
        <div className="grid gap-3 md:grid-cols-2">
          {tips.map((s, i) => (
            <div key={i} className="card-panel flex gap-3">
              <span className="text-success font-bold">✔</span>
              <p>{t(s)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Link & Domain Authenticity Inspector */}
      <section className="card-panel border-primary/30 bg-primary/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              🔍 {t({
                en: "Interactive Link & Domain Authenticity Checker",
                hi: "संदिग्ध लिंक एवं डोमेन जांच टूल",
                mr: "संशयास्पद लिंक व डोमेन तपासणी टूल",
              })}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t({
                en: "Analyze any domain, SMS link, or payment address. Performs live DNS resolution, SSL/TLS certificate inspection, redirect unmasking, and brand spoofing detection.",
                hi: "किसी भी डोमेन, SMS लिंक या पते की जांच करें। लाइव DNS, SSL/TLS सुरक्षा प्रमाणपत्र, रीडायरेक्ट जांच और फ़िशिंग नकल की पहचान करता है।",
                mr: "कोणतेही डोमेन, SMS लिंक किंवा पत्ता तपासा. थेट DNS, SSL प्रमाणपत्र, शॉर्ट लिंक उलगडणे आणि ब्रँड नक्कल तपासणी करतो.",
              })}
            </p>
          </div>
        </div>

        {/* Quick sample chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-medium">
            {t({ en: "Try quick samples:", hi: "नमूने जांचें:", mr: "नमुने तपासा:" })}
          </span>
          {SAMPLE_LINKS.map((sample) => (
            <button
              key={sample.url}
              type="button"
              onClick={() => handleCheck(undefined, sample.url)}
              disabled={loading}
              className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-foreground transition hover:bg-primary/20 hover:border-primary/40 disabled:opacity-50"
            >
              {sample.label}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => handleCheck(e)} className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            className="field flex-1"
            placeholder="e.g. google.com, support@sbi.co.in, helpdesk@cybercrime.gov.in, or sbi-kyc-verify.xyz"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" className="btn-primary shrink-0 flex items-center justify-center gap-2 min-w-[140px]" disabled={loading}>
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>{t({ en: "Checking…", hi: "जांच रहे हैं…", mr: "तपासत आहे…" })}</span>
              </>
            ) : (
              <span>{t({ en: "Inspect Link / Email", hi: "जांच करें", mr: "तपासा" })}</span>
            )}
          </button>
        </form>

        {loading && (
          <div className="mt-4 p-3 rounded-lg border border-primary/20 bg-background/50 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>
              {activeStep ||
                t({
                  en: "Executing live DNS lookup, SSL certificate verification, and anti-fraud heuristics…",
                  hi: "लाइव DNS, SSL प्रमाणपत्र और फ़िशिंग जांच चल रही है…",
                  mr: "थेट DNS, SSL प्रमाणपत्र व फिशिंग तपासणी सुरू आहे…",
                })}
            </span>
          </div>
        )}

        {checked && !loading && analysis && (
          <div className="mt-6 space-y-6">
            {/* Top Verdict Card */}
            {(() => {
              const info = getVerdictDetails(analysis.safetyVerdict);
              return (
                <div className={`p-5 rounded-xl border ${info.borderClass}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl shrink-0">{info.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-bold">{info.title}</h3>
                          <span className="text-xs px-2.5 py-0.5 rounded-full border font-semibold">
                            {info.badge}
                          </span>
                        </div>
                        <p className="mt-1 text-sm opacity-90">{info.desc}</p>
                      </div>
                    </div>

                    <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-current/20">
                      <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                        {t({ en: "Safety Score", hi: "सुरक्षा स्कोर", mr: "सुरक्षा गुण" })}
                      </span>
                      <span className="text-2xl font-extrabold">{analysis.safetyScore}/100</span>
                    </div>
                  </div>

                  <div className="mt-3 w-full bg-background/40 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        analysis.safetyScore >= 80
                          ? "bg-success"
                          : analysis.safetyScore >= 50
                          ? "bg-accent"
                          : "bg-destructive"
                      }`}
                      style={{ width: `${analysis.safetyScore}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Email Verification Section (if email provided) */}
            {analysis.emailAnalysis?.isEmail && (
              <div className="card-panel border-primary/40 bg-primary/10 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl">✉️</span>
                    <h3 className="font-bold text-base">
                      {t({
                        en: "Email Address Authenticity Check",
                        hi: "ईमेल पता प्रामाणिकता सत्यापन",
                        mr: "ईमेल पत्ता सत्यता पडताळणी",
                      })}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-foreground font-medium font-mono break-all">
                      {analysis.emailAnalysis.emailAddress}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    {analysis.emailAnalysis.hasMxRecords ? (
                      <span className="text-success font-medium">
                        ✔ {t({ en: "Active Mail Server (MX)", hi: "मान्य मेल सर्वर (MX)", mr: "वैध मेल सर्व्हर (MX)" })}: {analysis.emailAnalysis.mxHosts[0] || "Active"}
                      </span>
                    ) : (
                      <span className="text-destructive font-medium">
                        ✖ {t({ en: "No MX Records (Domain cannot receive emails)", hi: "कोई MX रिकॉर्ड नहीं (ईमेल प्राप्त नहीं हो सकते)", mr: "MX रेकॉर्ड नाही (ईमेल स्वीकारू शकत नाही)" })}
                      </span>
                    )}
                    <span>•</span>
                    {analysis.emailAnalysis.hasDmarc && analysis.emailAnalysis.hasSpf ? (
                      <span className="text-success font-medium">
                        ✔ {t({ en: "DMARC & SPF Protected", hi: "DMARC और SPF सुरक्षित", mr: "DMARC व SPF सुरक्षित" })}
                      </span>
                    ) : (
                      <span className="text-accent font-medium">
                        ⚠ {t({ en: "Missing DMARC policy (Spoofing possible)", hi: "DMARC नीति गायब (स्पूफिंग संभव)", mr: "DMARC धोरण नाही (बनावट ईमेल शक्य)" })}
                      </span>
                    )}
                  </p>
                </div>

                <a
                  href={`/breach-check?email=${encodeURIComponent(analysis.emailAnalysis.emailAddress || "")}`}
                  className="btn-primary text-xs px-3.5 py-2 shrink-0 flex items-center gap-2"
                >
                  <span>🔍</span>
                  <span>
                    {t({
                      en: "Check for Data Leaks",
                      hi: "डेटा लीक जांचें",
                      mr: "डेटा लीक तपासा",
                    })}
                  </span>
                </a>
              </div>
            )}


            {/* Technical Verification Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Domain & DNS */}
              <div className="card-panel bg-background p-4 flex flex-col justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  🌐 {t({ en: "Domain & DNS", hi: "डोमेन व DNS", mr: "डोमेन व DNS" })}
                </span>
                <div className="my-2">
                  <p className="font-mono text-sm font-bold truncate" title={analysis.domain}>
                    {analysis.domain}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {analysis.dns.resolved ? (
                      <span className="text-success font-medium">
                        ✔ {analysis.dns.ipAddresses.length > 0 ? analysis.dns.ipAddresses[0] : "Active DNS"}
                      </span>
                    ) : (
                      <span className="text-destructive font-medium">✖ {t({ en: "Unresolvable", hi: "अस्तित्वहीन", mr: "अस्तित्व नाही" })}</span>
                    )}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {analysis.heuristics.isIpAddress
                    ? t({ en: "Raw IP host", hi: "सीधा IP पता", mr: "थेट IP" })
                    : analysis.dns.resolved
                    ? t({ en: "Registered DNS host", hi: "सक्रिय डोमेन", mr: "सक्रिय डोमेन" })
                    : t({ en: "Failed DNS lookup", hi: "DNS विफल", mr: "DNS अयशस्वी" })}
                </span>
              </div>

              {/* SSL & Encryption */}
              <div className="card-panel bg-background p-4 flex flex-col justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  🔒 {t({ en: "SSL / Encryption", hi: "सुरक्षा एन्क्रिप्शन", mr: "सुरक्षा एन्क्रिप्शन" })}
                </span>
                <div className="my-2">
                  <p className="text-sm font-bold flex items-center gap-1.5">
                    {analysis.ssl.valid ? (
                      <span className="text-success flex items-center gap-1">
                        ✔ HTTPS ({analysis.ssl.issuer || "Trusted CA"})
                      </span>
                    ) : (
                      <span className="text-destructive flex items-center gap-1">
                        ✖ {analysis.protocol === "http" && analysis.userSpecifiedProtocol ? "HTTP Unencrypted" : "SSL Invalid / Absent"}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {analysis.ssl.daysRemaining !== undefined
                      ? t({
                          en: `Expires in ${analysis.ssl.daysRemaining} days`,
                          hi: `${analysis.ssl.daysRemaining} दिन शेष`,
                          mr: `अजून ${analysis.ssl.daysRemaining} दिवस बाकी`,
                        })
                      : analysis.ssl.valid
                      ? t({ en: "Valid Certificate", hi: "वैध प्रमाणपत्र", mr: "वैध प्रमाणपत्र" })
                      : t({ en: "Unencrypted / Insecure", hi: "असुरक्षित", mr: "असुरक्षित" })}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {analysis.securityHeaders.hsts
                    ? "HSTS Enforced"
                    : analysis.ssl.valid
                    ? "Standard TLS"
                    : t({ en: "No encryption", hi: "कोई एन्क्रिप्शन नहीं", mr: "एन्क्रिप्शन नाही" })}
                </span>
              </div>

              {/* Authenticity & Brand */}
              <div className="card-panel bg-background p-4 flex flex-col justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  🛡️ {t({ en: "Brand Authenticity", hi: "ब्रांड प्रामाणिकता", mr: "ब्रँड सत्यता" })}
                </span>
                <div className="my-2">
                  <p className="text-sm font-bold truncate">
                    {analysis.heuristics.isOfficialGov ? (
                      <span className="text-success">Gov of India (.gov.in)</span>
                    ) : analysis.heuristics.isVerifiedEntity ? (
                      <span className="text-success">{analysis.heuristics.verifiedEntityName}</span>
                    ) : analysis.heuristics.impersonatedBrand ? (
                      <span className="text-destructive truncate">Mimics {analysis.heuristics.impersonatedBrand}</span>
                    ) : (
                      <span>{t({ en: "Standard Domain", hi: "सामान्य डोमेन", mr: "सामान्य डोमेन" })}</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {analysis.heuristics.impersonatedBrand
                      ? t({ en: "Unauthorized imitation", hi: "अनधिकृत नकल", mr: "बनावट नक्कल" })
                      : analysis.heuristics.isVerifiedEntity || analysis.heuristics.isOfficialGov
                      ? t({ en: "Authentic entity", hi: "सत्यापित संस्था", mr: "अधिकृत संस्था" })
                      : t({ en: "No known brand clash", hi: "कोई ब्रांड विवाद नहीं", mr: "ब्रँड संघर्ष नाही" })}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {analysis.heuristics.hasSubdomainSpoof
                    ? t({ en: "Spoofed Subdomain", hi: "नकली सबडोमेन", mr: "बनावट सबडोमेन" })
                    : analysis.heuristics.hasPunycode
                    ? t({ en: "Punycode detected", hi: "प्यूनिकोड मिला", mr: "प्यूनिकोड आढळले" })
                    : t({ en: "Standard syntax", hi: "मानक संरचना", mr: "प्रमाणित रचना" })}
                </span>
              </div>

              {/* Redirect / Target */}
              <div className="card-panel bg-background p-4 flex flex-col justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                  🔄 {t({ en: "Redirect Tracker", hi: "रीडायरेक्ट ट्रैकर", mr: "रीडायरेक्ट ट्रॅकर" })}
                </span>
                <div className="my-2">
                  <p className="text-sm font-bold truncate" title={analysis.redirect.finalDomain || analysis.domain}>
                    {analysis.redirect.isShortener
                      ? t({ en: "Shortened URL", hi: "शॉर्ट लिंक", mr: "शॉर्ट लिंक" })
                      : analysis.redirect.hasRedirect
                      ? t({ en: "Redirected", hi: "रीडायरेक्टेड", mr: "रीडायरेक्टेड" })
                      : t({ en: "Direct Link", hi: "सीधी लिंक", mr: "थेट लिंक" })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {analysis.redirect.finalDomain ? `➔ ${analysis.redirect.finalDomain}` : "No redirection"}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {analysis.redirect.redirectCount > 0
                    ? `${analysis.redirect.redirectCount} ${t({ en: "hop(s)", hi: "हॉप", mr: "टप्पे" })}`
                    : t({ en: "Direct target", hi: "सीधा गंतव्य", mr: "थेट पत्ता" })}
                </span>
              </div>
            </div>

            {/* Analysis Breakdown */}
            <div className="card-panel bg-background">
              <h3 className="font-semibold text-base mb-3 flex items-center justify-between">
                <span>{t({ en: "Detailed Security Findings:", hi: "विस्तृत सुरक्षा निष्कर्ष:", mr: "तपशीलवार सुरक्षा निष्कर्ष:" })}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {analysis.reasons.length} {t({ en: "checks performed", hi: "जांच की गईं", mr: "तपासण्या केल्या" })}
                </span>
              </h3>

              <div className="space-y-3">
                {analysis.reasons.map((r, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-sm flex items-start gap-3 ${
                      r.type === "danger"
                        ? "border-destructive/40 bg-destructive/5 text-foreground"
                        : r.type === "warning"
                        ? "border-accent/40 bg-accent/5 text-foreground"
                        : r.type === "success"
                        ? "border-success/40 bg-success/5 text-foreground"
                        : "border-border bg-muted/20 text-muted-foreground"
                    }`}
                  >
                    <span className="text-lg shrink-0 mt-0.5">
                      {r.type === "danger" && "🚨"}
                      {r.type === "warning" && "⚠"}
                      {r.type === "success" && "✔"}
                      {r.type === "info" && "ℹ️"}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{t(r.title)}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{t(r.desc)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Guidance based on verdict */}
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
              <div>
                <p className="font-bold text-foreground">
                  💡 {t({ en: "Golden Safety Rule:", hi: "सुरक्षा का स्वर्णिम नियम:", mr: "सुरक्षेचा सुवर्ण नियम:" })}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {analysis.safetyVerdict === "danger"
                    ? t({
                        en: "Do NOT click, do NOT submit passwords or OTPs, and report this link to 1930 / cybercrime.gov.in immediately.",
                        hi: "क्लिक न करें, पासवर्ड या OTP दर्ज न करें, और तुरंत 1930 या cybercrime.gov.in पर रिपोर्ट करें।",
                        mr: "क्लिक करू नका, पासवर्ड किंवा OTP भरू नका आणि त्वरित 1930 किंवा cybercrime.gov.in वर तक्रार करा.",
                      })
                    : analysis.safetyVerdict === "caution"
                    ? t({
                        en: "Do not enter sensitive financial credentials. Verify with the organization through their official phone number or app.",
                        hi: "संवेदनशील बैंक विवरण न डालें। संस्था के आधिकारिक नंबर या ऐप से दोबारा पुष्टि करें।",
                        mr: "संवेदनशील बँक माहिती टाकू नका. संस्थेच्या अधिकृत नंबर किंवा अॅपद्वारे खात्री करा.",
                      })
                    : t({
                        en: "While this domain passes structural checks, never share OTPs or login passwords with anyone over call or chat.",
                        hi: "यद्यपि यह डोमेन सुरक्षित मानकों पर खरा उतरता है, कभी भी किसी कॉल या चैट पर OTP या पासवर्ड साझा न करें।",
                        mr: "हे डोमेन सुरक्षित दिसत असले तरी फोन किंवा चॅटवर कोणाशीही OTP किंवा पासवर्ड शेअर करू नका.",
                      })}
                </p>
              </div>

              {analysis.safetyVerdict === "danger" && (
                <a
                  href="/report"
                  className="btn-danger shrink-0 text-xs px-3 py-1.5 font-semibold"
                >
                  {t({ en: "Report to 1930", hi: "1930 पर रिपोर्ट करें", mr: "1930 वर तक्रार करा" })}
                </a>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Warning signs & What to do */}
      <div>
        <h2 className="mb-4 text-2xl font-bold">
          {t({
            en: "Suspicious-link safety guidelines",
            hi: "संदिग्ध लिंक सुरक्षा दिशानिर्देश",
            mr: "संशयास्पद लिंक सुरक्षा मार्गदर्शक",
          })}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card-panel border-destructive/50">
            <h3 className="font-bold text-destructive mb-3">
              {t({ en: "Warning signs", hi: "चेतावनी संकेत", mr: "धोक्याची लक्षणे" })}
            </h3>
            <ul className="space-y-2 list-disc pl-5">
              {linkSigns.map((s, i) => (
                <li key={i}>{t(s)}</li>
              ))}
            </ul>
          </div>
          <div className="card-panel border-primary/50">
            <h3 className="font-bold text-primary mb-3">
              {t({ en: "What to do", hi: "क्या करें", mr: "काय करावे" })}
            </h3>
            <ul className="space-y-2 list-disc pl-5">
              {linkDo.map((s, i) => (
                <li key={i}>{t(s)}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
