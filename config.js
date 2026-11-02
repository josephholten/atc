// Deployment settings. Edit by hand or with set-password.py; commit and push.

// Access gate. null = no password. Set one with:  python3 set-password.py
// The hash is SHA-256 of "atc-trainer:" + password. This keeps casual visitors
// out; it is not encryption, anyone reading the source can bypass it.
window.PASSWORD_HASH = null;

// "Report a problem" link. With an address, the link opens the visitor's mail
// program with a prefilled report. null = link to a new GitHub issue instead
// (the reporter then needs a GitHub account).
window.BUGREPORT_MAIL = null;
