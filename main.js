// @ts-check
import myCreateElement from './myCreateElement.js';

const sectionsContainer = document.querySelector('#sections');
const profilePicturePath = './profile-picture.jpg';
const signaturePath = './signature.svg';

fetch('lebenslauf.json')
	.then((response) => response.json())
	.then((data) => {
		data.sections.forEach((section, sectionIndex) => {
			const sectionElement = myCreateElement(
				'section',
				['section', 'mb-4', 'relative'],
				undefined,
				sectionsContainer,
				{ 'aria-label': section.title.toLowerCase() }
			);

			const sectionTitle = myCreateElement(
				'h2',
				['section-title', 'font-bold', 'text-base', 'capitalize', 'border-b-2'],
				section.title.toLowerCase(),
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

						if (sectionIndex == 1 || sectionIndex == 2) {
							sectionContentItem.classList.add(
								sectionContentValueIndex == 0 ? 'font-bold' : 'pl-2'
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

					if (key.toLowerCase() === 'telefon') {
						linkTag.setAttribute(
							'href',
							'tel:' + section.content[key].replace(/-/g, '')
						);
					} else if (
						key.toLowerCase() === 'portfolio' ||
						key.toLowerCase() === 'linkedin'
					) {
						linkTag.setAttribute('href', 'https://' + section.content[key]);
					} else if (key.toLowerCase() === 'email') {
						linkTag.setAttribute('href', 'mailto:' + section.content[key]);
					} else {
						sectionContentValue.innerText = section.content[key];
					}
				}
			}
			if (section.readmore) {
				const readmoreButton = myCreateElement(
					'a',
					['readmore', 'absolute', 'top-0', 'right-0', 'text-blue-500'],
					'mehr erfahren →',
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
		myCreateElement(
			'img',
			['h-12', 'object-cover'],
			undefined,
			sectionsContainer,
			{ src: signaturePath, alt: 'Signature' }
		);
	});
