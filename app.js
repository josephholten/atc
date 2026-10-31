"use strict";

// ---------- spelling ----------
const ALPHA = {
  A: "Alfa", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot", G: "Golf",
  H: "Hotel", I: "India", J: "Juliett", K: "Kilo", L: "Lima", M: "Mike", N: "November",
  O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo", S: "Sierra", T: "Tango", U: "Uniform",
  V: "Victor", W: "Whiskey", X: "X-Ray", Y: "Yankee", Z: "Zulu",
};
// Written form of the digits in solutions. Change here if the course prefers "tree"/"fife".
const DIGIT = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "niner"];
const LETTERS = Object.keys(ALPHA);

const spell = (s) => [...s].filter((c) => /[A-Z0-9]/.test(c)).map((c) => ALPHA[c] || DIGIT[+c]).join(" ");
const rnd = (n) => Math.floor(Math.random() * n);
const choice = (arr) => arr[rnd(arr.length)];

// ---------- data ----------
const D = window.DATA;
const AIRLINES = D.airlines.filter((a) => !a.prefix);   // usable for generated callsigns
const AIRLINES_ALL = D.airlines;                         // includes the prefix-style entries (MI…, R…)
const TYPES = D.types;
const GA_TYPES = TYPES.filter((t) => "CEFGHI".includes(t.reg));     // registration strips
const AIRLINE_TYPES = TYPES.filter((t) => t.reg === "A" || t.reg === "B"); // civil operator strips
const MIL_TYPES = TYPES.filter((t) => t.reg === null);                 // air force operator strips
const MIL_OPERATORS = new Set(["BAF", "FAF", "GAF", "NAF", "RRR", "RCH"]);
const AERODROMES = D.aerodromes;

// ---------- persistent state ----------
const LS = {
  get(k, def) { try { const v = localStorage.getItem("atc." + k); return v === null ? def : JSON.parse(v); } catch { return def; } },
  set(k, v) { try { localStorage.setItem("atc." + k, JSON.stringify(v)); } catch { /* private mode etc. */ } },
};
let scores = LS.get("scores", {});          // key -> {r, w}
let mode = LS.get("mode", "airlines");
let encode = LS.get("encode", false);
let groups = LS.get("groups", { europe: true, world: true, "de-civil": true, "de-vfr": true, "de-mil": true });

// ---------- weighted selection ----------
// Unseen items and items with many wrong answers come up more often.
function weight(key) {
  const s = scores[key];
  if (!s) return 2.8;
  return 0.3 + 2.5 * (s.w + 1) / (s.r + s.w + 1);
}
let lastKeys = new Set();
function pick(items, keyOf) {
  const ws = items.map((it) => (lastKeys.has(keyOf(it)) ? 0 : weight(keyOf(it))));
  let total = ws.reduce((a, b) => a + b, 0);
  if (total === 0) return choice(items);
  let x = Math.random() * total;
  for (let i = 0; i < items.length; i++) { x -= ws[i]; if (x <= 0) return items[i]; }
  return items[items.length - 1];
}

// ---------- generators ----------
// Designator + one digit + up to three alphanumerics. Letters only at the end.
function flightId() {
  const len = choice([1, 2, 2, 3, 3, 3, 4, 4, 4]);
  const letters = len === 1 ? 0 : choice([0, 0, 1, 1, 2].filter((l) => l < len));
  let id = String(1 + rnd(9));
  for (let i = 1; i < len - letters; i++) id += rnd(10);
  for (let i = 0; i < letters; i++) id += choice(LETTERS);
  return id;
}
function callsignCard() {
  const a = pick(AIRLINES, (x) => "airline:" + x.icao);
  const id = flightId();
  return { prompt: a.icao + id, answer: a.callsign + " " + spell(id), sub: a.icao + " = " + a.callsign, keys: ["airline:" + a.icao] };
}
// German registration, unabbreviated. The first letter follows the aircraft's
// MTOW / engine class (see data/types.js); without a type, a plausible mix.
function registration(cls) {
  cls = cls || choice(["E", "E", "E", "E", "G", "F", "I", "H", "C", "K"]);
  let r = "D-" + cls;
  for (let i = 0; i < 3; i++) r += choice(LETTERS);
  return r;
}
function registrationCard() {
  const r = registration();
  return { prompt: r, answer: spell(r), sub: "", keys: [] };
}
function activeAerodromes() {
  const f = AERODROMES.filter((a) => groups[a.group]);
  return f.length ? f : AERODROMES;
}

