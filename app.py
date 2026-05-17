from pathlib import Path
import json

from flask import Flask, abort, jsonify, render_template


# Resolve paths from the project root so the app works locally and in production.
BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "projects.json"

# Every project in the JSON file must include these fields.
# This keeps the templates predictable and prevents silent layout errors.
REQUIRED_PROJECT_FIELDS = {
    "slug",
    "title",
    "category",
    "summary",
    "description",
    "thumbnail",
    "tags",
    "year",
    "role",
    "deliverables",
    "highlight",
}

app = Flask(__name__)


def load_projects():
    """Load, validate, and sort portfolio projects from the JSON file."""
    with DATA_FILE.open(encoding="utf-8") as file:
        projects = json.load(file)

    if not isinstance(projects, list):
        raise ValueError("projects.json must contain a list of projects.")

    seen_slugs = set()
    for project in projects:
        # Raise a clear error if a project is incomplete.
        missing_fields = REQUIRED_PROJECT_FIELDS - project.keys()
        if missing_fields:
            fields = ", ".join(sorted(missing_fields))
            raise ValueError(f"Project '{project.get('title', 'Untitled')}' is missing: {fields}.")

        # Slugs are used in URLs, so they must be unique.
        if project["slug"] in seen_slugs:
            raise ValueError(f"Duplicate project slug: {project['slug']}.")
        seen_slugs.add(project["slug"])

    # The optional "order" field controls how projects appear in the gallery.
    return sorted(projects, key=lambda project: project.get("order", 999))


@app.route("/")
def index():
    """Render the home page with the full project gallery."""
    projects = load_projects()
    categories = sorted({project["category"] for project in projects})
    return render_template("index.html", projects=projects, categories=categories)


@app.route("/projects/<slug>")
def project_detail(slug):
    """Render one project detail page based on its URL slug."""
    projects = load_projects()
    project = next((item for item in projects if item["slug"] == slug), None)
    if project is None:
        abort(404)

    # Show a small set of other projects at the bottom of the detail page.
    related = [item for item in projects if item["slug"] != slug][:3]
    return render_template("project_detail.html", project=project, related=related)


@app.route("/health")
def health():
    """Health check used by hosting platforms such as Render."""
    return jsonify(status="ok")


@app.errorhandler(404)
def not_found(error):
    """Render a custom 404 page instead of Flask's default error screen."""
    return render_template("404.html"), 404


if __name__ == "__main__":
    # Debug mode is useful for local development. Production uses Gunicorn.
    app.run(debug=True)
