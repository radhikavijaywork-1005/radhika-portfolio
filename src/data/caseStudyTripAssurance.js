export const tripAssuranceCaseStudy = {
  company: "Adani One",
  companyTag: "",
  title: "Reducing Waitlist Uncertainty with Trip Assurance",
  subheadPre: "A guaranteed-travel safety net for waitlisted train tickets that reached ",
  subheadStrong: "~28% opt-in",
  subheadPost: " within its first rollout.",

  summary: [
    {
      icon: "❗",
      label: "Problem",
      text: "**~30%** of train tickets booked daily go waitlisted, leaving users stuck in uncertainty about whether they'll actually travel, with no guaranteed way to reach their destination.",
    },
    {
      icon: "🔍",
      label: "Approach",
      text: "Researched user pain points around waitlisted bookings, then designed **Trip Assurance** — a low-cost opt-in that guarantees a flight ticket if the train doesn't confirm.",
    },
    {
      icon: "📊",
      label: "Outcome",
      text: "Reached **~28% opt-in** within the first rollout across 1,000 trains, with a **~96% confirmed journey rate** and **~30% higher average transactional value.**",
    },
  ],

  meta: [
    {
      label: "My Role",
      primary: "Lead Product Designer",
      detail: "owned end-to-end UX, research & strategy",
    },
    {
      label: "Team",
      primary: "Me · 1 PM · 1 ML Eng",
      detail: "cross-functional with Product & Engineering",
    },
    {
      label: "Timeline",
      primary: "Year 2023",
      detail: "3 months · MVP to launch",
    },
  ],

  approach: [
    { n: "1", title: "Define", body: "Understand & define the problem, business goals" },
    { n: "2", title: "Research", body: "Understand WL flow, user goals, key metrics & trends" },
    { n: "3", title: "Strategy", body: "Target users, competitive analysis, solutions" },
    { n: "4", title: "Ideation & Design", body: "Define user flow, UI mockups & prototypes" },
    { n: "5", title: "Prototype & Testing", body: "User & stakeholder testing, feedback" },
    { n: "6", title: "Impacts & Feedbacks", body: "Observe impacts after launch, collect user feedback" },
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
    { value: "13 Lakhs", label: "train tickets are booked daily in India", sublabel: "" },
    { value: "30%", label: "of tickets get waitlisted", sublabel: "" },
  ],
  problemBody:
    "Waitlisted train tickets create uncertainty for travellers, often leading to **disrupted plans due to delayed or unconfirmed ticket status.**",

  problemCards: [
    {
      icon: "⏳",
      title: "Uncertainty of confirmation",
      body: "Uncertainty and anxiety due to unclear train ticket confirmation until the last minute.",
    },
    {
      icon: "😐",
      title: "Limited Alternatives",
      body: "Limited alternatives or backup options, leading to canceled or delayed travel plans if train tickets remain waitlisted.",
    },
  ],

  wlFlow: {
    steps: ["Search Route", "Select Train and WL Class", "Add Traveller and contact details", "Make payment", "Enter IRCTC credentials", "Booking Complete"],
    prePaymentEnd: 3,
  },

  wlChallenges: [
    { icon: "💺", title: "Real-Time Reservation", body: "Availability is not accurately reflected in real time due to lag in system updates." },
    { icon: "🕰", title: "Chart Preparation", body: "Indian railways prepares chart 4 hours before departure of train." },
    { icon: "💰", title: "Cancellation charges", body: "₹60–₹65 waitlisted auto-cancellation is charged." },
  ],

  survey: {
    label: "User Survey · 55 Passengers",
    body: "To understand the challenges train travellers face, I took a train journey myself and spoke to passengers about their struggles with waitlisted tickets.",
    stats: [
      { value: "~65%", label: "book waitlisted tickets last minute due to high demand & limited availability" },
      { value: "~72%", label: "travellers want a certainty of confirmation & guarantee of travel" },
    ],
    quote: "I booked a waitlisted ticket for a court hearing, but it didn't confirm at last moment, I missed my hearing and faced professional setbacks.",
    quoteName: "Nisha Yadav",
    quoteRole: "Lawyer + Avid Train Traveller",
  },

  insights: [
    {
      icon: "❗",
      title: "Waitlisted Tickets Are Common Pain Point",
      body: "Almost every passenger faced challenges with waitlisted train tickets, causing stress or disrupted plans.",
    },
    {
      icon: "🤔",
      title: "Unsure about Travel",
      body: "Passengers often don't know in advance whether their ticket will confirm, leading to last-minute changes or cancellations.",
    },
    {
      icon: "💸",
      title: "Costly Last-Minute Travel",
      body: "When waitlisted tickets don't confirm, alternative travel options (like flights) become expensive and are often not viable due to limited availability.",
    },
  ],

  competitors: {
    label: "Competitor Study · Desk Research",
    intro: [
      { name: "Make My Trip", body: "Trip Guarantee Feature: user gets 3x refund of base fare if ticket remains waitlisted." },
      { name: "Railofy", body: "Trip Guarantee Feature: users get fixed ₹3000 cash-back if their ticket remains waitlisted, regardless of the ticket price." },
    ],
    rows: [
      {
        feature: "Waitlist Prediction",
        mmt: "No",
        railofy: "Yes",
        insights: ["Prediction is key when booking waitlisted tickets, setting clear user expectations for confirmation."],
      },
      {
        feature: "Refund / Alternative Options",
        mmt: "3x Refund of base fare",
        railofy: "Fixed ₹3000 Cashback",
        insights: ["No clear assurance to users.", "Fixed cashback does not scale with ticket prices, leaving some users underserved."],
      },
      {
        feature: "Guaranteed Travel",
        mmt: "No",
        railofy: "No",
        insights: ["Both platforms do not provide the alternate travel mode, leaving users anxious."],
      },
      {
        feature: "Feature Price",
        mmt: "12%–15% of base fare",
        railofy: "30%–38% of base fare",
        insights: ["Cost is prohibitive, especially when they don't receive added value like a guaranteed travel."],
      },
      {
        feature: "UX flow",
        mmt: "Lacks feature visibility on booking confirmation",
        railofy: "Inconsistent narrative and opt-in flow",
        insights: ["Feature visibility and handholding, especially regarding alternate mode or refunds, are crucial in reducing post-booking confusion."],
      },
    ],
  },

  opportunities: [
    {
      icon: "💺",
      n: "1",
      title: "Travel Certainty",
      body: "provide certainty to travelers about their train bookings, especially those with waitlisted tickets?",
      tag: "UX-Driven",
    },
    {
      icon: "✈️",
      n: "2",
      title: "Seamless User Journey",
      body: "seamlessly transition users to an alternate travel option (flight), if their train ticket remains waitlisted after chart preparation?",
      tag: "UX + CX-Driven",
    },
    {
      icon: "🔮",
      n: "3",
      title: "Prediction Certainty",
      body: "make train travel a more reliable prediction model that ensures accurate waitlist forecasts?",
      tag: "Tech/ML-Driven",
    },
  ],

  stakeholders: [
    {
      icon: "📦",
      title: "Product Team",
      subtitle: "Trip Assurance",
      body: "Provide **flight alternatives** for waitlisted tickets instead of refunds/cashbacks. (Unique to the market)",
    },
    {
      icon: "💰",
      title: "Business Team",
      subtitle: "Cost Strategy",
      body: "Charge a **minimal cost** for users opting Trip Assurance, ensuring a sustainable model. Pre-booking of flight tickets to avoid surge charges.",
    },
    {
      icon: "⚙️",
      title: "Tech Team",
      subtitle: "MVP launch",
      body: "Focused on special trains like **Rajdhani and Shatabdi** and AC coaches with higher confirmation rates and limited to routes with **airport access.**",
    },
    {
      icon: "📣",
      title: "Marketing Team",
      subtitle: "Marketing Proposition",
      body: "Sell Trip Assurance starting at **₹1** as per predictions confidence to attract users. **Refund TA fee** in TM wallet enabling users to rebook.",
    },
  ],

  platformMetrics: [
    { value: "3,200", label: "Trains available to book tickets" },
    { value: "10 Lakh+", label: "Unique users on the platform (App & Web)" },
    { value: "39,000+", label: "Tickets booked during festive time (Diwali + Chhath Puja 2021)" },
  ],

  otherMetrics: [
    { value: "90%", label: "Users use app" },
    { value: "10%", label: "Users use Web" },
    { value: "45%", label: "AC tickets booking" },
    { value: "55%", label: "Non-AC tickets booking" },
  ],

  waitlistedTrends: [
    { value: "42%", label: "of overall waitlisted tickets booked happen during festive time" },
    { value: "51%", label: "of AC vs. Non-AC waitlisted tickets are AC ticket" },
    { value: "31%", label: "of tickets remain waitlisted post-chart preparation" },
  ],

  userFlowDesc: "We aligned the user flow with the Habit Loop — using cues to introduce Trip Assurance, cravings for a worry-free journey, responses to opt in, and rewards like flights for waitlisted tickets.",

  designVariants: [
    { label: "1 · Homepage", title: "Cue — visibility on the homepage banner grabs attention upfront" },
    { label: "2 · Search Results", title: "Cravings — Trip Assurance tag on WL class cards" },
    { label: "3 · Booking Form", title: "Response — clear offering & playful copy simplify the decision" },
  ],

  usabilityTestingBody: "To ensure the Trip Assurance feature met user needs, we conducted usability testing to observe real user interactions and identify any pain points.\n\nWe showed the initial concept to stakeholders as well and captured their feedbacks as well.\n\nOur goal was to refine the experience by addressing any user confusion, accessibility issues, or gaps in feature visibility.",

  keyResults: [
    { n: "1", title: "Visibility of Trip Assurance", body: "Users found it **challenging to locate** which trains includes Trip Assurance, as only class cards displayed the TA tag." },
    { n: "2", title: "User dilemma", body: "Users left the app to **compare flight prices** for their journey date on other platforms." },
    { n: "3", title: "Pricing & Anchoring", body: "Business feedback highlighted **strategic pricing anchors** can drive conversions and ease user decision-making." },
    { n: "4", title: "Tracking Confusion", body: "Users **struggled to understand the next steps** after the chart will be prepared, including how they would receive a flight ticket, & whom to contact." },
  ],

  solution2: {
    title: "Seamless User Journey — Manual Booking",
    pitch: "To avoid last-minute disruptions, we implemented a manual pre-booking flow managed by the CX team. Automation wasn't feasible for the MVP launch due to time constraints.",
    userGoal: "Ensure users receive confirmed flight tickets for their desired travel dates.",
    businessGoal: "Secure low-cost flight tickets in advance to avoid price surges closer to the travel date, and mitigate potential cancellation fees if the user decides not to travel.",
  },

  preBookingFlow: [
    { screen: "01", title: "Icon was added to the train card to highlight Trip Assurance availability" },
    { screen: "02 & 03", title: "Displayed realistic flight costs to help users make informed decisions", subtitle: "Anchor pricing has been added" },
    { screen: "04", title: "Added \"Track Status\" link to guide users through the next steps" },
  ],

  decisions: [
    {
      phase: "01",
      phaseLabel: "Solution 1",
      title: "Travel Certainty",
      solutionName: "Trip Assurance",
      pitch: "To provide users with guaranteed travel certainty when their train ticket is waitlisted.",
      userGoal: "Ensure **travel certainty** for users while booking waitlisted train tickets by seamlessly integrating **Trip Assurance feature.**",
      businessGoal: "Increase **revenue** and **ATV** by offering a minimal-cost Trip Assurance option that enhances operational efficiency.",
      platformMetrics: [
        { value: "3,200", label: "Trains available to book tickets" },
        { value: "10 Lakh+", label: "Unique users on the platform (App & Web)" },
        { value: "39,000+", label: "Tickets booked during festive time (Diwali + Chhath Puja 2021)" },
      ],
      otherMetrics: [
        { value: "90%", label: "Users use app" },
        { value: "10%", label: "Users use Web" },
        { value: "45%", label: "AC tickets booking" },
        { value: "55%", label: "Non-AC tickets booking" },
      ],
      waitlistedTrends: [
        { value: "42%", label: "During festive time", desc: "Overall waitlisted ticket booked" },
        { value: "51%", label: "AC ticket", desc: "AC vs. Non-AC Waitlisted Tickets" },
        { value: "31%", label: "Remains Waitlisted", desc: "Post-Chart Waitlisted Tickets" },
      ],
      userFlow: {
        body: "We aligned the user flow with the Habit Loop — using cues to introduce Trip Assurance, cravings for a worry-free journey, responses to opt in, and rewards like flights for waitlisted tickets.",
        steps: [
          { title: "Search Route", tag: "Introducing Trip Assurance", loop: "Cues" },
          { title: "Select Train and WL Class", tag: "Assured Journey Details", loop: "Cravings" },
          { title: "Add Traveller and contact details", loop: "Response" },
          { title: "Make payment" },
          { title: "Enter IRCTC credentials" },
          { title: "Booking Complete" },
        ],
        branch: {
          decision: "Opt Trip Assurance",
          outcomes: [
            { title: "Chart Prepared" },
          ],
          confirmed: ["Booking Confirm", "Journey Confirmed"],
          waitlisted: ["Booking Waitlisted", "Flight Ticket booked"],
          reward: "Reward",
        },
      },
      variants: [
        { label: "1 · Homepage", title: "Cue — visibility on the homepage banner grabs attention upfront", img: "homepage" },
        { label: "2 · Search Results", title: "Cravings — Trip Assurance tag on WL class cards", img: "srp" },
        { label: "3 · Booking Form", title: "Response — clear offering & playful copy simplify the decision", img: "bookingForm" },
      ],
      postBookingFlow: [
        { screen: "1", title: "On PNR Page", description: "User can track their ticket status through here" },
        { screen: "2", title: "Reward", description: "After chart preparation ticket got confirmed" },
        { screen: "3", title: "Contact Support", description: "When ticket remains waitlisted, Contact Us link ensures users can easily reach support & not be in dilemma" },
        { screen: "4", title: "Flight Tickets", description: "User got flight tickets when train ticket remains waitlisted" },
        { screen: "5", title: "Cancellation", description: "Case when user denies to travel and requests ticket cancellation" },
      ],
      trackStatus: [
        { screen: "1", title: "Users can check the **next steps** before chart preparation", description: "" },
        { screen: "2", title: "Case: Ticket is confirmed and TA fee is refunded to user's TM Wallet", description: "" },
        { screen: "3", title: "Resolves the **user's confusion** about next steps if tickets remain waitlisted", description: "" },
        { screen: "4", title: "Case: Ticket is waitlisted, CX team contacted and collected details", description: "" },
        { screen: "5", title: "User can find and **download flight ticket** details", description: "" },
      ],
      usability: [
        { n: "01", title: "Visibility of Trip Assurance", body: "Users found it **challenging to locate** which trains include Trip Assurance, as only class cards displayed the TA tag." },
        { n: "02", title: "User dilemma", body: "Users **left the app** to **compare flight prices** for their journey date on other platforms." },
        { n: "03", title: "Pricing & anchoring", body: "Business feedback highlighted **strategic pricing anchors** can drive conversions and ease user decision-making." },
        { n: "04", title: "Tracking confusion", body: "Users **struggled to understand the next steps** after the chart is prepared, including how and whom to contact for their flight ticket." },
      ],
      iterations: [
        "Icon added to the train card to highlight Trip Assurance availability",
        "Displayed realistic flight costs to help users make informed decisions",
        "Anchor pricing added",
        "Added a **Track Status** link to guide users through the next steps",
      ],
    },
    {
      phase: "02",
      phaseLabel: "Solution 2",
      title: "Seamless User Journey",
      solutionName: "Manual Booking",
      pitch: "To avoid **last–minute disruptions**, we implemented a **manual pre–booking flow** managed by the CX team. Automation was not feasible for the MVP launch due to time constraints.",
      userGoal: "Ensure users receive **confirmed flight tickets** for their desired travel dates.",
      businessGoal: "Secure **low-cost flight tickets** in advance to avoid price surges closer to the travel date, and mitigate potential cancellation fees if the user decides not to travel.",
      branches: [
        {
          title: "Chart Not Prepared",
          role: "👩🏻‍💼 Customer Support",
          steps: ["Connect with user and collect details like travel date, full name, etc.", "Pre-book cheapest flight available for the travel date."],
        },
        {
          title: "Chart Prepared",
          role: "",
          steps: [
            "**Confirmed ticket → 👨🏻‍💻 Tech:** automate refund of Trip Assurance fee into TM wallet.",
            "**Waitlisted ticket → 👩🏻‍💼 Customer Support:** connect with user & share flight ticket on shared contact details. Upload to portal so the user can download from the app too.",
          ],
        },
      ],
    },
  ],

  overallImpact: [
    { value: "~28%", trend: "up", label: "Opt-in rate", body: "Trip Assurance was live on only 1,000 limited trains, and we still achieved higher conversion, meeting the user need." },
    { value: "~96%", label: "Confirmed Journey Rate", body: "Our prediction model achieved 98% accuracy, alongside seamless tracking and flight booking, increasing confirmed journeys significantly." },
    { value: "~30%", trend: "up", label: "Average transactional value", body: "Our strategic pricing and the added value of Trip Assurance encouraged higher adoption, reflecting user willingness to pay for certainty." },
  ],
  overallImpactNote: "We rolled out these MVP solutions initially for **1,000 trains**, covering **GNWL clusters and 3AC, 2AC, and 1AC classes**, within 3 months and here are the impactful results we achieved.",

  videoTestimonials: [
    { name: "Nilava Biswas", route: "Sealdah – Delhi" },
    { name: "Shyam Deepak", route: "Delhi – Vizag" },
    { name: "Pranav Jain", route: "Mumbai – Delhi" },
  ],

  testimonials: [
    { name: "Shubham Bhanu", route: "Mumbai – Chennai", quote: "Trainman upgraded my flight in no time. I highly appreciate the Trainman team for providing crisp revert." },
    { name: "Riyde Saini", route: "Delhi – Mumbai", quote: "Will they really give you a flight ticket? #Yes I got flight tickets in 10min. Thank you Trainman, I reached on time." },
    { name: "Sneha Tiwari", route: "Lucknow – Delhi", quote: "मैंने वेटलिस्टेड टिकट बुक किया था और कंफर्म नहीं हुआ! Trainman ने मेरे लिए फ्लाइट का इंतजाम कर दिया, जिससे मेरी यात्रा बिना रुके पूरी हो गई! 🙏" },
  ],

  userPortraits: [
    { name: "Nilava Biswas", route: "Sealdah – Delhi" },
    { name: "Shyam Deepak", route: "Delhi – Vizag" },
    { name: "Pranav Jain", route: "Mumbai – Delhi" },
  ],

  feedbackCallsIntro: "I collaborated with the CX team to gain first-hand insights post-launch. Also to address user queries and gather feedback.",

  feedbackInsights: [
    "Users valued **clear communication** about how and when they would receive **flight tickets**.",
    "CX team calls **improves trust** in users about the reliability of Trip Assurance.",
    "Users faces **challenges** with **visibility of Trip Assurance status** within the app & **refund of TA fee in TM wallet**.",
    "Insights led to **continuous refinement** of user flow and communication strategies.",
  ],

  challenges: [
    {
      n: "1",
      title: "Firsthand user insights from field research",
      body: "Conducting **surveys** and **interviews** with users provided firsthand insights into their pain points. These shaped the **design process**, helping me create user-friendly solutions while empathizing with **users' real-world challenges**.",
    },
    {
      n: "2",
      title: "Lack of PRD & time constraints",
      body: "Delivering the MVP **without a formal PRD** required quick decisions and **several iterations** under **tight deadlines**. This taught me to balance speed with UX logic, prioritize user needs, and still **meet business goals** with limited resources.",
    },
    {
      n: "3",
      title: "Manual processes",
      body: "We faced **significant tech constraints** and had to **rely on manual processes** to manage bookings. These limitations taught us the **importance of early-stage technical feasibility assessments** and the need for automated solutions in future versions.",
    },
  ],

  futureScope: [
    { icon: "💡", text: "Trip Assurance on **PNR status**, ticket not booked with us" },
    { icon: "💰", text: "Trip Assurance with other rewards like **3X refund** **(Live)**" },
    { icon: "🚕", text: "Trip Assurance with other alternate mode of booking like **Cabs and buses** for shorter routes" },
    { icon: "🛤️", text: "Trip Assurance on different WL clusters like **RLWL, PQWL** etc." },
    { icon: "🚆", text: "Trip Assurance on all **trains and classes**" },
  ],
};
