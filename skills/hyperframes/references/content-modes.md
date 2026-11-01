# Content modes: what kind of thing is being told

`explainer-grammars.md` owns **form** — how one shot carries its idea. This file owns
**content** — what kind of thing the film is about, and therefore what has to be settled
before the first frame is drawn. The two axes are independent: any mode can use any
grammar, and a film may switch grammar at a seam without switching mode.

Pick the mode from the person's input before writing a single line of narration. When it
is genuinely unclear, treat it as **D concept** — it is the mode that absorbs the most
subjects and the one whose structure (definition → example → parts → misconception →
summary) degrades most gracefully.

| Mode | The input sounds like | Settle before drawing | Structure |
| --- | --- | --- | --- |
| **A Phenomenon** | "Why is the sky blue?" | the mechanism, in one sentence | question → analogy → mechanism → consequence → callback |
| **B Problem** | a maths, physics or geometry problem | the worked solution, verified | read → givens/unknowns → why this approach → steps → answer → method |
| **C Word** | one word, usually a foreign one | the etymology and the pronunciation | word → parts → core meaning → examples → wrap |
| **D Concept** | "What is compound interest?" | the one-sentence definition | definition → example → parts → misconception → summary |
| **E Allusion / history** | an idiom, a classical text, a historical event | the original source text | hook → background → cause → climax → outcome → meaning |
| **F How-to** | "How do I make X / do Y?" | the steps and their parameters | question → overview → step by step → common mistakes → mnemonic |
| **G News / data** | a number, a policy, an event with a cause | the sources and their dates | one number → causes → what it means for you → what next |

## A. Phenomenon: why does…?

The subject is a mechanism the viewer has seen but never explained. The film's job is to
make one causal thread stick.

1. **Hook (5–8 s).** Pose the question over a concrete image. It is fair to open on the
   answer most people would give and then show where it stops being enough.
2. **Intuition.** One everyday analogy, before any mechanism. "It's like…" buys the viewer
   a place to put the real explanation.
3. **Mechanism.** The actual cause. One thread; cut every side branch, however interesting.
4. **Consequence.** Use the same principle on a second, related phenomenon ("so that is why
   sunsets are red"). This is the proof that the mechanism is real and not a story.
5. **Callback.** Return to the opening image and close in one line.

Every abstract quantity has to land on a picture: light becomes a wave, a force becomes an
arrow, molecules become dots. A number needs a reference the viewer already has — "a
thousand times thinner than a hair" carries further than "0.1 micrometres".

60–120 s. One idea per shot.

## B. Problem: one worked solution

The viewer arrives with a problem, not a question. The film is only worth making if the
solution is correct, so correctness is settled before the storyboard exists.

**Step 0 — get the problem right (cannot be skipped).**

1. If the input is a screenshot, transcribe every number, unit and figure label and show
   the transcription to the person for confirmation. One misread digit wastes the film.
2. Solve it completely, and write the solution into the brief.
3. **Verify independently** — Python for arithmetic, `sympy` for algebra, coordinates for
   geometry, every option for multiple choice. If verification and the written solution
   disagree, find out why before drawing anything.
4. Where several methods work, teach the one most natural at the problem's level; the
   others get one sentence at most, at the end.

**Structure.** Read the problem aloud while highlighting the conditions → list given and
unknown → **why this approach** (which condition pointed at which theorem; this is the
step that teaches, and it is not equations) → one line per step with its justification →
answer, double-underlined, checked on the spot → the general method for this problem type
plus one common trap.

Redraw the figure precisely in code — angles and proportions correct, not "roughly". Keep
one quantity in one colour for the whole derivation. The narration talks the equation
through ("divide both sides by two"), it does not read it symbol by symbol.

1–3 min, set by the problem.

## C. Word: one word

Explanations are in the viewer's language, not in the word's language: a Chinese viewer
gets Chinese definitions and Chinese explanation; an English viewer gets plain-English
definitions of the kind a learner's dictionary uses, not translations.

1. **Word and pronunciation.** The word large, its transcription beside it. When the film
   is not in the word's language, the word is foreign text on screen: set it as text, never
   as baked pixels, and say it in the narration at the pace a speaker would, since no voice
   in the film is native to it.
2. **Breakdown.** Syllables, or roots and affixes, with each part's meaning. A reliable
   etymology in one sentence if there is one; **an uncertain etymology is left out**, not
   guessed.
3. **Core meaning.** One sentence in the viewer's language, plus one small image that makes
   it stick.
4. **Examples.** One or two everyday sentences with the word highlighted in each, each
   spoken then explained once.
5. **Distinctions** (optional). Two or three collocations, or the split between near
   synonyms.
6. **Wrap.** Word and meaning together once more.

30–60 s.

## D. Concept: what is…?

The default. One-sentence definition → one concrete example → break the parts or the
process out → the misconception people actually hold → one-sentence summary.

Choose the picture from the shape of the concept, not from habit: a process becomes an
arrow-and-box flow, a comparison becomes two columns, anything that changes over time
becomes axes with a curve. `explainer-grammars.md` picks the grammar for each beat.

## E. Allusion and historical story

The commonest failure here is not weak animation; it is a story that is not true. The
source text and the later embellishment are separated before anything is drawn.

**Step 0 — get the facts straight (cannot be skipped).**

1. Find the **original source text** — the chapter, not a summary of it. Put the cast,
   the place, the period and the passages you will quote into the brief. The projects in
   this workspace record this as §0 "原文与理解" at the head of the storyboard; keep that
   habit.
2. Separate **what the source says** from **what later operas, novels or folk versions
   added**. Where the film uses an addition, the film says so.
3. Where a date, an office or a relationship between two people is uncertain, verify it or
   leave it out. **Never invent one.** A wrong year is the one error an audience of this
   genre will always catch.
4. Write the layer under the plot as well: the surface events, the mechanism the story is
   really about, and the meaning the idiom carries today. State this as three lines —
   表层 / 里层 / 寓意 — and let the ending land on the third.

**Structure.**

1. **Hook.** Name the allusion, then pose it as a conflict the viewer cannot resolve
   ("why would the chancellor himself ride out after a minor official?").
2. **Background.** The period as a point on a timeline, the situation in one minimal
   picture, the cast arriving.
3. **Cause → development → climax.** Chronological. The climax is usually one decision or
   one exchange; the strongest line of the original is set large there.
4. **Outcome.** What followed, extending the timeline forward.
5. **Meaning.** What the story is used to mean now; related sayings if they carry it.
6. **Callback.** Return to the opening conflict, close in one line.

**Casting and colour.** Represent people as characters (`types/character.md`), each with
its own accent colour, and let that character's name, its lines and the arrows that point
at it carry the same colour. Past three people, colour by **faction** rather than by
person: one colour per camp, and one reserved for the meaning the ending lands on. Within a
camp, separate people by silhouette (headwear, hair, beard) and a name above the head. With
no clear camps, colour the protagonist and the antagonist and draw everyone else in the
film's ink.

Dialogue belongs in speech and counter-speech, one speaker to a side, keywords only, the
character speaking the span. Relay the classical lines conversationally in the narration —
do not read long passages of classical Chinese aloud. A four-character phrase from the
original can be set on screen verbatim and is usually the strongest title in the film.
Many events: one continuous timeline rather than a series of cards.

60–120 s in this workspace's practice (measured: 59–112 s across the nine allusion films
here); BB's own guide allows 1.5–3 min for allusion, so treat 3 min as the ceiling, not the
target.

