import { ITool } from "./ITool";
import { Logger } from "../../../core/source/utils/Logger";

export class WebSearchTool implements ITool {
  name = "web_search";
  description = "Search the public web for real-time technical documentation, current trends, industry standards, and market ideas.";

  schema = {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query keywords" }
    },
    required: ["query"]
  };

  async execute(args: Record<string, any>): Promise<any> {
    const query = args.query as string;
    Logger.info(`[WebSearchTool] Searching web for: ${query}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        return { results: [], query };
      }

      const html = await res.text();
      const snippetRegex = /<a class="result__snippet[^>]*>([\s\S]*?)<\/a>/g;

      const snippets: string[] = [];
      let match;
      while ((match = snippetRegex.exec(html)) !== null && snippets.length < 5) {
        const cleanSnippet = match[1].replace(/<[^>]+>/g, '').trim();
        if (cleanSnippet) snippets.push(cleanSnippet);
      }

      return {
        query,
        snippets: snippets.slice(0, 4),
      };
    } catch (err: any) {
      Logger.warn(`[WebSearchTool] Search failed: ${err.message}`);
      return { query, snippets: [] };
    }
  }
}
