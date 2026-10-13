import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { articles } from "../../content";

export default defineTool({
  name: "list_awareness_articles",
  title: "List awareness articles",
  description: "Return the site's cybercrime awareness articles.",
  inputSchema: { lang: z.enum(["en", "hi", "mr"]).default("en").describe("Language: en, hi (Hindi) or mr (Marathi).") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ lang }) => {
    const data = { articles: articles.map((a) => ({ title: a.title[lang], body: a.body[lang] })) };
    return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
  },
});
