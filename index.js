import Replicate from "replicate";
import { createResearchAgent } from "./agents/researchAgent.js";
import { createSupervisorAgent } from "./agents/supervisorAgent.js";
import { createWorkflow } from "./workflow/graph.js";

if (!process.env.REPLICATE_API_TOKEN) {
  console.error("Error: REPLICATE_API_TOKEN environment variable is not set");
  process.exit(1);
}

if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is not set");
  process.exit(1);
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const researchAgent = createResearchAgent(replicate);
const supervisorAgent = createSupervisorAgent();
const chain = createWorkflow(researchAgent, supervisorAgent);

try {
  console.log("Starting LangGraph.js research...");
  const result = await chain.invoke({
    query: "langgraph javascript framework features and capabilities",
    context: {
      focus_areas: [
        "state management",
        "agent coordination",
        "workflow creation",
        "latest features"
      ]
    }
  });
  console.log("Research Results:", result);
} catch (error) {
  console.error("Error during research:", error);
}