// Draft rewrite of the Sahay case study — refined tone/flow per Radhika's
// own rewritten write-up (2026-08-12). Lives separately from playground.js
// so the already-hosted /playground/sahay page is untouched while this is
// reviewed at /preview/sahay. Once approved, this replaces the sahay entry
// in playground.js and this file goes away.
export const sahayDraft = {
  slug: "sahay",
  title: "Sahay",
  tag: "Research Companion",
  date: "2026",
  accent: "#de8e69", // sidebar-primary from the app's own globals.css, not invented
  icon: "🧭",
  context: "Your research companion for the things you're trying to figure out.",

  problem: {
    eyebrow: "Why I built it",
    hook: "When I research something big, I save a lot. I forget why I saved most of it.",
    body: [
      "A trip, a new job, a big purchase, moving to a new city — anything that takes more than a couple of days to figure out eventually turns into the same mess.",
      "A few days later, I might remember the restaurant, hotel, company or product I saved, but not where I found it, why it caught my attention, what I liked about it, whether I'd already checked it, what else I found about it, or whether I'd changed my mind since.",
      "The more I research, the harder it becomes to keep the whole picture in my head.",
    ],
    // What "a dozen tabs, a few screenshots..." actually spans — shown as
    // chips, matching how the live page already visualizes fragmentation.
    sources: ["Browser tabs", "Screenshots", "Reels", "Reddit threads", "Google Maps lists", "ChatGPT chats", "Notes to self"],
    // A standalone two-line beat, not folded into a paragraph — the
    // sharpest line in the whole write-up.
    pullquote: ["The information is there.", "The context isn't."],
    flow: "I wanted something that could stay with the research as it evolved — not another place to collect links, but something that remembers the context behind them.",
  },

  whatIBuilt: {
    eyebrow: "What I built",
    hook: "Sahay is a Chrome extension and web dashboard that lets me save research as I browse, while keeping the context around each thing I save.",
    body: [
      "I browse normally. When something is worth keeping, I save it. Sahay takes care of the rest.",
    ],
    steps: [
      {
        title: "Save",
        icon: "🔖",
        body: "Three ways in: the floating button, the toolbar, or right-click. All three open the same lightweight save flow. The page already provides the URL, title, source and image, so there's very little left for me to do. One click, under five seconds.",
      },
      {
        title: "Understand",
        icon: "🧩",
        body: "Sahay processes it in the background: summary, category, tags, key facts, entities, preferences, constraints, open questions. I don't create these, sort them into folders, or tag anything myself. The AI does the first pass, and it stays editable. Saving never waits for this — the save happens immediately, the processing happens after.",
      },
      {
        title: "Remember",
        icon: "🧠",
        body: "This is where it stops being a bookmark collection. Each saved item keeps its context inside the research project, so instead of asking \"why did I save this?\" I come back to something that still means something: what I found, what mattered, what I already knew, what I was still figuring out.",
      },
    ],
    extractedFields: [
      "Summary", "Category", "Tags", "Key facts", "Entities",
      "Preferences", "Constraints", "Open questions",
    ],
    principles: [
      { label: "The save never waits", body: "The save completes immediately. The AI processing happens afterwards, in the background." },
      { label: "The intelligence stays invisible", body: "The user shouldn't have to manage the intelligence. They should simply benefit from it." },
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
      { title: "Come back with context", icon: "🧭", body: "Instead of reconstructing what I was thinking, I pick up where I left off." },
    ],
  },

  // New section — "the complexity lives underneath," visualized as the
  // same hub-and-spoke diagram already used for the extraction fields.
  productUnderneath: {
    eyebrow: "The product underneath",
    hook: "I deliberately kept the visible product simple. The complexity lives underneath.",
    body: [
      "A saved item isn't just a URL. Most of that doesn't need to become another screen — the user shouldn't have to manage the intelligence, they should simply benefit from it.",
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
      "Search is intentionally more than finding a URL. The richer context Sahay captures — summaries, categories, tags, extracted information — gives search more to work with than the original page title alone.",
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
        { lead: "Bagore Ki Haveli", body: "evening cultural show — came up in two different saves" },
        { lead: "Ambrai Ghat", body: "sunset spot, noted as quieter than the more touristy option nearby" },
      ],
      generalKnowledge: { lead: "Jagdish Temple", body: "a five-minute walk — not something I'd actually saved" },
    },
  },

  branding: {
    eyebrow: "Branding",
    hook: "I named it after what I want the product to feel like.",
    body: [
      "Sahay (सहाय) comes from Hindi/Sanskrit and means help, support or assistance — the root of \"sahayak,\" someone who assists. Sahay isn't meant to make decisions for me. It's there while I'm figuring something out.",
      "Rather than the usual visual language of AI — robots, brains, chat bubbles, neural networks — I wanted something more fluid. The mark is a flowing S, suggesting movement and transition: information coming in, being understood, becoming something more useful. A small point of light sits within the form rather than acting as a literal research icon.",
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
      body: "Multiple development processes could try to process the same save at the same time. The save looked fine from the user's perspective, but the same background job could get picked up twice. The fix wasn't in the UI — I changed the job-claiming logic so the database itself guarantees only one process can claim a job.",
    },
    {
      title: "Cover images that looked broken",
      body: "Some source thumbnails, particularly Wikipedia images, came back with awkward crops. Padding them made it worse. So I went back to the source instead: landscape-oriented Unsplash images as the primary fallback, with the image treatment controlled before display. Fix the source of the visual problem, not the symptom in the component.",
    },
    {
      title: "A technically correct experience that wasn't useful enough",
      body: "\"What's near this hotel?\" — the information existed in what I'd saved, but the experience wasn't using that context properly. The issue wasn't that the AI needed a better personality or a cleverer prompt. The product wasn't passing the right context through the system. I fixed the plumbing, not the prompt.",
    },
    {
      title: "A floating button that disappeared",
      body: "Worked perfectly on some sites, vanished on others. Turned out to be three separate problems: some sites intercepting the interaction, a dev asset path breaking in production, and an animation state leaving the button positioned off-screen. A feature isn't finished when the happy path works — it has to survive the environment it lives in.",
    },
    {
      title: "An icon that disappeared among other app icons",
      body: "Looked good in isolation. Beside bold, single-colour browser icons, it became almost invisible. Bigger didn't fix it. The fix was contrast: the mark moved onto a near-black tile, occupying more of the available space. Same identity, better presence.",
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
        body: "The original idea was easy to describe: save your research in one place. But that isn't really the problem — I already have plenty of places to save things. The frustrating part is what happens after: why did I save this, what did I learn from it, did I change my mind, what am I still missing. The unit of value isn't the saved link. It's the context that survives around it.",
      },
    ],
  },

  // Restructured as a 4-stage progression rather than a flat feature list
  // — each stage builds on the one before it.
  whatsNext: {
    eyebrow: "What's next",
    hook: "The version I built solves the first layer of the problem: remembering the context behind research. But research doesn't stay static — I discover something new, rule something out, change a preference, become more confident about one thing and less certain about another. That's where I want Sahay to go.",
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
        body: "As Sahay sees more of my research, it can start recognising patterns in the choices I make. Not preferences I configure manually — patterns that emerge from the research I naturally do.",
        quote: "You tend to choose quieter areas, even when they're slightly further from the centre.",
      },
      {
        title: "Empower the next step",
        icon: "🧭",
        body: "Not by replacing my judgement. Not by giving generic recommendations. By bringing my own accumulated context into what I'm researching now.",
        quote: "This option matches what you've consistently prioritised, but it conflicts with a constraint you rejected earlier.",
      },
    ],
    closing: "Sahay starts by remembering what I found. Then it learns what that research means to me. And eventually, it can help me research with more clarity, context and confidence.",
  },

  // The closing statement — its own beat, not folded into What's Next.
  closingStatement: [
    "I started by thinking I needed a better place to save research. After building Sahay, I think the more interesting problem is what happens after we save it.",
    "Information is easy to collect. Understanding is harder to preserve.",
    "Sahay is my attempt to build the layer in between.",
  ],

  builtWith: [
    "React", "TypeScript", "Vite", "Express", "Prisma", "PostgreSQL (Supabase)",
    "Chrome Extension (Manifest V3)", "Groq (Llama)", "Tailwind CSS", "shadcn/ui",
  ],
};
