import myCreateElement from '../myCreateElement.js';
const sectionsContainer = document.querySelector('#sections');

fetch('anschreiben.json')
	.then((response) => response.json())
	.then((data) => {
		console.log({ data });

		const address = myCreateElement(
			'div',
			['section', 'mb-12', 'flex', 'space-between'],
			undefined,
			sectionsContainer,
			{ 'aria-label': 'address' }
		);

		const recipient = myCreateElement(
			'div',
			['flex', 'flex-1', 'flex-col', 'gap-4', 'justify-center'],
			undefined,
			address,
			{ 'aria-label': 'recipient' }
		);

		const senderAddressAgain = myCreateElement(
			'p',
			['text-xs', 'text-gray-500'],
			`${data.sender.salutation} ${data.sender.name}, ${data.sender.address.street} ${data.sender.address.houseNumber}, ${data.sender.address.postalCode} ${data.sender.address.city}`,
			recipient,
			{}
		);

		const companyAddress = myCreateElement('div', [], undefined, recipient, {
			'aria-label': 'companyAddress',
		});

		const companyName = myCreateElement(
			'p',
			[],
			data.recipient.address.companyName,
			companyAddress,
			{}
		);

		const companyStreetAndNumber = myCreateElement(
			'p',
			[],
			`${data.recipient.address.street} ${data.recipient.address.houseNumber}`,
			companyAddress,
			{}
		);

		const companyZipAndCity = myCreateElement(
			'p',
			[],
			`${data.recipient.address.postalCode} ${data.recipient.address.city}`,
			companyAddress,
			{}
		);

		const sender = myCreateElement(
			'div',
			[
				'flex',
				'flex-col',
				'justify-center',
				'border-l-4',
				'border-sky-700',
				'gap-8',
				'pt-4',
				'pl-4',
				'w-64',
			],
			undefined,
			address,
			undefined
		);
		const senderName = myCreateElement(
			'h1',
			['text-3xl', 'capitalize', 'text-sky-700'],
			data.sender.name,
			sender,
			undefined
		);

		const contactDetails = myCreateElement(
			'div',
			['flex', 'flex-col'],
			undefined,
			sender,
			undefined
		);

		const contactDetailsTitle = myCreateElement(
			'h2',
			['text', 'text-gray-400'],
			'Kontaktdaten',
			contactDetails,
			undefined
		);

		const phone = myCreateElement(
			'a',
			['text-sky-500'],
			data.sender.phone,
			contactDetails,
			{
				href: `tel:${data.sender.phone}`,
			}
		);

		const email = myCreateElement(
			'a',
			['text-sky-500'],
			data.sender.email,
			contactDetails,
			{
				href: `mailto:${data.sender.email}`,
			}
		);

		const addressDetails = myCreateElement(
			'div',
			['flex', 'flex-col'],
			undefined,
			sender,
			undefined
		);

		const addressDetailsTitle = myCreateElement(
			'h2',
			['text', 'text-gray-400'],
			'Anschrift',
			addressDetails,
			undefined
		);

		const co = myCreateElement(
			'p',
			[],
			data.sender.address?.CO || data.sender.name,
			addressDetails,
			undefined
		);

		const streetAndNumber = myCreateElement(
			'p',
			[],
			`${data.sender.address.street} ${data.sender.address.houseNumber}`,
			addressDetails,
			undefined
		);

		const postalCodeAndCity = myCreateElement(
			'p',
			[],
			`${data.sender.address.postalCode} ${data.sender.address.city}`,
			addressDetails,
			undefined
		);

		// create the date in format 10. Oktober 2021
		const dateString = new Date().toLocaleString('default', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		});

		const date = myCreateElement(
			'p',
			['text-right'],
			`${data.sender.address.city}, den ${data.date || dateString}`,
			sectionsContainer,
			undefined
		);

		const title = myCreateElement(
			'h1',
			['text-xl', 'text-sky-700', 'mb-4'],
			data.title,
			sectionsContainer,
			undefined
		);

		data.body.forEach((section, sectionIndex) => {
			const sectionParagraph = myCreateElement(
				'p',
				['mb-4', 'text-justify'],
				section,
				sectionsContainer,
				undefined
			);
		});

		const signature = myCreateElement(
			'img',
			['w-48', 'object-contain'],
			undefined,
			sectionsContainer,
			{ src: '../signature.png' }
		);

		const name = myCreateElement(
			'p',
			['mt-4', 'text-justify'],
			data.sender.name,
			sectionsContainer,
			undefined
		);
	});
