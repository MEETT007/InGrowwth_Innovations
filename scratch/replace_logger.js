const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const stdout = execSync('git grep -l -E "console\\.(log|error|warn)" src/').toString();
const files = stdout.split('\n').filter(Boolean);

const excludedFiles = [
  'src/lib/logger.ts',
  'src/lib/mail.tsx',
  'src/app/api/upload/route.ts'
];

for (const file of files) {
  if (excludedFiles.includes(file)) continue;

  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  if (!content.includes("import { logger } from '@/lib/logger';")) {
    const importRegex = /^(?:import .*?from .*?;?)$/gm;
    let lastImportIndex = 0;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      lastImportIndex = match.index + match[0].length;
    }
    
    if (lastImportIndex > 0) {
      content = content.slice(0, lastImportIndex) + "\nimport { logger } from '@/lib/logger';" + content.slice(lastImportIndex);
    } else {
      content = "import { logger } from '@/lib/logger';\n" + content;
    }
  }

  const newContent = content
    .replace(/console\.log\(/g, 'logger.info(')
    .replace(/console\.warn\(/g, 'logger.warn(')
    .replace(/console\.error\(/g, 'logger.error(');

  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    console.log('Replaced console in ' + file);
  }
}

// Don't forget igg-ai/core/source/utils/Logger.ts
const iggLogger = 'igg-ai/core/source/utils/Logger.ts';
if (fs.existsSync(iggLogger)) {
  let content = fs.readFileSync(iggLogger, 'utf8');
  content = content.replace("process.env.NODE_ENV !== 'production'", "process.env.LOG_ENABLED === 'true' || process.env.NEXT_PUBLIC_LOG_ENABLED === 'true'");
  fs.writeFileSync(iggLogger, content);
  console.log('Updated ' + iggLogger);
}

