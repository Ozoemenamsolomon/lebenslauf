var html_to_pdf = require('html-pdf-node');
var fs = require('fs');
var path = require('path');

/**
 * @param {{
 *	company: {
 *		name: string,
 *		street: string,
 *		houseNumber: string,
 *		postalCode: string,
 *		city: string,
 *	},
 *  jobTitle: string,
 *}} data
 * @returns {string}
 */
const generateHTMLStringContent = ({ company, jobTitle }) => {
	const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
	const htmlWithData = html
		.replace(/{{company.name}}/g, company.name)
		.replace(/{{company.street}}/g, company.street)
		.replace(/{{company.houseNumber}}/g, company.houseNumber)
		.replace(/{{company.postalCode}}/g, company.postalCode)
		.replace(/{{company.city}}/g, company.city)
		.replace(/{{jobTitle}}/g, jobTitle);

	console.log(htmlWithData);

	return htmlWithData;
};

/**
 * @type { html_to_pdf.Options}
 */
const options = { format: 'A4', margin: {} };

const file = {
	content: generateHTMLStringContent({
		company: {
			name: 'Test',
			street: 'Test',
			houseNumber: 'Test',
			postalCode: 'Test',
			city: 'Test',
		},
		jobTitle: 'Test',
	}),
};

html_to_pdf.generatePdf(file, options, (_, pdfBuffer) => {
	console.log('PDF Buffer:-', pdfBuffer);
});
