"""Flask application providing cup reading and fortune telling experiences.

The app accepts a photo of the cup's interior, analyses the textures with
lightweight heuristics, and blends traditional tasseography symbolism with
modern reflective prompts. Beverage choices, notes, and mood reflections colour
the narrative reading while the uploaded image appears alongside the guidance.
"""
from __future__ import annotations

import random
import secrets
import textwrap
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Dict, List, Sequence

from flask import Flask, render_template, request, url_for
from PIL import Image, ImageFilter, ImageStat
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = Path("static/uploads")
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp", "bmp"}
app.config["UPLOAD_FOLDER"] = str(UPLOAD_FOLDER)
app.config["MAX_CONTENT_LENGTH"] = 8 * 1024 * 1024  # 8 MB per upload


@dataclass
class CupSymbol:
    """Represents a single symbol that might appear in a coffee cup reading."""

    name: str
    meaning: str
    keywords: Sequence[str]
    element: str


@dataclass
class CupImageInsights:
    """Summarised insights generated from analyzing an uploaded cup photo."""

    symbols: List[str]
    placement: str
    summary: str
    highlights: List[str]
    metrics: Dict[str, float]


SYMBOL_LIBRARY: Dict[str, CupSymbol] = {
    symbol.name.lower(): symbol
    for symbol in [
        CupSymbol(
            name="Bird",
            meaning=(
                "Messages on the way. Communication clears a lingering doubt "
                "and lifts your spirits."
            ),
            keywords=["news", "travel", "letters"],
            element="air",
        ),
        CupSymbol(
            name="Heart",
            meaning=(
                "Matters of love and compassion are highlighted. A heartfelt "
                "conversation can deepen an important bond."
            ),
            keywords=["romance", "family", "relationships"],
            element="water",
        ),
        CupSymbol(
            name="Anchor",
            meaning=(
                "Security and stability arrive through patient effort. Stay "
                "grounded in your values as you plan your next steps."
            ),
            keywords=["career", "stability", "support"],
            element="earth",
        ),
        CupSymbol(
            name="Fish",
            meaning=(
                "Abundant opportunities swim toward you. Trust your intuition "
                "to pick the one that nourishes your growth."
            ),
            keywords=["wealth", "creativity", "intuition"],
            element="water",
        ),
        CupSymbol(
            name="Mountain",
            meaning=(
                "Challenges test your endurance, yet the summit promises a "
                "transformative view. Persevere with steady dedication."
            ),
            keywords=["obstacles", "achievement", "growth"],
            element="earth",
        ),
        CupSymbol(
            name="Star",
            meaning=(
                "Inspiration sparkles around you. Follow the idea that glows "
                "brightest—it's aligned with your purpose."
            ),
            keywords=["hope", "guidance", "spiritual"],
            element="fire",
        ),
        CupSymbol(
            name="Snake",
            meaning=(
                "Transformation through wisdom. Shed an outdated pattern and "
                "embrace a more authentic version of yourself."
            ),
            keywords=["change", "healing", "mystery"],
            element="earth",
        ),
        CupSymbol(
            name="Flower",
            meaning=(
                "A tender situation blossoms. Nurture what is beautiful and "
                "watch connections flourish."
            ),
            keywords=["joy", "growth", "relationships"],
            element="air",
        ),
        CupSymbol(
            name="Key",
            meaning=(
                "A doorway opens. Your curiosity and courage unlock a solution "
                "that once felt hidden."
            ),
            keywords=["solutions", "breakthrough", "mystery"],
            element="fire",
        ),
        CupSymbol(
            name="Sun",
            meaning=(
                "Vitality surges. Optimism draws allies to your side and "
                "clarifies the path ahead."
            ),
            keywords=["success", "energy", "confidence"],
            element="fire",
        ),
    ]
}


PLACEMENT_MEANINGS = {
    "rim": (
        "Events manifest quickly—expect developments within days."
    ),
    "middle": (
        "Matters mature steadily. Growth unfolds over the coming weeks."
    ),
    "bottom": (
        "Deep roots and long-term themes are in play. Patience reveals the lesson."
    ),
}


BEVERAGE_TONES = {
    "coffee": "Grounded insights with a practical tone guide your steps.",
    "tea": "A gentle, intuitive vibe softens the messages you receive.",
    "herbal": "Healing energies and self-care rituals support your process.",
    "espresso": "Intense focus and swift change define this reading.",
    "decaf": "Calm reflection helps you notice subtle opportunities.",
}


LIFE_THEMES = {
    "love": (
        "Relationships respond to authenticity. Share your true feelings and "
        "listen for the responses hidden between the lines."
    ),
    "career": (
        "Opportunities emerge when you show up prepared. Let curiosity lead "
        "you to the next collaborative venture."
    ),
    "wellness": (
        "Your body mirrors your routines. Small adjustments to rest and "
        "mindfulness create lasting vitality."
    ),
    "spiritual": (
        "Dreams and synchronicities guide your path. Welcome quiet moments "
        "to hear your inner wisdom."
    ),
}


