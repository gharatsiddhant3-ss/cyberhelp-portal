import { defineMcp } from "@lovable.dev/mcp-js";
import safety from "./tools/safety";
import articles from "./tools/articles";
import breach from "./tools/breach";
import survey from "./tools/survey";
import linkInspector from "./tools/link-inspector";

export default defineMcp({
  name: "cyber-guardian-hub",
  title: "Cyber Guardian Hub",
  version: "0.2.0",
  instructions:
    "Public cyber-help tools for India: helplines (1930), reporting steps, safety tips, link & domain authenticity inspection, awareness articles in English, Hindi or Marathi; email leak checks; and aggregated survey results.",
  tools: [safety, articles, breach, survey, linkInspector],
});

