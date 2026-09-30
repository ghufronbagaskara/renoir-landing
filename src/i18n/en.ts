// English copy. Source: docs/renoir-run.md and the owner's current direction. Indonesian lives in ./id.ts and must
// match this shape exactly (enforced by the Dictionary type).
const en = {
  site: {
    name: "Renoir",
    pronunciation: "ren-WAHR",
    tagline: "Make a stronger impression. Run a better operation",
    description:
      "Renoir designs identities and digital experiences, builds websites and business systems, and keeps the products it builds running.",
  },

  nav: {
    services: "Services",
    process: "Process",
    work: "Work",
    about: "About",
    aboutRenoir: "About Renoir",
    team: "Team",
    notes: "Notes",
    cta: "Start a project",
    floatingCta: "Tell us what’s broken",
    floatingCtaShort: "What’s broken?",
    language: "Language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    home: "Home",
  },

  search: {
    button: "Search",
    label: "Search the site",
    placeholder: "Search the site",
    close: "Close search",
    loading: "Searching pages and notes…",
    noResults: "No results for “{term}”.",
    unavailable: "Search needs a local production build. Browse Services or Notes for now.",
    explore: "Start with a path",
    recent: "Recent notes",
    hint: "Type to search services, notes, work, and pages",
    groups: { service: "Services", note: "Notes", work: "Work", page: "Pages" },
  },

  offcanvas: {
    about:
      "Renoir is a digital studio for visual identity, interfaces, websites, and business systems. We can take on design by itself or build and run the finished product.",
    contactTitle: "Get in touch",
    followTitle: "Follow",
  },

  footer: {
    headline: "Tell us",
    headlineEm: "what needs to work",
    body: "Tell us what you are trying to change. We will ask the questions needed to shape the work and tell you plainly if we are not the right team.",
    circle: "START A PROJECT · START A PROJECT · ",
    tagline: "Identity and interface design, websites, apps, and systems. One studio for the work that needs to look right and run well.",
    studio: "Studio",
    more: "More",
    contact: "Contact",
    location: "Based in Indonesia, working remotely",
    rights: "All rights reserved.",
  },

  notFound: {
    metaTitle: "Page not found — Renoir",
    metaDescription: "This page doesn't exist. The link may be old, or the page moved. Go back to the Renoir home page.",
    breadcrumb: "Page not found",
    title: "This page doesn't exist.",
    body: "The link may be old, or the page moved.",
    button: "Back to home",
  },

  form: {
    name: "Your name",
    company: "Company",
    email: "Work email",
    buildType: "What are you looking to build?",
    buildTypes: { marketing: "Marketing site", internal: "Internal system or app", design: "UI/UX or visual identity", both: "Design and build", unsure: "Not sure yet" },
    problem: "What's the problem you're trying to solve?",
    timeline: "Timeline",
    timelines: { month: "Within a month", quarter: "1–3 months", later: "3+ months", exploring: "Just exploring" },
    budget: "Budget range",
    budgets: { lt10: "Under 10M IDR", "10-25": "10–25M IDR", "25-50": "25–50M IDR", gt50: "50M+ IDR", discuss: "Prefer to discuss" },
    submit: "Send project details",
    reply: "We will follow up using the email you provide.",
    honeypot: "Leave this field empty",
    messages: {
      sent: "Thanks. We received your project details and will follow up by email.",
      invalid: "Please check the highlighted fields.",
      captcha: "We couldn't verify the request. Please try again.",
      rate_limited: "Too many messages from this connection. Please wait a minute.",
      error: "We could not send your details. Please try again later.",
    },
  },

  home: {
    metaTitle: "Renoir | Design, websites, apps and business systems",
    metaDescription:
      "Renoir designs identities and digital experiences, builds websites and business systems, and keeps the products it builds running.",
    hero: {
      title: ["Make a stronger impression", "Run a better operation"],
      body: "Renoir is a digital studio for identities, interfaces, websites, and business systems. Start with design alone or work with us through launch and care.",
    },
    problem: {
      label: "The problem",
      title: "Good design should hold up in use",
      side: "Design to server",
      stat: "One studio",
      cardTitle: "One team for the whole job",
      cardBody:
        "A good first impression matters. So does the system behind it. We bring design and engineering together, then stay accountable when the work goes live.",
    },
    strip: [
      "Marketing sites",
      "Landing pages",
      "Internal systems",
      "Operational dashboards",
      "Order & document tracking",
      "Deployment & care",
    ],
    services: {
      label: "What we do",
      title: "Design, build, and care in one studio",
      body: "Four ways to work with us. Start with design, a public-facing site, a business system, or the infrastructure that keeps it running.",
      button: "See all services",
    },
    work: {
      label: "Work",
      title: "Selected work, shared with permission",
      body: "Websites, business systems, and the infrastructure behind them. See the work and the decisions that shaped it.",
      button: "Discuss your project",
      previous: "Previous project",
      next: "Next project",
      pause: "Pause project rotation",
      resume: "Resume project rotation",
    },
    process: {
      label: "How it goes",
      title: "Four stages, with the work in view",
      steps: [
        { title: "Scope", body: "We start with the business problem, not the technology. You get a written scope and a fixed price for it." },
        { title: "Design", body: "Structure first, surface second. You approve the design before any production code exists." },
        { title: "Build", body: "Written from scratch against the approved design, on a live staging URL you can check the whole way." },
        { title: "Deploy & care", body: "Infrastructure configured, monitoring on, documentation handed over. We keep it running, or you take it." },
      ],
    },
    engagements: {
      label: "How engagements work",
      title: "A clear scope, a fixed price",
      cards: [
        {
          build: "marketing",
          title: "Marketing site",
          audience: "For companies whose website is the first thing a prospect judges them by.",
          items: [
            "Written from scratch",
            "Performance targets agreed up front",
            "Technical SEO, readable to AI search",
            "Structured data and sitemaps",
            "Handed over running",
          ],
          priceLine: "Fixed fee",
          note: "for agreed scope",
          cta: "Scope my website",
          badge: "Site",
        },
        {
          build: "internal",
          title: "Internal system",
          audience: "For operations running on spreadsheets, chat threads, and paper.",
          items: [
            "Built around how you actually work",
            "Order and document tracking",
            "Dashboards and monitoring",
            "Approval workflows",
            "Integrations between your systems",
          ],
          priceLine: "Fixed fee",
          note: "for agreed scope",
          cta: "Scope my system",
          badge: "System",
        },
        {
          build: "design",
          title: "UI/UX & identity",
          audience: "For businesses and products that need a clearer experience and a visual identity of their own.",
          items: ["User flows and wireframes", "Website and app interfaces", "Interactive prototypes", "Visual identity", "Design files and handover"],
          priceLine: "Fixed fee",
          note: "for agreed scope",
          cta: "Scope my design",
          badge: "Design",
        },
        {
          build: "unsure",
          title: "Deployment & care",
          audience: "For every client, by default.",
          items: [
            "Servers and deployment pipeline",
            "Monitoring and backups",
            "Domain and SSL",
            "Documentation and walkthrough",
            "Optional monthly care retainer",
          ],
          priceLine: "Included",
          note: "",
          cta: "Ask about care",
          badge: "Care",
        },
      ],
    },
    oneStudio: {
      circle: "BUILT TO WORK · MADE TO BE SEEN · ",
      slides: [
        {
          label: "01 · Bought, not built",
          quote:
            "A theme with your logo on it looks like four hundred other sites, loads slowly on your customers' phones, and search engines struggle to read it. We write every site from zero.",
        },
        {
          label: "02 · Handed over as files",
          quote:
            "The vendor sends a zip file and leaves. You're left with software you can't deploy, on a server nobody configured. We hand over a URL that stays up.",
        },
        {
          label: "03 · Split across vendors",
          quote:
            "A designer, a developer, a host. Three timelines, three interpretations, and no one who owns the result. We keep design, engineering, and infrastructure on one team.",
        },
      ],
    },
    why: {
      label: "Why work with us",
      title: "What you get with Renoir",
      rows: [
        { title: "Written from zero", body: "No themes, no page builders. Every line exists because your project needed it.", tag: "Code" },
        { title: "Speed is a specification", body: "Performance and indexing targets are agreed before we start and checked before handover.", tag: "Speed" },
        { title: "One team, one result", body: "Design and engineering sit together. Nothing gets lost between them.", tag: "Team" },
        { title: "Delivered running", body: "Not a zip file. A working URL on infrastructure we configured.", tag: "Handover" },
        { title: "Talk to the person building it", body: "Small team, short lines. No account manager in between.", tag: "Contact" },
      ],
    },
    faq: {
      label: "Questions",
      title: "Before we start",
      items: [
        {
          question: "Why aren't prices listed?",
          answer:
            "The same page can be a two-week job or a two-month one, depending on what sits behind it. We scope first, then quote a fixed price for that scope. You will never get an invoice larger than the number you agreed to.",
        },
        {
          question: "Do I own the code?",
          answer:
            "Yes. Full ownership of all source code and design files transfers to you on final payment. No licensing, no lock-in, no hostage hosting.",
        },
        {
          question: "What if I want to leave?",
          answer:
            "You take the repository, infrastructure access, and documentation with you. We'd rather you stay because the work holds up, not because leaving is hard.",
        },
        {
          question: "How long does a project take?",
          answer:
            "A marketing site usually takes two to four weeks. Internal systems depend on scope; you get a timeline with the written scope, before you commit.",
        },
        {
          question: "Do you maintain what you build?",
          answer:
            "Yes, on a monthly retainer covering hosting, monitoring, backups, updates, and a set amount of change work. It's optional.",
        },
        {
          question: "Do you work with clients outside Indonesia?",
          answer: "Yes. We work remotely by default and across time zones.",
        },
      ],
    },
    notes: {
      label: "Notes",
      title: "Notes from the studio",
      body: "Short notes on speed, handovers, and what keeps a website working after launch.",
      button: "Read the notes",
    },
  },

  about: {
    metaTitle: "About Renoir — A small studio that builds and runs the web",
    metaDescription:
      "Renoir, pronounced ren-WAHR, is a small digital studio that keeps design, engineering, and infrastructure on one team.",
    breadcrumb: "About Renoir",
    name: {
      label: "The name",
      title: "A name with a working history",
      pronunciationLabel: "How to say it",
      cardTitle: "Good work takes practice",
      cardBody:
        "Pierre-Auguste Renoir spent his first years painting decoration onto porcelain in a factory — commercial work, paid by the piece, held to a standard. We took the name for that reason. Client work should still be made properly.",
    },
    band: "START A PROJECT · ",
    facts: [
      { value: 1, suffix: "", label: "accountable team" },
      { value: 4, suffix: "", label: "stages, scope to care" },
      { value: 4, suffix: "", label: "ways to work with us" },
      { value: 100, suffix: "%", label: "code ownership at handover" },
    ],
    beliefs: {
      circle: "BUILT TO WORK · MADE TO BE SEEN · ",
      slides: [
        { label: "What we believe · 01", quote: "Software that works and software worth looking at are one requirement, not two." },
        { label: "What we believe · 02", quote: "A site that loads in four seconds isn't finished. Speed and search visibility are part of the spec." },
        { label: "What we believe · 03", quote: "Nothing is delivered until it's running. A repository isn't a deliverable. A URL that stays up is." },
        { label: "What we believe · 04", quote: "Written from scratch beats assembled from parts. Themes are faster to start and slower forever after." },
        { label: "What we believe · 05", quote: "The person who builds it should be the person you talk to." },
      ],
    },
    fit: {
      label: "Fit",
      title: "Who we work best with",
        intro: "Use this to see whether the problem you need solved matches how we work. If it does, tell us what needs fixing.",
        cta: "Discuss your project",
      rows: [
        { text: "Established businesses whose operations outgrew off-the-shelf tools", good: true },
        { text: "Companies whose website undersells them", good: true },
        { text: "Teams that want one accountable party", good: true },
        { text: "Anyone looking for the cheapest possible site", good: false },
        { text: "Template or page-builder work", good: false },
        { text: "Projects with no decision-maker", good: false },
      ],
      goodTag: "Good fit",
      badTag: "Not a fit",
    },
  },

  services: {
    metaTitle: "Services: Design, Websites, Systems and Care | Renoir",
    metaDescription:
      "Explore Renoir's four services: UI/UX and visual identity, marketing sites, custom business systems, and deployment and care.",
    breadcrumb: "Services",
    label: "Services",
    title: "Four services, one accountable studio",
    button: "Start a project",
    includedTitle: "What's included",
    faqTitle: "Questions about this service",
  },

  process: {
    metaTitle: "How We Work — Scope, Design, Build, Deploy & Care | Renoir",
    metaDescription:
      "Four stages, a written scope, a fixed price, and a live staging URL the whole way. See how a project with Renoir runs.",
    breadcrumb: "Process",
    label: "Process",
    title: "From first conversation to handover",
    steps: [
      {
        title: "Scope",
        body: "A conversation about the business problem before anything about technology: what breaks today, what it costs, who decides, and what finished looks like. It ends with a written scope and a fixed price for that scope.",
      },
      {
        title: "Design",
        body: "Structure first, surface second. Information architecture, flows, then interface. You see and approve the design before a line of production code is written.",
      },
      {
        title: "Build",
        body: "Written from scratch against the approved design. You can follow progress on a live staging URL throughout the project.",
      },
      {
        title: "Deploy & care",
        body: "Infrastructure configured, pipeline set up, monitoring and backups in place, domain and SSL live. Handover includes documentation and a walkthrough. Care continues on a retainer, or you take it from there, with full access either way.",
      },
    ],
  },

  notes: {
    metaTitle: "Notes — Building websites that keep working | Renoir",
    metaDescription:
      "Notes from Renoir on website speed, search visibility, handovers, and what keeps web systems working long after launch.",
    breadcrumb: "Notes",
    articleBreadcrumb: "Note",
    readMore: "Read the note",
    by: "by",
    recent: "Recent notes",
    categories: "Topics",
    searchLabel: "Search notes",
    searchPlaceholder: "Search notes",
    share: "Share",
    results: "{count} notes",
    emptyTitle: "No notes match that search",
    emptyBody: "Clear the search or choose another topic to see the notes.",
    clear: "Clear filters",
  },

  contact: {
    metaTitle: "Start a Project — Tell us what's broken | Renoir",
    metaDescription:
      "Tell Renoir what you want to design or build. Share your project details and we will follow up to understand the work before defining a scope.",
    breadcrumb: "Start a project",
    title: "Tell us what you want to change",
    body: "Describe the work you need, whether that is a new identity, an interface, a website, or a system. We will follow up with the questions needed to define it.",
    emailLabel: "Email",
    locationLabel: "Where we work",
    location: "Indonesia — remote worldwide",
    formTitle: "Start a project",
  },

  work: {
    metaTitle: "Websites, Business Systems & UI/UX Work | Renoir",
    metaDescription: "Explore eight projects by the Renoir founder: marketing websites, business systems, UI/UX, and the deployment work that supports them.",
    breadcrumb: "Work",
    label: "Work",
    title: "Work that makes the next step clearer",
    intro: "Eight projects by the Renoir founder, from public websites to the systems and infrastructure behind daily operations.",
    featuredLabel: "Featured work",
    featuredTitle: "Start with these three",
    allLabel: "All work",
    allTitle: "Explore all eight projects",
    searchLabel: "Search work",
    searchPlaceholder: "Search by title, service, or topic",
    filtersLabel: "Filter work by service",
    allServices: "All services",
    services: {
      marketing: "Marketing sites",
      internal: "Internal systems",
      design: "UI/UX & identity",
      care: "Deployment & care",
    },
    results: "{count} projects",
    emptyTitle: "Nothing matches that search",
    emptyBody: "Clear the search or choose another service to see more work.",
    clear: "Clear filters",
    view: "View project",
    details: {
      breadcrumb: "Project breadcrumb",
      mainScreen: "A real screen from the project; the mobile view uses its own composition.",
      demoScreen: "A real application screen captured with sample data.",
      challenge: "The need",
      approach: "What was built",
      role: "Our role",
      screens: "More project screens",
      openDesktop: "Open desktop image",
      openMobile: "Open mobile image",
      openImage: "Open full image",
      websiteCta: "Discuss your website",
      systemCta: "Discuss a similar system",
      information: "Project information",
      services: "Services",
      year: "Year",
      previous: "Previous work",
      next: "Next work",
      navigation: "More work",
      relatedLabel: "Related work",
      relatedTitle: "More work in the same field",
    },
  },
  team: { breadcrumb: "Team" },
};

export default en;
export type Dictionary = typeof en;
