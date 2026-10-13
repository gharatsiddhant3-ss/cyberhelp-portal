import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { loadSurveyStats } from "../../survey.functions";

export default defineTool({
  name: "get_survey_results",
  title: "Get survey results",
  description: "Return live aggregated answer counts from the cybercrime awareness field survey (no personal details).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async () => {
    try {
      const s = await loadSurveyStats();
      const data = {
        total: s.total,
        updatedAt: s.updatedAt,
        questions: s.questions.map((q) => ({ question: q.question, responses: q.responses, answers: q.answers.map((a) => ({ label: a.label, count: a.count })) })),
      };
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data };
    } catch {
      throw new ToolError("Survey results are unavailable right now.");
    }
  },
});
