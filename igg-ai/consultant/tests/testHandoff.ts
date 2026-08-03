import { LangGraphOrchestrator } from '../../runtime/source/orchestration/LangGraphOrchestrator';

async function testHandoff() {
  const orchestrator = new LangGraphOrchestrator();
  const query = 'Can you draft a custom NDA and SLA for our new enterprise contract?';

  console.log('\n=============================================');
  console.log('TESTING v1.0 LAUNCH: HUMAN HANDOFF ENGINE');
  console.log('=============================================\n');
  console.log(`User Query: "${query}"\n`);

  try {
    const response = await orchestrator.run('session-handoff-test', query);

    console.log('\n--- Final Orchestrator Response ---');
    console.log(`Text Output: ${response.text}`);
    console.log(`Requires Handoff: ${response.requiresHandoff}`);
    console.log(`Handoff Reason: ${response.handoffReason}`);
    console.log('-----------------------------------\n');

    if (response.requiresHandoff && response.handoffReason === 'LEGAL_INQUIRY') {
      console.log('✅ SUCCESS: Handoff Engine correctly intercepted the legal inquiry!');
    } else {
      console.log('❌ FAILED: Handoff Engine did not intercept as expected.');
    }
  } catch (error) {
    console.error('Test Failed with Exception:', error);
  }
}

testHandoff();
