// @ts-check
import myCreateElement from './myCreateElement.js';

const sectionsContainer = document.querySelector('#sections');
const profilePicturePath = './profile-picture.jpg';
const signaturePath = './signature.png';

const controls = {
	/** @type {HTMLButtonElement | null} */
	langDeBtn: document.querySelector('#lang-de'),
	/** @type {HTMLButtonElement | null} */
	langEnBtn: document.querySelector('#lang-en'),
};

/** @type {'de'|'en'} */
let currentLang = 'de'; // default to German

const langPathDict = {
	en: 'eng/lebenslauf.json',
	de: 'lebenslauf.json',
};

/** @param {'de'|'en'} lang */
function jsonPathForLang(lang) {
	return langPathDict[lang || currentLang];
}

function clearSections() {
	if (!sectionsContainer) return;
	sectionsContainer.innerHTML = '';
}

function setActiveLangButton() {
	if (!controls.langDeBtn || !controls.langEnBtn) return;
	controls.langDeBtn.classList.toggle('bg-gray-200', currentLang === 'de');
	controls.langDeBtn.classList.toggle('bg-white', currentLang !== 'de');
	controls.langEnBtn.classList.toggle('bg-gray-200', currentLang === 'en');
	controls.langEnBtn.classList.toggle('bg-white', currentLang !== 'en');
}

/** @param {'de'|'en'} lang */
function setPageTitlesByLang(lang) {
	const deTitles = document.querySelectorAll('.de');
	const enTitles = document.querySelectorAll('.eng');
	deTitles.forEach((el) => el.classList.toggle('hidden', lang !== 'de'));
	enTitles.forEach((el) => el.classList.toggle('hidden', lang !== 'en'));
}

/** @param {'de'|'en'} lang */
function fetchAndRender(lang) {
	clearSections();
	setPageTitlesByLang(lang);
	setActiveLangButton();
	const path = jsonPathForLang(lang);
	fetch(path)
		.then((response) => response.json())
		.then((data) => renderData(data, lang))
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
	if (currentLang === 'de') return; // no change
	currentLang = 'de';
	fetchAndRender(currentLang);
});

controls.langEnBtn?.addEventListener('click', () => {
	if (currentLang === 'en') return; // no change
	currentLang = 'en';
	fetchAndRender(currentLang);
});

// initial load
fetchAndRender(currentLang);

/**
 * Render the JSON data into the DOM.
 * @param {any} data
 * @param {'de'|'en'} lang
 */
function renderData(data, lang) {
	/**
	 * @typedef {Object} Section
	 * @property {string} title
	 * @property {Record<string, string | string[]>} content
	 * @property {string} [readmore]
	 */

	/**
	 * @typedef {Object} LebenslaufData
	 * @property {string} [location]
	 * @property {Section[]} sections
	 */

	/** @type {LebenslaufData} */
	const typedData = data;

	typedData.sections.forEach((section, sectionIndex) => {
		/** @type {HTMLElement} */
		const sectionElement = myCreateElement(
			'section',
			['section', 'mb-2', 'relative'],
			undefined,
			sectionsContainer,
			{ 'aria-label': section.title.toLowerCase() }
		);

		const sectionTitle = myCreateElement(
			'h2',
			['section-title', 'font-bold', 'text-base', 'capitalize', 'border-b-2'],
			section.title,
			sectionElement,
			undefined
		);

		const sectionContentContainer = myCreateElement(
			'div',
			['section-content', 'flex', 'justify-between'],
			undefined,
			sectionElement,
			undefined
		);

		const sectionContentTable = myCreateElement(
			'table',
			[`section-${section.title.toLowerCase().replace(/\s/g, '-')}`],
			undefined,
			sectionContentContainer,
			undefined
		);

		for (const key in section.content) {
			const sectionContentRow = myCreateElement(
				'tr',
				[],
				undefined,
				sectionContentTable,
				undefined
			);

			myCreateElement(
				'td',
				['align-top', 'pr-4'],
				key + ':',
				sectionContentRow,
				undefined
			);

			const sectionContentValue = myCreateElement(
				'td',
				['align-top'],
				undefined,
				sectionContentRow,
				undefined
			);

			if (Array.isArray(section.content[key])) {
				section.content[key].forEach((item, sectionContentValueIndex) => {
					const sectionContentItem = myCreateElement(
						'p',
						[],
						item,
						sectionContentValue,
						undefined
					);

					if ([1, 2, 3].includes(sectionIndex)) {
						sectionContentItem.classList.add(
							sectionContentValueIndex == 0 ? 'font-bold' : 'pl-2'
						);
					}
				});
			} else {
				// Create a link only when the content looks like a URL, phone or email
				const raw = String(section.content[key]);
				const lowerKey = key.toLowerCase();

				// helper to create and append link
				/**
				 * @param {string} text
				 * @param {string} href
				 */
				function appendLink(text, href) {
					const linkTag = myCreateElement(
						'a',
						['text-blue-500'],
						text,
						sectionContentValue,
						{ rel: 'noopener noreferrer', target: '_blank', href }
					);
					return linkTag;
				}

				if (lowerKey === 'telefon' || lowerKey === 'phone') {
					appendLink(raw, 'tel:' + raw.replace(/[^+0-9]/g, ''));
				} else if (lowerKey === 'portfolio' || lowerKey === 'linkedin') {
					// ensure protocol
					const href = raw.startsWith('http')
						? raw
						: 'https://' + raw.replace(/^https?:\/\//, '');
					appendLink(raw, href);
				} else if (lowerKey === 'email') {
					appendLink(raw, 'mailto:' + raw);
				} else if (/^https?:\/\//i.test(raw) || /^(www\.)/i.test(raw)) {
					const href = raw.startsWith('http') ? raw : 'https://' + raw;
					appendLink(raw, href);
				} else {
					sectionContentValue.innerText = raw;
				}
			}
		}
		if (section.readmore) {
			const readmoreLabel = lang === 'de' ? 'mehr erfahren →' : 'read more →';
			myCreateElement(
				'a',
				['readmore', 'absolute', 'top-0', 'right-0', 'text-blue-500'],
				readmoreLabel,
				sectionContentContainer,
				{
					href: section.readmore,
					rel: 'noopener noreferrer',
					target: '_blank',
				}
			);
		}

		if (sectionIndex === 0) {
			myCreateElement(
				'img',
				['section-image', 'object-cover', '-mt-1', 'bg-white', 'w-32', 'h-48'],
				undefined,
				sectionContentContainer,
				{ src: profilePicturePath, alt: 'Profile picture' }
			);
		}
	});

	/* myCreateElement(
			'p',
			[],
			`${data.location || ''}, ${new Date().toLocaleDateString('de-DE', {
				dateStyle: 'short',
			})}.`,
			sectionsContainer,
			undefined
		); */
	myCreateElement(
		'img',
		['h-12', 'object-cover'],
		undefined,
		sectionsContainer,
		{ src: signaturePath, alt: 'Signature' }
	);
}
