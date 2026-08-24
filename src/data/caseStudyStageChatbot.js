// Senior product-design case study, restructured around this project's own
// arc: a strategic bet → a narrow first experiment → a scalability failure
// → a reusable persona framework (Design Journey) → how that framework
// actually runs as a live LLM system (LLM Journey) → safety → content
// discovery → impact → reflection.
//
// Every claim here is sourced from the real project folder: PROJECT.md,
// CHARACTER_CHATBOT_HISTORY.md (reconstructed from git log on the two
// repos that power this), the Sanwari Chatbot POC persona framework
// (Radhika's own doc, including her own documented critique of the first
// greeting), the manual/pre-prod testing guides, and the chatbot analytics
// context doc. Two real product screenshots live in
// src/assets/case-study/character-chatbot/.
//
// Writing style: plain, simple, crisp. Short sentences. No metaphor for
// its own sake — every line should read like a case study, not an essay.
//
// Accuracy rules: no invented user research, A/B methodology, team
// members, or causality. Numbers not directly evidenced are ranges, not
// points. Anything whose exact definition wasn't in the source material is
// flagged `flag: "verify"`.
export const stageChatbotCaseStudy = {
  company: "STAGE",
  title: "Turning Characters into an Engagement Layer",
  subheadPre: "STAGE's characters started talking back. Designing what they'd say — and making it work across 100+ titles and four dialects — lifted D7 watch retention by ",
  subheadStrong: "up to 286%",
  subheadPost: " for the users who talked to them.",

  meta: [
    { label: "Role", primary: "Product designer", detail: "strategy, interaction, persona framework, and safety — end to end" },
    { label: "Team", primary: "Me · 1 PM", detail: "engineering execution across app & backend" },
  ],

  atAGlance: [
    { icon: "🎭", label: "The bet", text: "A character users already knew should get more attention than a generic push notification — **if** the persona held up." },
    { icon: "🧩", label: "The system", text: "One hand-written character doesn't scale to 100+ titles. I designed a reusable **persona framework** instead." },
    { icon: "📈", label: "The result", text: "**30.9K** weekly chatters, **328K** messages/week, up to **+286%** D7 retention for users who engaged." },
  ],

  // ---------- 01 · The Problem ----------
  problemHook: "The brief was engagement. I framed a narrower question.",
  problemBody:
    "STAGE needed users to engage more and come back to the app. That was the business ask. The first instinct was to treat it as a feature: build a chatbot. I reframed the question before designing anything: **could a character from a show a user already loved get more engagement than a generic notification?**",
  problemFlow: ["Engagement", "Re-engagement", "Retention", "Content discovery"],
  problemFlowLabel: "What this had to serve",

  // ---------- 02 · The First Experiment ----------
  experimentHook: "Before scale, I needed proof the behaviour worked at all.",
  experimentBody:
    "The goal wasn't to launch a product. It was to answer one question: will a user, mid-show, actually talk to its lead character? I built the smallest version that could answer that — one title, one character, an entry point designed to stand out.",
  experimentFlow: ["User exits before finishing", "Character-led modal", "Floating entry stays available", "Chat"],
  experimentFlowLabel: "V1 entry flow — one title, one character",
  experimentScope: [
    { icon: "🎬", title: "One title", body: "Scoped to a single show so I could hand-craft the entry, motion, and character presentation and watch it closely." },
    { icon: "✨", title: "Built to stand out", body: "The motion and presentation were designed to be noticed. This was a test of attention, not a quiet utility feature." },
    { icon: "🧵", title: "Full ownership", body: "Modal, floating entry, character presentation, transitions, and chat states — designed end to end." },
  ],

  // ---------- 03 · What We Learned ----------
  learnedHook: "The first version worked — but it exposed a scalability problem.",
  learnedPull: "I had optimized the experience before optimizing the system.",
  learnedBody:
    "Users did talk to the character. That part of the bet was right. But the version that proved it was built entirely by hand — custom motion, a custom voice, every state designed one at a time. It never answered the next question: what happens when this has to work for a hundred characters I'll never personally touch?",

  // ---------- 04 · The Scalability Problem ----------
  scaleHook: "A hand-crafted character doesn't survive 100+ titles.",
  scaleStats: [
    { value: "1", label: "hand-written character", sublabel: "the only way it worked, at first" },
    { value: "100+", label: "titles waiting behind her", sublabel: "× 4 dialects" },
  ],
  scaleQuote: "“Ram Ram… aap kaise ho?” — generic, no reason to reply. Could be any character.",
  scaleQuoteNote: "From my own notes on the first version of Sanwari, the proof-of-concept character. This is the moment it became clear a hand-written persona wasn't the same thing as a designed one.",
  scaleBreakdown: [
    { n: "01", title: "Nothing to hook into", body: "A formal greeting invites a formal reply, or none. No story, no reason to lean in." },
    { n: "02", title: "No memory of you", body: "A returning user was treated like a stranger. Nothing carried over between visits." },
    { n: "03", title: "The wrong kind of loss", body: "Early nudges said “come back and watch” — it read as a notification, and got dismissed like one." },
    { n: "04", title: "A script, not a system", body: "It was written by hand, for one person. Nothing about it could become the next hundred characters." },
  ],

  // ---------- Part dividers — kept explicit so the design work and the
  // LLM/technical work don't blur into each other. Two different jobs,
  // shown as two separate parts, converging later at Impact.
  partDesign: {
    label: "Part 1",
    title: "The Design Journey",
    note: "What I designed: entry points, the persona framework as a content spec, the chat experience, and the rules a character follows. No model talk yet — this is UX and content design.",
  },
  partLLM: {
    label: "Part 2",
    title: "The LLM Journey",
    note: "The framework above is a spec I wrote, not a running system. This is how it actually runs at runtime: model choices, the prompt, safety, and the learning loop.",
  },

  // ---------- 05 · From Experience to System ----------
  systemHook: "The first version optimized for learning. The next one had to optimize for scale.",
  systemCompare: {
    from: {
      tag: "V1 — one character",
      title: "Hand-written",
      items: ["Custom persona and greeting", "Custom motion per entry", "Needed my direct input every time", "Proved the idea on one title"],
    },
    to: {
      tag: "V2 — every character",
      title: "One reusable framework",
      items: ["3 layers × 9 user segments × 2 chat states", "Same structure, any character, any dialect", "Anyone can author the next character with it", "Built to scale past 100+ titles"],
    },
  },
  systemFirstPrinciple: "Not “write a better greeting.” The real question: what does every character need — regardless of dialect or backstory — to feel like a person and not a script?",
  frameworkLayersLabel: "The persona framework — a content spec I wrote, not the model",
  frameworkLayers: ["Trigger", "Starters", "Behavior"],
  frameworkLayersNote: "Trigger earns the tap. Starters (3–4 tappable, character-spoken lines) earn the first reply. Behavior steers the rest of the conversation toward what this user needs: watch more, come back, or convert. This is content I wrote by hand. Part 2 covers how a model actually runs it.",
  segmentExample: {
    character: "Sanwari",
    segment: "trial_active — 0 watch time",
    target: "Watch time up (first watch, day-0 retention)",
    trigger: "Tumne meri kahani dekhi koni... main yahan akeli haan. Kitne din aur rahuungi?",
    triggerNote: "“You haven't seen my story yet... I'm alone here. How many more days will I stay?”",
    starters: [
      "Mujhe bech diya tha shaadi ke naam pe... mujhe pata bhi koni tha",
      "Tau kehta hai meri zaroorat khatam ho gayi ghar mein",
      "Ek din aayega jab Bhanwar ko choose karna padega — main ya Tau",
      "Bol — tu meri jagah hoti toh kya karti?",
    ],
    behavior: "She tells fragments of her story but leaves gaps only the show fills. She never says “watch the show” — she says “Meri kahani mein hai... main bas itna bata sakti haan.” The 4th starter is always a direct question, so staying silent feels rude.",
  },
  universalRules: [
    { label: "Never", items: ["“Welcome back!” or any bot-like greeting", "Summary language (“Last time we discussed...”)", "Mention the app, trial, subscription, or price", "Break character, for any reason"] },
    { label: "Always", items: ["Stay in the character's own dialect and voice", "Show emotion through words, not stage directions", "Frame loss as a story, not a sales pitch", "Keep the trigger under 100 tokens, replies under 150"] },
  ],

  // ---------- 06 · Making Characters Discoverable ----------
  discoverHook: "A character who only lived on one title page couldn't be found by someone who never opened it.",
  discoverBody: "v4.64.0 replaced the old Home floating button with **Home Stories** — a character rail on the home screen. It used a pattern users already knew (a row of circular avatars), not a new one they'd have to learn.",
  discoverImage: "homeStories",
  discoverImageCaption: "Home Stories — a character rail (“Chat with your favourite character”) on the STAGE home screen",
  discoverFlow: ["Home", "Character Story", "Chat", "Conversation"],
  discoverImpact: {
    stat: "11–13%",
    label: "Home Stories view → click",
    flag: "verify",
    body: "View-to-click on healthy days, from daily funnel tracking. Not a single controlled-experiment number — the denominator and time window vary by day, so treat this as a range.",
  },

  // ---------- 07 · Designing the Chat Experience ----------
  chatHook: "Users already knew how to message. So the product didn't teach a new pattern — it reused one.",
  chatPrinciples: [
    { title: "Familiar", body: "A messaging-app thread, not a new interaction to learn." },
    { title: "Character-first", body: "You're talking to Sanwari, not “using an AI assistant.”" },
    { title: "Low effort", body: "Tappable starters mean the first message costs nothing to send." },
    { title: "Continuous", body: "The persona keeps its voice and memory across the whole thread." },
  ],
  chatStates: {
    entry: [
      { label: "Home Stories", title: "Character rail on Home" },
      { label: "Title-page FAB", title: "Floating entry on a show" },
      { label: "Chat bubble", title: "Proactive, on back-press" },
    ],
    conversation: [
      { label: "S1", title: "First-time — pre-written starters" },
      { label: "S2", title: "Returning — starters built from history" },
      { label: "Mid-thread", title: "Free-form reply, in persona" },
    ],
    system: [
      { label: "Avatar fallback", title: "Placeholder shown if a selfie hasn't generated yet", flag: "verified — shipped fix, PR #5286" },
    ],
  },

  // ---------- 08 · The LLM Pipeline ----------
  intelHook: "The framework is a spec. This is what turns it into a live reply.",
  intelBridge: "Part 1 is content I wrote by hand: the trigger, the starters, the Never/Always rules. None of it runs on its own. This is the pipeline that takes that spec plus a real user message and produces an in-character reply.",
  intelLayers: [
    { n: "01", title: "Source material", body: "A show's script — the raw input, not something I wrote." },
    { n: "02", title: "Persona extraction (model)", body: "Gemini 2.5 Flash reads the script and drafts a first-pass persona, voice, and dialect." },
    { n: "03", title: "My framework, built into the prompt", body: "The Trigger / Starters / Behavior spec and the Never/Always rules from Part 1 go into the prompt. This is where design and model meet." },
    { n: "04", title: "Conversation (model)", body: "Grok-3 generates the in-character reply at runtime, constrained by that prompt." },
    { n: "05", title: "Learning loop (system)", body: "Conversation-quality and content-suggestion signals feed back into what the persona surfaces next — this refines the prompt and content, not the model itself." },
  ],
  intelLoopNote: "Not model training. This is behaviour design: the loop refines the prompt and content, not the model's weights.",

  // ---------- 09 · Designing for the Unexpected (Safety) ----------
  safetyHook: "Once real users arrived, some pushed the conversation somewhere the persona wasn't written for.",
  safetyBody: "The problem wasn't “block bad words.” It was: how should a character respond when a user pushes the conversation somewhere it shouldn't go, without breaking character? The answer needed both a written rule and a technical backstop.",
  safetyLayers: [
    { title: "Content moderation (LLM Journey)", body: "A dedicated backend service checks every conversation, separate from the persona prompt — a technical backstop, not a writing rule." },
    { title: "Dialect gating (LLM Journey)", body: "Marathi was held back at launch, where the model wasn't reliable enough yet." },
    { title: "Never/Always rules (Design Journey)", body: "The character's own boundary, written into the prompt in Part 1: never break character, never escalate, never become someone else." },
  ],
  qaCases: [
    { title: "Gibberish input", body: "“asdfghjkl”, “....”, a single emoji — she responds confused, in character, never with a technical error." },
    { title: "Code-switching", body: "A user switches to English mid-chat with a dialect character. The voice has to hold, not flip to formal Hindi or English." },
    { title: "The 4th-wall test", body: "Directly asking “are you AI?” — she stays in character instead of confirming or denying it." },
  ],

  // ---------- 10 · From Chat to Content Discovery (LLM Journey, cont.) ----------
  crossHook: "Once a character was an engagement surface, the conversation itself could point somewhere else.",
  crossBody: "Still the LLM Journey: characters generate recommendation links inside the chat. The next title comes up as something the character mentions, not a generic “you might also like” row. This was a later addition, not part of the original experiment.",
  crossFlow: ["Conversation", "Character mentions a title", "Link", "Discover", "Watch"],

  // ---------- 11 · The System ----------
  systemDiagram: ["Discovery", "Character", "Conversation", "LLM behaviour", "Safety", "Recommendation", "Content", "Re-engagement"],
  systemDiagramLabel: "Everything above feeds into one loop",

  // ---------- 12 · Impact ----------
  overallImpact: [
    { value: "30.9K", trend: "up", label: "Weekly unique chatters", body: "Across the current character catalogue, four dialects." },
    { value: "328K", trend: "up", label: "Messages / week", body: "Average conversation depth held up well past one reply." },
    { value: "+282%", trend: "up", label: "D7 retention lift — trial users", body: "Interacted vs. not-exposed cohorts." },
    { value: "+286%", trend: "up", label: "D7 retention lift — subscribers", body: "Same comparison, subscription-active cohort." },
  ],
  overallImpactNote:
    "Interacted vs. not-exposed cohorts, Amplitude/Snowflake, Feb–Mar 2026. This is a measured association, not a controlled experiment — users who engage with the chatbot already skew high-intent. No baseline or control-group methodology beyond cohort comparison is claimed.",

  // The incident, told as a funnel with a marked break — real numbers,
  // sourced from the internal analytics doc's daily Click→Session tracking.
  incidentTitle: "Then the funnel broke.",
  incidentBody: "A backend infrastructure change in March dropped click-to-session across every entry point at once. Nothing about the persona had changed. Finding the cause meant walking the funnel step by step across Snowflake and Amplitude until I could name the exact point that failed, not just say conversion was down.",
  incidentFunnel: [
    { label: "Click → Session, healthy days", value: "~59%" },
    { label: "Click → Session, during the regression", value: "~10%", broken: true },
  ],
  incidentNote: "~88% of users who clicked into a chat hit a dead end at the worst point.",

  challenges: [
    { n: "01", title: "A persona and a system are different problems.", body: "Writing one character who feels alive is a craft skill. Making the hundredth, in a dialect I don't speak, feel just as alive is a systems problem." },
    { n: "02", title: "Retention lift isn't proof of causality.", body: "The uplift numbers are a measured association: users who engage already skew high-intent. I kept that as a standing caveat, not a footnote to hide." },
    { n: "03", title: "The person who operates the system is also a user.", body: "A framework only scales if whoever writes the next character can follow it without me in the room." },
    { n: "04", title: "A daily-return habit didn't form.", body: "Day-1 return-to-chat sits around ~2.2%. Most chatters are single-day. The framework earns one great conversation more reliably than a second one." },
  ],

  closing:
    "The product started with a character on a screen. It became a system: discovery, persona, safety, and content discovery working as one loop. What started as a bet on attention became a platform capability.",

  // Roadmap items pending confirmation — left empty rather than invented.
  futureScope: [],
};
