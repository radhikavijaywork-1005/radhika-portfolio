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
    // published anywhere yet. entry.href gates the "Try it out" link on
    // both the card and the detail page, so leaving it unset keeps both
    // honest rather than pointing at a URL that doesn't exist.
    ctaLabel: "Read the write-up",
    accent: "#de8e69", // sidebar-primary from the app's own globals.css, not invented
    icon: "🧭",
    hoverLine: "Click save, and it remembers not just what you found, but why it mattered.",
    context:
      "Sahay is a Chrome extension and dashboard for saving research as it happens: click save on any page, and it uses AI to work out why that page matters and how it connects to everything else you've saved for the same project.",
    problem: {
      eyebrow: "The problem",
      hook: "When I research something big, I save a lot. I forget why I saved most of it.",
      body: [
        "Any research that runs longer than a couple of days ends up scattered across a dozen tabs and apps. A week in, I'd forget where I found something, why I'd saved it, what I'd already ruled out, or how two saved pages were even related.",
        "I tried the usual fixes: bookmarks, a screenshots folder, messaging links to myself on WhatsApp. They all saved the information. None of them saved the reasoning behind it.",
      ],
      // Where the fragmentation actually happens — shown as chips, not
      // buried mid-sentence, so it reads at a glance.
      sources: ["Google", "YouTube", "Reddit", "Maps", "ChatGPT", "Notes", "Bookmarks", "Screenshots"],
      flow: "Browse normally  →  click save  →  AI fills in the context automatically  →  the dashboard keeps the reasoning, not just the link",
    },
    whatIBuilt: {
      eyebrow: "What I built",
      hook: "A Chrome extension for saving pages in one click, plus a dashboard that uses AI to keep track of what all those saves add up to.",
      body: [
        "The extension adds a floating save button, a side panel, and a right-click option to any page. Behind it is a dashboard built with Express, Prisma, and Postgres. Every save goes through the same three steps:",
      ],
      // The pipeline, as a scannable 3-step flow instead of a paragraph —
      // mirrors the mark's own curiosity → understanding → insight story.
      steps: [
        {
          title: "Save",
          icon: "🔖",
          body: "Click the floating button, right-click the page, or use the toolbar icon: all three open the same save panel, with the URL, title, source, and a thumbnail already filled in. Takes under 5 seconds and one click.",
        },
        {
          title: "Extract",
          icon: "🧩",
          body: "Saving itself is instant, it doesn't wait on AI. Once the page is stored, one AI call reads it and pulls out a summary, category, tags, and key facts, all in a single request instead of several, to keep the cost down.",
        },
        {
          title: "Remember",
          icon: "🧠",
          body: "Everything extracted gets folded into one running model of the project: topics merge together, open questions get marked answered, and each new save is linked to earlier ones as supporting, contradicting, expanding, or answering evidence.",
        },
      ],
      extractedFields: [
        "Summary", "Category", "Tags", "Entities", "Claims",
        "Key facts", "Preferences", "Constraints", "Open questions",
      ],
      // How a linked item is typed once it folds into the Research State —
      // shown as a legend, not restated in the paragraph above.
      evidenceTypes: [
        { label: "Supports", style: "solid" },
        { label: "Contradicts", style: "dashed" },
        { label: "Expands", style: "dotted" },
        { label: "Answers", style: "double" },
      ],
      principles: [
        { label: "Saving never waits on AI", body: "The save itself is instant. The AI processing happens afterward in the background, and retries automatically if it fails." },
        { label: "The raw data stays hidden", body: "You never see the internal model Sahay builds directly. It only shows up indirectly, through search, key facts, and chat." },
      ],
      closing:
        "On top of all this is a chat feature. It answers from your own saved research first, and only falls back to general AI knowledge when your research genuinely can't answer, always labeling which one it used.",
    },
    branding: {
      eyebrow: "Branding",
      hook: "I named it after what it does for you.",
      body: [
        "Sahay (सहाय) is Hindi/Sanskrit for help or support, the root of \"sahayak,\" meaning someone who assists. The logo is a flowing letter S with a small sparkle where the two curves meet, and the gradient across it moves from curiosity, to understanding, to insight.",
      ],
      // The real exported mark, not a CSS approximation of it.
      brandMark: {
        wordmark: "wordmark",
        before: { key: "iconLight", label: "Before", caption: "Soft mark on white: reads as delicate in isolation, but disappears in a row of bold, saturated app icons." },
        after: { key: "iconDark", label: "After", caption: "Same shape, same colors, moved onto a dark tile filled edge to edge: holds its own at 16px in a browser toolbar." },
      },
      // Real gradient stops from the brand spec, alongside the wordmark
      // image itself, not instead of it — the labels annotate what the
      // image alone doesn't say (which color means what).
      gradient: [
        { label: "Curiosity", hex: "#FEBAB4" },
        { label: "Understanding", hex: "#F0D3A3" },
        { label: "Insight", hex: "#CEB0E5" },
      ],
      closing:
        "The fix wasn't making the icon bigger, it was adding contrast. I kept the colors soft on purpose, so the dark background around them had to do more of the work instead.",
    },
    iterations: [
      {
        title: "A race condition that only showed up under real load",
        body: "Multiple dev-server instances raced to process the same save, because job claiming wasn't atomic. Fixed with a database update that only succeeds if the job is still in the state it expects.",
      },
      {
        title: "Cover images that looked like nothing was there",
        body: "Wikipedia thumbnails came back cropped oddly. Padding them made it worse, so I fixed the actual source instead: Unsplash as primary, filtered to landscape at fetch time, crop back to full-bleed.",
      },
      {
        title: "A chat that was technically correct but practically useless",
        body: "Asked it \"what's near this hotel,\" got a hedge, even though the save had the answer. The data was there, it just wasn't wired into the chat prompt. Fixed the plumbing, not the prompt.",
      },
      {
        title: "A floating button that quietly stopped existing",
        body: "Reported as \"it's just gone.\" Turned out to be three stacked bugs: some sites intercepting the click before it landed, a dev-mode asset path breaking in production, and an animation stuck at frame zero pinning the button off-screen. Finding all three took longer than fixing them.",
      },
      {
        title: "An icon that disappeared in a row of app icons",
        body: "Next to bold, single-color app icons, mine read as weak: a soft line drawing lost in white space. Bigger didn't help. The fix was contrast: a near-black tile with the mark filling almost the whole square.",
      },
    ],
    whatILearned: {
      eyebrow: "What I learned",
      hook: "As soon as I tested it on my own research, my founding rule broke down.",
      body: [
        "I'd built the chat to only ever answer using your saved research, since that felt like the safest default. But the first real question I asked it, \"best places near this hotel,\" showed that a strictly grounded-only answer isn't useful for anything that needs advice rather than facts. The underlying system wasn't the problem, the rule sitting on top of it was too strict. Knowing when to loosen a rule I'd set myself, once it clearly didn't match how I actually needed to use the tool, turned out to be the real design decision here.",
      ],
    },
    whatsNext: {
      eyebrow: "What's next",
      hook: "This part of the product was scoped from the start, not decided after the fact. My own spec calls Sahay a \"Thinking Workspace,\" not a bookmark manager, and lists exactly this kind of reasoning as something the architecture should support later without a schema rewrite. Here's where each of those pieces actually stands today.",
      roadmap: [
        {
          icon: "⚖️",
          label: "Evidence weight",
          status: "Built, but crude",
          today: "Every save already gets a confidence score. It's just a blunt rule: 0.8 if the save introduced a new topic or answered an open question, 0.6 if it didn't. It has no idea whether the source itself is trustworthy, just whether the save happened to add something new.",
          next: "Score confidence by the source, not only by whether the save added something. A stat from a source I trust should outweigh a stray comment I saved on a whim.",
        },
        {
          icon: "⚡",
          label: "Contradiction detection",
          status: "Designed, not wired",
          today: "The database already has a CONTRADICTS type sitting in its schema, ready to use. The code just never assigns it. Every save today only ever gets typed as introducing a topic, answering a question, adding a constraint, or generically expanding, never as agreeing or disagreeing with something I saved earlier.",
          next: "Actually compare a new save against earlier ones and assign CONTRADICTS when they disagree, instead of leaving that type defined but unused.",
        },
        {
          icon: "🕰️",
          label: "\"How my understanding changed\" view",
          status: "Data exists, no page",
          today: "Every save already writes an entry into a reasoning history: what it introduced, what it answered, and when. Up to 50 entries deep per project, sitting in the database right now.",
          next: "Turn that log into an actual page I can scroll back through, instead of rows only I can query.",
        },
        {
          icon: "🪞",
          label: "Predicting my own patterns",
          status: "Siloed per project",
          today: "Every save already gets read for implied preferences, budget-conscious, prefers window seats, whatever the page and the reason I saved it suggest. But it's stored per project, not per me. A preference from my trip planning never talks to a preference from a work research project. There's no single model of me anywhere, only one of each project.",
          next: "Not a full personality model, that's further out than I can honestly scope right now. The real next step is smaller: look across all my projects together and surface the patterns that keep repeating, the kind of source I trust, the kind of option I usually end up picking, before attempting anything bigger than that.",
        },
      ],
      body: [
        "It's already submitted to the Chrome Web Store and currently going through their permissions review, the last step before it's actually live.",
      ],
    },
    builtWith: [
      "React", "TypeScript", "Vite", "Express", "Prisma", "PostgreSQL (Supabase)",
      "Chrome Extension (Manifest V3)", "Groq (Llama)", "Tailwind CSS", "shadcn/ui",
    ],
  },
];