function airlineCard() {
  if (!encode) return callsignCard();
  const a = pick(AIRLINES_ALL, (x) => "airline:" + x.icao);
  return { prompt: a.callsign, answer: a.icao, sub: "", keys: ["airline:" + a.icao] };
}
function typeCard() {
  const t = pick(TYPES, (x) => "type:" + x.icao);
  const cls = "WTC " + t.wtc + " · " + t.engines;
  if (encode) return { prompt: t.mfr + " " + t.name, answer: t.icao, sub: cls, keys: ["type:" + t.icao] };
  return { prompt: t.icao, answer: t.spoken, sub: t.mfr + " " + t.name + " · " + cls, keys: ["type:" + t.icao] };
}
function aerodromeCard() {
  const a = pick(activeAerodromes(), (x) => "ad:" + x.icao);
  if (encode) return { prompt: a.name, answer: a.icao, sub: a.country, keys: ["ad:" + a.icao] };
  return { prompt: a.icao, answer: a.name, sub: a.country, keys: ["ad:" + a.icao] };
}
function stripCard() {
  const ga = Math.random() < 0.3;   // general aviation: registration + matching type
  const ad = pick(activeAerodromes(), (x) => "ad:" + x.icao);
  let t, cs, csSpoken, keys = ["ad:" + ad.icao];
  if (ga) {
    t = pick(GA_TYPES, (x) => "type:" + x.icao);
    cs = registration(t.reg); csSpoken = spell(cs);
  } else {
    const a = pick(AIRLINES, (x) => "airline:" + x.icao);
    t = pick(MIL_OPERATORS.has(a.icao) ? MIL_TYPES : AIRLINE_TYPES, (x) => "type:" + x.icao);
    const id = flightId();
    cs = a.icao + id; csSpoken = a.callsign + " " + spell(id);
    keys.push("airline:" + a.icao);
  }
  keys.push("type:" + t.icao);
  return {
    prompt: cs + " " + t.icao + " " + ad.icao,
    answer: csSpoken + ", " + t.spoken + ", " + ad.name,
    parts: [csSpoken, t.spoken, ad.name],   // rendered with extra spacing
    sub: t.mfr + " " + t.name + " · " + ad.name + ", " + ad.country,
    keys,
  };
}
function mixedCard() {
  return choice([airlineCard, typeCard, aerodromeCard])();
}
const GEN = { airlines: airlineCard, types: typeCard, aerodromes: aerodromeCard, registrations: registrationCard, strip: stripCard, mixed: mixedCard };

// ---------- UI ----------
const $ = (id) => document.getElementById(id);
const el = {
  prompt: $("prompt"), solution: $("solution"), answer: $("answer"), sub: $("sub"),
  reveal: $("reveal"), judge: $("judge"), right: $("right"), wrong: $("wrong"),
  sRight: $("s-right"), sWrong: $("s-wrong"), encode: $("encode"),
  dirOpt: $("direction-opt"), groupsOpt: $("groups-opt"),
  statsTotal: $("stats-total"), statsBody: document.querySelector("#stats-table tbody"), reset: $("reset"),
};
let card = null, revealed = false, session = { r: 0, w: 0 };

function label(key) {
  const [cat, code] = key.split(":");
  const list = { airline: AIRLINES_ALL, type: TYPES, ad: AERODROMES }[cat];
  const it = list.find((x) => x.icao === code);
  return it ? code + " – " + (it.callsign || it.spoken || it.name) : key;
}
function renderStats() {
  let r = 0, w = 0;
  const rows = Object.entries(scores).map(([k, s]) => { r += s.r; w += s.w; return [k, s]; });
  el.statsTotal.textContent = rows.length ? `${rows.length} items seen, ${r} right, ${w} wrong. Weakest items:` : "Nothing yet.";
  rows.sort((a, b) => weight(b[0]) - weight(a[0]) || b[1].w - a[1].w);
  el.statsBody.innerHTML = rows.slice(0, 15).map(([k, s]) =>
    `<tr><td>${label(k)}</td><td>${s.r}</td><td>${s.w}</td></tr>`).join("");
}
function renderOptions() {
  document.querySelectorAll("#modes button").forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
  el.dirOpt.hidden = !["airlines", "types", "aerodromes", "mixed"].includes(mode);
  el.groupsOpt.hidden = !["aerodromes", "strip", "mixed"].includes(mode);
  el.encode.checked = encode;
  document.querySelectorAll("#groups-opt input").forEach((c) => { c.checked = !!groups[c.dataset.group]; });
}
function next() {
  card = GEN[mode]();
  revealed = false;
  el.prompt.textContent = card.prompt;
  el.answer.textContent = "";
  if (card.parts) {
    for (const p of card.parts) { const span = document.createElement("span"); span.textContent = p; el.answer.append(span); }
  } else {
    el.answer.textContent = card.answer;
  }
  el.sub.textContent = card.sub;
  el.solution.hidden = true;
  el.judge.hidden = true;
  el.reveal.hidden = false;
}
function reveal() {
  if (revealed) return;
  revealed = true;
  el.solution.hidden = false;
  el.reveal.hidden = true;
  el.judge.hidden = false;
}
function judge(ok) {
  if (!revealed) return;
  for (const k of card.keys) {
    const s = scores[k] || (scores[k] = { r: 0, w: 0 });
    ok ? s.r++ : s.w++;
  }
  LS.set("scores", scores);
  lastKeys = new Set(card.keys);
  ok ? session.r++ : session.w++;
  el.sRight.textContent = session.r;
  el.sWrong.textContent = session.w;
  renderStats();
  next();
}

document.querySelectorAll("#modes button").forEach((b) => b.addEventListener("click", () => {
  mode = b.dataset.mode; LS.set("mode", mode); renderOptions(); next();
}));
el.encode.addEventListener("change", () => { encode = el.encode.checked; LS.set("encode", encode); next(); });
document.querySelectorAll("#groups-opt input").forEach((c) => c.addEventListener("change", () => {
  groups[c.dataset.group] = c.checked; LS.set("groups", groups); next();
}));
el.reveal.addEventListener("click", reveal);
el.right.addEventListener("click", () => judge(true));
el.wrong.addEventListener("click", () => judge(false));
el.reset.addEventListener("click", () => {
  if (confirm("Delete all statistics on this device?")) { scores = {}; LS.set("scores", scores); renderStats(); }
});
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === " " || e.key === "Enter") { e.preventDefault(); revealed ? next() : reveal(); }
  else if (e.key === "1" || e.key === "ArrowLeft") { e.preventDefault(); judge(false); }
  else if (e.key === "2" || e.key === "ArrowRight") { e.preventDefault(); judge(true); }
});

renderOptions();
renderStats();
next();

// Offline support: only possible over http(s), silently skipped when opened as a file.
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
