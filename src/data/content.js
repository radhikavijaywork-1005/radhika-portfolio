import bgStage1 from "../assets/site/work/bg-stage-1.png";
import bgStage2 from "../assets/site/work/bg-stage-2.png";
import bgAdaniOne from "../assets/site/work/bg-adani-one.png";
import bgTrainman from "../assets/site/work/bg-trainman.png";
import phonesStage1 from "../assets/site/work/phones-stage-1.png";
import phonesStage2 from "../assets/site/work/phones-stage-2.png";
import phonesAdaniOne from "../assets/site/work/phones-adani-one.png";
import phonesTrainman from "../assets/site/work/phones-trainman.png";

export const profile = {
  name: "Radhika Vijay",
  pillGreeting: "Hi, I'm Radhika",
  title: "Product Designer & Builder",
  subhead:
    "strategising and designing growth-focused experiences with AI-enabled product execution",
  currentCompany: { label: "STAGE", note: "Currently driving growth at" },
  previousCompany: { label: "Adani", note: "Previously worked at" },
  links: {
    linkedin: "https://www.linkedin.com/in/radhikavijay5895/",
    medium: "https://medium.com/@radhikavijaywork",
    behance: "https://www.behance.net/radhikavijay5895",
    dribbble: "https://dribbble.com/radhikavijay5895",
    resume: "/Radhika_Vijay_Resume.pdf",
    email: "radhikavijaywork@gmail.com",
  },
};

export const work = [
  {
    company: "STAGE",
    title: "Improving trial conversion through paywall experiments",
    metrics: ["+250% increase", "14L/mo revenue"],
    category: "Acquisition",
    cta: "Read Case Study",
    href: "/work/paywall-experiments",
    bg: bgStage1,
    phones: phonesStage1,
    phonesWidthPct: 68,
    color: "#6b0000",
  },
  {
    company: "STAGE",
    title: "Building a new revenue stream end-to-end with AI",
    metrics: ["+26% opt in", "23L/yr revenue"],
    category: "Monetisation",
    cta: "In Writing",
    href: null,
    bg: bgStage2,
    phones: phonesStage2,
    phonesWidthPct: 70.8,
    color: "#6b0000",
  },
  {
    company: "Adani One",
    title: "Reducing Waitlist Uncertainty with Trip Assurance",
    metrics: ["28% opt in rate", "+30% ATV"],
    category: "Conversion",
    cta: "Read Case Study",
    href: "https://www.figma.com/proto/9jxcUHpEVLdB8Av1qfpEXc/Radhika_Portfolio?page-id=161%3A1537&node-id=850-11893&viewport=435%2C403%2C0.02&t=aH7m7jaEBVjnhPb5-1&scaling=scale-down&content-scaling=fixed",
    bg: bgAdaniOne,
    phones: phonesAdaniOne,
    phonesWidthPct: 68,
    color: "#3d6690",
  },
  {
    company: "Trainman",
    title: "Reducing Booking Failures: Post Payment Flow",
    metrics: ["57% reduction"],
    category: "Flow Improvement",
    cta: "Read Case Study",
    href: "https://www.figma.com/proto/9jxcUHpEVLdB8Av1qfpEXc/Radhika_Portfolio?page-id=161%3A2531&node-id=846-30517&viewport=151%2C383%2C0.02&t=O2AgLqr3f1L0vrnm-1&scaling=scale-down&content-scaling=fixed",
    bg: bgTrainman,
    phones: phonesTrainman,
    phonesWidthPct: 68,
    color: "#c2621f",
  },
];

export const skills = [
  "UX Researcher",
  "UI/UX Expertise",
  "User Testing",
  "Interaction Design",
  "Team Player",
  "Leadership",
  "Growth Mindset",
];

export const quote = {
  sanskrit: "व्यवसायो हि समृद्धये",
  translation: "Innovation and effort lead to growth and prosperity.",
};
