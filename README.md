## CV Builder

converts json data of your CV to html

clone or download the repo and use the command below to see the html page of your CV

```shell
python -m http.server
```

the default port is 8000. You can view your CV at [http://localhost:8000/](http://localhost:8000/)

kill the server with `Ctrl+C`

create a json file with your CV data called `lebenslauf.json`

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
			"content": {
				"01/2020 - 01/2022": "studies at university",
				"01/2020 - 01/2022": ["Musterstr. 01", "12345 Musterstadt"],
				"2018 - 2019": [
					"Worked at Muster GmbH",
					"- Job Description 1",
					"- Job Description 2"
				]
			}
		}
	]
}
```
