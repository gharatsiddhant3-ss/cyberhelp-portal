import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import dns from "node:dns/promises";
import tls from "node:tls";

export interface ReasonItem {
  type: "success" | "warning" | "danger" | "info";
  title: { en: string; hi: string; mr: string };
  desc: { en: string; hi: string; mr: string };
}

export interface DetailedLinkAnalysis {
  inputUrl: string;
  normalizedUrl: string;
  domain: string;
  protocol: "https" | "http";
  userSpecifiedProtocol: boolean;
  dns: {
    resolved: boolean;
    ipAddresses: string[];
    error?: string;
  };
  ssl: {
    checked: boolean;
    valid: boolean;
    issuer?: string;
    validFrom?: string;
    validTo?: string;
    daysRemaining?: number;
    error?: string;
  };
  redirect: {
    hasRedirect: boolean;
    redirectCount: number;
    finalUrl: string;
    finalDomain: string;
    isShortener: boolean;
  };
  securityHeaders: {
    hsts: boolean;
  };
  emailAnalysis?: {
    isEmail: boolean;
    emailAddress?: string;
    mailbox?: string;
    hasMxRecords: boolean;
    mxHosts: string[];
    hasDmarc: boolean;
    hasSpf: boolean;
    disposableEmailDomain: boolean;
  };
  heuristics: {
    isOfficialGov: boolean;
    isVerifiedEntity: boolean;
    verifiedEntityName?: string;
    impersonatedBrand?: string;
    hasSubdomainSpoof: boolean;
    hasPunycode: boolean;
    isIpAddress: boolean;
    hasRiskyTld: boolean;
    foundKeywords: string[];
  };
  safetyVerdict: "safe_verified" | "safe" | "caution" | "danger";
  safetyScore: number;
  reasons: ReasonItem[];
}

interface VerifiedBrand {
  name: string;
  nameHi: string;
  nameMr: string;
  officialDomains: string[];
  patterns: string[];
}

const VERIFIED_BRANDS: VerifiedBrand[] = [
  {
    name: "State Bank of India (SBI)",
    nameHi: "भारतीय स्टेट बैंक (SBI)",
    nameMr: "भारतीय स्टेट बँक (SBI)",
    officialDomains: ["sbi.co.in", "onlinesbi.sbi", "statebankofindia.com"],
    patterns: ["sbi", "onlinesbi", "statebankofindia"],
  },
  {
    name: "HDFC Bank",
    nameHi: "एचडीएफसी बैंक",
    nameMr: "एचडीएफसी बँक",
    officialDomains: ["hdfcbank.com", "hdfc.com"],
    patterns: ["hdfc", "hdfcbank"],
  },
  {
    name: "ICICI Bank",
    nameHi: "आईसीआईसीआई बैंक",
    nameMr: "आयसीआयसीआय बँक",
    officialDomains: ["icicibank.com"],
    patterns: ["icici", "icicibank"],
  },
  {
    name: "Axis Bank",
    nameHi: "एक्सिस बैंक",
    nameMr: "अॅक्सिस बँक",
    officialDomains: ["axisbank.com"],
    patterns: ["axisbank"],
  },
  {
    name: "Punjab National Bank (PNB)",
    nameHi: "पंजाब नेशनल बैंक",
    nameMr: "पंजाब नॅशनल बँक",
    officialDomains: ["pnbindia.in"],
    patterns: ["pnbindia"],
  },
  {
    name: "Bank of Baroda",
    nameHi: "बैंक ऑफ बड़ौदा",
    nameMr: "बँक ऑफ बडोदा",
    officialDomains: ["bankofbaroda.in", "bankofbaroda.com"],
    patterns: ["bankofbaroda"],
  },
  {
    name: "Canara Bank",
    nameHi: "केनरा बैंक",
    nameMr: "कॅनरा बँक",
    officialDomains: ["canarabank.com"],
    patterns: ["canarabank"],
  },
  {
    name: "Kotak Mahindra Bank",
    nameHi: "कोटक महिंद्रा बैंक",
    nameMr: "कोटक महिंद्रा बँक",
    officialDomains: ["kotak.com"],
    patterns: ["kotak"],
  },
  {
    name: "Reserve Bank of India (RBI)",
    nameHi: "भारतीय रिज़र्व बैंक (RBI)",
    nameMr: "भारतीय रिझर्व्ह बँक (RBI)",
    officialDomains: ["rbi.org.in"],
    patterns: ["rbi.org"],
  },
  {
    name: "NPCI / BHIM UPI",
    nameHi: "एनपीसीआई / भीम यूपीआई",
    nameMr: "एनपीसीआय / भीम यूपीआय",
    officialDomains: ["npci.org.in", "bhimupi.org.in"],
    patterns: ["npci", "bhimupi"],
  },
  {
    name: "Paytm",
    nameHi: "पेटीएम",
    nameMr: "पेटीएम",
    officialDomains: ["paytm.com"],
    patterns: ["paytm"],
  },
  {
    name: "PhonePe",
    nameHi: "फोनपे",
    nameMr: "फोनपे",
    officialDomains: ["phonepe.com"],
    patterns: ["phonepe"],
  },
  {
    name: "Google / Google Pay",
    nameHi: "गूगल / गूगल पे",
    nameMr: "गुगल / गुगल पे",
    officialDomains: ["google.com", "google.co.in", "pay.google.com", "gmail.com"],
    patterns: ["google", "gmail"],
  },
  {
    name: "Income Tax Department",
    nameHi: "आयकर विभाग",
    nameMr: "प्राप्तिकर विभाग",
    officialDomains: ["incometax.gov.in"],
    patterns: ["incometax"],
  },
  {
    name: "UIDAI / Aadhaar",
    nameHi: "यूआईडीएआई / आधार",
    nameMr: "यूआयडीएआय / आधार",
    officialDomains: ["uidai.gov.in"],
    patterns: ["uidai", "aadhaar"],
  },
  {
    name: "National Cyber Crime Reporting Portal",
    nameHi: "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल",
    nameMr: "राष्ट्रीय सायबर गुन्हा नोंदणी पोर्टल",
    officialDomains: ["cybercrime.gov.in"],
    patterns: ["cybercrime"],
  },
  {
    name: "DigiLocker",
    nameHi: "डिजिलॉकर",
    nameMr: "डिजीलॉकर",
    officialDomains: ["digilocker.gov.in"],
    patterns: ["digilocker"],
  },
  {
    name: "India Post",
    nameHi: "इंडिया पोस्ट",
    nameMr: "इंडिया पोस्ट",
    officialDomains: ["indiapost.gov.in"],
    patterns: ["indiapost"],
  },
  {
    name: "IRCTC",
    nameHi: "आईआरसीटीसी",
    nameMr: "आयआरसीटीसी",
    officialDomains: ["irctc.co.in"],
    patterns: ["irctc"],
  },
  {
    name: "Amazon",
    nameHi: "अमेज़न",
    nameMr: "ॲमेझॉन",
    officialDomains: ["amazon.in", "amazon.com"],
    patterns: ["amazon"],
  },
  {
    name: "Flipkart",
    nameHi: "फ्लिपकार्ट",
    nameMr: "फ्लिपकार्ट",
    officialDomains: ["flipkart.com"],
    patterns: ["flipkart"],
  },
  {
    name: "Microsoft",
    nameHi: "माइक्रोसॉफ्ट",
    nameMr: "मायक्रोसॉफ्ट",
    officialDomains: ["microsoft.com", "outlook.com", "hotmail.com"],
    patterns: ["microsoft", "outlook", "hotmail"],
  },
  {
    name: "Apple",
    nameHi: "एप्पल",
    nameMr: "अ‍ॅपल",
    officialDomains: ["apple.com", "icloud.com"],
    patterns: ["apple", "icloud"],
  },
  {
    name: "WhatsApp",
    nameHi: "व्हाट्सएप",
    nameMr: "व्हॉट्सॲप",
    officialDomains: ["whatsapp.com"],
    patterns: ["whatsapp"],
  },
];

