# Band Sight Reading — product and code audit

**Audit date:** September 24, 2026  
**Scope:** The current static site in this package, including the eight-level generator, notation, audio, class/instrument views, tests, and the instrument-mode flow. This is an audit of the current source, not a claim that every browser, device, and speaker has been tested.

## Plain-language verdict

| Question | Answer | Practical condition |
|---|---|---|
| Can a student with little technical experience use it from Google Classroom? | **Mostly yes, after publishing a student-accessible copy.** | The teacher posts a public site link; each student selects Instrument mode, their part, level, and length. The Copy student link control has been removed. The current workshop preview is owner-restricted, so students cannot use that particular link. The app does not submit work or grades to Classroom. |
| Does it need my own server or bucket? | **No separate application server or storage bucket.** | Static HTML, CSS, and JavaScript run in the student's browser. It still needs an accessible web host, such as GitHub Pages. Keep the repository and a backup; no outside host is guaranteed forever. |
| Could it later become a desktop app or larger student platform? | **Yes, with further work.** | The music rules now live in a browser-independent module. A desktop shell can reuse them. Accounts, grading, microphone input, saved assignments, and synchronized teacher/student exercises would be new features, likely with storage and a service. |

## What is in the package

| Item | Purpose |
|---|---|
| `dist/index.html` | One-page classroom interface and controls. |
| `dist/style.css` | Projector and instrument layouts, responsive styling, dark mode, active states. |
| `dist/core.mjs` | Pure scale data, level rules, pitch math, and random exercise generation. No browser APIs. |
| `dist/clefs.mjs`, `dist/favicon.svg`, and `dist/BRAVURA-LICENSE.txt` | Licensed clef outlines, browser-tab icon, and attribution. |
| `dist/app.js` | Score drawing, audio, timers, modes, and controls. |
| `dist/checks.mjs` and `dist/checks.html` | In-browser test page at `/checks.html`; runs music-rule checks and interface smoke checks with pass/fail output. |
| `tests/core.test.mjs` and `tests/ui.test.mjs` | Repeatable Node test suite; run `node --test tests/*.test.mjs`. |
| `README.md` | Classroom, deployment, local-run, and limitation instructions. |

There is no framework, build step, external script, paid API, database, analytics package, account system, or server-side application. The browser generates and draws a new exercise when requested. It makes the reference sound locally using Web Audio. The word “MIDI” would be misleading here: no MIDI file is produced or played.

## Teaching behavior verified in the source

- Two views: class projection with six synchronized parts, and one instrument part for individual use. Class view has concert flute, separate B-flat clarinet and trumpet, E-flat alto sax, bass clef, and mallets.
- Four or eight bars in 4/4, concert B-flat major; one random underlying rhythm/melody supplies all parts. Class view shows eight bars on one line per part. On a narrow display the line shrinks, so it is intended for projection rather than a phone.
- Levels 1–3 use concert B-flat, C, D; Levels 4–6 add E-flat and F; Levels 7–8 use B-flat through the next B-flat. Paired eighths begin on a beat and are never singly flagged or grouped in threes. Quarter rests begin at Levels 3 and 6. Level 8 adds `mf` and occasional accents/staccato. Key signatures remain; courtesy accidentals appear through Level 6 and are omitted in Levels 7–8.
- Note ranges follow the previous scale game. Mallets sound/write an octave below flute. The alto part uses the corresponding G-major written scale. Class mode shows clarinet and trumpet separately so each retains its intended register.
- “Hear this exercise” plays a soft, synthesized piano-like concert reference. The next Proceed click makes a new exercise; double-click skips reference playback. Class mode also has an explicit **New exercise · skip audio** button.
- Instrument mode has a 48–172 BPM slider, four-count play-along, note highlight tracker, and metronome. The tracker starts on; play-along automatically uses one click stream and temporarily disables the separate metronome. Class mode hides the slider; the metronome remains available at the current tempo (68 BPM on first load).
- Dark mode persists on that device via `localStorage`. No exercise, score, name, recording, or student result is saved.
- A student can open the public site and select Instrument mode and settings. The app creates a *new random exercise*; the main interface no longer has a link-copy button. Previously formed preset URLs still load, but the interface does not create them.

## Findings and changes applied

