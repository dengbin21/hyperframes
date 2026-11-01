# Launch, promo and feature films

The shape is `../story.md` §6 (hook → tension → reveal → proof → payoff → claim → end card), usually 20–45 s. What a viewer shares is real people and real output: in the official films, effects-heavy pieces drew about a tenth of the views of ones built on a real result.

## Real UI, never a mockup

Everything that claims to be the product is the product. One invented button loses everyone who uses it.

1. Where it comes from, best first: the person's recording or screenshots (ask, naming the screen per beat, when the proof needs one you cannot capture); Figma frames, rebuilt as states of one app so the change between two frames is a real click (`/figma`); walking the flow yourself when no sign-in is needed; `npx hyperframes capture` of the feature's own page; the product's code, PR or docs to confirm today's labels.
2. Missing a screen: a clearly labelled placeholder ("Screenshot: Settings → Motion"), said in the reply. A feature with nothing visible (speed, an API): the real UI that exposes it, a real analogue the viewer knows, real terminal output, or a checklist of real facts. Never a made-up dashboard.
3. Logo, icons and fonts are the brand's own files (`/media-use` for logos); never redrawn from memory, never a coloured square for an app icon.

## The product on screen

- Rebuild only the piece the beat uses (the panel, the prompt box, the row that changes) and show it at 1.6–2× its real size; text stays at least 26 px at 1080p after any push. Never a small window in the middle of an empty canvas, never product UI tilted in 3D.
- The camera cycles between the window on its ground, one pane, and a punch-in on one control. Moves take 0.4–0.6 s with motion blur, arrive at the control the cursor needs, then hold while the UI acts.
- Containers morph instead of cutting: the button becomes the menu, the message becomes the bubble.
- Pull back to reveal that the result was playing inside the product, or zoom through the player until the result fills the frame.
- The cursor is big (4–7% of the frame), enters from off-screen, and its click causes the next thing on the same frame.

## Worlds and transitions

Visit several worlds (`../story.md` §7) and enter each through an object on screen, with 3–5 kinds of transition in a film (`../motion.md` "Transitions with a cause").

## Framing a demo as one continuous read

The sequence a product film has to get right is: whole, then the operation, then the whole again, then the relationship, then the detail, then the result. One measured reference (a 24 s cross-device demo) runs it as: device whole → push into the input field → text grows in the near shot → pull back as the reply arrives → the phone moves aside and a desktop window opens beside it → tasks appear, the camera staying put → a click opens a detail panel and the camera pushes until the surrounding frames drop away → scrolling carries the read without rescaling → a notification card closes the loop with the same avatar and the same request.

What transfers is the causality, not the seconds:

- **Short moves, long reads.** Each re-framing is 0.3–0.8 s; the explaining is whatever the content needs. The picture can hold while text types, a list opens or a status changes — content moving is information, and it does not need the camera to move with it. Slow everything down and the cuts drag; speed everything up and the read is gone.
- **One primary reading area per shot.** A whole shot establishes the carrier and the relationship; a near shot is for the one line that must be read; a side-by-side shot says which is primary by size and keeps the secondary only as a source the viewer can recognise.
- **Keep a few identity anchors** across the re-framings: the same request, the same avatar, the same accent on the bubble, the same task title. Everything else may be cropped away. Cropping the device shell is fine when the same focus stays findable and the key text is whole; cropping the key text is a defect.
- **Name every seam in one line**: `who holds the focus now → where it lands → what is newly visible`. A device moving aside is an object re-layout, a field growing is a framing change, a panel lifting off is an extraction into a new layer — they do not all have to be one 3D camera, and implementing them as one usually breaks the type.
- **Separate four layers**: the interface content and its scroll, the device or window shell, the framing wrapper, and the fixed captions. Rebuild simple rectilinear UI in DOM and move the wrapper, so a field growing its line count never rescales the device.
- **A freeze that shows a still is not a stall**, but a wait before a result must not be cut into "click and it is done": keep a processing state, or a visible passage of time. **Interstitials are punctuation, not cover**: a white beat can end the sequence deliberately; it must never hide a load that failed.
- **Every pose comes from one clock.** Set the wrapper's start state explicitly and give later `fromTo`s `immediateRender: false`, or a future near shot appears on frame 0. Seeking backwards must restore the same content, crop and framing.

Check it three ways: three representative frames (can the whole be recognised, does the side-by-side have a hierarchy, is the detail big enough to read); the frames either side of each seam (does the old focus hand over to the new one, or does position, scale and content all change at once so the viewer has to hunt); and the render at 1× (are the read windows long enough, is there progress during the still stretches, does the camera ever move before the user's action).

## The end card

The mark lands in the last 5–10% of the film, centred, the lockup 15–30% of the frame width, performed rather than faded in: the cursor clicks the mark and a fill rises through it, or a character carries it in, then the wordmark wipes in beside it. Then the call to action (a real button, the command to type), held 1.5–3 s.

## Tells for this type

Typing into a prompt box as the opener; a feature list as three cards; a title over a dimmed screenshot; an invented dashboard; the logo docked in a corner.
