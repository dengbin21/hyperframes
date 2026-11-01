# Story

Read before building any video that tells something over about 15 s: a launch or promo, an explainer, a pull-request or changelog video, a recap, a music video with a narrative. Most weak films are good motion around no story: a list of features, three cards in a row, a logo, a URL.

Skip it for an edit to an existing project, captions or overlays on footage, and a short single-idea piece (one kinetic line, a map move, a highlight on an image), where the request is the story. When the person gave a script, a storyboard or a reference film, follow theirs. The shape of each kind of film (launch, explainer, music, data, vertical, 3D, character) is in `types/`.

## 1. The one thing

- **What it is**, in one line: "You can now …" for a launch, the one idea the viewer must understand for an explainer, what changed and why it matters for a pull request. A whole release ("2.0", "what's new") is not one thing: take its headline.
- **The one thing to remember** after the film ends, in the viewer's words, not the brand slogan.
- **One viewer doing one real task**, from the moment they need it to the result. That task is the spine, and one real piece of data (a query, a file, a prompt, a number) travels through it from the hook to the payoff. An explainer's spine is one concrete example worked through.
- Keep facts (what it does, real numbers, real labels) apart from creative choices (angle, tone, look). Every claim on screen traces to the source: the site, the PR, the docs or the person's words. Use the person's own copy verbatim.
- What the source does not say stays unsaid: never derive a claim it did not make ("40 min to 2 min" is not "20× faster"), mark an example number as illustrative, and show a screen you cannot get as a labelled placeholder, not a drawn one.

## 2. Read the subject before you sketch

Most AI-made motion fails here, not in the code: it picks the same look for every subject and animates every feature with equal weight. Read what you were given before asking anything — the site, the app store page, the README, screenshots, the logo, existing launch posts, the data file — and write one line each:

