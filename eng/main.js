const sectionsContainer = document.querySelector('#sections');

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
	}
	return element;
};

fetch('lebenslauf.json')
	.then((response) => response.json())
	.then((data) => {
		const cvHeader = myCreateElement(
			'header',
			['section', 'mb-4', 'flex', 'space-between', 'bg-gray-200', 'p-4'],
			undefined,
			sectionsContainer,
			{ 'aria-label': 'cv header' }
		);
		const nameProfessionContainer = myCreateElement(
			'div',
			['flex-1', 'flex', 'flex-col', 'justify-center'],
			undefined,
			cvHeader,
			undefined
		);
		const name = myCreateElement(
			'h1',
			['text-3xl', 'capitalize'],
			data.name.toUpperCase(),
			nameProfessionContainer,
			undefined
		);
		const profession = myCreateElement(
			'h2',
			['capitalize', 'text-lg'],
			data.profession,
			nameProfessionContainer,
			undefined
		);

		const profilePicture = myCreateElement(
			'img',
			[
				'section-image',
				'object-cover',
				'-mt-1',
				'bg-white',
				'aspect-square',
				'rounded-full',
				'h-32',
			],
			undefined,
			cvHeader,
			{ src: './profile-pics.jpg', alt: 'profile image' }
		);
		const sectionsGrid = myCreateElement(
			'article',
			['grid', 'bg-gray-200'],
			undefined,
			sectionsContainer,
			{ style: 'grid-template-columns: 265px 1fr; column-gap: 1px;' }
		);
		data.sections.forEach((section, sectionIndex) => {
			const sectionElement = myCreateElement(
				'section',
				[
					'section',
					'bg-white',
					'py-4',
					'px-2',
					`${sectionIndex === 3 ? 'row-span-2' : 'no-span'}`,
				],
				undefined,
				sectionsGrid,
				{ 'aria-label': section.title.toLowerCase() }
			);
			const sectionTitle = myCreateElement(
				'h2',
				['section-title', 'font-bold', 'text-base', 'capitalize', 'border-b-2'],
				section.title.toUpperCase(),
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

			if (
				typeof section.content === 'string' ||
				section.content instanceof String
			) {
				const sectionContentTable = myCreateElement(
					'p',
					[],
					section.content,
					sectionContentContainer,
					undefined
				);
			} else {
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

					myCreateElement(
						'td',
						['align-top', 'pr-2'],
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

							if (sectionIndex === 3 || sectionIndex === 6) {
								sectionContentItem.classList.add(
									sectionContentValueIndex === 0 ? 'font-bold' : 'pl-2'
								);
							}
						});
					} else {
						const linkTag = myCreateElement(
							'a',
							['text-blue-500'],
							section.content[key],
							sectionContentValue,
							{ rel: 'noopener noreferrer', target: '_blank' }
						);

						if (key.toLowerCase() === '📞') {
							linkTag.setAttribute(
								'href',
								'tel:' + section.content[key].replace(/-/g, '')
							);
						} else if (
							key.toLowerCase() === '🔗' ||
							key.toLowerCase() === '👨🏽‍💼'
						) {
							linkTag.setAttribute('href', 'https://' + section.content[key]);
						} else if (key.toLowerCase() === '📧') {
							linkTag.setAttribute('href', 'mailto:' + section.content[key]);
						} else {
							sectionContentValue.innerText = section.content[key];
						}
					}
				}
			}
		});
		console.log({ data });
	});
