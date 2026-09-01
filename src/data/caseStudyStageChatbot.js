// Structured to match the site's other case studies exactly: Summary →
// Overview → Problem (real numbers first) → Design Work → LLM & Systems
// Work → Decisions → Impact → Reflection. Short, plain sentences — the
// same flat, declarative tone as the other 3 case studies, not rhetorical
// copywriting. Bullets and stat rows carry the detail.
//
// Design Work and LLM & Systems Work are kept separate on purpose: content
// and interaction decisions are one job, model/safety/runtime decisions
// are a different one.
//
// Sourced from PROJECT.md, CHARACTER_CHATBOT_HISTORY.md, the Sanwari
// Chatbot POC persona-framework doc, and the chatbot analytics context
// docs. D7 retention (55%) and cross-sell CTR (14%) are the numbers from
// Radhika's resume — the authoritative figures for those two metrics.
// Baseline retention numbers (Problem section) are the "Not Exposed"
// cohort figures from the same analytics window, real and sourced.
export const stageChatbotCaseStudy = {
  company: "STAGE",
  title: "Turning Characters into an Engagement Layer",
  subheadPre: "A persona framework for 100+ STAGE characters across four dialects lifted D7 watch retention by ",
  subheadStrong: "55%",
  subheadPost: " and drove a 14% CTR on in-chat recommendations.",

  meta: [
    { label: "Role", primary: "Product designer", detail: "strategy, interaction, persona framework, and safety — end to end" },
    { label: "Team", primary: "Me · 1 PM", detail: "engineering execution across app & backend" },
  ],

  // ---------- Summary ----------
  summary: [
    { icon: "❗", label: "Problem", text: "STAGE's chatbot let users message characters from shows they watched. Every character opened the same way — **\"Ram Ram… aap kaise ho?\"** Generic, and no reason to reply." },
    { icon: "🔍", label: "Approach", text: "The ask was \"build a chatbot.\" I reframed it: could a character a user already knows earn more attention than a notification? Built a reusable **persona framework** instead of a hand-written script." },
    { icon: "📊", label: "Outcome", text: "**+55%** D7 watch retention lift, **14%** CTR on in-chat recommendations, **30.9K** weekly chatters across four dialects." },
  ],

  // ---------- Overview ----------
  overview:
    "STAGE is a regional-language OTT platform in India. It makes original shows in dialects — Haryanvi, Rajasthani, Bhojpuri, Gujarati — instead of the mainstream Hindi or English content most Indian streaming platforms compete on.",
  overviewFacts: [
    { icon: "🎬", title: "100+ Titles", body: "Original character-led shows across dialects, each with its own leads and story arcs." },
    { icon: "🗣️", title: "Four Dialects", body: "Haryanvi, Rajasthani, Bhojpuri, and Gujarati, each with its own voice rather than a translation." },
    { icon: "💬", title: "Existing Chatbot", body: "Users could already message a character from a show. It wasn't converting attention into retention." },
  ],

  // ---------- Problem ----------
  problemStats: [
    { value: "~57%", label: "Trial cancellation rate", sublabel: "platform benchmark, considered elevated" },
    { value: "~7.6%", label: "Trial users hitting an \"aha moment\"", sublabel: "4+ distinct watch days — most never got there" },
  ],
  problemBody:
    "The real problem was retention and activation, not the chatbot. Most trial users never watched enough to form a habit, and most who did still cancelled. The chatbot was one lever chosen to move those numbers, and the existing version wasn't moving anything — every character sounded the same to everyone.",
  problemQuote: "“Ram Ram… aap kaise ho?” — generic. No hook. No reason to respond. Could be any character.",
  problemQuoteNote: "My own diagnosis of the proof-of-concept greeting, before the redesign.",

  // ---------- Research ----------
  researchHook: "Before designing anything, two questions needed answering: which users actually needed to move, and on what.",
  researchBody:
    "STAGE's funnel isn't one audience. A brand-new trial user with zero watch time has a different problem than someone mid-cancellation, or a paying subscriber. I mapped the persona framework's 9 user segments against the business metric each one actually needed to move, before writing a single line of character dialogue.",
  targetMetricsLabel: "Nine user segments, each targeting a different business metric",
  targetMetrics: [
    { segment: "New trial, zero watch time", target: "Consumption ↑ → activation, D0 retention" },
    { segment: "Trial, inactive 24h+", target: "D1+ retention ↑, cancellation ↓" },
    { segment: "Trial, chatted recently", target: "Session length ↑, activation (4+ watch days)" },
    { segment: "Subscriber", target: "D0–30 retention ↑, consumption depth, churn ↓" },
    { segment: "Trial paused / cancelling", target: "Resume trial ↓ cancellation" },
    { segment: "Trial over / lapsed", target: "Win-back → subscription conversion ↑" },
  ],
  userFlowLabel: "The entry flow, mapped before any screen was built",
  userFlow: ["Watching a show", "Exits or pauses", "Eligibility check: trial user? watched enough?", "Chat entry shown", "Character opens the chat"],
  modelChoiceLabel: "Model research: two jobs, two different models",
  modelChoice: [
    { title: "Gemini 2.5 Flash", body: "Reads a show's script and drafts a first-pass persona and dialect. A one-time job per character, done once, not at chat time." },
    { title: "Grok-3", body: "Generates the in-character reply live, every message. Chosen for runtime conversation, not persona drafting." },
  ],

  // ---------- Validation ----------
  validationTag: "Solution 1",
  validationHook: "One character, hand-built, to test whether the idea worked at all before building anything bigger.",
  designStats: [
    { value: "1", label: "hand-written character", sublabel: "proved users would talk to it" },
    { value: "100+", label: "shows waiting behind her", sublabel: "across 4 dialects" },
  ],
  designWorkBody:
    "V1 was scoped to one show, one character — a custom greeting, custom motion, hand-designed end to end, to answer one question: will a user actually talk to a character mid-show? They did. That validated the idea. But nothing about it could become the next hundred characters without me writing every one myself, and scaling it surfaced four specific failures.",
  breakdown: [
    { n: "01", title: "Nothing to hook into", body: "A formal greeting invites a formal reply, or none." },
    { n: "02", title: "No memory of a returning user", body: "Someone coming back was treated like a stranger every time." },
    { n: "03", title: "The wrong kind of loss", body: "Nudges said \"come back and watch\" — read like a notification, dismissed like one." },
    { n: "04", title: "A script, not a system", body: "Written by hand, for one person. Couldn't scale without me." },
  ],

  // ---------- Design Work ----------
  designWorkTag: "Solution 2",
  reasoningLadder: [
    { n: "01", label: "Signal", body: "V1 validated that users would talk to a character, then failed the four ways above the moment it needed to scale. The business still needed cancellation down from ~57% and activation up from ~7.6%." },
    { n: "02", label: "Principle", body: "Not \"write a better greeting.\" The real question: what does every character need — regardless of dialect, backstory, or how popular the show is — to feel like a person, not a script?" },
    { n: "03", label: "Decision", body: "A reusable persona framework, reverse-engineered against the exact business metric each of STAGE's 9 user segments needed to move." },
  ],
  frameworkLayersLabel: "The persona framework that replaced it — 3 layers × 9 user segments × 2 chat states",
  frameworkLayers: ["Trigger", "Starters", "Behavior"],
  frameworkLayersNote: "Trigger earns the tap. Starters (3–4 tappable, character-spoken lines) earn the first reply. Behavior steers toward what this user needs: watch more, come back, or convert from trial to subscriber.",
  researchCopy: {
    label: "The framework in practice — Sanwari, new trial user, zero watch time",
    character: "Sanwari",
    segment: "New trial user — hasn't started watching",
    trigger: "Tumne meri kahani dekhi koni... main yahan akeli haan. Kitne din aur rahuungi?",
    triggerNote: "“You haven't seen my story yet... I'm alone here. How many more days will I stay?”",
    starters: [
      "Mujhe bech diya tha shaadi ke naam pe... mujhe pata bhi koni tha",
      "Tau kehta hai meri zaroorat khatam ho gayi ghar mein",
      "Ek din aayega jab Bhanwar ko choose karna padega — main ya Tau",
      "Bol — tu meri jagah hoti toh kya karti?",
    ],
    behavior: "She never says \"watch the show.\" She says “Meri kahani mein hai... main bas itna bata sakti haan.” The 4th starter is always a direct question, so silence feels rude.",
  },

  // ---------- Part divider ----------
  partDesign: {
    label: "Part 1",
    title: "The Design System",
    note: "The persona spec, entry points, and copy. Content and interaction design, no model talk.",
  },

  // ---------- Figma Plugin (in progress) ----------
  pluginTeaser: {
    flag: "in progress",
    title: "Turning this framework into a Figma plugin",
    body: "Authoring a new character today still means manually feeding reference images into a separate AI tool. I'm building a Figma plugin that does it in one click and one prompt, inside Figma.",
    note: "Still in progress. Once it ships, it's also its own AI Playground entry.",
  },

  // ---------- LLM & Systems Work ----------
  partLLM: {
    label: "Part 2",
    title: "LLM & Systems Work",
    note: "Model choice, the rules that constrain it, and the safety and learning-loop architecture around it.",
  },
  llmSystemsHook: "Choosing a model is research. Constraining it and keeping it safe at runtime is systems work.",
  universalRulesLabel: "Rules that override the model's default behaviour",
  universalRules: [
    { label: "Never", items: ["“Welcome back!” or any bot-like greeting", "Summary language (“Last time we discussed...”)", "Mention the app, trial, subscription, or price", "Break character, for any reason"] },
    { label: "Always", items: ["Stay in the character's own dialect and voice", "Frame loss as a story, not a sales pitch", "Keep the trigger under 100 tokens, replies under 150"] },
  ],
  universalRulesNote: "Left alone, a general-purpose AI model defaults to a formal greeting and a sales nudge — the exact failure mode of V1. These rules run on every model call, in every dialect.",
  safetyLabel: "Safety architecture: a written rule plus a technical backstop",
  safetyLayers: [
    { title: "Content moderation", body: "A dedicated backend service checks every conversation, separate from the persona prompt." },
    { title: "Dialect gating", body: "Marathi was held back at launch until the model was reliable enough in that dialect." },
  ],
  qaCases: ["Gibberish input — she responds confused, in character, never a technical error", "Code-switching to English mid-chat — the voice has to hold", "“Are you AI?” — she stays in character"],
  learningLoopLabel: "The learning loop",
  learningLoopNote: "Conversation-quality and content-suggestion signals feed back into what the persona surfaces next. It refines the prompt and content, not the model's weights.",

  // ---------- Decisions (phased) — product and UX, no model talk ----------
  decisions: [
    {
      phase: "03",
      phaseLabel: "Solution 3",
      title: "Discoverability",
      hypothesis: "A character who only lives on one show's page can't be found by someone who never opened it.",
      howTested: "Replaced the old home floating button with **Home Stories** — a character rail on the home screen, reusing a pattern users already knew (circular avatars, like Instagram or WhatsApp Stories).",
      image: "homeStories",
      imageCaption: "Home Stories — “Chat with your favourite character” on the STAGE home screen",
      impact: { stat: "11–13%", label: "Home Stories view → click", flag: "verify", body: "View-to-click on healthy days, from daily funnel tracking." },
    },
    {
      phase: "04",
      phaseLabel: "Solution 4",
      title: "Chat Experience",
      hypothesis: "Users already know how to message someone. Reuse that pattern instead of teaching a new one.",
      howTested: "Built the thread like WhatsApp: familiar, character-first (talking to Sanwari, not \"an AI assistant\"), tappable starters so the first message costs nothing to send.",
      image: "consumptionBubble",
      imageCaption: "Real consumption-screen chat bubble: “Namaste ji 🙏 Ek baat batani thi aapko…”",
      states: { entry: ["Home Stories", "Title-page FAB", "Chat bubble on back-press"], conversation: ["First-time — pre-written starters", "Returning — starters from history", "Mid-thread — free-form, in persona"] },
    },
    {
      phase: "05",
      phaseLabel: "Solution 5",
      title: "Cross-Sell",
      hypothesis: "A character people already trust can point them toward more content.",
      howTested: "Characters generate recommendation links inside the chat. The next show comes up in their own voice, instead of a generic \"you might also like\" row.",
      impact: { stat: "14%", label: "Recommendation link CTR", body: "Click-through on recommendations routed through the character's voice." },
    },
  ],

  // ---------- Impact ----------
  overallImpact: [
    { value: "30.9K", trend: "up", label: "Weekly unique chatters", body: "Across the character catalogue, four dialects." },
    { value: "328K", trend: "up", label: "Messages / week", body: "Conversation depth held up well past one reply." },
    { value: "+55%", trend: "up", label: "D7 watch retention lift", body: "Interacted vs. not-exposed users, Amplitude/Snowflake." },
    { value: "14%", trend: "up", label: "Cross-sell CTR", body: "Click-through on in-chat recommendation links." },
  ],
  overallImpactNote:
    "Compared against a not-exposed cohort in the same window. Not a randomised controlled test.",

  incidentTitle: "Then the funnel broke.",
  incidentBody: "A backend infrastructure change in March dropped click-to-session from ~59% to ~10% across every entry point. Nothing about the persona changed. It was a technical regression, found by walking the funnel step by step across Snowflake and Amplitude.",
  incidentFunnel: [
    { label: "Click → Session, healthy days", value: "~59%" },
    { label: "Click → Session, during the regression", value: "~10%", broken: true },
  ],
  incidentNote: "~88% of users who clicked into a chat hit a dead end at the worst point.",

  // ---------- Reflection ----------
  challenges: [
    { n: "01", title: "A persona and a system are different problems.", body: "Writing one alive character is a craft skill. Making the hundredth, in a dialect I don't speak, feel just as alive is a systems problem." },
    { n: "02", title: "This is correlation, not a real experiment.", body: "Users who engage already skew high-intent, so the 55% lift is likely an upper bound. The next version needs a randomised holdout instead of an exposed/not-exposed split." },
    { n: "03", title: "A daily habit didn't form.", body: "D1 return-to-chat sits at 2.2%. The framework earns one great conversation reliably. A second one is unfinished work." },
  ],

  closing:
    "This didn't happen in a clean sequence. It started as a rushed bet on one character, broke once it had to scale, and only became a system once that failure forced the rebuild. What shipped is a lever STAGE can point at any retention or activation number it needs to move next, across any of its 100+ shows.",

  futureScope: [
    { title: "Character selfies", body: "AI-generated in-character selfies, using Gemini image generation. Shipped by engineering; not part of this design scope." },
    { title: "In-chat games", body: "Native games inside the chat thread (Ludo, Saanp Seedhi, Bluff). Shipped by engineering; not part of this design scope." },
  ],
};
