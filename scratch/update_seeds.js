const fs = require('fs');
const files = [
  'prisma/seed.ts',
  'seed.ts',
  'seed.mjs',
  'scripts/seed-blogs.ts',
  'scripts/seed-legacy-projects.ts',
  'scripts/seed-services.ts'
];
const guard = `if (process.env.APP_ENV === 'production' && process.env.ALLOW_PROD_SEED !== 'true') {
  console.error('Refusing to run seed in production. Set ALLOW_PROD_SEED="true" to override.');
  process.exit(1);
}
`;

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('ALLOW_PROD_SEED')) {
      // For seed.mjs which might import something, maybe it's fine at top. But some imports must be at the very top.
      // Let's insert it after the imports if possible, or just at the top for JS.
      // Actually, since it's a script, inserting at the top is fine for CJS, but for ESM, imports must come first.
      
      const importRegex = /^(?:import .*?from .*?;?|import\s+[\s\S]*?from\s+.*?;?)$/gm;
      let lastImportIndex = 0;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        lastImportIndex = match.index + match[0].length;
      }
      
      if (lastImportIndex > 0) {
        content = content.slice(0, lastImportIndex) + '\n\n' + guard + content.slice(lastImportIndex);
      } else {
        content = guard + '\n' + content;
      }
      
      fs.writeFileSync(file, content);
      console.log('Added guard to ' + file);
    }
  }
}
