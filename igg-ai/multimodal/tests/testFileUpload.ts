import { LangGraphOrchestrator } from '../../runtime/source/orchestration/LangGraphOrchestrator';
import { FileData } from '../../security/source/validators/FileValidator';

async function testFileUpload() {
  const orchestrator = new LangGraphOrchestrator();

  const mockPdf: FileData = {
    name: 'Uber Clone Requirements.pdf',
    mimeType: 'application/pdf',
    size: 2 * 1024 * 1024, // 2MB
    buffer: Buffer.from('mock pdf content'),
  };

  const query = 'Please review this requirement document and give me a proposal.';

  console.log('\n=============================================');
  console.log('TESTING PHASE 8: MULTIMODAL PLATFORM');
  console.log('=============================================\n');
  console.log(`Uploading file: ${mockPdf.name}`);
  console.log(`User Query: ${query}\n`);

  try {
    const response = await orchestrator.run('session-multimodal-test', query, mockPdf);

    console.log('\n--- Final Consultant Response ---');
    console.log(response);
    console.log('---------------------------------\n');
  } catch (error) {
    console.error('Test Failed:', error);
  }
}

testFileUpload();
