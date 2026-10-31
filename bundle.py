#!/usr/bin/env python3
"""Build dist/atc-trainer.html: one self-contained file with CSS, JS and data
inlined. Send that file (or a zip of it); it opens in any browser, no server."""
import base64, pathlib, re
root = pathlib.Path(__file__).parent
html = (root / "index.html").read_text(encoding="utf-8")
html = re.sub(r'<link rel="stylesheet" href="([^"]+)">',
              lambda m: "<style>\n" + (root / m[1]).read_text(encoding="utf-8") + "</style>", html)
html = re.sub(r'<script src="([^"]+)"></script>',
              lambda m: "<script>\n" + (root / m[1]).read_text(encoding="utf-8") + "</script>", html)
html = re.sub(r'<link rel="manifest"[^>]*>\n', "", html)
icon = base64.b64encode((root / "icon.svg").read_bytes()).decode()
html = html.replace('href="icon.svg"', f'href="data:image/svg+xml;base64,{icon}"')
out = root / "dist" / "atc-trainer.html"
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding="utf-8")
print(out, f"{out.stat().st_size // 1024} KB")
