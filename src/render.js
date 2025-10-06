// @ts-check
import myCreateElement from '../myCreateElement.js';

/**
 * Render the JSON data into the DOM.
 * This is extracted from main.js to make it testable and modular.
 * @param {any} data
 * @param {'de'|'en'} lang
 * @param {{ sectionsContainer: Element | null, profilePicturePath: string, signaturePath: string }} opts
 */
export function renderData(data, lang, opts) {
	const { sectionsContainer, profilePicturePath, signaturePath } = opts;

	/** @type {any} */
	const typedData = data;

	try {
		if (typedData && typeof typedData.title === 'string') {
			if (typeof document !== 'undefined') {
				document.title = typedData.title;
				const titleH1 = document.querySelector('.title');
				if (titleH1 && titleH1 instanceof HTMLElement)
					titleH1.innerText = typedData.title;
			}
		}
	} catch (e) {
		// defensive: ignore errors when running in non-browser environments
		// eslint-disable-next-line no-console
		console.warn('Could not set document title from JSON', e);
	}

	/**
	 * @typedef {{ title: string, content: Record<string, any>, readmore?: string }} Section
	 */

	if (!typedData?.sections || !Array.isArray(typedData.sections)) return;

	/** @param {Section} section @param {number} sectionIndex */
	typedData.sections.forEach(
		/** @type {(section: Section, sectionIndex: number) => void} */
		(section, sectionIndex) => {
			const sectionElement = myCreateElement(
				'section',
				['section', 'mb-2', 'relative'],
				undefined,
				sectionsContainer,
				{ 'aria-label': section.title.toLowerCase() }
			);

			myCreateElement(
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
						/** @type {(it: string) => HTMLElement} */
						const addItem = (it) =>
							myCreateElement('li', [], it, ul, undefined);
						entryItems.forEach(addItem);
					}

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
					[
						'section-image',
						'object-cover',
						'-mt-1',
						'bg-white',
						'w-32',
						'h-48',
					],
					undefined,
					sectionContentContainer,
					{ src: profilePicturePath, alt: 'Profile picture' }
				);
			}
		}
	);

	myCreateElement(
		'img',
		['h-12', 'object-cover'],
		undefined,
		sectionsContainer,
		{ src: signaturePath, alt: 'Signature' }
	);
}
