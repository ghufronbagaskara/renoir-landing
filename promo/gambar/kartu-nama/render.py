import json
import os
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont
from pypdf import PdfReader
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

HERE = Path(__file__).resolve().parent
OUT = HERE / "renders" / "v2"
FONT = Path(os.environ["WINDIR"]) / "Fonts"
W, H, BLEED = 90, 55, 3
COBALT, INK, ICE, MUTED = "#1D4ED8", "#101D37", "#DBEAFE", "#596273"
WHITE, CYAN = "#FFFFFF", "#89DFFF"
PEOPLE = json.loads((HERE / "kontak.json").read_text(encoding="utf-8"))


def label(value, x, y, width, size, color=INK, bold=False):
    return dict(text=value, x=x, y=y, width=width, size=size, color=color, bold=bold)


def front(person):
    names = person["nama"].rsplit(" ", 1)
    name_labels = ([label(names[0], 6, 13.2, 48, 23, INK, True),
                    label(names[1], 6, 21.8, 48, 23, INK, True)] if len(names) == 2
                   else [label(names[0], 6, 16.5, 48, 30, INK, True)])
    return dict(art="depan", logo=[64.7, 8.2, 21.1], labels=[
        label("Katalhys", 6, 5.1, 39, 12, INK, True),
        *name_labels,
        label(person["jabatan"], 6.2, 32, 48, 9.5, COBALT, True),
        label("WhatsApp", 6, 41.05, 35, 8, CYAN, True),
        label(person["whatsapp"] or "[Nomor bisnis]", 6, 46.2, 35, 9.5, WHITE),
        label("LinkedIn", 47, 41.05, 37, 8, CYAN, True),
        label(person["linkedin"] or "[Tautan profil]", 47, 46.2, 37, 9.5, WHITE),
    ])


SERVICES = [
    ("Website pemasaran", "Situs profil, landing page"),
    ("Sistem internal & AI", "Aplikasi kerja, otomasi"),
    ("Identitas & UI/UX", "Logo dan antarmuka"),
    ("Deploy & perawatan", "Monitoring dan backup"),
]
BACK = dict(art="belakang", labels=[
    label("Studio desain & teknologi", 6, 4.1, 61, 13.5, WHITE, True),
    label("Kami merancang dan membangun", 6, 11.75, 61, 8.8, ICE),
    label("website serta sistem untuk bisnis Anda.", 6, 15.75, 61, 8.8, ICE),
    label("Katalhys", 6, 47.45, 28, 9.5, WHITE, True),
    label("katalhys.com", 56.5, 47.45, 22, 9.5, WHITE),
])
for i, (title, detail) in enumerate(SERVICES):
    x = 6 if i % 2 == 0 else 47.6
    y = 23.2 if i < 2 else 34.6
    BACK["labels"].extend([
        label(f"{i + 1:02}", x, y + .15, 5.3, 8, CYAN, True),
        label(title, x + 6, y, 32.4, 8.5, WHITE, True),
        label(detail, x + 6, y + 4.2, 32.4, 8, ICE),
    ])


def draw_page(doc, design, art):
    doc.drawImage(art / f'{design["art"]}-bleed.png', 0, 0, (W + 2 * BLEED) * mm, (H + 2 * BLEED) * mm)
    if "logo" in design:
        x, y, side = design["logo"]
        doc.drawImage(art / "logo.png", (x + BLEED) * mm, (H + BLEED - y - side) * mm,
                      side * mm, side * mm, mask="auto")
    for item in design["labels"]:
        value, x, y, width, size, color, bold = (item[k] for k in
            ("text", "x", "y", "width", "size", "color", "bold"))
        font = "Arial-Bold" if bold else "Arial"
        assert size >= 8 and x >= 4 and x + width <= W - 4
        assert y >= 4 and y + size / mm <= H - 4, f"Teks di luar area aman: {value}"
        assert pdfmetrics.stringWidth(value, font, size) <= width * mm, f"Teks terlalu panjang: {value}"
        doc.setFillColor(HexColor(color))
        doc.setFont(font, size)
        doc.drawString((x + BLEED) * mm, (H + BLEED - y) * mm - size * 0.91, value)
    doc.showPage()


