# ATC radiotelephony trainer — plan

## What it does

A trainee sees a written prompt (as it would appear on a flight strip),
speaks it out loud, reveals the correct spoken form, and marks themselves
right or wrong. Data: only the course study list, nothing else.

| Mode          | Shown                 | Spoken                                                        |
|---------------|-----------------------|---------------------------------------------------------------|
| Airlines      | `DLH4PK`              | Lufthansa four papa kilo                                      |
| Types         | `B738`                | Boeing seven three eight                                      |
| Aerodromes    | `EDDM`                | München                                                       |
| Registrations | `D-EKAB`              | Delta echo kilo alfa bravo (never abbreviated)                |
| Strip         | `DLH4PK A320 LEMD`    | Lufthansa four papa kilo, Airbus three two zero, Madrid       |
| Encode        | `Speedbird`           | BAW (reverse direction for airlines, types, aerodromes)       |
| Units         | `300 m → ft`          | ≈ 990 ft; rule of thumb m × 3 + 10%, worked steps, exact value |

Decisions (2026-10-31):

- Airline callsign = 3-letter designator + one digit + up to three
  alphanumerics, letters only at the end, 7 characters at most.
- Wake category and engines appear only in the Types mode solution, never on
  strips; no "heavy", no operator names, no tactical
  callsigns, no registration abbreviation.
- One-line strip: callsign, type, destination.
- The PDF stays out of git (`.gitignore`).

Decisions (2026-11-02):

- Units mode works the course rules of thumb (m ↔ ft, km ↔ NM, NM → ft,
  m/s ↔ ft/min, km/h ↔ kt, kt ↔ ft/min, L ↔ gal U.S., kg ↔ lb) exactly as the
  conversion slides state them. NM ↔ m, which the exercise list asks for but
  the table lacks, chains the NM ↔ km rule with × 1000. Intermediate results
  are rounded as one would in one's head and carried forward; the exact value
  is shown alongside for comparison. Practice values are chosen so the
  arithmetic stays mental. The slides (docx) stay out of git like the PDF.

Later, optional: speech recognition that compares the transcript with the
solution.

## Architecture: one static folder, three ways to run it

```
atc/
  index.html        the whole UI
  style.css
  app.js            card logic, modes, self-check, localStorage score
  data/
    airlines.js     window.DATA.airlines = [{icao:"DLH", telephony:"Lufthansa", name:"Lufthansa"}, ...]
    types.js        window.DATA.types    = [{icao:"B738", spoken:"Boeing seven three seven eight hundred", name:"Boeing 737-800"}, ...]
    aerodromes.js   window.DATA.aerodromes = [{icao:"EDDM", spoken:"Munich", name:"Munich"}, ...]
  manifest.json     PWA metadata (name, icon, standalone window)
  sw.js             service worker: cache every file above for offline use
  icon.png
```

Rules that keep all three ways working:

1. No framework, no npm, no bundler. Vanilla HTML/CSS/JS, ES modules at most.
2. Data lives in `.js` files loaded with `<script src>`, not JSON loaded with
   `fetch`. Chrome refuses `fetch` from `file://`, so this is what makes the
   zip/double-click variant work.
3. Only relative paths. No server-side code at all.
4. Persistence through `localStorage` (scores, settings). Nothing leaves the
   machine.

### Way 1: website

Push the folder to GitHub, enable GitHub Pages. The URL serves the files; all
logic runs in the browser. Nothing to install on the corporate laptop.

### Way 2: installable, offline (the likely endpoint)

Add `manifest.json` and `sw.js` so the site is a Progressive Web App. After the
first visit the service worker has cached everything, so the page works with
no network. Chrome and Edge then offer "Install app": it gets its own window,
a start-menu/desktop icon on Windows and Linux, and runs offline. No admin
rights, no installer, no download. Updates arrive automatically on the next
online visit.

Fallback with zero infrastructure: zip the folder, unzip anywhere, double-click
`index.html`. Works because of rule 2.

### Way 3: real executable (only if a PWA is not acceptable)

Wrap the unchanged folder with Tauri (Rust shell around the OS webview; binary
of a few MB, produces `.msi`/`.exe` and `.deb`/`.AppImage`). Electron does the
same with a ~150 MB binary. Neither requires changing the web code. Defer
until someone actually needs an installer.

### Speech (later)

- `speechSynthesis` (reading the solution aloud): works in all browsers, offline.
- `SpeechRecognition` (checking what the trainee said): Chrome/Edge only,
  audio is sent to Google/Microsoft servers, needs network. Works in the
  PWA and in Tauri on Windows (WebView2 = Edge), not in Tauri on Linux
  (WebKitGTK). Fully offline recognition would need Vosk or Whisper via WASM,
  which is a separate project. So: self-check first, recognition as an
  opt-in button.

## Steps

1. done: `index.html` + `app.js`, all modes, keyboard self-check.
2. done: data files from the study list.
3. done: score per item in `localStorage`, weighted draw, statistics panel.
4. done locally: `manifest.json`, `sw.js`, icons. Open: push to GitHub Pages.
5. Optional: speech synthesis, then speech recognition with a fuzzy match
   against the solution.
6. Optional: Tauri build.
