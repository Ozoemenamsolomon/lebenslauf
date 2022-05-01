const sectionsContainer = document.querySelector('#sections');

fetch('lebenslauf.json')
	.then((response) => response.json())
	.then((data) => {
		data.sections.forEach((section) => {
			const sectionElement = document.createElement('section');
			sectionElement.classList.add('section', 'mb-5');
			sectionElement.setAttribute('aria-label', section.title.toLowerCase());

			const sectionTitle = document.createElement('h2');
			sectionTitle.classList.add('font-bold', 'text-lg');
			sectionTitle.innerText = section.title.toUpperCase();
			sectionElement.appendChild(sectionTitle);

			const sectionContentContainer = document.createElement('div');
			sectionContentContainer.classList.add('section-content');
			const sectionContentTable = document.createElement('table');
			sectionContentContainer.appendChild(sectionContentTable);

			for (const key in section.content) {
				const sectionContentRow = document.createElement('tr');
				sectionContentTable.appendChild(sectionContentRow);

				const sectionContentKey = document.createElement('td');
				sectionContentKey.classList.add('align-top');
				sectionContentKey.innerText = key + ':';
				sectionContentRow.appendChild(sectionContentKey);

				const sectionContentValue = document.createElement('td');
				sectionContentValue.classList.add('align-top');
				if (Array.isArray(section.content[key])) {
					sectionContentValue.innerHTML = section.content[key].join('<br>');
				} else {
					sectionContentValue.innerText = section.content[key];
				}
				sectionContentRow.appendChild(sectionContentValue);
			}

			sectionElement.appendChild(sectionContentContainer);

			sectionsContainer.appendChild(sectionElement);
		});
	});
