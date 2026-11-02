// Unit conversions with the course rules of thumb.
// from / to: units as shown on the card
// factor:    exact multiplier (from → to); exact: how to write it in the solution
// simple:    the "simplification" column
// rule:      the "rule of thumb" column, null where the course gives none
//            (then the simplification is applied instead)
// steps:     how the rule is worked, in order: ["*", n] multiply, ["/", n] divide,
//            ["%", p] add p percent of the running value (negative p subtracts)
// values:    numbers to practise with, chosen so the arithmetic stays mental
// NM ↔ m is not a table row; it is the NM ↔ km rule followed by the factor 1000.
window.DATA = window.DATA || {};
(function () {
  const range = (min, max, step) => { const out = []; for (let v = min; v <= max + 1e-9; v += step) out.push(+v.toFixed(6)); return out; };
  const nice = [5, 10, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 4000, 5000];
  window.DATA.units = [
    // Distances
    { cat: "distance", from: "m",   to: "ft",  factor: 3.2808,  exact: "× 3.2808", simple: "3.3",  rule: "m × 3 + 10% ≈ ft",   steps: [["*", 3], ["%", 10]],  values: range(100, 3000, 50) },
    { cat: "distance", from: "ft",  to: "m",   factor: 0.3048,  exact: "× 0.3048", simple: "0.3",  rule: "ft / 3 − 10% ≈ m",   steps: [["/", 3], ["%", -10]], values: [100, 200, 300, 500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000] },
    { cat: "distance", from: "km",  to: "NM",  factor: 0.5399,  exact: "× 0.5399", simple: "0.54", rule: "km / 2 + 10% ≈ NM",  steps: [["/", 2], ["%", 10]],  values: range(10, 500, 10) },
    { cat: "distance", from: "NM",  to: "km",  factor: 1.852,   exact: "× 1.852",  simple: "1.9",  rule: "NM × 2 − 10% ≈ km",  steps: [["*", 2], ["%", -10]], values: range(5, 300, 5) },
    { cat: "distance", from: "NM",  to: "ft",  factor: 6076,    exact: "× 6076",   simple: "6000", rule: null,                 steps: [["*", 6000]],          values: range(1, 12, 1) },
    { cat: "distance", from: "NM",  to: "m",   factor: 1852,    exact: "× 1852",   simple: "1900", rule: "NM × 2 − 10% ≈ km, × 1000 ≈ m", steps: [["*", 2], ["%", -10], ["*", 1000]], values: range(1, 10, 1) },
    { cat: "distance", from: "m",   to: "NM",  factor: 1 / 1852, exact: "÷ 1852",  simple: "0.00054", rule: "m / 1000 ≈ km, / 2 + 10% ≈ NM", steps: [["/", 1000], ["/", 2], ["%", 10]], values: range(500, 10000, 500) },
    // Speeds
    { cat: "speed", from: "m/s",    to: "ft/min", factor: 196.8,  exact: "× 196.8",  simple: "× 200", rule: null, steps: [["*", 200]], values: range(1, 15, 1) },
    { cat: "speed", from: "ft/min", to: "m/s",    factor: 0.0050, exact: "× 0.0050", simple: "/ 200", rule: null, steps: [["/", 200]], values: range(200, 3000, 100) },
    { cat: "speed", from: "km/h",   to: "kt",     factor: 0.5399, exact: "× 0.5399", simple: "0.54",  rule: "km/h / 2 + 10% ≈ kt",  steps: [["/", 2], ["%", 10]],  values: range(100, 900, 10) },
    { cat: "speed", from: "kt",     to: "km/h",   factor: 1.852,  exact: "× 1.852",  simple: "1.9",   rule: "kt × 2 − 10% ≈ km/h",  steps: [["*", 2], ["%", -10]], values: range(50, 600, 10) },
    { cat: "speed", from: "kt",     to: "ft/min", factor: 101.27, exact: "× 101.27", simple: "100",   rule: null, steps: [["*", 100]], values: range(60, 300, 10) },
    { cat: "speed", from: "ft/min", to: "kt",     factor: 1 / 101.27, exact: "÷ 101.27", simple: "/ 100", rule: null, steps: [["/", 100]], values: range(500, 3000, 100) },
    // Volumes
    { cat: "volume", from: "L",        to: "gal U.S.", factor: 0.26417, exact: "× 0.26417", simple: "/ 4", rule: "L / 4 + 5% ≈ gal U.S.", steps: [["/", 4], ["%", 5]],  values: range(20, 1000, 20) },
    { cat: "volume", from: "gal U.S.", to: "L",        factor: 3.785,   exact: "× 3.785",   simple: "× 4", rule: "gal U.S. × 4 − 5% ≈ L", steps: [["*", 4], ["%", -5]], values: range(10, 500, 10) },
    // Mass
    { cat: "mass", from: "kg", to: "lb", factor: 2.20462, exact: "× 2.20462", simple: "2.2", rule: "kg × 2 + 10% ≈ lb", steps: [["*", 2], ["%", 10]],  values: nice },
    { cat: "mass", from: "lb", to: "kg", factor: 0.45359, exact: "× 0.45359", simple: "0.5", rule: "lb / 2 − 10% ≈ kg", steps: [["/", 2], ["%", -10]], values: nice },
  ];
})();
