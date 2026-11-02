#!/usr/bin/env python3
"""Set (or with --clear remove) the password the trainer asks for on first
visit. Writes config.js; commit and push afterwards. Also bump VERSION in
sw.js so installed copies pick the change up."""
import getpass, hashlib, pathlib, sys
p = pathlib.Path(__file__).parent / "config.js"
if "--clear" in sys.argv:
    h = "null"
else:
    pw = getpass.getpass("Password: ")
    if pw != getpass.getpass("Again: "):
        sys.exit("Passwords differ.")
    h = '"' + hashlib.sha256(("atc-trainer:" + pw).encode()).hexdigest() + '"'
lines = p.read_text(encoding="utf-8").splitlines(keepends=True)
lines = [f"window.PASSWORD_HASH = {h};\n" if l.startswith("window.PASSWORD_HASH") else l for l in lines]
p.write_text("".join(lines), encoding="utf-8")
print("password", "cleared" if h == "null" else "set", "in", p)
