import dotenv from 'dotenv';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @typedef GetHTMLParam
 * @type {object}
 * @property {string} jobTitle
 * @property {{
 *		name: string,
 *		ccorrespondence?: { lastName: string, isMale: boolean },
 *		street: string,
 *		houseNumber: string,
 *		postalCode: string,
 *		city: string,
 *	}} company - your name.
 */

/**
 * @param {GetHTMLParam } param
 * @returns {string}
 */
export const getHTML = (param) => {
	console.log('reading htmlTemplate...');
	const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
	return replacer(html, param);
};

/**
 * @param {string} html
 * @param {GetHTMLParam } param
 * @returns {string}
 */
const replacer = (html, param) => {
	const { company, jobTitle } = param;
	console.log('replacing placeholders...');
	return html
		.replace(/{{company.name}}/g, company.name)
		.replace(/{{company.street}}/g, company.street)
		.replace(/{{company.houseNumber}}/g, company.houseNumber)
		.replace(/{{company.postalCode}}/g, company.postalCode)
		.replace(/{{company.city}}/g, company.city)
		.replace(/{{jobTitle}}/g, jobTitle)
		.replace(/{{signature.src}}/g, process.env.SIGNATURE_SRC || 'signature.png')
		.replace(
			/{{salutation}}/g,
			!company.ccorrespondence
				? 'Sehr geehrte Damen und Herren'
				: `Sehr geehrte${company.ccorrespondence.isMale ? 'r' : ''} ${
						company.ccorrespondence.isMale ? 'Herr' : 'Frau'
				  } ${company.ccorrespondence.lastName}`
		)
		.replace(
			/{{date}}/g,
			new Date().toLocaleDateString('de-DE', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
			})
		);
};
