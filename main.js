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

/**
 * Render the JSON data into the DOM.
 * @param {any} data
 * @param {'de'|'en'} lang
 */
function renderData(data, lang) {
	/**
	 * @typedef {Object} Section
	 * @property {string} title
	 * @property {Record<string, string | {title?:string,items?:any[],visible?:boolean}>} content
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
			const rawVal = section.content[key];
			// create table row and cells
			const sectionContentRow = myCreateElement(
				'tr',
				[],
				undefined,
				sectionContentTable,
				undefined
			);

			const sectionContentKey = myCreateElement(
				'td',
				['align-top', 'pr-4'],
				key + ':',
				sectionContentRow,
				undefined
			);
			sectionContentKey.style.display = 'ruby-text';

			const sectionContentValue = myCreateElement(
				'td',
				['align-top', 'relative'],
				undefined,
				sectionContentRow,
				undefined
			);
			// detect new entry shape: { title, items, visible }
			if (
				rawVal &&
				typeof rawVal === 'object' &&
				!Array.isArray(rawVal) &&
				(Array.isArray(rawVal.items) || typeof rawVal.title === 'string')
			) {
				const entry = rawVal;
				const entryTitle = entry.title || key;
				const entryItems = Array.isArray(entry.items) ? entry.items : [];
				const entryVisible = entry.visible !== false;

				if (!entryVisible)
					sectionContentRow.classList.add('opacity-25', 'no-print');

				// entry container (relative so the toggle can be absolute)
				const entryContainer = myCreateElement(
					'div',
					['entry-container', 'relative'],
					undefined,
					sectionContentValue,
					undefined
				);

				myCreateElement(
					'p',
					['font-bold'],
					entryTitle,
					entryContainer,
					undefined
				);
				if (entryItems.length) {
					const ul = myCreateElement(
						'ul',
						['list-disc', 'pl-6'],
						undefined,
						entryContainer,
						undefined
					);
					entryItems.forEach((it) =>
						myCreateElement('li', [], it, ul, undefined)
					);
				}

				// toggle button (absolute top-right)
				const toggleBtn = myCreateElement(
					'button',
					['entry-toggle', 'absolute', 'top-0', 'right-0', 'p-1', 'no-print'],
					entryVisible ? '👁' : '👁‍🗨',
					entryContainer,
					undefined
				);
				toggleBtn.style.background = 'transparent';
				toggleBtn.style.border = 'none';
				toggleBtn.style.cursor = 'pointer';

				toggleBtn.addEventListener('click', (ev) => {
					ev.stopPropagation();
					const hidden = sectionContentRow.classList.toggle('opacity-25');
					sectionContentRow.classList.toggle('no-print', hidden);
				});

				continue;
			}

			// legacy handling: single string
			const raw = String(rawVal);
			const lowerKey = key.toLowerCase();

			/** @param {string} text @param {string} href */
			function appendLink(text, href) {
				return myCreateElement(
					'a',
					['text-blue-500'],
					text,
					sectionContentValue,
					{ rel: 'noopener noreferrer', target: '_blank', href }
				);
			}

			if (lowerKey === 'telefon' || lowerKey === 'phone') {
				appendLink(raw, 'tel:' + raw.replace(/[^+0-9]/g, ''));
			} else if (lowerKey === 'portfolio' || lowerKey === 'linkedin') {
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