- **What it is**, in the person's own words, and its category.
- **The one thing** the film must leave behind (§1); propose it if they did not say.
- **Personality** on the five sliders below, with the evidence you read it from (the site's type, its copy, its colours). Brand assets beat adjectives.
- **Real material** collected before anything is drawn: the logo file, the interface, numbers with sources, footage, a voice. Every string, number and default on screen points to a real screenshot, recording or page; what you cannot point to is not shown. Footage the person gave plays as it is — uncut, unmasked, unstabilised — and is processed only when asked.
- **Where it plays**: a feed (autoplay, muted at first), vertical with captions, a landing-page hero (silent loop), a stage (sound on), an app-store preview.
- **Material**: code-built, CG, live footage, screen recording, AI-generated — and in what mix. Material changes a film more than language does.
- **People**: none, hands only, picture-in-picture, or on camera; and who speaks.
- **Sound**: muted-first (must read without sound) or sound-led.

Ask only what you cannot find or infer, in one message, with your defaults written in: "I'll assume X unless you say otherwise."

| Slider | −2 | +2 | What it moves |
| --- | --- | --- | --- |
| precise ↔ playful | Linear, Stripe | Duolingo, Arc | easing (hard ease-out → springs with overshoot), shape language (grids → blobs) |
| calm ↔ energetic | Notion, a meditation app | games, sport, music | tempo, shot length, cut density |
| premium ↔ accessible | Apple, Leica | Canva, a consumer utility | negative space, type-scale contrast, colour count, how much is on screen |
| technical ↔ human | CLI tools, infra | social, health, kids | monospace, code and diagrams vs photos, faces, hand-drawn |
| established ↔ new | banks, enterprise | startups, beta launches | restraint vs bold and surprising |

Three cautions. Precise ↔ playful is about motion and shape, premium ↔ accessible about density and vocabulary — do not let one drag the other. Calm ↔ energetic sets the music and the cutting, and the cutting matters more: measured across 21 launch films, the ones that read as cool were not fast in tempo (77–130 BPM, median 105) but dense in cutting (a shot every 1.8–3.5 s, 15–33 cuts a minute), and nine in twelve had one burst of 5–8 cuts inside five seconds. So when a brief asks for *tech*, *cool* or *energetic*, take the hybrid or montage route (`rhythm.md` §1) whatever the category, and let the brand's calm set the look, not the energy. A launch film defaults to energetic: 100–125 BPM, an onset or the first cut inside 3 s, a climb, a burst near 30–60% of the length.

## 3. The shape picks the language

The shape of what has to be said decides the motion language far more than the category does. The languages named here are in `motion-languages.md`.

| Shape | Sounds like | Natural languages | Wrong choice |
| --- | --- | --- | --- |
| Claim / feeling | "Introducing X." "Any model." | kinetic type, generative field, 3D object | a UI tour |
| Workflow | "Type this, get that." | cursor demo, continuous morph | abstract shapes with no product |
| Mechanism | "Here is why it works." | mechanism, system diagram, flat world | a fast cut reel |
| Evidence | "Signups doubled." | data story, editorial collage | numbers flashing by unreadably |
| List | "Five new things." | kinetic type chapters, modular grid, card montage | five equal slides |
| Transformation | "Before / after." | continuous morph, data story, split compare | a cut between two stills |
| Story | "A little agent wakes up…" | talking head, photo-led, character, hand-drawn | bullet points |
| Showcase | "Look what it can do." | one deeply made artifact; a showreel on one spine | a feature list |

A film may have two shapes (a story opening, a workflow middle, a claim ending). Give each part its own language only when the switch itself means something; otherwise carry one through.

## 4. Three storylines, then one

Write three. They are three different films, not three titles on one film: each has its own **world** (where it happens and what it looks like), its own **device** (what the story is) and its own **form** (how the camera and the cuts carry it). Sketch five or more ideas first, a line each pairing a device with a form (tables below); drop those the subject cannot carry well, and of the rest keep the three that differ most. Make one of the three the bold one you would not have picked first. Each says:

- its name, its device and form in a few words, and in two sentences what the viewer sees and feels;
- the first two seconds, exactly;
- its beats in one line (`hook → … → end card`);
- its look in one line: ground, type, the one material or treatment, taken from the subject or the brand (`look.md`);
- its sound in one line (`sound.md` §1).

The storylines are words: build nothing for any of them before one is picked. Pick a storyline for its story: the one a stranger would follow and remember, with people or a situation they know, ahead of the most striking picture. Picking a storyline picks its look and its sound. Then write the picked one as `SPEC.md`.

Put your recommendation first, with the reason in one clause, and save all three in the project as `STORYLINES.md` so a later turn can switch.

- **The person is there to answer:** show the three and stop once until they pick. A mix ("A's opening with C's middle") is one storyline. Ask nothing else unless only they can answer it (real screens you cannot capture, narrated or music only). State everything else in one assumption line: the length as a range, the aspect, music or voice, and every paid item (a HeyGen voice, an avatar, catalog music) with the free option beside it.
- **They asked for the file or for no stops:** take your recommendation, build it, and name the other two in one line each in your reply.
- With a storyboard (`storyboard.md`), the picked storyline becomes the board's frames.

| Device                        | What the viewer sees                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| A moment in someone's day     | a person, a time stamp, the message that creates the need ("launch is tomorrow")        |
| A character does the work     | a mascot or a cursor carries, drags, draws and reacts; every cut has a cause            |
| The feature as the hook       | the feature happening to a recognisable image in the first half second                  |
| The result first              | the finished output plays, then the camera pulls back to show where it came from        |
| One object across apps        | the thing being made travels from one app into the product, which keeps working on it   |
| Life before and after         | the old way as a scene (one person drowning in tabs), then the new way                  |
| Type carries the argument     | giant kinetic type, colour fields and grids that cut on the beat                        |
| A number lands                | one real number earned by a scene, then made physical                                   |
| A question with the input     | "What if you could make a video from your ⟨website⟩?", the blank filled by a real input |
| The object is the explanation | a machine or model whose working is the idea; the camera tours through it               |

| Form                       | What the viewer sees                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| One continuous take        | the camera never cuts; it pushes, pulls and travels from one world into the next             |
| Object-to-object chain     | every shot ends on the thing that opens the next: a button becomes a card becomes a phone    |
| An endless zoom            | the camera dives into a detail that turns out to be the next world, again and again          |
| A flight through one world | a 3D set, a map or a desk the camera travels across; each idea is a stop on the route        |
| Cut on the beat            | hard cuts on the music, type and colour fields changing every half beat                      |
| Match cuts                 | one shape holds while everything around it changes: a circle becomes a lens, a wheel, a logo |
| Split screen to one        | several panes play at once, then collapse into the one that matters                          |
| One frame that rebuilds    | a single composition keeps rearranging itself and never leaves the frame                     |

A pitch where all three are plain cuts between scenes has not tried the forms. Before and after: the new side moves calmly while the old side churns; never mock a named competitor. A recap asks one question first so each piece answers it.

### Three directions, genuinely different

A storyline is a story; a direction is the film's treatment. When the person has not chosen one, the three you write differ in **language or material**, not in colour — the largest differences between films of the same month were material (a pure code recording against live footage with UI cards growing out of it), and three quiet variations on the same grammar are one direction written three times.

- **A · Fit** — the language the message's shape and the brand's personality point to (`motion-languages.md`). The safe, excellent one.
- **B · Amplify** — the same message pushed: one continuous take instead of scenes, type as the hero instead of UI, a 3D world instead of flat.
- **C · Unexpected** — a different language that still carries the message and suits the brand: an art-history reimagining (`art-styles.md`), a character story, an editorial collage. Novelty alone is not a direction.

Exactly one of the three uses depth (`types/3d.md` — an interface in space, or real objects in a studio), so the person always has depth to choose and always has something else. Which one gets it follows the brief: depth for a premium launch, a physical or iconic object, or an interface whose layers are worth separating; another language for a sentence, a list, a mechanism, or a changelog. If the three share one drawn object (a mascot, an emblem), make that object first, alone, at full size — one weak object sinks all three.

Every direction carries the same six lines, so the person can mix them by layer ("C's composition with B's feeling"):

```
A · <name>     language: <id> (+ the techniques that carry it)   look: <type, material, light>
Palette:       <role #hex share · …> — from: <where each colour came from>   (look.md "Colour")
Logline:       <the film in one sentence, the hook and the ending>
Why it fits:   <message shape + the personality sentence → this>
Feel:          <route, BPM, events per bar, what the first 3 s show with the sound off>
Risk:          <what could make it fail, e.g. "needs real screenshots we cannot capture">
```

The feel line comes from `rhythm.md`; the palette from `look.md`. Music is not on the cards: most people cannot judge a music world from a name, and it is a decision they do not want. Choose it from the subject's character (`sound.md` §3) once a direction is picked, and offer options only when they ask for a say.

If they said "just make it", or the film is a quick variation of an existing one, choose A yourself, say why in one line, and offer B and C as one-line alternatives at handover. Name directions by a real reference ("Linear changelog", "Apple bumper", "Kurzgesagt"), never by adjectives.

## 5. The hook

The first two seconds are the densest of the film, and frame 0 is the thumbnail: never black, never a logo alone. Open on the feature working on something recognisable, a real moment that creates the need, a question with the input inside it, a sentence whose last word becomes the picture, or the bug itself. Then let the old way fail on screen (the wait, the wall of text, the wrong result) before the product brings relief; the proof is often the same shot improved in front of the viewer. Typing into a prompt box as the opener, with nothing else on screen, is the tell of a generated film; as a story step a few seconds in, it is fine.

## 6. Beats

A common shape for a launch of about 35 s; scale it, let the device bend it, and take another type's shape from its file in `types/`:

| Beat     | Share | Job                                                                                       |
| -------- | ----- | ----------------------------------------------------------------------------------------- |
| Hook     | ~8%   | the world and the need, or the feature already working                                    |
| Tension  | ~12%  | the old way failing on screen, or a gag                                                   |
| Reveal   | ~8%   | the product or idea named as a title, about 20–30% in                                     |
| Proof    | ~40%  | the real task in the real UI as 3–6 verbs (_paste, pick, watch it build, ship_), one each |
| Payoff   | ~20%  | the output arrives, already moving: the biggest visual moment, once, 60–80% in            |
| Claim    | ~8%   | the one thing, in one line                                                                |
| End card | ~8%   | the mark carried in, the name and the call to action land and hold 2–3 s                  |

In each verb beat keep only what the cursor touches and what proves the line; delete the rest of the screen. The process runs fast; the payoff plays at normal speed. Length follows the story (a feature launch is usually 20–45 s); a length in the request is a range, never padded.

## 7. Worlds

A film visits several worlds, each with its own background, light and scale (a desktop, the product on a brand gradient, a white void with a character, live action), never one dark canvas with small UI floating in it. Enter each world through an object already on screen: the thing clicked becomes the next shot. Keep one home stage to return to, one carrier the eye follows, and the palette and type constant across worlds.

## 8. Copy and voice

- Titles take at most 6 words a line, one line on screen at a time, no trailing periods; an explainer's lines may run to about 10. A line holds about 0.3 s a word plus 0.5 s, and the last line at least 2 s.
- Show, don't list: no bullet slides or three-card rows. When similar things repeat, each gets its own idea and layout.
- Real numbers only, from the source. The first line is never "Introducing", "Meet" or the logo; after the pain, "Introducing X" is fine. Never "unlock", "seamless", "supercharge", "game-changer", "revolutionize", "effortless", or "in seconds" unless measured.
- Read the lines alone: a stranger gets the pitch. Watch the pictures alone: they tell the same story.
- No voiceover unless the request or the source calls for one; then the screen never repeats the spoken sentence word for word. Without a voice, large titles and the product's own text carry the words, over music and effects (`sound.md`).

## 9. The brand

The mark lands once, with weight, usually on the end card; before it the brand shows only inside the product and the story, never docked small in a corner. The end card is built, not a still: the mark is carried in, typed or wiped in. The accent colour is rationed: one highlighted word, the payoff, the end card.

## 10. Tells of a generated film

The defaults a film falls into when nothing is decided are banned by name in `spec.md` ("BANNED by default"): a dark void with small things floating in it, glow and particles, the cream-paper-serif-mono-label look, everything fading and sliding up, three cards in a row, the docked logo. Beyond those, for a story:

- every scene entering the same way, or the same move beat after beat;
- side-by-side panels and floating cards standing in for a scene;
- titles that keep sliding or shrinking after they land; breathing or floating loops standing in for motion on titles and UI (a character's idle breath is acting, `types/character.md`).

When a first render shows any of them, name which, take the replacement from the subject, the brand or the medium, and add it to the BANNED line of `SPEC.md`.
