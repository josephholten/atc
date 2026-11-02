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
- **Registrations**: `D-EKAB` → "Delta Echo Kilo Alfa Bravo" (on strips the first letter matches the type's weight class)
- **Strip**: `DLH4PK A320 LEMD` → "Lufthansa four papa kilo, Airbus three two zero, Madrid"
- **Units**: `300 m → ft` → "≈ 990 ft" with the rule of thumb (m × 3 + 10%), the
  worked steps (300 × 3 = 900; + 90 = 990) and the exact value. Distance, speed,
  volume and mass can be switched on and off; "Rules of thumb" below the card
  lists the whole table.
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

`data/airlines.js`, `data/types.js`, `data/aerodromes.js`, `data/units.js` are
plain JavaScript arrays. Edit them with any text editor; no build step. After a
change, bump `VERSION` in `sw.js` so installed copies refresh.

## Password

```
python3 set-password.py
```

asks for a password and writes its hash to `config.js`; commit and push,
and bump `VERSION` in `sw.js`. Visitors type the password once per device.
`--clear` removes it. This keeps casual visitors out; it is not encryption,
and the data files are readable in the public repository anyway.

## Problem reports

"Report a problem" in the footer opens a prefilled report (mode, card on
screen, browser). Set `BUGREPORT_MAIL` in `config.js` to receive it by mail;
without an address it opens a new GitHub issue, which also notifies the
repository owner but needs a GitHub account.

## Host

Pages is enabled for the `master` branch, repository root:
<https://josephholten.github.io/atc/>. Every push to `master` deploys within
a minute or two. No other setup.
