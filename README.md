# 5876 Stoltze Rd Website Skeleton

Single-page static website scaffold designed for GitHub Pages deployment and easy editing in VS Code.

## Project structure

- `index.html` - Complete single-page layout with all required sections.
- `css/styles.css` - Theme, responsive layout, and gallery/editorial styling.
- `js/main.js` - Mobile nav toggle, reveal effects, and image fallback handling.
- `img/` - All image references used by the page.
- `.github/workflows/pages.yml` - Optional workflow for GitHub Pages deployment.
- `CNAME` - Custom domain placeholder.

## Run locally

Option 1 (quick):
1. Open the folder in VS Code.
2. Install the Live Server extension.
3. Right-click `index.html` and choose **Open with Live Server**.

Option 2 (no extension):
1. Open a terminal in the project root.
2. Run `python -m http.server 8000`.
3. Open `http://localhost:8000`.

## Add or replace images

The page is already wired to these filenames in `img/`:

- `hero-main.jpg`
- `gallery-aerial-home.jpg`
- `gallery-valley-wide.jpg`
- `gallery-arbutus-frame.jpg`
- `gallery-rocky-outlook.jpg`
- `gallery-home-exterior.jpg`
- `gallery-lawn-solar.jpg`
- `gallery-sunset.jpg`
- `gallery-wildlife.jpg`
- `location-map.jpg`

If these files are not present, the page automatically falls back to placeholders so local preview still works.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. In GitHub repo settings, open **Pages**.
3. Set source to **GitHub Actions**.
4. The included workflow publishes the root static files.
5. Add your custom domain in GitHub Pages settings.
6. Update `CNAME` to your final domain.

## Notes

- Uses relative paths for all assets.
- No backend or CMS required.
- Easy to edit copy and image references directly in VS Code.
