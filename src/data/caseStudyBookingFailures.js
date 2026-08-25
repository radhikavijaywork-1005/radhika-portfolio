export const bookingFailuresCaseStudy = {
  company: "Trainman",
  companyTag: "(Wholly owned subsidiary of Adani Digital Labs)",
  title: "Reducing Booking Failures: Post Payment Flow",
  subheadPre: "Simplifying the mandatory IRCTC credential step after payment to cut booking failures by ",
  subheadStrong: "~57%",
  subheadPost: ".",

  meta: [
    {
      label: "My Role",
      primary: "Lead Product Designer",
      detail: "owned end-to-end UX, research & delivery",
    },
    {
      label: "Team",
      primary: "Me · 2 Designers · 1 PM · 3 Eng",
      detail: "cross-functional with Product, Design & Engineering",
    },
    {
      label: "Timeline",
      primary: "Year 2022",
      detail: "2 weeks",
    },
  ],

  summary: [
    {
      icon: "❗",
      label: "Problem",
      text: "After successful payment, users are mandated to fill in their **IRCTC password and CAPTCHA** to complete their booking — a step that saw a consistent **~11% funnel drop-off** and a **~14% failure rate** that kept rising.",
    },
    {
      icon: "🔍",
      label: "Approach",
      text: "Analysed failure metrics, App/Play Store reviews, and 1:1 user calls to understand why users were failing at this step, then redesigned the flow across three targeted solutions.",
    },
    {
      icon: "📊",
      label: "Outcome",
      text: "Failure rate dropped from **14% to 6% (~57%)**, booking conversion from the pending page rose to **~87%**, and pending-page CX queries fell **~68%**.",
    },
  ],

  approach: [
    { n: "1", title: "Define", body: "Understand problem, Define problem & Challenges" },
    { n: "2", title: "Research", body: "Understanding WL flow, User pain points & challenges, Target Users, Competitive Analysis" },
    { n: "3", title: "Strategy", body: "User Goals, Business Goals, Solutions" },
    { n: "4", title: "Ideation & Design", body: "Learning Key Metrics & Trends, Define User Flow, UI mockups & prototypes" },
    { n: "5", title: "Prototype & Testing", body: "Prototype, User & Stakeholder Testing" },
    { n: "6", title: "Impacts & Feedbacks", body: "Observe impacts after launch, Collecting user feedbacks" },
  ],

  overview:
    "**Trainman** is an IRCTC authorised online **train ticket booking platform in India.** It offers helpful technology like waitlist predictions, live train tracking, and quick refunds.",

  overviewFacts: [
    {
      icon: "🙋🏻‍♂️",
      title: "Prediction Model",
      body: "High-accuracy waitlist predictions to help users make informed booking decisions.",
    },
    {
      icon: "🤖",
      title: "Real-Time Tracking",
      body: "Provides an intuitive booking experience along with live train tracking.",
    },
    {
      icon: "⚡",
      title: "Instant Refunds",
      body: "Enables quick refunds to the TM wallet, adding convenience and flexibility.",
    },
  ],

  problemStats: [
    { value: "~11%", label: "Funnel drop off after successful payment" },
    { value: "~14%", label: "Failed booking rate-consistently increasing" },
  ],
  problemBody:
    "Users are mandated to fill in their **IRCTC password and CAPTCHA** after successful payment. This step has emerged as a critical challenge, resulting in:",

  problemCard: {
    title: "Problem Statement",
    body: "After successful payment, there has been a consistent increase in **booking failures** and **funnel drop-offs,** resulting in a surge in **customer support queries** and **negatively impacting** booking conversions, user satisfaction, and app ratings.",
  },

  basicBookingFlow: {
    steps: ["Search Route", "Select Train and WL Class", "Add Traveller and contact details"],
    postPayment: ["Make payment", "Enter IRCTC credentials (password & Captcha)"],
    branch: { yes: "Booking Complete", no: "Booking Pending" },
  },

  failureMetrics: [
    { value: "6800", label: "Avg failed bookings month" },
    { value: "14%", label: "Failure rate" },
    { value: "55%", label: "Requests for Pending bookings + Refunds" },
  ],

  pendingIssueMetrics: [
    { value: "61%", label: "IRCTC ID + Password Issues" },
    { value: "19%", label: "Pressed cancel button + Session Timeouts" },
    { value: "12%", label: "Invalid Captcha" },
    { value: "8%", label: "Track Refund" },
  ],

  feedbackCategories: [
    { key: "credential", icon: "🫤", title: "IRCTC Credential Challenges" },
    { key: "pending", icon: "👩🏻‍🚀", title: "Pending Page Confusion" },
  ],

  userFeedback: [
    { text: "I don’t remember my IRCTC Password. There was no option to reset it or change ID", category: "credential" },
    { text: "The session timeout forced me to restart the process. It’s frustrating when you’ve already paid.", category: "pending" },
    { text: "Refund process is confusing. I don’t know if my payment is safe.", category: "pending" },
    { text: "Fraud app. Took my money and then asking me to fill IRCTC Password.", category: "credential" },
    { text: "It’s so complicated; there’s no clear visibility of what I’ve entered in the password field.", category: "credential" },
    { text: "There’s no clear information on whether my booking is confirmed or if I’ll get a refund.", category: "pending" },
    { text: "CAPTCHA reload button does not work sometimes", category: "credential" },
  ],

  technicalChallenges: [
    {
      icon: "🔗",
      title: "Handled by IRCTC",
      body: "The credential flow (ID+Password+CAPTCHA) is managed externally by IRCTC, limiting Trainman’s ability to customize and optimize the user experience.",
    },
    {
      icon: "🔑",
      title: "Password Provided by IRCTC",
      body: "Users get their password or a new ID from IRCTC, causing distractions in the booking flow and increasing abandonment due to forgotten or delayed credentials.",
    },
    {
      icon: "🙈",
      title: "Hidden Password Field",
      body: "The small input fields for IRCTC ID, password (hidden), and CAPTCHA make it difficult for users to enter information accurately, especially on mobile devices, leading to errors.",
    },
    {
      icon: "⏳",
      title: "Time-Based Expiration",
      body: "IRCTC’s session time is limited, and the user may lose their session if the process takes too long (e.g., forgetting credentials, errors in entering captcha), leading to session expiry and forcing users to restart the process.",
    },
  ],

  overallInsights: [
    {
      icon: "🤔",
      title: "Lack of Awareness",
      body: "Many users are unaware of the mandatory IRCTC step after payment. This lack of awareness leads to confusion, delays, and increased drop-off rates.",
    },
    {
      icon: "❗️",
      title: "Credential Errors",
      body: "A significant portion of users drop off at the IRCTC credential page due to forgotten or wrong passwords, incorrect IDs, timeout and captcha issues.",
    },
    {
      icon: "😣️",
      title: "Pending Page Confusion",
      body: "Passengers often don't know in advance whether their ticket will confirm, leading to last-minute changes or cancellations.",
    },
    {
      icon: "📉",
      title: "CX & Business Impact",
      body: "Increased refund queries and booking confusion are driving negative user experiences, lowering NPS, and reducing bookings, impacting revenue.",
    },
  ],

  opportunities: [
    {
      icon: "📲",
      n: "1",
      title: "Booking Flow Education",
      body: "better educate users about the booking flow, including mandatory steps and the redirection to IRCTC after payment?",
    },
    {
      icon: "✈️",
      n: "2",
      title: "Simplify IRCTC Credential",
      body: "simplify the IRCTC credential process to reduce errors and improve user experience?",
    },
    {
      icon: "⚠️",
      n: "3",
      title: "Pending Conversion",
      body: "convert users on the pending page while also providing a seamless refund experience for those who choose to cancel?",
    },
  ],

  strategy: {
    intro: "After multiple discussions with stakeholders, we have finalised the following strategies for each identified solution:",
    cards: [
      { icon: "📲", title: "Booking Flow Education", body: "Progress bar and transition page" },
      { icon: "✈️", title: "Simplify IRCTC Credential", body: "Visible password field above the keyboard\nClear guidance for managing the back or cancel button actions." },
      { icon: "⚠️", title: "Pending Conversion", body: "Reassuring users about payment safety\nClear CTA and guidance for conversion" },
    ],
  },

  decisions: [
    {
      phase: "01",
      title: "Booking Flow Education",
      solutionName: "Booking Flow Education",
      userFlow: {
        body: "We introduce a progress bar and a transition page right after payment, walking users through the mandatory IRCTC step instead of dropping them into it cold.",
        steps: ["Search Route", "Select Train and WL Class", "Add Traveller and contact details", "Make payment", "Transition page with next steps", "Enter IRCTC credentials (password & Captcha)"],
      },
      iterations: [
        "Informing users of **mandatory step** post-payment.",
        "Prompt to reset or get new **passwords** to avoid delays.",
      ],
    },
    {
      phase: "02",
      title: "Simplify IRCTC Credential",
      solutionName: "Simplify IRCTC Credential",
      userFlow: {
        body: "Submit Credentials feeds into a decision tree that waits for a response from IRCTC — Complete, Retry Booking, or Session timeout — each with its own recovery path back to a confirmed or cancelled booking.",
      },
      iterations: [
        "User can easily reset password without leaving the booking flow",
        "Guidance to help users take the actions required",
        "Clear instructions to avoid errors",
        "Clear and easy-to-find forgot password nudge",
        "Need help section to help users who get stuck",
        "Clear and Bold CTA- Linked with Submit button",
        "Visible password field above the keyboard to avoid entering wrong password",
        "Option given to hide or show password at user’s convenience",
        "The CTA becomes active once both the password and CAPTCHA are entered.",
      ],
    },
    {
      phase: "03",
      title: "Pending Conversion",
      solutionName: "Pending Conversion",
      pitch: "We made sure to maintain design consistency similar to the booking completion screen, ensuring users feel familiar and not as though they've landed on a foreign screen.",
      iterations: [
        "**Booking ID** upfront- making it easier for users to track with the **CX team.**",
        "**Steps** to navigate the completed and next steps",
        "Supporting text to explain users the **actions required.**",
        "Clear **primary CTA** ensuring users don’t have to pay again to complete booking.",
        "Cancel as **secondary CTA**",
        "**Need Help** section for users who need to change or create their credentials.",
        "**FAQ** to solve users query upfront",
        "If users click **back, cancel, or need help**, a bottom sheet will appear with a **list of potential issues** they might be facing.",
        "**Hindi** as supporting language ensures users can easily navigate and resolve issues.",
        "Removed call icon from upfront and given contact us link on bottom sheet",
      ],
    },
  ],

  happyFlowScreens: {
    solution1Caption: "Booking Flow Education — walkthrough of the transition page after payment",
    solution2Caption: "Simplify IRCTC Credential — happy flow",
    postSolution2: [
      "Retry booking bottom sheet with updated availability",
      "If there is no availability",
      "When clicked on cancel & get full refund",
      "Booking cancelled and refund initiated",
      "Booking cancelled and refund processed with details and refund breakup",
      "No response from IRCTC",
      "30mins time gets over",
      "Homepage page- Prompt 10mins case",
      "Homepage page- Prompt 30mins case",
      "Homepage page- Prompt 30mins time out",
    ],
  },

  usability: {
    findings: [
      "Users found the **progress bar** and **transition page** helpful in understanding the next steps after payment.",
      "The **visible password** fields above the keyboard reduced entry errors, though users faced **challenges on smaller devices.**",
      "While users landing on the pending page initially felt their **payment was stuck**, the clear **CTA reassured** them that they wouldn't need to pay again.",
    ],
    gap: "However, we identified a significant gap in the forgot password flow, where users were manually entering their **\"_IRCTC\"** by copying it along with their password from SMS messages received from IRCTC.",
  },

  overallImpact: [
    { value: "~57%", trend: "down", label: "Failure rate", body: "Failure rates dropped from **14% to 6%** by streamlining the IRCTC credential process and providing clear guidance." },
    { value: "~87%", trend: null, label: "Booking conversion from pending page", body: "**Clear CTAs** and step-by-step **guidance** enabled users to navigate the booking flow seamlessly, ensuring successful ticket bookings." },
    { value: "~68%", trend: "down", label: "Pending page queries", body: "Strategic placement of **'Contact Us' links** and guided booking flow reduced CX calls significantly." },
  ],
  overallImpactNote: "We went live with these updates on APP (Android & iOS) first, and here are the impactful results we achieved.",

  challenges: [
    {
      n: "01",
      title: "Tech Constraints & Collaborative Problem-Solving",
      body: "IRCTC’s platform limitations were a significant challenge. We **collaborated closely with developers** to understand each constraint and explore possible **workarounds**, finding ways to optimise the experience within these limits.",
    },
    {
      n: "02",
      title: "User Handholding Across the Booking Flow",
      body: "Guiding users through each step of the booking flow was crucial, and each step needed its own approach. Using **cognitive load reduction,** progressive disclosure, and nudges, I minimised confusion and anxiety — clear instructions and progress indicators kept users **feeling supported** throughout.",
    },
  ],
};
