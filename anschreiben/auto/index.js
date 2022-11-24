import html_to_pdf from 'html-pdf-node';
import { getHTML } from './utils.js';

/**
 * @type {import('./utils').GetHTMLParam[]}
 */
const datas = [
	{
		company: {
			name: 'Company 1',
			street: 'Street 1',
			houseNumber: '1',
			postalCode: '12345',
			city: 'City 1',
			ccorrespondence: { lastName: 'Schneider', isMale: false },
		},
		jobTitle: 'Job Title 1',
	},
	{
		company: {
			name: 'MSG Systems AG',
			street: 'Münchner Straße',
			houseNumber: '722',
			postalCode: '82031',
			city: 'Grünwald',
			ccorrespondence: { lastName: 'Müller', isMale: true },
		},
		jobTitle: 'Werksstudent im Bereich Softwareentwicklung',
	},
	{
		company: {
			name: 'Company 2',
			street: 'Street 2',
			houseNumber: '2',
			postalCode: '12345',
			city: 'City 2',
		},
		jobTitle: 'Job Title 2',
	},
];

/**
 * @type { html_to_pdf.Options}
 */
const options = {
	format: 'A4',
	printBackground: true,
	preferCSSPageSize: true,
	margin: {
		top: '5mm',
		bottom: '5mm',
		left: '10mm',
		right: '10mm',
	},
};

const files = datas.map((data, index) => ({
	content: getHTML(data),
	filename: `anschreiben_${data.company.name.replace(
		/ /g,
		'-'
	)}_${data.jobTitle.replace(/ /g, '-')}.pdf`,
}));

files.forEach((file, index) => {
	html_to_pdf.generatePdf(
		file,
		{ ...options, path: file.filename },
		(_, pdfBuffer) => {
			console.log(`pdf ${index} generated`);
		}
	);
});