def main(art):
    OUT.mkdir(parents=True, exist_ok=True)
    pdfmetrics.registerFont(TTFont("Arial", FONT / "arial.ttf"))
    pdfmetrics.registerFont(TTFont("Arial-Bold", FONT / "arialbd.ttf"))
    pages = [page for person in PEOPLE for page in (front(person), BACK)]
    pdf = OUT / "katalhys-kartu-nama-proof-cetak.pdf"
    trim = (BLEED * mm, BLEED * mm, (W + BLEED) * mm, (H + BLEED) * mm)
    size = ((W + 2 * BLEED) * mm, (H + 2 * BLEED) * mm)
    doc = canvas.Canvas(str(pdf), pagesize=size, trimBox=trim, bleedBox=(0, 0, *size))
    doc.setTitle("Katalhys | Kartu nama")
    for page in pages:
        draw_page(doc, page, art)
    doc.save()

    checked = PdfReader(pdf).pages
    assert len(checked) == len(pages)
    for design, page in zip(pages, checked):
        assert all(abs(float(a) - b) < 0.001 for a, b in zip(page.trimbox, trim))
        assert all(item["text"] in page.extract_text() for item in design["labels"])

    stems = [PEOPLE[i // 2]["slug"] if i % 2 == 0 else "belakang-layanan" for i in range(len(pages))]
    for stem in dict.fromkeys(stems):
        page = stems.index(stem) + 1
        subprocess.run(["pdftoppm", "-f", str(page), "-l", str(page), "-r", "300",
                        "-x", "35", "-y", "35", "-W", "1063", "-H", "650", "-singlefile",
                        "-png", str(pdf), str(OUT / stem)], check=True)
        with Image.open(OUT / f"{stem}.png") as rendered:
            assert rendered.size == (1063, 650)

    preview = Image.new("RGB", (1480, 1060), "#E7EDF7")
    shadow = Image.new("RGBA", preview.size)
    slots = [(64, 326), (774, 193), (774, 622)]
    for x, y in slots:
        ImageDraw.Draw(shadow).rectangle((x, y + 9, x + 641, y + 401), fill=(23, 25, 28, 40))
    preview = Image.alpha_composite(preview.convert("RGBA"), shadow.filter(ImageFilter.GaussianBlur(14))).convert("RGB")
    pen = ImageDraw.Draw(preview)
    small = ImageFont.truetype(str(FONT / "arialbd.ttf"), 18)
    title = ImageFont.truetype(str(FONT / "arialbd.ttf"), 59)
    note = ImageFont.truetype(str(FONT / "arial.ttf"), 23)
    pen.text((64, 45), "KATALHYS  /  EDISI 02", font=small, fill=COBALT)
    pen.text((61, 76), "Kartu nama", font=title, fill=INK)
    pen.text((64, 152), "90 × 55 mm   ·   Identitas pendiri dan layanan studio", font=note, fill=MUTED)
    for (x, y), stem, title in zip(slots, ["belakang-layanan", *[p["slug"] for p in PEOPLE]],
                                   ["BELAKANG  /  TENTANG STUDIO", "DEPAN  /  CTO", "DEPAN  /  CEO"]):
        pen.text((x, y - 28), title, font=small, fill=MUTED)
        with Image.open(OUT / f"{stem}.png") as card:
            preview.paste(card.resize((642, 393), Image.Resampling.LANCZOS), (x, y))
    preview.save(OUT / "preview.jpg", quality=94, subsampling=0)
    print(json.dumps(dict(width=W, height=H, pages=pages)))


if __name__ == "__main__":
    main(Path(sys.argv[1]))
