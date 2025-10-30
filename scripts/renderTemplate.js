import nunjucks from 'nunjucks';
import fs from 'fs';
import path from 'path';

// Configure Nunjucks to use the templates directory
nunjucks.configure(path.join(path.dirname(''), 'templates/cv-eng'), {
	autoescape: true,
});

// Load the JSON data
const data = JSON.parse(fs.readFileSync('lebenslauf.json', 'utf-8'));

// Render the template with the JSON data
const output = nunjucks.render('table.njk', { sections: data.sections });

// Write the output to an HTML file
fs.writeFileSync('output.html', output);

console.log('HTML output written to output.html');
