import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { lookupEmailBreach } from "../../breach.functions";

export default defineTool({
  name: "check_email_leak",
  title: "Check email leak",
  description: "Check public breach records to see whether an email address appeared in known data leaks.",
  inputSchema: { email: z.string().trim().email().max(255).describe("Email address to check.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ email }) => {
    const r = await lookupEmailBreach(email);
    if (!r.ok) throw new ToolError("The breach lookup service is unavailable right now. Try again later.");
    const data = { email, leaked: r.breaches.length > 0, breaches: r.breaches };
    const text = data.leaked ? `Found in ${r.breaches.length} breach(es): ${r.breaches.join(", ")}` : "No known breaches found.";
    return { content: [{ type: "text", text }], structuredContent: data };
  },
});
