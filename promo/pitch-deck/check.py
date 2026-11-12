"""Check the delivered deck; uses stdlib and the bundled PDF reader."""
import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from pypdf import PdfReader

root = Path(__file__).resolve().parent
ns = {"p": "http://schemas.openxmlformats.org/presentationml/2006/main", "a": "http://schemas.openxmlformats.org/drawingml/2006/main"}
deck = root / "output/katalhys-pitch-id-v5.pptx"
text_boxes = pictures = animations = 0
with zipfile.ZipFile(deck) as package:
    slide_names = sorted((name for name in package.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", name)), key=lambda name: int(re.search(r"(\d+)\.xml", name)[1]))
    assert len(slide_names) == 37
    for number, name in enumerate(slide_names, 1):
        slide = ET.fromstring(package.read(name))
        texts = [item.text or "" for item in slide.findall(".//a:t", ns)]
        assert not re.search(r"[\u2013\u2014]", " ".join(texts)), (number, "long dash in slide copy")
        assert "Katalhys" in texts, (number, "brand missing")
        assert str(number).zfill(2) in texts, (number, "page missing")
        assert not re.search(r"Claudia|Charolyn|Renoir|Catalyst|studio digital|Isaac|Munandar", " ".join(texts), re.I), (number, "private or outdated copy")
        if number <= 28:
            assert "AI POWERED SOFTWARE HOUSE" in texts, (number, "positioning missing")
        assert len(slide.findall(".//p:pic", ns)) >= 2, (number, "missing visual")
        assert len(slide.findall(".//p:sp/p:txBody", ns)) >= 5, (number, "flattened text")
        assert len(slide.findall(".//a:custGeom", ns)) >= 3, (number, "editable background curves missing")
        if number == 4:
            assert any("Elroy" in t for t in texts), "Team introduction missing"
            assert "Kenapa Katalhys dibangun" in texts
        if number == 16:
            assert "Lead tracker admin" in texts
        transitions = slide.findall(".//p:transition", ns)
        assert transitions, (number, "missing transition")
        assert all(t.find("p:push", ns) is not None for t in transitions), (number, "missing Push effect")
        assert all(t.get("advTm") is None for t in transitions), (number, "automatic advance")
        notes = ET.fromstring(package.read(f"ppt/notesSlides/notesSlide{number}.xml"))
        note_text = " ".join(item.text or "" for item in notes.findall(".//a:t", ns))
        assert not re.search(r"[\u2013\u2014]", note_text), (number, "long dash in speaker notes")
        assert "Sumber isi dan visual" in " ".join(item.text or "" for item in notes.findall(".//a:t", ns)), number
        text_boxes += len(slide.findall(".//p:sp/p:txBody", ns))
        pictures += len(slide.findall(".//p:pic", ns))
        animations += len(slide.findall(".//p:animEffect", ns))
    assert text_boxes >= 200 and pictures >= 70 and animations >= 37
    assert ET.fromstring(package.read("ppt/presentation.xml")).find("p:embeddedFontLst", ns) is not None
    assert not any(name.endswith("vbaProject.bin") for name in package.namelist())
reader = PdfReader(root / "output/katalhys-pitch-id-v5.pdf")
assert len(reader.pages) == 37
assert all("Katalhys" in page.extract_text() for page in reader.pages)
assert len(list((root / ".build/powerpoint-preview-v5").glob("slide-*.png"))) == 37
result = {"slides": len(slide_names), "editable_text_boxes": text_boxes, "image_objects": pictures, "image_animations": animations, "pdf_pages": len(reader.pages), "embedded_fonts": True}
(root / ".build/content-check.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
print(json.dumps(result))
