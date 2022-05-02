const sectionsContainer = document.querySelector('#sections');

fetch('lebenslauf.json')
	.then((response) => response.json())
	.then((data) => {
		data.sections.forEach((section, sectionIndex) => {
			const sectionElement = document.createElement('section');
			sectionElement.classList.add('section', 'mb-5');
			sectionElement.setAttribute('aria-label', section.title.toLowerCase());

			const sectionTitle = document.createElement('h2');
			sectionTitle.classList.add('font-bold', 'text-lg');
			sectionIndex > 0 && sectionTitle.classList.add('border-b-2');
			sectionTitle.innerText = section.title.toUpperCase();
			sectionElement.appendChild(sectionTitle);

			const sectionContentContainer = document.createElement('div');
			sectionContentContainer.classList.add(
				'section-content',
				'flex',
				'justify-between'
			);
			sectionElement.appendChild(sectionContentContainer);

			const sectionContentTable = document.createElement('table');
			sectionContentContainer.appendChild(sectionContentTable);

			for (const key in section.content) {
				const sectionContentRow = document.createElement('tr');
				sectionContentTable.appendChild(sectionContentRow);

				if (key !== ' ') {
					const sectionContentKey = document.createElement('td');
					sectionContentKey.classList.add('align-top', 'pr-8');
					sectionContentKey.innerText = key + ':';
					sectionContentRow.appendChild(sectionContentKey);
				}

				const sectionContentValue = document.createElement('td');
				sectionContentValue.classList.add('align-top');

				if (Array.isArray(section.content[key])) {
					sectionContentValue.innerHTML = section.content[key].join('<br>');
				} else {
					sectionContentValue.innerText = section.content[key];
				}
				const linkTag = document.createElement('a');
				linkTag.setAttribute('href', section.content[key]);

				if (key.toLowerCase() === 'telefon') {
					sectionContentValue.innerText = '';
					linkTag.setAttribute('target', '_blank');
					linkTag.setAttribute('rel', 'noopener noreferrer');
					linkTag.classList.add('text-blue-500');
					linkTag.setAttribute('href', 'tel:' + section.content[key]);
					linkTag.innerText = section.content[key];
					sectionContentValue.appendChild(linkTag);
				}
				if (key.toLowerCase() === 'webseite') {
					sectionContentValue.innerText = '';
					linkTag.setAttribute('target', '_blank');
					linkTag.setAttribute('rel', 'noopener noreferrer');
					linkTag.classList.add('text-blue-500');
					linkTag.setAttribute('href', 'https://' + section.content[key]);
					linkTag.innerText = section.content[key];
					sectionContentValue.appendChild(linkTag);
				}
				if (key.toLowerCase() === 'email') {
					sectionContentValue.innerText = '';
					linkTag.setAttribute('target', '_blank');
					linkTag.setAttribute('rel', 'noopener noreferrer');
					linkTag.classList.add('text-blue-500');
					linkTag.setAttribute('href', 'mailto:' + section.content[key]);
					linkTag.innerText = section.content[key];
					sectionContentValue.appendChild(linkTag);
				}
				sectionContentRow.appendChild(sectionContentValue);
			}
			if (sectionIndex === 0) {
				const sectionImage = document.createElement('img');
				sectionImage.classList.add(
					'section-image',
					// 'absolute',
					// 'right-0',
					// 'top-0',
					'object-cover'
				);
				sectionImage.setAttribute('src', './profile-picture.jpg');
				sectionImage.setAttribute('alt', section.title);
				sectionContentContainer.appendChild(sectionImage);
			}

			sectionsContainer.appendChild(sectionElement);
		});

		// create p tag
		const pTag = document.createElement('p');
		pTag.innerText = data.location + ', den ' + data.date;
		sectionsContainer.appendChild(pTag);
	});