const KNOWN_SHORTENERS = [
  "bit.ly",
  "tinyurl.com",
  "is.gd",
  "cutt.ly",
  "t.co",
  "rb.gy",
  "wa.me",
  "chat.whatsapp.com",
  "ow.ly",
  "buff.ly",
  "rebrand.ly",
  "qr.ae",
  "shorturl.at",
];

const DISPOSABLE_EMAIL_PROVIDERS = [
  "tempmail.com",
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "throwawaymail.com",
  "getnada.com",
  "trashmail.com",
  "sharklasers.com",
  "dispostable.com",
  "fakeinbox.com",
];

const RISKY_TLDS = [
  ".xyz",
  ".top",
  ".click",
  ".live",
  ".work",
  ".loan",
  ".cam",
  ".monster",
  ".vip",
  ".surf",
  ".fit",
  ".buzz",
  ".cfd",
  ".gdn",
  ".stream",
  ".rest",
  ".icu",
];

const FREE_HOSTING_PATTERNS = [
  "ngrok-free.app",
  "ngrok.io",
  "000webhostapp.com",
  "glitch.me",
  "firebaseapp.com",
  "pages.dev",
  "vercel.app",
  "netlify.app",
  "github.io",
  "workers.dev",
  "duckdns.org",
  "surge.sh",
];

const FRAUD_KEYWORDS = [
  "kyc",
  "pan",
  "aadhaar",
  "otp",
  "cashback",
  "lottery",
  "reward",
  "bonus",
  "urgent",
  "apk",
  "gift",
  "electricity",
  "cut-off",
  "challan",
  "refund",
  "suspend",
  "unblock",
  "verify-login",
  "update-account",
  "claim-prize",
];

async function checkDns(hostname: string): Promise<{ resolved: boolean; ipAddresses: string[]; error?: string }> {
  try {
    const addresses = await dns.resolve4(hostname);
    return { resolved: true, ipAddresses: addresses };
  } catch (err: unknown) {
    try {
      const addresses6 = await dns.resolve6(hostname);
      return { resolved: true, ipAddresses: addresses6 };
    } catch {
      const errorMsg = err instanceof Error ? err.message : "DNS resolution failed";
      return { resolved: false, ipAddresses: [], error: errorMsg };
    }
  }
}

async function checkEmailRecords(domain: string): Promise<{
  hasMxRecords: boolean;
  mxHosts: string[];
  hasDmarc: boolean;
  hasSpf: boolean;
}> {
  let hasMxRecords = false;
  let mxHosts: string[] = [];
  let hasDmarc = false;
  let hasSpf = false;

  try {
    const mx = await dns.resolveMx(domain);
    if (mx && mx.length > 0) {
      hasMxRecords = true;
      mxHosts = mx.map((r) => r.exchange);
    }
  } catch {
    hasMxRecords = false;
  }

  // Check SPF
  try {
    const txts = await dns.resolveTxt(domain);
    hasSpf = txts.some((recordArr) => recordArr.join("").toLowerCase().includes("v=spf1"));
  } catch {
    hasSpf = false;
  }

  // Check DMARC
  try {
    const dmarcTxts = await dns.resolveTxt(`_dmarc.${domain}`);
    hasDmarc = dmarcTxts.some((recordArr) => recordArr.join("").toLowerCase().includes("v=dmarc1"));
  } catch {
    hasDmarc = false;
  }

  return { hasMxRecords, mxHosts, hasDmarc, hasSpf };
}

