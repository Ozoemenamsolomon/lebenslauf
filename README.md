# CV Builder

converts a JSON file into a printable CV using Tailwind CSS. The project currently supports German and English languages.

## Built with

- HTML
- Tailwind CSS
- JavaScript (ES6)

## Features

- Multi-language support (German and English)
- Dynamic rendering of CV sections
- Print-friendly layout
- Easy to customize with Tailwind CSS
- No backend required, runs entirely in the browser

## Installation

1. Ensure you have Python installed on your machine.
2. Download or clone this repository to your local machine.
3. Navigate to the project directory in your terminal.
4. Start a simple HTTP server using Python:
   - For Python 3.x:
   ```shell
   python -m http.server
   ```
   - For Python 2.x:
   ```shell
   python -m SimpleHTTPServer
   ```
5. Open your web browser and go to `http://localhost:8000` to view your CV.

## Configuration

1. Create a `lebenslauf.json` file in the project directory.
2. Populate the JSON file with your CV data following the provided structure in the example below.

```json
{
	"title": "Lebenslauf",
	"location": "sample_location",
	"date": "01.01.2021",
	"sections": [
		{
			"title": "Personal Information",
			"content": {
				"Name": "John Doe",
				"Geburtsdatum": "01.01.2022",
				"Adresse": ["Musterstr. 01", "12345 Musterstadt"],
				"Telefon": "0123-4567890",
				"Portfolio": "solozo.page",
				"Email": "sample@test.de"
			}
		},
		{
			"title": "Section 2",
			"readmore": "https://www.example.com",
			"content": {
				"01/2020 - 01/2022": {
					"title": "studies at university",
					"visible": true,
					"items": ["item1", "item2"]
				},
				"01/2018 - 01/2020": {
					"title": "high school",
					"visible": true,
					"items": ["item1", "item2"]
				}
			}
		}
	]
}
```

3. Modify the JSON data to reflect your personal information and experiences.
