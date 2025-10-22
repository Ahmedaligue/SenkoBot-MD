	import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { readdir, stat, readFile, writeFile } from 'fs/promises';

const targets = ['plugins', 'lib', 'handler.js', 'index.js', 'settings.js'];

async function purifyFile(filePath) {
  let content = await readFile(filePath, 'utf-8');
  content = content
    .split('\n')
    .map(line => line.replace(/\/\/.*$/g, '').replace(/;/g, '').trimEnd())
    .filter(line => line.trim() !== '' || line === '')
    .join('\n');
  await writeFile(filePath, content);
}

async  function walkAndPurify(entry) {
  const stats = await stat(entry);
  if (stats.isDirectory()) {
    const files = await readdir(entry);
    for (const file of files) {
      await walkAndPurify(path.join(entry, file));
    }
  } else if (entry.endsWith('.js')) {
    await purifyFile(entry);
  }
}

(async () => {
  for (const target of targets) {
    if (fs.existsSync(target)) {
      await walkAndPurify(target);
    }
  }
  console.log('✨ Purificación completada');
})();
