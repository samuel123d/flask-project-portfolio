# Flask Project Portfolio

A polished, responsive portfolio focused on Web Development and Graphic Design projects. The site uses semantic HTML, modern CSS, a lightweight Flask backend, and JSON-powered content so projects can be edited without changing the templates.

## Highlights

- Clean project-first interface with a hero carousel, About section, gallery, search, and category filters.
- Dedicated detail page for every project.
- Professional responsive layout for mobile, tablet, and desktop.
- Smooth transitions, hover states, sticky navigation, and accessible focus states.
- JSON-based project data with validation for required fields and duplicate slugs.
- Custom 404 page and `/health` endpoint for deployment checks.
- Local SVG thumbnails for a complete demo without external assets.
- Ready for Render or a basic VPS using Gunicorn.

## Project Structure

```text
.
|-- app.py
|-- data/
|   `-- projects.json
|-- static/
|   |-- css/styles.css
|   |-- img/
|   `-- js/main.js
|-- templates/
|   |-- 404.html
|   |-- base.html
|   |-- index.html
|   `-- project_detail.html
|-- Procfile
|-- render.yaml
|-- requirements.txt
`-- README.md
```

## Run Locally

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Then open `http://127.0.0.1:5000`.

On macOS or Linux:

```bash
source .venv/bin/activate
```

## Edit Projects

Projects are managed in `data/projects.json`.

Required fields:

- `slug`: URL identifier.
- `title`: project name.
- `category`: project category.
- `summary`: short card description.
- `description`: detail page description.
- `thumbnail`: image path.
- `tags`: list of technologies or topics.
- `year`: project year.
- `role`: your role in the project.
- `deliverables`: list of delivered items.
- `highlight`: main project highlight.

Example:

```json
{
  "order": 1,
  "slug": "my-project",
  "title": "My Project",
  "category": "Web Development",
  "summary": "Short text shown on the card.",
  "description": "Longer text shown on the detail page.",
  "thumbnail": "/static/img/my-image.svg",
  "tags": ["HTML", "CSS", "Flask"],
  "year": "2026",
  "role": "Front-end",
  "deliverables": ["Responsive layout", "Detail page"],
  "highlight": "Main project highlight."
}
```

Place new images in `static/img/` and reference them as `/static/img/file-name.svg`.

## Deployment

### Render

This repository includes `render.yaml` and a `Procfile`.

Manual setup:

1. Create a new Web Service.
2. Connect the repository.
3. Build command: `pip install -r requirements.txt`
4. Start command: `gunicorn app:app`
5. Health check path: `/health`

### Basic VPS

```bash
pip install -r requirements.txt
gunicorn app:app --bind 0.0.0.0:8000
```

For production, use Nginx as a reverse proxy and configure HTTPS.

## Quality Notes

- Keep thumbnails consistent in size and visual style.
- Keep summaries concise for clean card alignment.
- Use unique slugs for every project.
- Run the site locally after editing `projects.json`; invalid or missing fields will raise a clear error.