## F. How-to: how to do something

Reading a recipe out loud is worthless. The value is in **the one or two points people get
wrong** and **why the order cannot change**.

**Step 0 — get the steps right.** The full sequence and each step's parameters (time,
temperature, heat, quantity, force) into the brief. Name the easy-to-get-wrong points and
the reason the order is fixed. Anything with a knife, flame, hot oil or mains electricity
gets its own warning.

1. **The question people actually have** ("tomatoes or egg first?"), conclusion first.
2. **Overview.** Every step as box-and-arrow, 3–5 steps, numbered ①②③, two to four
   characters each, so the whole shape is visible before the detail.
3. **Step by step.** One chapter per step, each making two things clear: **what to do**
   (the action and the visible state change) and **why** ("scramble the egg first so it
   stays tender"). An action without its reason does not stick.
4. **Common mistakes.** Wrong and right side by side, ✗ on the wrong one, ✓ on the right.
5. **Mnemonic.** All the steps compressed into one line, held on the last beat.

Where a duration matters, put a timer on screen rather than saying the number; where a
degree matters (heat, force, difficulty), show a level, not a word. Keep the ①②③ numbering
identical between the overview and the step chapters, in the same colours.

60–120 s.

## G. News and data: the story behind a number

**Step 0 — verify the facts (cannot be skipped).**

1. Every number, date and clause carries a **source, a publication date and what it
   measures**. Put all of it in the brief.
2. A number without a reliable source is not used. Data shown only to demonstrate a shape
   is labelled on screen as illustrative.
3. Separate **fact** from **interpretation** in the narration itself: what is published
   data, what is analysis, what is speculation ("generally believed", "possibly because").
4. Time-sensitive content states on screen the date the data is current to.

**Structure.** Open on one number or one change — a large figure or a single comparison,
not a dashboard → two to four causes, numbered side by side, each one picture and one
sentence → what it means for the viewer, brought down to their own life (this is the beat
that makes a data film watchable) → what happens next, as a judgment with its uncertainty
stated, not a prediction → one-sentence summary.

Charts stay honest: bars from a zero baseline, no truncation, units and period stated.
Restrained tone — no "shocking", no "skyrocketing". `types/data.md` owns the charts.

60–120 s.

## Before the storyboard, whichever mode

- **Language.** The film is in the language the person wrote in, unless they say otherwise.
  A Chinese request about an English word is a Chinese film with English parts.
- **Chapters.** The numbered beats above are the chapters: 3–6 of them, two to six
  characters or one to three words each, so the viewer can see where they are. Under 30 s,
  chapters can be dropped.
- **Narration length.** Measured across eight films in this workspace: **3.97–4.46 Chinese
  characters per second** (BB's guide says 4–5), so 60 s is roughly 240–270 characters. One
  idea per line, 8–30 characters. Write it as speech — "you", "we", a rhetorical question —
  not as prose.
- **Sound.** The mode narrows the world the track comes from, not a track: E wants a world
  that can hold a long silence (lyrical strings, 国风), G wants restraint, C and F can carry
  lightness. The table of worlds is in `sound.md` §3.
