import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { performDeepAnalysis } from "../../safety.functions";

export default defineTool({
  name: "inspect_link_authenticity",
  title: "Inspect link and domain authenticity",
  description:
    "Analyze a URL or domain name for phishing risks, typosquatting brand impersonation, SSL/TLS certificate validity, DNS resolution, deceptive subdomains, and suspicious redirect hops.",
  inputSchema: {
    url: z.string().describe("The URL or domain to analyze (e.g. 'google.com', 'sbi-kyc-update.xyz', or full URL)."),
    lang: z.enum(["en", "hi", "mr"]).default("en").describe("Language for output reasoning: en, hi, or mr."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ url, lang }) => {
    const analysis = await performDeepAnalysis(url);
    const localizedReasons = analysis.reasons.map((r) => ({
      type: r.type,
      title: r.title[lang],
      description: r.desc[lang],
    }));

    const result = {
      domain: analysis.domain,
      verdict: analysis.safetyVerdict,
      safetyScore: analysis.safetyScore,
      sslValid: analysis.ssl.valid,
      sslIssuer: analysis.ssl.issuer,
      dnsResolved: analysis.dns.resolved,
      ipAddresses: analysis.dns.ipAddresses,
      isOfficialGov: analysis.heuristics.isOfficialGov,
      isVerifiedEntity: analysis.heuristics.isVerifiedEntity,
      impersonatedBrand: analysis.heuristics.impersonatedBrand,
      finalDestinationUrl: analysis.redirect.finalUrl,
      emailAnalysis: analysis.emailAnalysis,
      reasons: localizedReasons,
    };


    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  },
});
