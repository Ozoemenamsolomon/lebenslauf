const sectionsContainer = document.querySelector('#sections');

fetch('lebenslauf.json')
	.then((response) => response.json())
	.then((data) => {
		data.sections.forEach((section, sectionIndex) => {
			const sectionElement = myCreateElement(
				'section',
				['section', 'mb-5'],
				undefined,
				sectionsContainer,
				{ 'aria-label': section.title.toLowerCase() }
			);

			const sectionTitle = myCreateElement(
				'h2',
				['section-title', 'font-bold', 'text-base', 'capitalize'],
				section.title.toLowerCase(),
				sectionElement,
				undefined
			);
			sectionIndex > 0 && sectionTitle.classList.add('border-b-2');

			const sectionContentContainer = myCreateElement(
				'div',
				['section-content', 'flex', 'justify-between'],
				undefined,
				sectionElement,
				undefined
			);

			const sectionContentTable = myCreateElement(
				'table',
				[],
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

				const sectionContentKey = myCreateElement(
					'td',
					['align-top', 'pr-8'],
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
						sectionContentValueIndex == 0 &&
							(sectionIndex == 1 || sectionIndex == 2) &&
							sectionContentItem.classList.add('font-bold');
					});
				} else {
					const linkTag = myCreateElement(
						'a',
						['text-blue-500'],
						section.content[key],
						sectionContentValue,
						{ rel: 'noopener noreferrer', target: '_blank' }
					);

					if (key.toLowerCase() === 'telefon') {
						linkTag.setAttribute('href', 'tel:' + section.content[key]);
					} else if (key.toLowerCase() === 'webseite') {
						linkTag.setAttribute('href', 'https://' + section.content[key]);
					} else if (key.toLowerCase() === 'email') {
						linkTag.setAttribute('href', 'mailto:' + section.content[key]);
					} else {
						sectionContentValue.innerText = section.content[key];
					}
				}
			}
			if (sectionIndex === 0) {
				const sectionImage = myCreateElement(
					'img',
					['section-image', 'object-cover'],
					undefined,
					sectionContentContainer,
					{ src: './profile-picture.jpg', alt: section.title }
				);
			}
		});

		myCreateElement(
			'p',
			[],
			`${data.location}, ${new Date().toLocaleDateString('de-DE', {
				dateStyle: 'short',
			})}.`,
			sectionsContainer,
			undefined
		);
	});

/**
 *
 * @param {string} tagName
 * @param {string[]} classNames
 * @param {string|undefined} text
 * @param {Element | null|undefined} parentNode
 * @param {object | undefined} attributes
 * @returns {HTMLElement}
 */

const myCreateElement = (
	tagName,
	classNames,
	text = '',
	parentNode,
	attributes
) => {
	let element = document.createElement(tagName);
	element.innerText = text;
	classNames && element.classList.add(...classNames);
	attributes &&
		Object.keys(attributes).forEach((key) => {
			element.setAttribute(key, attributes[key]);
		});
	if (parentNode) {
		element = parentNode.appendChild(element);
		return element;
	}
	return element;
};
