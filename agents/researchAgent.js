import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";

export const createResearchAgent = (replicate) => {
  const agent = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.7,
  });

  const researchTemplate = PromptTemplate.fromTemplate(`
    Research Task: {query}
    Focus Areas: {context.focus_areas}
    
    Analyze the following aspects:
    1. Current features and capabilities
    2. State management approaches
    3. Integration with other frameworks
    4. Best practices and patterns
    
    Previous findings: {previous_research}
    
    Provide a detailed analysis focusing on the specified areas.
  `);

  return RunnableSequence.from([
    {
      research: async (input) => {
        // GitHub API could be used here to fetch latest releases and issues
        const repoInfo = {
          name: "langgraph",
          organization: "langchain-ai",
          latestVersion: "0.0.2",
        };

        return {
          query: input.query,
          context: input.context,
          previous_research: input.previous_research || "",
          repo_info: repoInfo
        };
      }
    },
    researchTemplate,
    agent,
    new StringOutputParser(),
  ]);
};