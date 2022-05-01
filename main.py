import json
from random import random
from docx import Document

document = Document()

# import json
with open('lebenslauf.json', 'r') as f:
    data = json.load(f)
    main_heading=document.add_heading(text=data["title"],level=0)
    main_heading.alignment=1



document.add_page_break()
try:
    document.save('demo.docx')
except PermissionError:
    print('Permission denied')


