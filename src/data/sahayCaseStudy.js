// The Sahay case study's full write-up. Lives separately from
// playground.js because this entry outgrew the shared PlaygroundEntry
// template (Ask, Search, the Projects/Collections/Research Item
// hierarchy, the flow demo video — none of that applies to Airmarc or
// Aves), so it has its own dedicated page (PlaygroundSahay.jsx) instead.
// playground.js still carries the lightweight card-only fields (hoverLine,
// etc.) that the homepage grid needs.
export const sahayCaseStudy = {
  slug: "sahay",
  title: "Sahay",
  tag: "Research Companion",
  date: "2026",
  accent: "#de8e69", // sidebar-primary from the app's own globals.css, not invented
  icon: "🧭",
  // Used on the homepage Playground card (hover description) — the card
  // component reads this directly, so it's required even though nothing
  // on this detail page itself renders it.
  hoverLine: "Click save, and it remembers not just what you found, but why it mattered.",
  context: "Your research companion: a Chrome extension and dashboard for saving your research, building context around it, and answering questions from it.",

  problem: {
    eyebrow: "Why I built it",
    hook: "When I research something big, I save a lot. I forget why I saved most of it.",
    body: [
      "A trip, a new job, a big purchase, moving to a new city: anything that takes more than a couple of days to figure out eventually turns into the same mess.",
      "A few days later, I might remember the restaurant, hotel, company or product I saved, but not where I found it, why it caught my attention, what I liked about it, whether I'd already checked it, what else I found about it, or whether I'd changed my mind since.",
      "The more I research, the harder it becomes to keep the whole picture in my head.",
    ],
    // What "a dozen tabs, a few screenshots..." actually spans — shown as
    // chips, matching how the live page already visualizes fragmentation.
    sources: ["Browser tabs", "Screenshots", "Reels", "Reddit threads", "Google Maps lists", "ChatGPT chats", "Notes to self"],
    // A standalone two-line beat, not folded into a paragraph — the
    // sharpest line in the whole write-up.
    // One italic beat, not a stacked two-line quote plus a separate boxed
    // flow line below it — built directly around what that flow line
    // said, not a vaguer stand-in for it.
    pullquote: ["The information is there. The context isn't. I wanted something that stays with the research as it evolves, not just another place to collect links."],
  },

  whatIBuilt: {
    eyebrow: "What I built",
    // No leading "Sahay" — PlaygroundSahay.jsx prepends it as its own
    // lighter-weight span, so this starts mid-sentence ("Sahay is a...").
    hook: "is a Chrome extension and dashboard that saves my research as I browse and keeps the context around it.",
    body: [
      "I browse normally. When something is worth keeping, I save it. Sahay takes care of the rest.",
    ],
    // Pointers, not paragraphs — but each one is still a full thought,
    // not a fragment. Short enough to scan, complete enough to actually
    // explain what's happening and why, not just list keywords.
    steps: [
      {
        title: "Save",
        icon: "🔖",
        points: [
          "Three ways in: the floating button, the toolbar, or right-click, all open the same quick save flow",
          "The page's URL, title, source, and image are filled in automatically, so there's little left for me to do",
          "One click, under five seconds",
        ],
      },
      {
        title: "Understand",
        icon: "🧩",
        points: [
          "Sahay reads the page in the background and pulls out a summary, category, tags, key facts, entities, preferences, constraints, and open questions",
          "I don't sort or tag anything myself, and everything it finds stays editable",
          "This never blocks the save: the save completes instantly, the reading happens after",
        ],
      },
      {
        title: "Remember",
        icon: "🧠",
        points: [
          "Each saved item keeps its context inside the research project, not just the link",
          "So instead of asking why I saved something, I come back to what I found, what mattered, what I already knew, and what I was still figuring out",
        ],
      },
    ],
    // A visual close to the section, not another explanation — the
    // Understand step above already says what gets extracted in words,
    // this just gives that list a shape before the page moves on.
    extractedFields: [
      "Summary", "Category", "Tags", "Key facts", "Entities",
      "Preferences", "Constraints", "Open questions",
    ],
  },

  // New section — the 5-step journey, distinct from the Save/Understand/
  // Remember mechanics above: this is what using it actually feels like
  // day to day.
  journey: {
    eyebrow: "How it works",
    hook: "I don't have to change where or how I research.",
    steps: [
      { title: "Browse normally", icon: "🌐", body: "Google, YouTube, Reddit, Google Maps, blogs, ChatGPT, anywhere else." },
      { title: "Save when something matters", icon: "🔖", body: "One click captures the source and the context around it." },
      { title: "Sahay adds structure", icon: "🧩", body: "AI extracts the useful information in the background." },
      { title: "Research accumulates", icon: "🗂️", body: "Saved items live inside Projects → Collections → Research Items." },
      { title: "Search or ask when I need it", icon: "🔍", body: "A keyword search or a full question brings back what I actually saved." },
      { title: "Come back with context", icon: "🧭", body: "Instead of reconstructing what I was thinking, I pick up where I left off." },
    ],
  },

  // New section — "the complexity lives underneath," visualized as a flat
  // card grid (see PlaygroundSahay.jsx) rather than a second hub-and-spoke
  // diagram: this list overlaps in substance with the extracted-fields
  // diagram above, and a grid actually fits "I kept it simple" better
  // than another busy radial shape would.
  productUnderneath: {
    eyebrow: "The product underneath",
    hook: "I deliberately kept the visible product simple. The complexity lives underneath.",
    body: [
      "A saved item isn't just a URL. Most of that doesn't need to become another screen. The user shouldn't have to manage the intelligence, they should simply benefit from it.",
    ],
    nodes: [
      "What it's about", "What facts it contains", "What constraints it suggests",
      "What preferences it reveals", "What questions it might answer", "How it relates to other research",
    ],
  },

  // New section — the information architecture, as a 3-step hierarchy
  // flow rather than a definitions list.
  hierarchy: {
    eyebrow: "Projects, Collections & Research Items",
    hook: "I kept the information architecture deliberately familiar.",
    steps: [
      { title: "Project", icon: "🗂️", body: "Something I'm actively trying to figure out. Japan Trip, New Job, Buying a Laptop, Moving to Gurgaon." },
      { title: "Collection", icon: "📁", body: "A lightweight way to group related research inside a project." },
      { title: "Research Item", icon: "📄", body: "Each saved page, with its source, content, context and AI-generated understanding." },
    ],
    closing: "I didn't want to introduce a complicated knowledge-management system just to solve a context problem.",
  },

  search: {
    eyebrow: "Search",
    hook: "Find the thing I remember, even when I don't remember where I found it.",
    body: [
      "Search is intentionally more than finding a URL. The richer context Sahay captures (summaries, categories, tags, extracted information) gives search more to work with than the original page title alone.",
    ],
  },

  // New section, sitting right after Search: search finds what I already
  // half-remember, ask is for when I don't remember the specifics at all
  // and want an actual answer, not a list of results to sift through.
  ask: {
    eyebrow: "Ask",
    hook: "Search finds what I remember. Ask is for when I don't remember the specifics either.",
    body: [
      "I can ask a full question instead of a keyword, and Sahay answers from what I've actually saved first, citing which item it's using. If my research genuinely can't answer it, it says so, and fills the gap with general knowledge, kept clearly separate from what I saved rather than blended in as if I'd found it myself.",
      "Answers come back as short, scannable points, not a paragraph I have to read top to bottom for the one line I actually needed.",
    ],
    // Illustrative, not a screenshot — shows the shape of an answer: cited
    // from saved research first, general knowledge clearly separated out.
    example: {
      question: "What's near the hotel I picked for Udaipur?",
      bullets: [
        { lead: "Bagore Ki Haveli", body: "evening cultural show, came up in two different saves" },
        { lead: "Ambrai Ghat", body: "sunset spot, noted as quieter than the more touristy option nearby" },
      ],
      generalKnowledge: { lead: "Jagdish Temple", body: "a five-minute walk, not something I'd actually saved" },
    },
  },

  branding: {
    eyebrow: "Branding",
    hook: "I named it after what I want the product to feel like.",
    body: [
      "Sahay (सहाय) comes from Hindi/Sanskrit and means help, support or assistance: the root of \"sahayak,\" someone who assists. Sahay isn't meant to make decisions for me. It's there while I'm figuring something out.",
      "Rather than the usual visual language of AI (robots, brains, chat bubbles, neural networks), I wanted something more fluid. The mark is a flowing S, suggesting movement and transition: information coming in, being understood, becoming something more useful. A small point of light sits within the form rather than acting as a literal research icon.",
    ],
    brandMark: {
      wordmark: "wordmark",
      before: { key: "iconLight", label: "Before", caption: "Soft mark on white: reads as delicate in isolation, but disappears in a row of bold, saturated app icons." },
      after: { key: "iconDark", label: "After", caption: "Same shape, same colors, moved onto a dark tile filled edge to edge: holds its own at 16px in a browser toolbar." },
    },
    gradient: [
      { label: "Curiosity", hex: "#FEBAB4" },
      { label: "Understanding", hex: "#F0D3A3" },
      { label: "Insight", hex: "#CEB0E5" },
    ],
  },

  iterations: [
    {
      title: "A race condition that only appeared under real load",
      body: "Multiple dev processes could pick up the same background job twice, even though the save itself looked fine. I fixed it at the database level: a claim only succeeds if the job is still unclaimed.",
    },
    {
      title: "Cover images that looked broken",
      body: "Wikipedia thumbnails often came back awkwardly cropped, and padding them made it worse. I fixed the source instead: landscape-oriented Unsplash images as the primary fallback.",
    },
    {
      title: "A technically correct experience that wasn't useful enough",
      body: "\"What's near this hotel?\" The answer existed in what I'd saved, but the system wasn't passing that context through. I fixed the plumbing, not the prompt.",
    },
    {
      title: "A floating button that disappeared",
      body: "Worked on some sites, vanished on others: three separate bugs stacked together (intercepted clicks, a broken asset path, an animation stuck off-screen). A feature isn't finished until it survives the environment it lives in.",
    },
    {
      title: "An icon that disappeared among other app icons",
      body: "Looked good alone, but disappeared next to bold, single-color browser icons. The fix was contrast, not size: a near-black tile with the mark filling more of it.",
    },
  ],

  // Restructured as two labeled cards instead of flowing paragraphs — each
  // is a distinct, complete idea, not a continuation of the other.
  whatILearned: {
    eyebrow: "What I learned",
    hook: "The hardest part wasn't building the AI. It was deciding what the AI should and shouldn't do.",
    insights: [
      {
        label: "AI is the layer underneath, not the experience",
        body: "The first instinct with an AI product is to keep adding intelligence. The more I built, the more obvious the opposite became. If Sahay can understand a page, organise its useful context, and make it easier to find later, I shouldn't have to interact with an AI interface just to benefit from it.",
      },
      {
        label: "Context is more valuable than collection",
        body: "The original idea was easy to describe: save your research in one place. But that isn't really the problem. I already have plenty of places to save things. The frustrating part is what happens after: why did I save this, what did I learn from it, did I change my mind, what am I still missing. The unit of value isn't the saved link. It's the context that survives around it.",
      },
    ],
  },

  // Restructured as a 4-stage progression rather than a flat feature list
  // — each stage builds on the one before it.
  whatsNext: {
    eyebrow: "What's next",
    hook: "I've solved the first layer: remembering context. But research keeps evolving, and that's what I want Sahay to keep up with next.",
    stages: [
      {
        title: "Remember",
        icon: "💾",
        body: "Today, Sahay remembers the context around what I save. Over time, that context should accumulate across the research I'm doing.",
      },
      {
        title: "Understand",
        icon: "🧠",
        body: "As more information comes in, Sahay should get better at understanding what I've already learned, what I'm still unsure about, which information supports or challenges what I know, what changed my thinking, and which questions are still unanswered.",
      },
      {
        title: "Learn my patterns",
        icon: "🪞",
        body: "As Sahay sees more of my research, it can start recognising patterns in the choices I make. Not preferences I configure manually: patterns that emerge from the research I naturally do.",
        quote: "You tend to choose quieter areas, even when they're slightly further from the centre.",
      },
      {
        title: "Empower the next step",
        icon: "🚀",
        body: "Not by replacing my judgement. Not by giving generic recommendations. By bringing my own accumulated context into what I'm researching now.",
        quote: "This option matches what you've consistently prioritised, but it conflicts with a constraint you rejected earlier.",
      },
    ],
    closing: "Sahay starts by remembering what I found. Then it learns what that research means to me. And eventually, it can help me research with more clarity, context and confidence.",
    // Where the project actually stands today, separate from the product
    // vision above it: it's a local-only build right now, and getting it
    // live is its own work in progress, not a "someday" item.
    status: "Right now, Sahay is a local-only Chrome extension. It's submitted to the Chrome Web Store with all permissions requested, and I'm waiting on their review before it can actually go live.",
  },

  builtWith: [
    "React", "TypeScript", "Vite", "Express", "Prisma", "PostgreSQL (Supabase)",
    "Chrome Extension (Manifest V3)", "Groq (Llama)", "Tailwind CSS", "shadcn/ui",
  ],
};
