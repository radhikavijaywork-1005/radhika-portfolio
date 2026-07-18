export const paywallCaseStudy = {
  company: "STAGE",
  title: "Improving trial conversion through paywall experiments",
  subheadPre: "A 3-phase paywall and freemium strategy that grew trial rate from ",
  subheadStrong: "8% → 28%",
  subheadPost: " through structured experimentation.",

  meta: [
    {
      label: "My Role",
      primary: "Sole product designer",
      detail: "owned diagnostic → design → CMS handling → iteration",
    },
    {
      label: "Team",
      primary: "Me · 2 PM · Data · 2 Eng",
      detail: "+ cross-functional review with Retention, Marketing, & Content",
    },
    {
      label: "Timeline",
      primary: "Q2–Q3 2025",
      detail: "~5 Months, 3 Phases",
    },
  ],

  summary: [
    {
      icon: "❗",
      label: "Problem",
      text: "Trial conversion was stuck at **8%,** despite the paywall being the only revenue model. Users weren't rejecting the price, just confused about what they were paying for.",
    },
    {
      icon: "🔍",
      label: "Approach",
      text: "Studied user behaviour through qualitative, quantitative, and past experiment data, then ran **3 phased experiments,** each testing a different part of the paywall.",
    },
    {
      icon: "📊",
      label: "Outcome",
      text: "Trial rate went from **8% to 28%,** contributing to multi-crore annual revenue, while cutting cancellation rate by ~44%.",
    },
  ],

  overview:
    "STAGE is India's regional-language OTT platform, spanning dialects like Haryanvi, Rajasthani, Bhojpuri, & more. When I joined, the platform's primary monetization model was Try Now, Pay Later, a mandate-based subscription flow where users start a trial first and pay later.",

  overviewFacts: [
    {
      icon: "🎬",
      title: "Regional-First Content",
      body: "Original shows and movies made for dialect audiences across the country.",
    },
    {
      icon: "₹",
      title: "TNPL Monetization",
      body: "Subscription based revenue model, where user sets mandate by paying ₹1 for 7 days trial.",
    },
    {
      icon: "📱",
      title: "Multi-Platform Reach",
      body: "Live across app, website, and TV, meeting users wherever they watch.",
    },
  ],

  problemStats: [
    { value: "~8%", label: "Trial Rate", sublabel: "Conversions only" },
    { value: "~75%", label: "of new users dropped", sublabel: "before ever trying" },
  ],
  problemBody:
    "Despite being the platform's primary monetisation model, trial conversions were stuck at **8-10%** even after multiple paywall experiments. My aim was to identify the **friction points and improve trial activation and conversion.**",

  flow: {
    steps: ["Meta Ads", "Download App", "Sign-up", "Genre Selection", "Paywall", "Checkout"],
    note: "~98% of acquisition happens from Meta ads.",
  },

  userQuote: "I came to watch the movie, why is it asking for money? Is it a fraud app?",

  breakdown: [
    {
      n: "01",
      title: "No information hierarchy",
      body: "Header, price, three pills, video, and CTA all competed at once. Nothing told users what to read first.",
    },
    {
      n: "02",
      title: "Intent and content depth is missing",
      body: "150+ films is a number, not a taste. Users couldn't tell which titles, dialects, or if their show was even there.",
    },
    {
      n: "03",
      title: "Repetitive, unclear plan comms",
      body: "₹1, ₹199, 7 days, 3 months information across header, price, and list not communicated clearly.",
    },
    {
      n: "04",
      title: "The face wasn't relatable",
      body: "The creator video was meant to build trust, but the person on screen wasn't someone this audience recognised.",
    },
    {
      n: "05",
      title: "The paywall didn't look like STAGE",
      body: "Type, colour, and components didn't follow one system. Mismatched styles made the screen feel foreign.",
    },
    {
      n: "06",
      title: "CMS-operated - built from 4 separate blocks",
      body: "The screen was stitched together from four independently controlled CMS sections: header, plan, video, and CTA.",
    },
  ],

  research: {
    body: "To get the concrete problems, I ran user calls with 3 months of trial cohort users across Haryanvi, Rajasthani, and Bhojpuri dialects, and also analysed the from App/Play Store reviews.",
    body2: "Each call was coded against 5 parameters.",
    params: ["1. Barriers", "2. Decision factor", "3. Value Perception", "4. Trust Elements", "5. User Expectation"],
    quotes: [
      { text: "₹1 mein kitne din dekh sakte hai? ₹199 kya khudse kat lega?", name: "Sanjay", loc: "Hisar" },
      { text: "Mehnga laga, pata nahi chala kaisa content hai, jiske liye ₹199 dun", name: "Neha", loc: "Bhilwara" },
      {
        text: "Bina paise diye aage badhne hi de rahe the, bina dekhe kaise paise de dun. Uninstall kar diya",
        name: "Jatin",
        loc: "Patna",
      },
    ],
  },

  insights: [
    {
      n: "01",
      title: "The problem was clarity, not price.",
      body: "Users didn't reject the ₹1 trial cost, they didn't understand when or how ₹199 would be auto-deducted and Tier 2/3 users specifically worried it signaled fraud.",
    },
    {
      n: "02",
      title: "Unsure of the value they'll get after subscribing.",
      body: "Content availability was unclear - number of titles, dialects, or shows. Paying ₹x felt like a gamble.",
    },
    {
      n: "03",
      title: "Users were asked to pay before seeing anything.",
      body: "They thought the app was free but encountered a paywall immediately, before viewing any content, and left.",
    },
  ],

  decisions: [
    {
      phase: "01",
      phaseLabel: "Phase 1",
      title: "Plan Communication",
      hypothesis: "Clear plan communication, paired with nurturing trust elements, will convert better.",
      howTested:
        "5 paywall variants experiment on the existing CMS-driven layer.\n**1. Clarity baseline  2. Loss & Avoidance  3. Risk reversal  4. Ownership  5. Social proof**",
      variants: [
        { label: "Variant 1", title: "Clean plan comms" },
        { label: "Variant 2", title: "Clean comms + autopay" },
        { label: "Variant 3", title: "Refund Information" },
        { label: "Variant 4", title: "Content Depth" },
        { label: "Variant 5", title: "Social Proof" },
      ],
      eyebrow: "Clarity",
      highlights: [
        { title: "Clear trial pitch", body: "₹1 for 7 days, stated once, clearly, no repetition" },
        { title: "Price anchoring", body: "₹399 shown crossed out next to ₹1, so the discount feels real" },
        { title: "A recognisable face", body: "Neeraj Chopra walks users through the plan in their dialect." },
      ],
      impact: {
        stat: "17.8%",
        label: "Trial rate",
        body: "**Variant 1:** Clean plan comms had the highest trials at **18.5%**, with **Variant 2** close behind at **17.8%.** But **Variant 2 had 40% fewer cancellations.** We close the experiment on **Variant 2.** Slightly fewer trials, but far more people stayed.",
      },
    },
    {
      phase: "02",
      phaseLabel: "Phase 2",
      title: "Intent",
      hypothesis:
        "The user's source intent is the strongest signal we have. A paywall that knows what title or genre they came from a Meta ad to see should outperform a generic one.",
      howTested:
        "Layered **Intent Reinforcement** on top of the Phase 1 winner - surfacing a small, contextual reminder of the source title at paywall entry.",
      eyebrow: "Phase 2",
      spotlightTitle: "Intent paywall",
      spotlightBody:
        "Added the **trailer of the same content** that the user came from via the meta ad, instead of the celebrity video. We also highlighted the **content's depth** to emphasise its value for the price.",
      impact: {
        stat: "21.1%",
        label: "Trial rate",
        body: "Users seeing a paywall that **\"knew what they came for\"** converted at a higher rate than the clean baseline alone.",
      },
    },
    {
      phase: "03",
      phaseLabel: "Phase 3",
      title: "Value Proposition",
      hypothesis: "If we let users watch the exact title they came for up to its hook point, they'd be likely to convert better",
      howTested:
        "Our first instinct was to change the main flow - let the user watch the content they came for up to the hook point, then pitch trial.\n\nBut when we looked at the data, **70% users converts after seeing 1st paywall view, 28% from the 2nd, and 14% from the 3rd.** So changing the main flow would've meant risking the trials we were already getting.\n\nSo we tested this on the **3rd paywall view** instead. We **tracked the deeplink the user came** from, and let them watch that content behind a Special Access gate -right up to the hook point.",
      eyebrow: "Phase 3",
      spotlightTitle: "Special Access",
      spotlightBody:
        "Users will gain **special access to the content** they intended to watch up to the hook point, after which a **trial is offered to view the entire content.**",
      impact: {
        stat: "28.6%",
        label: "Trial rate",
        body: "Letting users watch what they came for **right up to the hook point** before asking them to pay pushed trial rate to 28%, our highest yet & since we only tested it on the 3rd paywall view, the main funnel stayed untouched.",
      },
    },
  ],

  overallImpact: [
    { value: "250%", trend: "up", label: "Trial rate", body: "Built across 3 phases of design experimentation, Trial rate increased from 8% → 28%." },
    { value: "~44%", trend: "down", label: "Reduction in cancellation rate", body: "Users were earlier cancelling just after taking trial, which is reduced with multiple experiments & pitches" },
    { value: "14L", trend: "up", label: "Revenue uplift", body: "Projected increase in new trials & subscriptions/month, contributing to multi-crore annual revenue." },
  ],

  challenges: [
    {
      n: "01",
      title: "Designing for a low-trust audience",
      body: "Most growth playbooks tell you to add **urgency, anchoring, & social proof**-that's exactly what we tested. But on a fraud-wary Tier 2/3 audience, those things backfired and actually pulled conversion down. The biggest learning here was to **unlearn the standard growth defaults** & design for clarity and trust instead. These users didn't need more reasons to buy - they needed to understand what they were buying before they could trust it.",
    },
    {
      n: "02",
      title: "Everything was CMS-operated",
      body: "The paywall wasn't one screen I could fully own, it was **stitched together from separate CMS blocks** (header, plan, video, CTA), so the design quality was capped by what the CMS allowed. I worked closely with **product & engineering** to understand why each constraint existed & what was actually possible to change. A lot of the design work was finding **workarounds within these limits** rather than designing freely",
    },
    {
      n: "03",
      title: "Innovating without cannibalising trials",
      body: "Bold bets like **Special Access** were exciting, but risky - most of our trials were already coming from the first paywall view, and testing a new idea there could have **broken the wins we'd already booked**. The **learning was to protect what's working** and test bold ideas where the downside is small. So we ran Special Access on the 3rd paywall view a low-risk surface which let us **try something ambitious without putting the main funnel at stake.**",
    },
  ],

  reflectionPre: "Every additional line on a paywall is ",
  reflectionEm1: "friction",
  reflectionMid: ". The user came for the ",
  reflectionEm2: "movie",
  reflectionPost: ", not the contract.",

  futureScope: [
    "Multiple experiments across **trial vs monthly plans** to find the right entry price",
    "Launched **quarterly and yearly plans** - moving beyond the single 3-month plan Live",
    "Experimenting with the **decoy effect** on the trial paywall to frame value better",
    "**Theme-based** trial paywalls matching the paywall to the cultural events and festivals",
    "**Gamification on paywalls** - spin-the-wheel, surprise gifts, and reward-led nudges",
  ],
};