async function checkSsl(
  hostname: string,
  port = 443,
  timeoutMs = 4000
): Promise<{
  checked: boolean;
  valid: boolean;
  issuer?: string;
  validTo?: string;
  validFrom?: string;
  daysRemaining?: number;
  error?: string;
}> {
  return new Promise((resolve) => {
    let resolved = false;
    const socket = tls.connect(
      {
        host: hostname,
        port,
        servername: hostname,
        rejectUnauthorized: true,
        timeout: timeoutMs,
      },
      () => {
        if (resolved) return;
        resolved = true;
        try {
          const cert = socket.getPeerCertificate();
          const authorized = socket.authorized;
          const authError = socket.authorizationError?.message;
          socket.end();

          if (!cert || Object.keys(cert).length === 0) {
            resolve({ checked: true, valid: false, error: "No SSL certificate found" });
            return;
          }

          const validTo = cert.valid_to;
          const validFrom = cert.valid_from;
          let daysRemaining: number | undefined;
          if (validTo) {
            const exp = new Date(validTo).getTime();
            daysRemaining = Math.round((exp - Date.now()) / (1000 * 60 * 60 * 24));
          }

          const issuerOrg = typeof cert.issuer?.O === "string" ? cert.issuer.O : (cert.issuer?.CN || "Standard Certificate Authority");

          resolve({
            checked: true,
            valid: authorized,
            issuer: issuerOrg,
            validTo,
            validFrom,
            daysRemaining,
            error: authorized ? undefined : (authError || "Certificate untrusted or self-signed"),
          });
        } catch (e: unknown) {
          resolve({ checked: true, valid: false, error: e instanceof Error ? e.message : "Failed to inspect certificate" });
        }
      }
    );

    socket.on("error", (err) => {
      if (resolved) return;
      resolved = true;
      socket.destroy();
      resolve({ checked: true, valid: false, error: err.message });
    });

    socket.on("timeout", () => {
      if (resolved) return;
      resolved = true;
      socket.destroy();
      resolve({ checked: true, valid: false, error: "SSL connection timed out" });
    });
  });
}

async function traceRedirects(initialUrl: string): Promise<{
  finalUrl: string;
  finalDomain: string;
  hasRedirect: boolean;
  redirectCount: number;
  hsts: boolean;
}> {
  let currentUrl = initialUrl;
  let redirectCount = 0;
  let hasHsts = false;

  for (let i = 0; i < 5; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const resp = await fetch(currentUrl, {
        method: "HEAD",
        redirect: "manual",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) CyberHelp-DomainSecurityInspector/2.0",
          Accept: "*/*",
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (resp.headers.has("strict-transport-security")) {
        hasHsts = true;
      }

      if ([301, 302, 303, 307, 308].includes(resp.status)) {
        const loc = resp.headers.get("location");
        if (loc) {
          redirectCount++;
          const nextUrl = new URL(loc, currentUrl).href;
          currentUrl = nextUrl;
          continue;
        }
      }
      break;
    } catch {
      break;
    }
  }

  let finalDomain = "";
  try {
    finalDomain = new URL(currentUrl).hostname.toLowerCase();
  } catch {
    finalDomain = "";
  }

  return {
    finalUrl: currentUrl,
    finalDomain,
    hasRedirect: redirectCount > 0,
    redirectCount,
    hsts: hasHsts,
  };
}

