import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { helplines, linkDo, linkSigns, reportSteps, tips } from "../../content";

export default defineTool({
  name: "get_cyber_safety_guide",
  title: "Get cyber safety guide",
  description: "Return emergency helplines, cybercrime reporting steps, safety tips and suspicious-link guidance.",
  inputSchema: { lang: z.enum(["en", "hi", "mr"]).default("en").describe("Language: en, hi (Hindi) or mr (Marathi).") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lang }) => {
    const data = {
      helplines: helplines.map((h) => ({ number: h.num, name: h.name[lang], link: h.href })),
      reportSteps: reportSteps.map((s) => s[lang]),
      safetyTips: tips.map((s) => s[lang]),
      suspiciousLinkSigns: linkSigns.map((s) => s[lang]),
      whatToDoWithSuspiciousLinks: linkDo.map((s) => s[lang]),
    };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
  },
});
