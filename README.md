# ATC R/T Trainer

Flashcard trainer for ATC trainees: see a code as it appears on a flight
strip, say it out loud, reveal the spoken form, mark yourself right or wrong.
Data is the course study list (airline designators, aircraft type
designators, location indicators). Everything runs in the browser; nothing is
sent anywhere and statistics stay on the device.

## Use

Open `index.html` in a browser, or visit the hosted page. Modes:

- **Airlines**: `DLH4PK` → "Lufthansa four papa kilo"
- **Types**: `B738` → "Boeing seven three eight"
- **Aerodromes**: `EDDM` → "München"
- **Registrations**: `D-EKAB` → "Delta Echo Kilo Alfa Bravo"
- **Strip**: `DLH4PK A320 LEMD` → "Lufthansa four papa kilo, Airbus three two zero, Madrid"
- **Mixed**: airlines, types and aerodromes shuffled

"Encode" reverses the direction (name → code). Aerodrome groups can be
switched on and off. Items answered wrongly come back more often.

Keys: `Space` reveal / next, `1` or `←` wrong, `2` or `→` right.

## Install (offline)

After one visit over https, Chrome or Edge offer "Install app" in the address
bar. The installed app works without network. Alternatively unzip the folder
anywhere and open `index.html`.

## Send as a single file

```
python3 bundle.py
```

writes `dist/atc-trainer.html` with everything inlined. Mail or share that one
file (zip it if a mail filter blocks `.html`); it opens in any browser by
double-click, no server, no install.

## Edit the data

`data/airlines.js`, `data/types.js`, `data/aerodromes.js` are plain
JavaScript arrays. Edit them with any text editor; no build step. After a
change, bump `VERSION` in `sw.js` so installed copies refresh.

## Host

Push to GitHub and enable Pages for the repository root. No other setup.
