import { ITool } from "./ITool";
import { retrievalEngine } from "../../../rag/source/RetrievalEngine";

export class SearchWebsiteTool implements ITool {
  name = "search_website";
  description = "Search the verified company knowledge base (website, docs, portfolio, pricing). Use this tool whenever the user asks about the company or its services.";
  
  schema = {
    type: "object",
    properties: {
      query: { type: "string", description: "The search query" }
    },
    required: ["query"]
  };

  async execute(args: Record<string, any>): Promise<any> {
    const query = args.query as string;
    const context = await retrievalEngine.search(query);
    
    // Return a condensed version of the retrieved knowledge
    return {
      documents: context.finalPackage?.contentChunks || [],
      citations: context.finalPackage?.citations || []
    };
  }
}