export async function performDeepAnalysis(rawInput: string): Promise<DetailedLinkAnalysis> {
  const trimmed = rawInput.trim();

  // Check if user entered an email address (e.g. support@sbi-kyc.xyz or helpdesk@cybercrime.gov.in)
  const emailMatch = trimmed.match(/^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/);
  const isEmail = !!emailMatch;
  const mailbox = emailMatch ? emailMatch[1] : undefined;
  const rawEmailDomain = emailMatch ? emailMatch[2].toLowerCase() : undefined;

  const hasUserProtocol = /^https?:\/\//i.test(trimmed);
  const protocolSpecified = hasUserProtocol ? (trimmed.toLowerCase().startsWith("https://") ? "https" : "http") : null;

  // If user entered email, target domain is the email domain; otherwise workingUrl
  const workingUrl = isEmail
    ? `https://${rawEmailDomain}`
    : hasUserProtocol
    ? trimmed
    : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(workingUrl);
  } catch {
    return {
      inputUrl: rawInput,
      normalizedUrl: rawInput,
      domain: rawInput,
      protocol: "http",
      userSpecifiedProtocol: false,
      dns: { resolved: false, ipAddresses: [], error: "Invalid URL syntax" },
      ssl: { checked: false, valid: false, error: "Invalid URL" },
      redirect: { hasRedirect: false, redirectCount: 0, finalUrl: rawInput, finalDomain: "", isShortener: false },
      securityHeaders: { hsts: false },
      heuristics: {
        isOfficialGov: false,
        isVerifiedEntity: false,
        hasSubdomainSpoof: false,
        hasPunycode: false,
        isIpAddress: false,
        hasRiskyTld: false,
        foundKeywords: [],
      },
      safetyVerdict: "danger",
      safetyScore: 0,
      reasons: [
        {
          type: "danger",
          title: {
            en: "Invalid Link / URL / Email Format",
            hi: "अमान्य लिंक / URL / ईमेल प्रारूप",
            mr: "अवैध लिंक / URL / ईमेल स्वरूप",
          },
          desc: {
            en: "The entered text cannot be parsed as a valid web address, domain name, or email.",
            hi: "दर्ज किया गया टेक्स्ट एक मान्य वेब पते, डोमेन नाम या ईमेल के रूप में मान्य नहीं है।",
            mr: "टाकलेला मजकूर वैध वेब पत्ता, डोमेन नाव किंवा ईमेल म्हणून ओळखता येत नाही.",
          },
        },
      ],
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const fullPathAndQuery = (parsed.pathname + parsed.search).toLowerCase();
  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);

  // Check Punycode / Homograph (starts with xn-- or contains non-ascii characters)
  const hasPunycode = hostname.startsWith("xn--") || /[^\u0000-\u007F]/.test(hostname);

  // Check shortener
  const isShortener = !isEmail && KNOWN_SHORTENERS.some((s) => hostname === s || hostname.endsWith("." + s));

  // Check official government domain
  const isOfficialGov = hostname.endsWith(".gov.in") || hostname.endsWith(".nic.in");

  // Check risky TLD
  const hasRiskyTld = RISKY_TLDS.some((tld) => hostname.endsWith(tld));

  // Check free hosting platforms often abused by scammers
  const isFreeHosting = FREE_HOSTING_PATTERNS.some((p) => hostname === p || hostname.endsWith("." + p));

  // Check disposable email
  const isDisposableEmail = isEmail && DISPOSABLE_EMAIL_PROVIDERS.some((d) => hostname === d || hostname.endsWith("." + d));

  // Brand impersonation and verified entity match
  let isVerifiedEntity = false;
  let verifiedEntityName: string | undefined;
  let impersonatedBrand: string | undefined;
  let hasSubdomainSpoof = false;

  for (const b of VERIFIED_BRANDS) {
    const isExactOfficial = b.officialDomains.some((d) => hostname === d || hostname.endsWith("." + d));
    if (isExactOfficial) {
      isVerifiedEntity = true;
      verifiedEntityName = b.name;
      break;
    }
  }

  if (!isVerifiedEntity) {
    for (const b of VERIFIED_BRANDS) {
      const mentionsBrandInHost = b.patterns.some((p) => hostname.includes(p));
      const mentionsOfficialDomainInHost = b.officialDomains.some((d) => hostname.includes(d.replace(/\./g, "-")) || hostname.includes(d));

      if (mentionsBrandInHost || mentionsOfficialDomainInHost) {
        impersonatedBrand = b.name;
        if (mentionsOfficialDomainInHost && !b.officialDomains.some((d) => hostname.endsWith("." + d))) {
          hasSubdomainSpoof = true;
        }
        break;
      }
    }
  }

  // Check keywords in hostname, path, and query
  const entireUrlTarget = (hostname + parsed.pathname + parsed.search).toLowerCase();
  const foundKeywords = FRAUD_KEYWORDS.filter((kw) => entireUrlTarget.includes(kw));


  // Run live network probes in parallel: DNS, SSL, Redirect trace, and Email records
  const [dnsResult, sslResult, redirectResult, emailRecordResult] = await Promise.all([
    isIpAddress ? Promise.resolve({ resolved: true, ipAddresses: [hostname] }) : checkDns(hostname),
    isIpAddress ? Promise.resolve({ checked: false, valid: false, error: "Raw IP does not have standard SSL" }) : checkSsl(hostname),
    isEmail ? Promise.resolve({ finalUrl: workingUrl, finalDomain: hostname, hasRedirect: false, redirectCount: 0, hsts: false }) : traceRedirects(workingUrl),
    isEmail ? checkEmailRecords(hostname) : Promise.resolve({ hasMxRecords: false, mxHosts: [], hasDmarc: false, hasSpf: false }),
  ]);

  const reasons: ReasonItem[] = [];
  let score = 100;

  // 1. Email Specific Findings
  if (isEmail) {
    reasons.push({
      type: "info",
      title: {
        en: `Email Address Detected: ${trimmed}`,
        hi: `ईमेल पता पहचाना गया: ${trimmed}`,
        mr: `ईमेल पत्ता ओळखला: ${trimmed}`,
      },
      desc: {
        en: `Analyzing sender domain '${hostname}' for mail exchange (MX) capability, sender reputation, and anti-spoofing policies.`,
        hi: `प्रेषक डोमेन '${hostname}' के मेल सर्वर (MX), प्रेषक विश्वसनीयता और स्पूफिंग सुरक्षा की जांच की जा रही है।`,
        mr: `प्रेषक डोमेन '${hostname}' चे मेल सर्व्हर (MX), विश्वासार्हता व फसवणूक प्रतिबंधक नियमांची तपासणी केली जात आहे.`,
      },
    });

    if (emailRecordResult.hasMxRecords) {
      reasons.push({
        type: "success",
        title: {
          en: `Active Mail Exchange (MX) Server: ${emailRecordResult.mxHosts[0] || "Configured"}`,
          hi: `सक्रिय मेल एक्सचेंज (MX) सर्वर: ${emailRecordResult.mxHosts[0] || "कॉन्फ़िगर"}`,
          mr: `सक्रिय मेल एक्सचेंज (MX) सर्व्हर: ${emailRecordResult.mxHosts[0] || "सक्रिय"}`,
        },
        desc: {
          en: `Domain has genuine email routing records to send and receive messages (${emailRecordResult.mxHosts.slice(0, 2).join(", ")}).`,
          hi: `डोमेन के पास ईमेल भेजने और प्राप्त करने के वैध रिकॉर्ड मौजूद हैं।`,
          mr: `डोमेनकडे ईमेल्स पाठवण्यासाठी व मिळवण्यासाठी अधिकृत रेकॉर्ड्स आहेत.`,
        },
      });
    } else {
      score -= 40;
      reasons.push({
        type: "danger",
        title: {
          en: "No Valid Mail Server (MX) Found",
          hi: "कोई मान्य मेल सर्वर (MX) नहीं मिला",
          mr: "कोणताही वैध मेल सर्व्हर (MX) आढळला नाही",
        },
        desc: {
          en: "This domain cannot receive incoming emails. Fake/scam emails often forge return addresses from domains with no real mail servers.",
          hi: "यह डोमेन ईमेल प्राप्त नहीं कर सकता। फर्जी ईमेल अक्सर बिना मेल सर्वर वाले डोमेन से जाली पते बनाकर भेजे जाते हैं।",
          mr: "हे डोमेन ईमेल स्वीकारू शकत नाही. सायबर गुन्हेगार अनेकदा अशा खोट्या डोमेनवरून बनावट ईमेल पाठवतात.",
        },
      });
    }

    if (emailRecordResult.hasDmarc && emailRecordResult.hasSpf) {
      reasons.push({
        type: "success",
        title: {
          en: "Protected with DMARC & SPF Anti-Spoofing",
          hi: "DMARC और SPF एंटी-स्पूफिंग से सुरक्षित",
          mr: "DMARC आणि SPF फसवणूक प्रतिबंधक सुरक्षा सक्रिय",
        },
        desc: {
          en: "Domain enforces strict sender authentication, preventing unauthorized attackers from faking emails from this domain.",
          hi: "यह डोमेन सख्त प्रेषक प्रमाणीकरण लागू करता है, जिससे धोखेबाज इसके नाम से जाली ईमेल नहीं भेज सकते।",
          mr: "हे डोमेन कडक प्रेषक पडताळणी लागू करते, ज्यामुळे भामट्यांना या नावाने बनावट ईमेल पाठवणे अशक्य होते.",
        },
      });
    } else {
      score -= 10;
      reasons.push({
        type: "warning",
        title: {
          en: "Missing or Weak DMARC / SPF Email Protection",
          hi: "DMARC / SPF एंटी-स्पूफिंग सुरक्षा अनुपस्थित",
          mr: "DMARC / SPF सुरक्षा धोरण आढळले नाही",
        },
        desc: {
          en: "Without strict DMARC policies, malicious actors might forge emails that visually appear to come from this domain.",
          hi: "DMARC नीति के बिना, जालसाज ऐसे ईमेल बना सकते हैं जो इस डोमेन से आते दिखाई देते हैं।",
          mr: "DMARC धोरणाशिवाय सायबर भामटे या डोमेनच्या नावाचा गैरवापर करून बनावट ईमेल पाठवू शकतात.",
        },
      });
    }

    if (isDisposableEmail) {
      score -= 50;
      reasons.push({
        type: "danger",
        title: {
          en: "Disposable / Burner Temporary Email Domain",
          hi: "डिस्पोजेबल / अस्थायी बर्नर ईमेल डोमेन",
          mr: "तात्पुरते / फेक बर्नर ईमेल डोमेन",
        },
        desc: {
          en: "This domain provides disposable throwaway inboxes frequently abused for anonymous scamming and fraud.",
          hi: "यह डोमेन अस्थायी इनबॉक्स प्रदान करता है जिसका उपयोग अक्सर अज्ञात रहकर धोखाधड़ी करने के लिए किया जाता है।",
          mr: "हे डोमेन तात्पुरते इनबॉक्स देते ज्याचा वापर अनेकदा सायबर गुन्ह्यांमध्ये केला जातो.",
        },
      });
    }
  }

  // 2. Authenticity & Brand evaluation
  if (isOfficialGov) {
    reasons.push({
      type: "success",
      title: {
        en: "Official Government of India Domain",
        hi: "भारत सरकार का आधिकारिक डोमेन",
        mr: "भारत सरकारचे अधिकृत डोमेन",
      },
      desc: {
        en: "Verified authentic .gov.in / .nic.in domain reserved exclusively for Indian government ministries and statutory portals.",
        hi: "प्रमाणित आधिकारिक .gov.in / .nic.in डोमेन जो केवल भारत सरकार के मंत्रालयों और संस्थाओं के लिए आरक्षित है।",
        mr: "खात्रीशीर अधिकृत .gov.in / .nic.in डोमेन जे केवळ भारत सरकारच्या मंत्रालये व अधिकृत संस्थांसाठी राखीव आहे.",
      },
    });
  } else if (isVerifiedEntity && verifiedEntityName) {
    reasons.push({
      type: "success",
      title: {
        en: `Verified Legitimate Domain: ${verifiedEntityName}`,
        hi: `सत्यापित आधिकारिक डोमेन: ${verifiedEntityName}`,
        mr: `सत्यापित अधिकृत डोमेन: ${verifiedEntityName}`,
      },
      desc: {
        en: "This domain matches the registered, genuine public domain name of this trusted organization.",
        hi: "यह डोमेन इस विश्वसनीय संस्था के पंजीकृत, वास्तविक सार्वजनिक डोमेन नाम से मेल खाता है।",
        mr: "हे डोमेन या नामांकित व विश्वासार्ह संस्थेच्या नोंदणीकृत अधिकृत डोमेनशी जुळते.",
      },
    });
  } else if (impersonatedBrand) {
    score -= 60;
    reasons.push({
      type: "danger",
      title: {
        en: `High Phishing Risk: Brand Impersonation of ${impersonatedBrand}`,
        hi: `उच्च फ़िशिंग जोखिम: ${impersonatedBrand} की नकली नकल`,
        mr: `अति धोका: ${impersonatedBrand} ची बनावट नक्कल`,
      },
      desc: {
        en: `The domain name attempts to mimic '${impersonatedBrand}', but does not belong to their verified official website. Criminals use this trick to steal credentials and OTPs.`,
        hi: `डोमेन नाम '${impersonatedBrand}' की नकल करने का प्रयास करता है, लेकिन यह उनकी आधिकारिक वेबसाइट नहीं है। साइबर अपराधी पासवर्ड और OTP चुराने के लिए ऐसा करते हैं।`,
        mr: `हे डोमेन नाव '${impersonatedBrand}' ची नक्कल करण्याचा प्रयत्न करत आहे, पण ही त्यांची खरी वेबसाइट नाही. सायबर गुन्हेगार पासवर्ड व OTP चोरण्यासाठी ही युक्ती वापरतात.`,
      },
    });
  }

  // 3. Subdomain Deception
  if (hasSubdomainSpoof) {
    score -= 40;
    reasons.push({
      type: "danger",
      title: {
        en: "Deceptive Subdomain / Host Spoofing Detected",
        hi: "धोखाधड़ी वाला सबडोमेन / होस्ट स्पूफिंग पाया गया",
        mr: "फसवणूक करणारा सबडोमेन / बनावट होस्ट आढळला",
      },
      desc: {
        en: "The link nests a trusted organization's name inside a deceptive third-party host to mislead unsuspecting victims.",
        hi: "लिंक किसी विश्वसनीय संस्था के नाम को किसी तीसरे पक्ष के धोखेबाज होस्ट के अंदर छुपाती है ताकि लोग भ्रमित हो जाएं।",
        mr: "वापरकर्त्याची दिशाभूल करण्यासाठी या लिंकमध्ये नामांकित संस्थेचे नाव तिसऱ्याच बनावट होस्टमध्ये जोडले आहे.",
      },
    });
  }

  // 4. DNS Resolution
  if (!dnsResult.resolved) {
    score -= 40;
    reasons.push({
      type: "danger",
      title: {
        en: "Domain Does Not Resolve (Unregistered or Inactive)",
        hi: "डोमेन मौजूद नहीं है (अपंजीकृत या बंद)",
        mr: "डोमेन अस्तित्वात नाही (नोंदणी नसलेले किंवा बंद)",
      },
      desc: {
        en: `DNS lookup failed (${dnsResult.error || "NXDOMAIN"}). Fake, temporary, or already taken-down scam links fail to resolve to a real web host.`,
        hi: `DNS जांच विफल रही। नकली, अल्पकालिक या पहले ही बंद कर दिए गए फ़िशिंग लिंक असली सर्वर पर नहीं जाते।`,
        mr: `DNS शोध अयशस्वी झाला. बनावट, तात्पुरत्या किंवा आधीच ब्लॉक केलेल्या फिशिंग लिंक्स खऱ्या सर्व्हरशी जोडल्या जात नाहीत.`,
      },
    });
  } else {
    reasons.push({
      type: "info",
      title: {
        en: "DNS Record Active",
        hi: "DNS रिकॉर्ड सक्रिय",
        mr: "DNS रेकॉर्ड सक्रिय",
      },
      desc: {
        en: `Domain resolves to valid IP addresses: ${dnsResult.ipAddresses.slice(0, 3).join(", ")}.`,
        hi: `डोमेन मान्य IP पते पर जाता है: ${dnsResult.ipAddresses.slice(0, 3).join(", ")}।`,
        mr: `डोमेन वैध IP पत्त्यावर जाते: ${dnsResult.ipAddresses.slice(0, 3).join(", ")}.`,
      },
    });
  }

  // 5. SSL / Encryption
  if (!isEmail) {
    if (protocolSpecified === "http") {
      score -= 30;
      reasons.push({
        type: "warning",
        title: {
          en: "Explicit Unencrypted Connection (HTTP)",
          hi: "असुरक्षित कनेक्शन (HTTP)",
          mr: "असुरक्षित कनेक्शन (HTTP)",
        },
        desc: {
          en: "The link explicitly requests unencrypted HTTP. Legitimate financial, government, and consumer services always enforce HTTPS.",
          hi: "लिंक स्पष्ट रूप से अनएन्क्रिप्टेड HTTP का उपयोग कर रही है। बैंक और सरकारी सेवाएं हमेशा सुरक्षित HTTPS का उपयोग करती हैं।",
          mr: "लिंकमध्ये थेट असुरक्षित HTTP वापरले आहे. बँक आणि शासकीय सेवा नेहमी सुरक्षित HTTPS वापरतात.",
        },
      });
    } else if (sslResult.checked) {
      if (sslResult.valid) {
        reasons.push({
          type: "success",
          title: {
            en: `Valid SSL/TLS Certificate (${sslResult.issuer})`,
            hi: `मान्य SSL/TLS सुरक्षा प्रमाणपत्र (${sslResult.issuer})`,
            mr: `वैध SSL/TLS सुरक्षा प्रमाणपत्र (${sslResult.issuer})`,
          },
          desc: {
            en: `Secure encrypted HTTPS supported. Certificate issued by ${sslResult.issuer}${sslResult.daysRemaining !== undefined ? ` (valid for ${sslResult.daysRemaining} more days)` : ""}.`,
            hi: `सुरक्षित एन्क्रिप्टेड HTTPS समर्थित है। प्रमाणपत्र जारीकर्ता: ${sslResult.issuer}${sslResult.daysRemaining !== undefined ? ` (${sslResult.daysRemaining} दिन शेष)` : ""}।`,
            mr: `सुरक्षित एन्क्रिप्टेड HTTPS उपलब्ध आहे. प्रमाणपत्र जारीकर्ता: ${sslResult.issuer}${sslResult.daysRemaining !== undefined ? ` (अजून ${sslResult.daysRemaining} दिवस वैध)` : ""}.`,
          },
        });
      } else {
        score -= 35;
        reasons.push({
          type: "danger",
          title: {
            en: "Invalid or Missing SSL Certificate",
            hi: "अमान्य या गायब SSL प्रमाणपत्र",
            mr: "अवैध किंवा उपलब्ध नसलेले SSL प्रमाणपत्र",
          },
          desc: {
            en: `HTTPS security handshake failed: ${sslResult.error || "Untrusted or self-signed certificate"}. Never enter passwords or personal data on sites without valid SSL.`,
            hi: `HTTPS सुरक्षा जांच विफल: ${sslResult.error || "अविश्वसनीय या स्व-हस्ताक्षरित प्रमाणपत्र"}। बिना वैध SSL वाली साइटों पर कभी पासवर्ड न डालें।`,
            mr: `HTTPS सुरक्षा तपासणी अयशस्वी: ${sslResult.error || "अविश्वसनीय प्रमाणपत्र"}. वैध SSL नसलेल्या साइट्सवर पासवर्ड किंवा वैयक्तिक माहिती भरू नका.`,
          },
        });
      }
    }
  }

  // 6. Shortened link & Redirection unmasking
  if (isShortener) {
    score -= 15;
    if (redirectResult.hasRedirect && redirectResult.finalDomain) {
      reasons.push({
        type: "warning",
        title: {
          en: `Shortened URL Unmasked ➔ Destination: ${redirectResult.finalDomain}`,
          hi: `शॉर्ट लिंक खोली गई ➔ अंतिम गंतव्य: ${redirectResult.finalDomain}`,
          mr: `शॉर्ट लिंक उलगडली ➔ मुख्य वेबसाइट: ${redirectResult.finalDomain}`,
        },
        desc: {
          en: `This shortened link redirects to: ${redirectResult.finalUrl}. Always verify the final destination before logging in.`,
          hi: `यह संक्षिप्त लिंक यहां ले जाती है: ${redirectResult.finalUrl}। लॉगिन करने से पहले अंतिम वेबसाइट की पुष्टि करें।`,
          mr: `ही शॉर्ट लिंक येथे घेऊन जाते: ${redirectResult.finalUrl}. लॉगिन करण्यापूर्वी अंतिम वेबसाइटची खात्री करा.`,
        },
      });
    } else {
      reasons.push({
        type: "warning",
        title: {
          en: "Shortened Link Conceals Final Destination",
          hi: "छोटा किया गया लिंक असली वेबसाइट को छुपाता है",
          mr: "शॉर्ट लिंक खरी वेबसाइट लपवते",
        },
        desc: {
          en: "URL shorteners conceal the ultimate destination domain. Cybercriminals frequently use them in SMS scams to bypass filters.",
          hi: "URL शॉर्टनर असली वेबसाइट को छुपाते हैं। धोखेबाज SMS घोटालों में फिल्टर से बचने के लिए इनका उपयोग करते हैं।",
          mr: "URL शॉर्टनर्स अंतिम वेबसाइट लपवतात. सायबर गुन्हेगार SMS फसवणुकीत यांचा वापर करतात.",
        },
      });
    }
  }

  // 7. Punycode / IDN Homograph
  if (hasPunycode) {
    score -= 50;
    reasons.push({
      type: "danger",
      title: {
        en: "Punycode / Homograph Character Lookalike Attack",
        hi: "प्यूनिकोड / हमशक्ल अक्षर फ़िशिंग हमला",
        mr: "प्यूनिकोड / हुबेहूब दिसणाऱ्या अक्षरांचा सायबर हल्ला",
      },
      desc: {
        en: "This domain uses non-standard or foreign character encodings (punycode) to visually mimic well-known websites (e.g., Cyrillic 'а' instead of Latin 'a').",
        hi: "यह डोमेन लोकप्रिय वेबसाइटों की नकल करने के लिए विदेशी या विशेष अक्षरों (प्यूनिकोड) का उपयोग करता है।",
        mr: "हे डोमेन नामांकित वेबसाइट्सची हुबेहूब नक्कल करण्यासाठी वेगळ्या लिपीतील अक्षरे (प्यूनिकोड) वापरत आहे.",
      },
    });
  }

  // 8. Numerical IP address
  if (isIpAddress) {
    score -= 45;
    reasons.push({
      type: "danger",
      title: {
        en: "Direct Numerical IP Address (No Registered Domain)",
        hi: "सीधा संख्यात्मक IP पता (कोई डोमेन नाम नहीं)",
        mr: "थेट संख्यात्मक IP पत्ता (कोणतेही नोंदणीकृत डोमेन नाही)",
      },
      desc: {
        en: "The link points directly to a raw IP address instead of an authenticated domain name. This is a trademark pattern of temporary phishing servers.",
        hi: "लिंक किसी अधिकृत डोमेन नाम के बजाय सीधे कच्चे IP पते पर ले जाती है। यह अल्पकालिक फ़िशिंग सर्वरों का मुख्य लक्षण है।",
        mr: "लिंक अधिकृत डोमेन नावाऐवजी थेट आयपी पत्त्यावर घेऊन जाते. हे तात्पुरत्या फिशिंग सर्व्हरचे प्रमुख लक्षण आहे.",
      },
    });
  }

  // 9. Risky TLD
  if (hasRiskyTld) {
    score -= 20;
    reasons.push({
      type: "warning",
      title: {
        en: "High-Risk Domain Extension (TLD)",
        hi: "उच्च जोखिम वाला डोमेन एक्सटेंशन",
        mr: "धोकादायक डोमेन एक्स्टेंशन",
      },
      desc: {
        en: `Uses a domain extension frequently registered for spam and automated scams due to ultra-cheap pricing (${RISKY_TLDS.filter((t) => hostname.endsWith(t)).join(", ")}).`,
        hi: `अत्यधिक सस्ते होने के कारण ऐसे डोमेन एक्सटेंशन अक्सर साइबर घोटालों में उपयोग किए जाते हैं।`,
        mr: `अत्यंत स्वस्त असल्याने हे डोमेन एक्स्टेंशन अनेकदा बनावट व फसव्या कामांसाठी वापरले जातात.`,
      },
    });
  }

  // 10. Free hosting service abuse
  if (isFreeHosting && (impersonatedBrand || foundKeywords.length > 0)) {
    score -= 35;
    reasons.push({
      type: "danger",
      title: {
        en: "Free Hosting / Tunneling Service Abuse",
        hi: "मुफ्त होस्टिंग / टनलिंग सेवा का दुरुपयोग",
        mr: "मोफत होस्टिंग सेवेचा गैरवापर",
      },
      desc: {
        en: "Scammers frequently host disposable fake banking forms on free platforms like ngrok, vercel, or firebaseapp to bypass domain reputation checks.",
        hi: "धोखेबाज डोमेन जांच से बचने के लिए मुफ्त प्लेटफॉर्म पर फर्जी बैंक फॉर्म होस्ट करते हैं।",
        mr: "सायबर गुन्हेगार पकडले जाऊ नये म्हणून मोफत प्लॅटफॉर्मवर बनावट फॉर्म्स तयार करतात.",
      },
    });
  }

  // 11. Fraud & urgency keywords
  if (foundKeywords.length > 0) {
    score -= foundKeywords.length * 10;
    reasons.push({
      type: "warning",
      title: {
        en: `High-Urgency & Scam Keywords Detected (${foundKeywords.slice(0, 4).join(", ")})`,
        hi: `संदिग्ध व तत्काल कार्रवाई वाले शब्द मिले (${foundKeywords.slice(0, 4).join(", ")})`,
        mr: `संशयास्पद व भीती दाखवणारे शब्द आढळले (${foundKeywords.slice(0, 4).join(", ")})`,
      },
      desc: {
        en: `Path or query contains keywords commonly used in SMS/WhatsApp social engineering: ${foundKeywords.join(", ")}.`,
        hi: `पाथ में ऐसे शब्द हैं जो SMS/व्हाट्सएप घोटालों में अक्सर देखे जाते हैं: ${foundKeywords.join(", ")}।`,
        mr: `पाथमध्ये असे शब्द आहेत जे फसव्या SMS किंवा व्हॉट्सॲप संदेशांमध्ये वापरले जातात: ${foundKeywords.join(", ")}.`,
      },
    });
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine safety verdict
  let safetyVerdict: DetailedLinkAnalysis["safetyVerdict"] = "safe";
  if (isOfficialGov || (isVerifiedEntity && (!isEmail ? sslResult.valid : emailRecordResult.hasMxRecords))) {
    safetyVerdict = "safe_verified";
    score = Math.max(95, score);
  } else if (
    impersonatedBrand ||
    hasSubdomainSpoof ||
    hasPunycode ||
    isIpAddress ||
    isDisposableEmail ||
    !dnsResult.resolved ||
    (isEmail && !emailRecordResult.hasMxRecords) ||
    (!isEmail && sslResult.checked && !sslResult.valid && score < 50)
  ) {
    safetyVerdict = "danger";
  } else if (score < 75 || hasRiskyTld || isShortener || foundKeywords.length > 0 || protocolSpecified === "http") {
    safetyVerdict = "caution";
  } else {
    safetyVerdict = "safe";
  }

  // Default clean reason if perfectly safe with no red flags
  if (reasons.length === 0 || (reasons.length === 2 && dnsResult.resolved && !impersonatedBrand)) {
    reasons.unshift({
      type: "success",
      title: {
        en: "Standard Security Protocols Verified",
        hi: "सामान्य सुरक्षा मानक सत्यापित",
        mr: "सामान्य सुरक्षा निकष पूर्ण",
      },
      desc: {
        en: "Active DNS records, standard domain registration, and no known brand imitation markers detected.",
        hi: "सक्रिय DNS रिकॉर्ड, सामान्य डोमेन पंजीकरण, और कोई स्पष्ट नकल नहीं पाई गई।",
        mr: "सक्रिय DNS, अधिकृत डोमेन आणि कोणत्याही ब्रँडची नक्कल आढळली नाही.",
      },
    });
  }

  return {
    inputUrl: rawInput,
    normalizedUrl: workingUrl,
    domain: hostname,
    protocol: protocolSpecified || (sslResult.valid ? "https" : "http"),
    userSpecifiedProtocol: hasUserProtocol,
    dns: dnsResult,
    ssl: sslResult,
    redirect: {
      hasRedirect: redirectResult.hasRedirect,
      redirectCount: redirectResult.redirectCount,
      finalUrl: redirectResult.finalUrl,
      finalDomain: redirectResult.finalDomain,
      isShortener,
    },
    securityHeaders: {
      hsts: redirectResult.hsts,
    },
    emailAnalysis: isEmail
      ? {
          isEmail: true,
          emailAddress: trimmed,
          mailbox,
          hasMxRecords: emailRecordResult.hasMxRecords,
          mxHosts: emailRecordResult.mxHosts,
          hasDmarc: emailRecordResult.hasDmarc,
          hasSpf: emailRecordResult.hasSpf,
          disposableEmailDomain: isDisposableEmail,
        }
      : undefined,
    heuristics: {
      isOfficialGov,
      isVerifiedEntity,
      verifiedEntityName,
      impersonatedBrand,
      hasSubdomainSpoof,
      hasPunycode,
      isIpAddress,
      hasRiskyTld,
      foundKeywords,
    },
    safetyVerdict,
    safetyScore: score,
    reasons,
  };
}

export const inspectLinkDomain = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        url: z.string().trim().min(1).max(2048),
      })
      .parse(d)
  )
  .handler(async ({ data }) => {
    return performDeepAnalysis(data.url);
  });