| Priority | Finding | Action/status |
|---|---|---|
| High | Workshop site is restricted to its owner. A Google Classroom student link pointing there is unusable for other students. | **Documented.** Publish the supplied files to a student-accessible static host before assigning. Access settings were not silently changed. |
| High | The previous root ZIP and README described an older build and could mislead GitHub Pages setup. | **Addressed in this package.** The updated GitHub ZIP puts `index.html` at its root and includes the current tests and instructions. |
| Medium | Students opening the default URL land in class mode and must navigate controls. | **Current behavior.** Students select Instrument mode and settings; there is no Copy student link button. Previously formed preset URLs still load, and invalid settings are ignored safely. |
| Medium | Music rules and UI were intertwined, making later reuse difficult. | **Fixed.** Generator, scale data, and pitch helpers moved to a pure module; interface behavior remains separate. |
| Medium | Exercise generation moved its pitch position even when it inserted a rest. | **Fixed.** Rests no longer silently change the next note's pitch choice. |
| Medium | Earlier CSS held unused layout and highlight selectors from previous revisions. | **Fixed.** Removed abandoned wide-layout rules, old staff sizes, and unused color/active-stem rules. |
| Medium | Clarinet's below-the-break ending is not the trumpet's usual ascending ending. | **Fixed.** Class mode now shows separate B-flat lines: clarinet wraps to B3/C4; trumpet ascends to B4/C5. They keep the same rhythm and pitch classes, with different written registers at the end. |
| Medium | No fixed assignment, performance capture, submission, or teacher results. | **Known scope.** Google Classroom can distribute the link, but cannot receive a score from this app. Plan separate assignment and result features only if needed. |
| Low | Metronome, countdown, and visual tracker depend partly on browser timers; timing can vary under heavy device load. | **Known limit.** Fine for guided practice, not a measurement or grading instrument. Confirm on actual classroom devices and speakers. |
| Low | Eight-bar staves fit one line with no score scrollbar; phones can render notes too small. | **Known layout tradeoff.** Use a larger display for eight measures when readability matters. |

## Verification performed

- `node --check dist/app.js` passed.
- `node --test tests/*.test.mjs` passed **14/14** checks. The generator checks every level at 4 and 8 measures across 100 repeatable random seeds per combination; they confirm four beats per bar, allowed ranges, paired eighths, quarter-rest restrictions, and level-specific markings. Interface checks cover a preset URL, six class staffs, eight bars per staff, skip-audio generation, courtesy accidental rules, tempo range, playback volume routing, and accidentals staying in their own measures.
- The browser-facing `/checks.html` page is included to repeat core and interface smoke checks without a terminal. Its presence was reviewed in source; a real browser visual/audio pass was **not available in this audit environment**, so the final projector appearance, sound level, Google Classroom access, and browser timer behavior still need an on-device trial.
- The checks do not assess musical taste or whether generated lines sound like deliberate melodies. Generation produces short, bounded random exercises, not composed etudes.

## Deployment and long-term ownership

This product can live on GitHub Pages without an extra server, bucket, API key, or monthly app infrastructure. Copy the files from `dist/` into a GitHub repository root and enable Pages for the root of the main branch. The GitHub ZIP is already flattened for this workflow. Keep a backup of the repository and ZIP. Should a host change its terms or cease service, these files can be moved to another static host. Hosting services, browsers, and Classroom may change, so “in perpetuity” is a portability goal rather than a guarantee.

At the time of audit, [GitHub's documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) confirms Pages publishes HTML, CSS, and JavaScript from a repository. [GitHub's limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) apply, though this package is far smaller than its documented site-size threshold. [Google Classroom's material instructions](https://support.google.com/edu/classroom/answer/9123621?co=GENIE.Platform%3DDesktop&hl=en) describe attaching a link to Classwork. A public web host is required for students outside the current owner-only preview.

## Next technical direction, only if the classroom need arises

Reuse `core.mjs` as the music engine in a desktop wrapper or another web framework. Keep score display and audio as separate adapters. To assign *the exact same line* to everyone, add a seed or serialized exercise to the link and test that it reproduces identically. To collect work, design student identity, consent, recordings/results, teacher review, storage, and school data rules before adding a backend. Avoid moving to a framework merely for hosting; the current static app is simpler to maintain.

## Clef refinement after the audit

The text-font clefs were replaced with larger Bravura vector outlines. Treble curls around the G line; bass dots straddle the F line. The reference images were inspected and rendered staff samples were checked. The bundled font license is included. The repeatable interface check now verifies the presence and placement transforms of both clefs; this does not replace a final check on the classroom projector.

## Playback volume refinement after the audit

The bottom slider starts at 100% of the previous reference volume and can only reduce it. It adjusts the reference audio live, while metronome clicks keep their existing level. The reference playback path was also corrected to use the shared scale data; a focused audio-path check now covers the slider and separation from the metronome.

## Browser-tab icon and simpler controls

A compact treble-clef favicon was added using the existing licensed glyph. The Copy student link button and its clipboard handler were removed. Students use a publicly accessible site link and choose their own part and settings; preset URLs from earlier versions continue to work.

## Score scrolling update

The written music now fits the available score width in both modes, without a horizontal scrollbar. Tempo and playback-volume sliders remain because they control audio. At narrow widths an eight-measure line may be small; this is a readability tradeoff rather than clipped notation.
