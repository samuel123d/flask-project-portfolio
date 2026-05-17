from pathlib import Path
import json

from flask import Flask, abort, jsonify, render_template


BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "projects.json"
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
    with DATA_FILE.open(encoding="utf-8") as file:
        projects = json.load(file)

    if not isinstance(projects, list):
        raise ValueError("projects.json must contain a list of projects.")

    seen_slugs = set()
    for project in projects:
        missing_fields = REQUIRED_PROJECT_FIELDS - project.keys()
        if missing_fields:
            fields = ", ".join(sorted(missing_fields))
            raise ValueError(f"Project '{project.get('title', 'Untitled')}' is missing: {fields}.")
        if project["slug"] in seen_slugs:
            raise ValueError(f"Duplicate project slug: {project['slug']}.")
        seen_slugs.add(project["slug"])

    return sorted(projects, key=lambda project: project.get("order", 999))


@app.route("/")
def index():
    projects = load_projects()
    categories = sorted({project["category"] for project in projects})
    return render_template("index.html", projects=projects, categories=categories)


@app.route("/projects/<slug>")
def project_detail(slug):
    projects = load_projects()
    project = next((item for item in projects if item["slug"] == slug), None)
    if project is None:
        abort(404)
    related = [item for item in projects if item["slug"] != slug][:3]
    return render_template("project_detail.html", project=project, related=related)


@app.route("/health")
def health():
    return jsonify(status="ok")


@app.errorhandler(404)
def not_found(error):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True)