def allowed_file(filename: str) -> bool:
    """Return True if the filename uses a supported image extension."""

    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def analyze_cup_image(image_path: Path) -> CupImageInsights:
    """Inspect an uploaded cup image and infer symbolism and placement."""

    with Image.open(image_path) as img:
        img = img.convert("RGB")
        width, height = img.size
        if width == 0 or height == 0:
            raise ValueError("Image has no discernible size")

        grayscale = img.convert("L")
        stat = ImageStat.Stat(grayscale)
        brightness = stat.mean[0]
        contrast = stat.stddev[0]

        edges = grayscale.filter(ImageFilter.FIND_EDGES)
        edge_stat = ImageStat.Stat(edges)
        edge_energy = edge_stat.mean[0]

        third = max(height / 3.0, 1)
        segment_boxes = {
            "rim": (0, 0, width, int(third)),
            "middle": (0, int(third), width, int(min(2 * third, height))),
            "bottom": (0, int(min(2 * third, height)), width, height),
        }
        segment_scores: Dict[str, float] = {}
        for name, box in segment_boxes.items():
            if box[3] - box[1] <= 0:
                segment_scores[name] = 0.0
                continue
            region = edges.crop(box)
            segment_scores[name] = ImageStat.Stat(region).mean[0]

        placement = max(segment_scores, key=segment_scores.get) if segment_scores else "middle"

        center_box = (
            int(width * 0.25),
            int(height * 0.25),
            int(width * 0.75),
            int(height * 0.75),
        )
        center_region = grayscale.crop(center_box)
        center_brightness = ImageStat.Stat(center_region).mean[0]
        swirl_index = abs(center_brightness - brightness)

        symbol_candidates: List[str] = []
        if edge_energy >= 65:
            symbol_candidates.append("Mountain")
        if contrast >= 50:
            symbol_candidates.append("Snake")
        if brightness >= 155:
            symbol_candidates.append("Sun")
        elif brightness <= 90:
            symbol_candidates.append("Fish")
        if placement == "rim":
            symbol_candidates.append("Bird")
        elif placement == "bottom":
            symbol_candidates.append("Anchor")
        if swirl_index >= 25:
            symbol_candidates.append("Key")
        elif swirl_index <= 10:
            symbol_candidates.append("Flower")

        unique_symbols: List[str] = []
        for symbol in symbol_candidates:
            if symbol not in unique_symbols:
                unique_symbols.append(symbol)
        for fallback in ["Star", "Heart", "Flower", "Bird", "Fish"]:
            if len(unique_symbols) >= 3:
                break
            if fallback not in unique_symbols:
                unique_symbols.append(fallback)

        texture_phrase = (
            "Bold textures cling to the porcelain walls."
            if edge_energy >= 65
            else "Sketched trails outline the cup's surface."
            if edge_energy >= 40
            else "Soft washes drift through the cup."
        )
        light_phrase = (
            "The cup glows brightly, signalling optimism."
            if brightness >= 155
            else "Balanced midtones invite contemplation."
            if brightness >= 115
            else "Shadowed tones point to introspection and hidden whispers."
        )
        motion_phrase = (
            "A dramatic swirl draws attention toward the heart of the cup."
            if swirl_index >= 25
            else "Gentle currents keep the story steady and measured."
            if swirl_index >= 15
            else "Still pools create a calm canvas for intuition to land."
        )
        summary = " ".join([texture_phrase, light_phrase, motion_phrase])

        placement_highlights = {
            "rim": "Most contrast gathers near the rim, hinting at swift developments.",
            "middle": "Textures concentrate mid-cup, suggesting themes taking shape soon.",
            "bottom": "Depth collects at the base, emphasising long-term foundations.",
        }
        highlights: List[str] = [placement_highlights.get(placement, "The cup balances its story across all layers.")]
        if swirl_index >= 25:
            highlights.append("A pronounced center swirl signals a secret ready to unfurl.")
        elif swirl_index <= 10:
            highlights.append("Evenly spread tones create a peaceful, grounded message.")

        if contrast >= 55:
            highlights.append("Strong contrasts hint at transformative shifts unfolding.")
        elif edge_energy <= 25:
            highlights.append("Feather-light edges keep the guidance gentle and reflective.")

        if not highlights:
            highlights.append("The photo offers a balanced field, inviting intuition to lead the reading.")

        metrics = {
            "Brightness": int(round((brightness / 255) * 100)),
            "Contrast": int(round(min(contrast / 128, 1) * 100)),
            "Edge energy": int(round((edge_energy / 255) * 100)),
            "Center pull": int(round(min(swirl_index / 128, 1) * 100)),
        }

        return CupImageInsights(
            symbols=unique_symbols[:3],
            placement=placement,
            summary=summary,
            highlights=highlights,
            metrics=metrics,
        )


