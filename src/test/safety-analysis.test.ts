import { describe, expect, it } from "vitest";
import { performDeepAnalysis } from "../lib/safety.functions";

describe("performDeepAnalysis", () => {
  it("accurately analyzes clean domain google.com without false HTTP suspicion", async () => {
    const res = await performDeepAnalysis("google.com");
    expect(res.domain).toBe("google.com");
    expect(res.heuristics.isVerifiedEntity).toBe(true);
    expect(res.heuristics.impersonatedBrand).toBeUndefined();
    // Must NOT flag unencrypted HTTP when user didn't enter http://
    expect(res.reasons.some((r) => r.title.en.includes("Explicit Unencrypted Connection"))).toBe(false);
  });

  it("identifies official Government of India domains", async () => {
    const res = await performDeepAnalysis("cybercrime.gov.in");
    expect(res.heuristics.isOfficialGov).toBe(true);
    expect(res.safetyVerdict).toBe("safe_verified");
    expect(res.reasons.some((r) => r.title.en.includes("Official Government of India"))).toBe(true);
  });

  it("identifies legitimate banking domains", async () => {
    const res = await performDeepAnalysis("https://onlinesbi.sbi");
    expect(res.heuristics.isVerifiedEntity).toBe(true);
    expect(res.heuristics.impersonatedBrand).toBeUndefined();
  });

  it("flags brand impersonation and phishing keywords in scam URLs", async () => {
    const res = await performDeepAnalysis("http://sbi-kyc-verify.xyz/login");
    expect(res.heuristics.impersonatedBrand).toBe("State Bank of India (SBI)");
    expect(res.heuristics.hasRiskyTld).toBe(true);
    expect(res.heuristics.foundKeywords).toContain("kyc");
    expect(res.safetyVerdict).toBe("danger");
    expect(res.safetyScore).toBeLessThan(50);
  });

  it("correctly identifies and inspects email addresses", async () => {
    const res = await performDeepAnalysis("helpdesk@cybercrime.gov.in");
    expect(res.emailAnalysis?.isEmail).toBe(true);
    expect(res.emailAnalysis?.mailbox).toBe("helpdesk");
    expect(res.domain).toBe("cybercrime.gov.in");
    expect(res.heuristics.isOfficialGov).toBe(true);
  });

  it("flags raw numerical IP addresses as danger", async () => {
    const res = await performDeepAnalysis("192.168.1.1");
    expect(res.heuristics.isIpAddress).toBe(true);
    expect(res.safetyVerdict).toBe("danger");
  });
});
