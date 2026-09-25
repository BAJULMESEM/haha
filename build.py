from pathlib import Path
from datetime import datetime
import json
import re

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "MADDAH"
OUTPUT = ROOT / "generated" / "data.js"

DATE_RE = re.compile(r"^\s*(\d{1,2})\s*,\s*(\d{1,2})\s*,\s*(\d{4})\s*$")


def parse_file(path: Path, maddah: str):
    raw = path.read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n")
    lines = [line.strip() for line in raw.split("\n") if line.strip()]

    if len(lines) < 2:
        raise ValueError("minimal 2 baris: tanggal lalu URL")

    match = DATE_RE.match(lines[0])
    if not match:
        raise ValueError("format tanggal harus DD,MM,YYYY")

    day, month, year = map(int, match.groups())
    date = datetime(year, month, day)

    url = lines[1].strip()
    if not re.match(r"^https?://", url, re.I):
        url = "https://" + url

    return {
        "id": str(path.relative_to(SOURCE)).replace("\\", "/"),
        "maddah": maddah,
        "title": path.stem,
        "day": day,
        "month": month,
        "year": year,
        "weekday": date.strftime("%A"),
        "url": url,
    }


def build():
    SOURCE.mkdir(exist_ok=True)
    OUTPUT.parent.mkdir(exist_ok=True)

    items = []
    errors = []

    for subject_dir in sorted(p for p in SOURCE.iterdir() if p.is_dir()):
        maddah = subject_dir.name
        for path in sorted(subject_dir.iterdir()):
            if not path.is_file():
                continue
            if path.suffix.lower() not in {".link", ".txt"}:
                continue
            try:
                items.append(parse_file(path, maddah))
            except Exception as exc:
                errors.append(f"{path}: {exc}")

    items.sort(key=lambda x: (
        x["maddah"].lower(),
        x["year"], x["month"], x["day"],
        x["title"].lower()
    ))

    # Mode tanggal secara desain maksimal 4 link per tanggal.
    counts = {}
    for item in items:
        key = f'{item["year"]:04d}-{item["month"]:02d}-{item["day"]:02d}'
        counts[key] = counts.get(key, 0) + 1

    warnings = [f"{k}: {v} link (mode tanggal hanya menampilkan 4)" for k, v in counts.items() if v > 4]

    payload = json.dumps(items, ensure_ascii=False, indent=2)
    js = (
        "// GENERATED FILE. Jangan edit manual.\n"
        f"window.LECTURE_DATA = {payload};\n"
    )
    OUTPUT.write_text(js, encoding="utf-8")

    print(f"Berhasil membaca {len(items)} file link.")
    if warnings:
        print("PERINGATAN:")
        for w in warnings:
            print(" -", w)
    if errors:
        print("ERROR:")
        for e in errors:
            print(" -", e)
        raise SystemExit(1)


if __name__ == "__main__":
    build()
