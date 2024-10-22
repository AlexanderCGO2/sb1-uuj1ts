import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

export const createSupervisorAgent = () => {
  const agent = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.3,
  });

  const supervisorTemplate = PromptTemplate.fromTemplate(`
    Review the research findings on LangGraph.js:

    {results}

    Evaluate the following:
    1. Completeness of information
    2. Coverage of focus areas
    3. Need for additional research
    4. Action items and recommendations

    Provide a decision on whether more research is needed and a summary of findings.
  `);

  return RunnableSequence.from([
    {
      supervise: async (input) => {
        const analysis = {
          coverage_score: calculateCoverageScore(input.results),
          missing_areas: identifyMissingAreas(input.results),
          continue_research: shouldContinueResearch(input.results)
        };

        return {
          results: input.results,
          analysis
        };
      }
    },
    supervisorTemplate,
    agent,
    new StringOutputParser(),
  ]);
};

function calculateCoverageScore(results) {
  const keyAreas = ['state management', 'workflow', 'agents', 'features'];
  return keyAreas.filter(area => 
    results.toLowerCase().includes(area)
  ).length / keyAreas.length;
}

function identifyMissingAreas(results) {
  const requiredAreas = ['state management', 'workflow', 'agents', 'features'];
  return requiredAreas.filter(area => 
    !results.toLowerCase().includes(area)
  );
}

function shouldContinueResearch(results) {
  const coverageScore = calculateCoverageScore(results);
  const missingAreas = identifyMissingAreas(results);
  return coverageScore < 0.8 || missingAreas.length > 1;
}