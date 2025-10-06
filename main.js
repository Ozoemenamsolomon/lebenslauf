// @ts-check
import myCreateElement from './src/myCreateElement.js';
import { renderData } from './src/render.js';
import {
	clearSections,
	jsonPathForLang,
	setActiveLangButton,
} from './src/utils.js';

const sectionsContainer = document.querySelector('#sections');
const profilePicturePath = './profile-picture.jpg';
const signaturePath = './signature.png';

/** @type {'de'|'en'} */
let currentLang = 'de'; // default to German

const langPathDict = {
	en: 'eng/lebenslauf.json',
	de: 'lebenslauf.json',
};

const controls = {
	/** @type {HTMLButtonElement | null} */
	langDeBtn: document.querySelector('#lang-de'),
	/** @type {HTMLButtonElement | null} */
	langEnBtn: document.querySelector('#lang-en'),
};

/** @param {'de'|'en'} lang */
function fetchAndRender(lang) {
	clearSections(sectionsContainer);
	setActiveLangButton(controls, currentLang);
	const path = jsonPathForLang(lang, langPathDict, currentLang);
	fetch(path)
		.then((response) => response.json())
		.then((data) =>
			renderData(data, lang, {
				sectionsContainer,
				profilePicturePath,
				signaturePath,
			})
		)
		.catch((err) => {
			console.error('Failed to load JSON:', err);
			if (sectionsContainer) {
				myCreateElement(
					'p',
					[],
					'Failed to load resume data.',
					sectionsContainer,
					undefined
				);
			}
		});
}

controls.langDeBtn?.addEventListener('click', () => {
	if (currentLang === 'de') {
		console.log('Language is already German');
		return;
	}
	currentLang = 'de';
	fetchAndRender(currentLang);
});

controls.langEnBtn?.addEventListener('click', () => {
	if (currentLang === 'en') {
		console.log('Language is already English');
		return;
	}
	currentLang = 'en';
	fetchAndRender(currentLang);
});

// initial load
fetchAndRender(currentLang);
