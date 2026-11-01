# Characters, mascots and story shorts

A character gives every transition a cause and gives the film its jokes: it carries the result into the player, rejects its own first try, reads the manual. After Effects characters come in through Lottie (`../runtimes.md`).

**A poor character is worse than none.** A round head with two dots and a rounded rectangle for a body is read as "AI made this" in the first second, and nothing after it recovers. Settle the route before drawing anything:

| Route | When | How |
| --- | --- | --- |
| **Frame library** | the run can generate images, or the person gave character art | build a small set of posed frames, then pass the delivery line below |
| **Hands and back only** | no image generation, but the story needs a person | a hand holding, pointing, putting something away; a back, a silhouette, over the shoulder. Never the face |
| **None** | the story can be carried by objects | the object is the hero — a battery, a loaf, a book — and speaks through shape, colour and action |

Retired, because code produces them badly and `check` and review will both stop them:

- the generic chibi: round head, dot eyes, blush, no neck, body as a rounded rectangle;
- the white-shell robot: white dome, blue visor, one antenna, hovering or jetting;
- anything with a face it should not have: a smiling coin, a frowning lithium ion, an eyeball on a ball;
- stick figures or Haring men *acted with* (a Haring mark used as a diagram symbol on a whiteboard is not a story).

One exception: when the whole film's hero **is** an anthropomorphic object — a walking paintbrush, a desk lamp — designed through the three directions and chosen by the person, it may have a face and expressions. The difference is design: an identity, a body structure, a performance. What stays retired is the expression someone adds to a coin as an afterthought.

## Delivery line for a drawn character

Before a frame library goes on screen, take one 2× close-up and check every line; what fails goes back to the drawing step, or the route changes to hands and back.

1. **The silhouette reads** — fill it solid black: can you still tell who it is and what it is doing? A circle plus a rounded rectangle cannot pass this.
2. **It has a skeleton** — neck, shoulders, elbows, wrists; a head-to-body ratio that stays fixed across the film.
3. **The hands are hands** — fingers or a glove shape, and they actually hold the prop (the object is in the hand, not beside it).
4. **Two values minimum** — base plus shadow, and a highlight or rim light whose direction matches the scene.
5. **Three material details** that this character should have: a fold, a seam, hair grouped into strands, a fabric weave, a lace, a strap.
6. **The performance is specific** — one expression plus one pose that answers this shot (frowning at a phone, then pocketing it in relief), not just a blink or a bob.
7. **The same drawing as the world** — same line, same flatting, same palette as the background; not a sticker on someone else's painting.
8. **Continuous** — face, hair, clothes and colours match in every shot.

## An object without a face

Giving a concept a face is the lazy way to make it act. These do the same job:

- **Shape and action**: the ion crowds together and moves slowly when cold, spreads and runs when warm; the battery bar loses a segment in the wind.
- **Scale**: something the size of a palm slams to filling the frame.
- **Contrast**: the same object twice, one frozen and one working.
- **Real material**: a real cross-section, real frost, a real screenshot.

## Acting

- Mood changes go through a take: anticipation, a squash, the new face, a settle. A face never snaps from one state to the next.
- Squash and stretch, anticipation, overshoot and follow-through belong to the character. Here an idle breath or blink is life, not a tell; the tells about breathing and bounce in `../motion.md` are about titles and UI.
- Code moves every part at once, on one curve, by the same amount. Offset the parts (head leads, arms follow), vary the amounts, and never move both arms, both eyes or a crowd in unison.
- Contact sells it: feet on the ground, props held by the hand, eyes on what they look at.

## Reads

Each action is one read. Lead the eye to where it will happen, play the action fast, and let its meaning land slowly: hold the reaction. A sign or caption that repeats what the action already shows is the classic failure.

## Build

- A rig is a set of parameters over time: position, squash, arm angles, an eye state and a mouth state per moment. Write mood changes as keyed states (`[[t0,"normal"],[t1,"scared"]]`) the rig eases between.
- Hand-drawn life: redraw the outlines about 12 times a second with a jitter seeded by `Math.floor(t * 12)`, so the line boils while the character holds still, and every render matches.
- A long piece is one chapter per sub-composition, all drawing from the same rig and helpers.
