import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';

const templatePath = path.resolve('templates/cv-eng/index.hbs');
const dataPath = path.resolve('data/lebenslauf.json');
const outDir = path.resolve('dist');
const outPath = path.join(outDir, 'index.html');

async function run() {
  await fs.mkdir(outDir, { recursive: true });
  const [tplRaw, dataRaw] = await Promise.all([
    fs.readFile(templatePath, 'utf8'),
    fs.readFile(dataPath, 'utf8')
  ]);

  const data = JSON.parse(dataRaw);
  const tpl = Handlebars.compile(tplRaw);
  const result = tpl(data);
  await fs.writeFile(outPath, result, 'utf8');
  console.log('Generated', outPath);
}

run().catch((err) => { console.error(err); process.exit(1); });
