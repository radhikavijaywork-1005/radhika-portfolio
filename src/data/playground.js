// Playground — small, quickly-built experiments. The "ship only once there
// are at least 3 real entries" threshold (per explicit instruction) is now
// met: Airmarc, Aves, and Sahay.
export const playground = [
  {
    slug: "arimarc",
    title: "Airmarc",
    tag: "Gesture Sketch",
    date: "2026",
    href: "https://airmarc.vercel.app",
    accent: "#4da3ff", // matches the live tool's own color-picker swatch, not invented
    icon: "✍️",
    hoverLine:
      "Sketch with just your hand, mid-conversation, and walk away with an actual image you can send.",
    context:
      "A webcam hand-gesture drawing tool: point to draw, pinch to place, a fist to pause. A full toolset with undo/redo, plus a separate Reactions layer for thumbs up/down, peace signs, and two-hand hearts. No mouse, no touchscreen, just your hand in front of the camera.",
    problem: {
      eyebrow: "The problem",
      hook: "Say something on a call and the other person still has to imagine it.",
      body: [
        "Sketch it and they just see it. But sketching means stopping the conversation to open a separate app, and once you've drawn something, you still need to turn it into a file you can actually send.",
        "The air-draw demos I looked at don't do either. Point your finger, draw a line, look away, and it's gone. Nothing captured, nothing to share.",
      ],
      flow: "Stays open in a tab  →  drawing in seconds  →  exports a PNG you can send",
    },
    gestures: [
      { icon: "☝️", label: "Point", does: "Draw" },
      { icon: "✋", label: "Palm", does: "Erase" },
      { icon: "🤏", label: "Pinch", does: "Grab · move" },
      { icon: "✊", label: "Fist", does: "Pause" },
      { icon: "👍", label: "Thumbs up", does: "Reaction" },
      { icon: "👎", label: "Thumbs down", does: "Reaction" },
      { icon: "✌️", label: "Peace", does: "Particle burst" },
      { icon: "🫶", label: "Two hands", does: "Heart" },
    ],
    whatIBuilt: {
      eyebrow: "What I built",
      hook: "A full sketch toolset, controlled entirely by your hand.",
      body: [
        "Pencil, brush, pen, shapes, a color picker, stamps, undo/redo, and PNG export, all driven by MediaPipe hand-tracking reading 21 points per hand, live off the webcam.",
        "On top of that sits a second layer modeled on Apple's Reactions: a thumbs up, thumbs down, or peace sign pops a particle effect; matching it with both hands escalates into fireworks, rain, or confetti; touching fingertips from both hands makes a heart. Reactions never touch the canvas. They're pure feedback, kept separate from the stamp tool, which is the only thing that actually marks the page.",
      ],
    },
    toolset: ["Pencil", "Brush", "Pen", "Shapes", "Color picker", "Stamps", "Undo/redo", "PNG export"],
    iterations: [
      {
        title: "Erase felt laggy",
        body: "Turned out the eraser was placing one dot per frame, leaving gaps during a fast sweep. Fixed by connecting each frame's point to the last with a continuous stroke instead of a single dab.",
      },
      {
        title: "Drawing felt too jittery",
        body: "Raw hand-tracking noise was going straight onto the canvas. Added light smoothing to the draw point without touching how responsive the cursor itself felt.",
      },
      {
        title: "Reactions read as inconsistent",
        body: "They started as a burst in every direction. Rebuilt thumbs up and thumbs down to rise or fall the same way balloons and rain do, so every effect shares one clear flow.",
      },
      {
        title: "A hover guide silently did nothing",
        body: "Looked like a limitation of testing gesture UI at all. Turned out to be a real pointer-events bug.",
      },
      {
        title: "The name changed twice",
        body: "Gesture Sketch, then Airmark, then Airmarc. The last change made purely so a clean, unclaimed subdomain was actually available.",
      },
    ],
    whatILearned: {
      eyebrow: "What I learned",
      hook: "The bigger lesson was about direction.",
      body: [
        "I did not know hand tracking worked this way going in. MediaPipe just hands you 21 raw points per hand, every frame. Deciding that this is a fist or a peace sign is something you have to build yourself, and a single frame is never trustworthy on its own.",
        "Reactions like balloons and hearts kept popping while I was just drawing, not making any gesture at all. My first instinct was to say \"make it less sensitive.\" Instead I described exactly what was happening, drawing versus an actual gesture, and that precision surfaced the real bug: the reaction logic was reading the raw, per frame gesture instead of the same steady, confirmed value the drawing tools already used. A vague ask gets a vague patch. A precise one gets the real fix. That is the skill this project proved for me, not that I can describe what I want, but that I can direct something well enough to build with it, catch it when it is wrong, and end up with something that is still mine.",
      ],
    },
    builtWith: ["React", "Vite", "MediaPipe HandLandmarker", "Framer Motion", "HTML5 Canvas"],
  },
  {
    slug: "aves",
    title: "Aves",
    tag: "Field Guide",
    date: "2026",
    href: "https://birdssong.vercel.app",
    accent: "#5c7a5e", // forest tone, matches the site's own nature/calm palette
    icon: "🕊️",
    hoverLine: "A calm field guide: a name, a photo, a voice. Nothing to complete, nothing to score.",
    context:
      "A digital field guide for exploring birds by sight and sound: click a species, see a real photo, hear its actual call, sourced from Wikimedia Commons and Xeno-canto's community-recorded audio.",
    problem: {
      eyebrow: "The problem",
      hook: "Every app built around loving birds turns it into a task.",
      body: [
        "I built this during a stretch when career and growth anxiety had gotten loud. Birds, specifically their sound, have always calmed me, and this became both that calm and my way into vibe-coding with Claude.",
        "An ID quiz, a checklist, a streak. I wanted the opposite, something closer to sound therapy. So I kept it plain: a name, a photo, a voice.",
      ],
      flow: "A name  →  a photo  →  a voice. Nothing to complete, nothing to score",
    },
    whatIBuilt: {
      eyebrow: "What I built",
      hook: "A static field guide: 51 species, each with a name, a real photo, and its actual voice.",
      body: [
        "Two build-time scripts do the real work before anything ships: one pulls a clean recording per bird from Xeno-canto and runs it through ffmpeg to trim silence, cap it at 30 seconds, and compress it to a small mono mp3; the other resolves a portrait from Wikimedia and statically generates every species page.",
        "Nothing calls an external API at runtime. It just serves pre-resolved files, so it loads fast and stays out of its own way.",
      ],
      // 6 real photos from the live site's own birds.json (Wikimedia
      // Commons, same source the app itself credits), arranged as an
      // asymmetric collage rather than a flat grid — puts "51 species,
      // each with a name, a real photo" in front of you instead of just
      // describing it.
      // focalY: where each bird's head/neck actually sits in its source
      // photo (checked directly, not guessed) — a plain center-crop was
      // cutting through necks on the shorter/wider tiles.
      collage: [
        { name: "Indian Peafowl", sciName: "Pavo cristatus", key: "indian-peafowl", size: "lg", focalY: 22 },
        { name: "White-throated Kingfisher", sciName: "Halcyon smyrnensis", key: "white-throated-kingfisher", size: "sm", focalY: 35 },
        { name: "Indian Roller", sciName: "Coracias benghalensis", key: "indian-roller", size: "md", focalY: 12 },
        { name: "Eurasian Hoopoe", sciName: "Upupa epops", key: "eurasian-hoopoe", size: "sm", focalY: 45 },
        { name: "Brahminy Kite", sciName: "Haliastur indus", key: "brahminy-kite", size: "md", focalY: 10 },
        { name: "Asian Koel", sciName: "Eudynamys scolopaceus", key: "asian-koel", size: "sm", focalY: 15 },
      ],
    },
    iterations: [
      {
        title: "Layout flipped for hierarchy",
        body: "Photo and text swapped sides once, for better hierarchy.",
      },
      {
        title: "Cropping went through two passes",
        body: "First tried fitting every photo inside its frame. Fixed the crop but made the whole grid feel boxed-in and lifeless, so I reverted that and instead fixed just the handful of genuinely bad crops one by one, keeping every photo full-bleed elsewhere.",
      },
      {
        title: "Homepage cards got stripped down",
        body: "Cut to just name, photo, and voice: no blurb, no tags, because the extra detail was noise you didn't need until you actually clicked in.",
      },
      {
        title: "Broke my own \"never autoplay\" rule",
        body: "Hovering on a card for a second now lets its voice start on its own. A bird's call inviting itself in gently turned out to feel more true to the calm I was going for than a rule about restraint.",
      },
    ],
    whatILearned: {
      eyebrow: "What I learned",
      hook: "Calm isn't the default state of the internet. You have to keep choosing it, feature by feature.",
      body: [
        "The easy version of almost every decision here (more tags, more autoplay everywhere, more data density) would've made the site \"richer\" and less peaceful. The harder, quieter version was the right one every time.",
      ],
    },
    builtWith: [], // not yet gathered
  },
  {
    slug: "sahay",
    title: "Sahay",
    tag: "Research Companion",
    date: "2026",
    // No href — deliberately: it runs locally only, not deployed or
    // published anywhere yet. entry.href gates the "Try it out" button on
    // the detail page, so leaving it unset keeps that honest rather than
    // pointing at a URL that doesn't exist. The homepage card itself
    // doesn't use href/ctaLabel at all — every card reads "Read more"
    // and goes to the write-up, never straight to a live tool.
    accent: "#de8e69", // sidebar-primary from the app's own globals.css, not invented
    icon: "🧭",
    hoverLine: "Click save, and it remembers not just what you found, but why it mattered.",
    // Only the homepage card fields live here — the full write-up outgrew
    // this generic entry shape (Ask, Search, the Projects/Collections/
    // Research Item hierarchy, the flow demo video) and now has its own
    // dedicated page: see sahayCaseStudy.js + PlaygroundSahay.jsx, routed
    // directly at /playground/sahay ahead of this file's generic
    // PlaygroundEntry.jsx route.
  },
];
