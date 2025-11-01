# Cup Reading Oracle

A Flask-powered tasseography experience that now reads directly from a photo of
your cup. Upload an image of the brew's interior and the oracle analyses the
textures, infers likely symbols, and delivers a narrative fortune complete with
energy overviews, life-area outlooks, and playful lucky numbers.

## Features
- **Automatic photo insights** – brightness, contrast, and swirl detection guide
  the generated symbolism and placement meanings.
- **Custom reflections** – capture your mood or optional observations to weave
  into the interpretation.
- **Rich presentation** – view your uploaded cup, analysis highlights, and
  symbolic messages in a polished layout.
- **Static preview** – explore the interface instantly via the bundled preview
  page without running the backend.

## Getting started
1. (Optional) Create and activate a virtual environment.
2. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Launch the development server:
   ```bash
   flask --app app run
   ```
4. Open <http://127.0.0.1:5000> in your browser.
5. Upload a clear, well-lit photo of your cup taken from above, choose the
   beverage, add any notes or mood reflections, and submit to receive your
   reading.

Uploaded photos are stored in `static/uploads/` so the reading can display them.
Remove older files periodically if desired.

### Quick preview without Flask
If you only need to preview the interface, serve the repository with any static
HTTP server and open `preview/index.html`. For example:
```bash
python -m http.server 8000
# then visit http://127.0.0.1:8000/preview/index.html
```
The preview mimics the form but does not perform image analysis.

## How the photo interpretation works
The oracle uses lightweight Pillow-based heuristics to interpret each upload:
- **Brightness & contrast** hint at optimistic versus introspective tones.
- **Edge energy** highlights bold versus soft textures, suggesting different
  symbolic archetypes.
- **Center pull** compares the cup’s heart to its overall tone to spot spirals
  or calm pools.
- **Vertical texture bands** indicate whether activity clusters at the rim,
  middle, or base, anchoring the placement meaning.

These metrics seed the symbol selection, placement insight, and narrative text
before blending in your beverage choice and written reflections.