def interpret_symbols(symbol_names: Sequence[str]) -> List[str]:
    """Return interpretation blurbs for the provided symbols."""

    interpretations: List[str] = []
    for name in symbol_names:
        key = name.strip().lower()
        if not key:
            continue
        symbol = SYMBOL_LIBRARY.get(key)
        if symbol:
            interpretations.append(symbol.meaning)
        else:
            interpretations.append(
                textwrap.fill(
                    (
                        f"The symbol '{name}' invites you to explore its personal "
                        "meaning. Notice the emotions it stirs—it may reveal a "
                        "message unique to your journey."
                    ),
                    width=78,
                )
            )
    return interpretations


def interpret_placement(placement: str) -> str:
    """Return the meaning associated with where the symbols appeared."""

    return PLACEMENT_MEANINGS.get(
        placement,
        "The placement invites a flexible timeline—trust your inner rhythm as it unfolds.",
    )


def interpret_beverage(beverage: str) -> str:
    """Return tonal guidance for the selected beverage type."""

    return BEVERAGE_TONES.get(
        beverage,
        "Your chosen brew brings a personal signature. Let its aroma anchor you in the present moment.",
    )


def build_focus_prompt(symbol_names: Sequence[str]) -> str:
    """Generate a reflective question linked to the user's symbols."""

    if not symbol_names:
        return (
            "What inner whisper seeks your attention right now? Sit with the silence and let insight arise."
        )

    chosen = random.choice(symbol_names).strip().lower()
    symbol = SYMBOL_LIBRARY.get(chosen)
    if symbol:
        keyword = random.choice(list(symbol.keywords))
        return (
            f"How does the theme of {keyword} appear in your life this week? What next step feels aligned?"
        )
    return (
        "What personal symbol feels powerful to you today, and what lesson does it offer?"
    )


def generate_outlook() -> Dict[str, str]:
    """Create short outlook statements for core life areas."""

    focuses = random.sample(list(LIFE_THEMES.items()), k=3)
    return {area.title(): message for area, message in focuses}


def lucky_numbers() -> List[int]:
    """Provide playful lucky numbers for the reading."""

    return sorted(random.sample(range(3, 60), k=5))


@app.route("/", methods=["GET", "POST"])
def index():
    default_beverage = "coffee"

    if request.method == "POST":
        beverage = request.form.get("beverage", default_beverage)
        mood = request.form.get("mood", "")
        observations = request.form.get("observations", "")
        uploaded = request.files.get("cup_image")

        form_state = {
            "beverage": beverage or default_beverage,
            "mood": mood,
            "observations": observations,
        }

        if not uploaded or uploaded.filename == "":
            return render_template(
                "index.html",
                beverages=sorted(BEVERAGE_TONES.keys()),
                error="Please choose a photo of your cup to begin the reading.",
                form_state=form_state,
            )

        if not allowed_file(uploaded.filename):
            return render_template(
                "index.html",
                beverages=sorted(BEVERAGE_TONES.keys()),
                error="Unsupported file type. Please upload a PNG, JPG, GIF, WEBP, or BMP image.",
                form_state=form_state,
            )

        filename = secure_filename(uploaded.filename)
        ext = Path(filename).suffix.lower()
        unique_name = f"{date.today().isoformat()}-{secrets.token_hex(8)}{ext}"
        save_path = UPLOAD_FOLDER / unique_name
        uploaded.save(save_path)

        try:
            insights = analyze_cup_image(save_path)
        except Exception:
            if save_path.exists():
                save_path.unlink()
            return render_template(
                "index.html",
                beverages=sorted(BEVERAGE_TONES.keys()),
                error="We couldn't interpret that image. Please upload a clear photo of the cup's interior.",
                form_state=form_state,
            )

        derived_symbols = insights.symbols
        interpretations = interpret_symbols(derived_symbols)
        symbol_messages = []
        for idx, message in enumerate(interpretations):
            label = derived_symbols[idx] if idx < len(derived_symbols) else f"Symbol {idx + 1}"
            symbol_messages.append({"label": label.title(), "message": message})

        reading = {
            "date": date.today().strftime("%B %d, %Y"),
            "symbol_focus": symbol_messages,
            "placement": interpret_placement(insights.placement),
            "placement_choice": insights.placement.title(),
            "beverage_choice": beverage.title() if beverage else "Custom blend",
            "beverage_tone": interpret_beverage(beverage),
            "mood": mood.strip(),
            "reflection_prompt": build_focus_prompt(derived_symbols),
            "outlook": generate_outlook(),
            "lucky_numbers": lucky_numbers(),
            "observations": observations.strip(),
        }

        image_url = url_for("static", filename=f"uploads/{unique_name}")

        return render_template(
            "reading.html",
            reading=reading,
            analysis=insights,
            image_url=image_url,
        )

    form_state = {
        "beverage": default_beverage,
        "mood": "",
        "observations": "",
    }
    return render_template(
        "index.html",
        beverages=sorted(BEVERAGE_TONES.keys()),
        error=None,
        form_state=form_state,
    )


if __name__ == "__main__":
    app.run(debug=True)
