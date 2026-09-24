# Band Sight Reading

A static sight-reading exercise generator for beginning band. Five synchronized class parts or one instrument part, eight levels, four or eight measures, reference audio, and an optional timed play-along. Exercises run in the browser; no account, backend, database, or API key is needed.

## Classroom use

For a teacher-led projection, open the site and use **Class mode**. For students, choose **Instrument mode**, set the instrument, level, and length, then click **Copy student link**. Post the link as a Google Classroom material or assignment. Students get a new random exercise each visit. The link presets settings, but it does not preserve a particular generated exercise or collect submissions.

The in-progress ChatGPT Sites preview is owner-restricted. To give students access, publish the files in `dist/` at the root of a public static host such as GitHub Pages, then copy the student link from that public address. Do not post the owner-only preview as a student assignment.

## Run and verify

Serve the `dist/` directory with any static web server. For example, from the project root, run `python3 -m http.server 8000 --directory dist`, then open `http://localhost:8000/`. ES modules require HTTP(S); opening `index.html` through `file://` is not a supported launch method.

Run `node --test tests/*.test.mjs` for the repeatable music and interface checks. Open `/checks.html` on the running site for a browser test page with pass/fail results. The checks page is intended for teachers/developers and is not linked from the main student screen.

## GitHub Pages

Copy the contents of `dist/` into the repository root so `index.html` is at the root; enable Pages on the main branch/root in the repository settings. Use relative paths as supplied. If using the packaged GitHub ZIP, those files are already at the root. Keep a backup of the repository or ZIP for portability.

## Music and limitations

All exercises are 4/4 in concert B-flat major. Levels 1–3 have three notes (B-flat, C, D), Levels 4–6 have five (B-flat through F), and Levels 7–8 have the full eight (B-flat through B-flat). Eighth notes are paired within one beat. Rests first appear in Levels 3 and 6. Level 8 adds expression. Courtesy flats and sharps appear only in Levels 1–6; key signatures remain in all levels.

The note ranges follow the previous Concert B-flat Scale Quest. Clarinet's last two scale degrees wrap to B3 and C4 to remain below the break. Class mode and instrument mode now show separate B-flat lines: clarinet wraps to B3/C4 below the break, while trumpet ascends to B4/C5. Both derive from the same exercise and share the same rhythm and pitch classes.

The reference sound is a synthesized piano-like tone, not a MIDI file. The app does not listen to students, grade performances, save results, or submit to Google Classroom. A small screen may make all eight class measures too small; project class mode, and use instrument mode for personal devices.
