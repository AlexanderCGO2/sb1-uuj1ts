import { StateGraph, END } from "langgraph";

export const createWorkflow = (researchAgent, supervisorAgent) => {
  const workflow = new StateGraph({
    channels: {
      query: {},
      context: {},
      results: {},
      previous_research: {},
      decision: {}
    }
  });

  // Add nodes for each agent
  workflow.addNode("research", researchAgent);
  workflow.addNode("supervise", supervisorAgent);

  // Connect research to supervision
  workflow.addEdge("research", "supervise");

  // Add conditional edges for research iteration
  workflow.addConditionalEdges(
    "supervise",
    (state) => {
      if (state.decision.continue_research) {
        // Update context with previous research before continuing
        state.previous_research = state.results;
        return "research";
      }
      return END;
    }
  );

  return workflow.compile();
};