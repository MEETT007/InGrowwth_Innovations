import fs from 'fs';
import path from 'path';
import { LangGraphOrchestrator } from '../../runtime/source/orchestration/LangGraphOrchestrator';

interface TestCase {
  id: string;
  query: string;
  expectedIntent: string;
  expectedKeywords: string[];
}

export class EvalRunner {
  private datasetPath: string;
  private orchestrator: LangGraphOrchestrator;

  constructor() {
    this.datasetPath = path.resolve(__dirname, '../datasets/baseline.json');
    this.orchestrator = new LangGraphOrchestrator();
  }

  async runEvals() {
    console.log('Starting Evaluation Run...');
    const data = fs.readFileSync(this.datasetPath, 'utf-8');
    const testCases: TestCase[] = JSON.parse(data);

    let totalLatency = 0;
    let successfulRuns = 0;

    for (const testCase of testCases) {
      console.log(`\nEvaluating [${testCase.id}]: "${testCase.query}"`);

      const startTime = Date.now();
      try {
        const response = await this.orchestrator.run(`eval-${Date.now()}`, testCase.query);

        const responseText = response.text;
        const latency = Date.now() - startTime;
        totalLatency += latency;

        // 1. Check Groundedness (Did it use the provided context or hallucinate?)
        const isGrounded = responseText
          .toLowerCase()
          .includes(testCase.expectedKeywords[0].toLowerCase());

        // 2. Check Relevance (Is it actually answering the question?)
        const isRelevant = responseText.length > 50;

        console.log(`  -> Latency: ${latency}ms`);
        console.log(`  -> Contains Keywords: ${isGrounded ? '✅' : '❌'}`);
        console.log(`  -> Response: ${responseText.substring(0, 100)}...`);

        if (isGrounded && isRelevant) {
          successfulRuns++;
        }
      } catch (error) {
        console.error(`  -> Failed:`, error);
      }
    }

    console.log(`\n============================`);
    console.log(`Evaluation Summary`);
    console.log(`============================`);
    console.log(`Total Cases: ${testCases.length}`);
    console.log(`Successful: ${successfulRuns}`);
    console.log(`Avg Latency: ${Math.round(totalLatency / testCases.length)}ms`);
    console.log(`Relevance Score: ${Math.round((successfulRuns / testCases.length) * 100)}%`);
  }
}

// To run this directly:
new EvalRunner().runEvals();
