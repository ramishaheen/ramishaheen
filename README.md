# Public Camera Dashboard (AI-assisted tagging)

A simple, local-first dashboard to track and view legally accessible public camera links.

## What it does

- Lets you save camera links (name, location, notes).
- Adds lightweight AI-style tags from keywords in your metadata.
- Embeds previews for common stream URLs and YouTube links.
- Stores camera list in your browser (`localStorage`).

> Use only cameras you are authorized to access or links explicitly shared for public viewing.

## Run locally

```bash
python3 -m http.server 8000
```

Open: `http://localhost:8000`

## Next upgrades (if you want a full AI scraper)

- Add a backend crawler for **approved** directories/APIs of public webcams.
- Add OpenCV/YOLO detection (vehicles, crowding, motion).
- Add alerting rules, map layers, and user authentication.
