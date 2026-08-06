import type { SiteContent } from "./types";

// Seed content — the data that previously lived hardcoded inside the section
// components. Served whenever no content.json exists in Blob storage (e.g.
// local dev without a BLOB_READ_WRITE_TOKEN), and used to seed the first save.

export const DEFAULT_CONTENT: SiteContent = {
  projects: [
    {
      // NOTE: needs a screenshot at public/cruze.png — the schema requires `image`, and no
      // asset exists yet. Add the GitHub URL here (or via /admin/projects) once it's public.
      id: "cruze",
      name: "Cruze",
      tag: "Computer Vision · Real-time · Edge AI",
      description:
        "Vision-first driving co-pilot built as an async pub/sub pipeline (camera → detection → depth → tracking → scene → rules → voice), so each perception stage stays decoupled and independently testable. Flags forward collisions under a 3s time-to-collision, plus tailgating, speeding, and stop signs. A hardware-abstraction layer swaps YOLOv8 CPU, TensorRT on Jetson, and TFLite on Raspberry Pi with a one-line config change.",
      tech: ["Python", "YOLOv8", "OpenCV", "TensorRT", "TFLite", "faster-whisper", "Piper", "Claude API"],
      year: 2026,
      status: "In progress",
      image: "/cruze.png",
    },
    {
      id: "karyaai",
      name: "KaryaAI",
      tag: "MERN Stack · Productivity",
      description: "Task manager with JWT auth, MongoDB syncing, and AI-powered task sorting.",
      tech: ["React", "Node.js", "MongoDB", "Express", "Tailwind"],
      github: "https://github.com/RavangDai/SmartTodo",
      live: "https://karyaai.vercel.app/",
      year: 2026,
      status: "Completed",
      image: "/KaryaAI.png",
      video: "https://youtu.be/sQ7IdpM0jQg",
    },
    {
      id: "crumbcraft",
      name: "CrumbCraft",
      tag: "Full-stack · AI · Productivity",
      description:
        "Two AI-powered dev tools in one: Crumb compresses messy conversations into structured docs, Craft helps engineer precise AI prompts with guided templates.",
      tech: ["Next.js", "React", "Tailwind CSS", "Gemini 2.5", "Framer Motion"],
      github: "https://github.com/RavangDai/crumb",
      live: "https://crumbcrraft.vercel.app/",
      year: 2026,
      status: "Completed",
      image: "/CrumbCraft.png",
    },
    {
      // The GitHub repo is still named "car-deal" — a leftover from the car-deal-finder this
      // pivoted from. Same repo, different product. The deal math is deliberately deterministic
      // statistics, not ML; don't reintroduce XGBoost/LightGBM here.
      id: "wasitcheaper",
      name: "WasItCheaper",
      tag: "Full-stack · AI · Price intelligence",
      description:
        "Paste any product URL and it tracks the real price daily, building an append-only price history. Deals are scored against the last 90 days, so a store that inflates a price for three weeks then drops it back to baseline scores near zero instead of looking like a sale. Structured-data extraction with a Claude API fallback, Celery-beat rechecks, email alerts, and dependency-free step-after SVG charts.",
      tech: ["FastAPI", "React 19", "PostgreSQL", "Celery", "Redis", "Claude API", "TanStack Query", "Docker"],
      github: "https://github.com/RavangDai/car-deal",
      year: 2026,
      status: "In progress",
      image: "/wasitcheaper.png",
    },
    {
      id: "vectorvance",
      name: "VectorVance",
      tag: "Raspberry Pi · Computer Vision · Robotics",
      description:
        "Autonomous car prototyped in Python simulation, then deployed to Raspberry Pi. Vector-based navigation and pathfinding steer it around dynamic obstacles, SSD MobileNet reads traffic signs and colour-coded forks, and live telemetry streams to a web dashboard.",
      tech: ["Python", "OpenCV", "Flask", "Raspberry Pi", "SSD MobileNet", "PID Control", "NumPy", "lgpio"],
      github: "https://github.com/RavangDai/VectorVance",
      year: 2025,
      status: "Completed",
      image: "/vvdash.png",
    },
    {
      id: "buzzboard",
      name: "BuzzBoard",
      tag: "Node.js · Express · MongoDB",
      description:
        "Message board app with topic subscriptions, recent-message dashboard, posting, stats, and MVC, Observer, and Singleton pattern implementations over MongoDB.",
      tech: ["Node.js", "Express", "MongoDB", "Mongoose", "Handlebars", "bcryptjs", "express-session", "MVC", "Observer", "Singleton"],
      github: "https://github.com/RavangDai/Buzzboard",
      live: "https://buzzboard-fk7m.onrender.com/auth/login",
      year: 2026,
      status: "Completed",
      image: "/BuzzBoard.png",
    },
  ],

  certificates: [
    {
      id: "hackerrank-software-engineer",
      title: "Software Engineer Certificate",
      issuer: "HackerRank",
      year: 2025,
      category: "Full-stack Engineering",
      summary: "Role certification covering problem solving, REST APIs, full-stack structure, and data structures.",
      skills: ["Problem Solving", "REST APIs", "Full-stack", "Data Structures"],
      image: "/certificates/software-engineer-crop.png",
      url: "https://www.hackerrank.com/certificates/iframe/1ec7df9efdd8",
      icon: "Code2",
      featured: true,
    },
    {
      id: "hackerrank-sql-advanced",
      title: "SQL (Advanced) Certificate",
      issuer: "HackerRank",
      year: 2025,
      category: "Data / Backend",
      summary: "Advanced SQL certification covering query optimization, indexing, joins, subqueries, and pivots.",
      skills: ["Complex Queries", "Indexing", "Joins", "Performance"],
      image: "/certificates/sql-advanced-crop.png",
      url: "https://www.hackerrank.com/certificates/a0f6fb1fb4af",
      icon: "Database",
    },
    {
      id: "simplilearn-tableau",
      title: "Introduction to Tableau",
      issuer: "Simplilearn · SkillUp",
      year: 2025,
      category: "Data Visualization",
      summary: "Completion course covering interactive dashboards, charts, and visual analytics workflows in Tableau.",
      skills: ["Tableau", "Data Visualization", "Dashboards", "Analytics"],
      image: "/tablue certificate.png",
      url: "https://www.simplilearn.com/skillup-certificate-landing?token=eyJjb3Vyc2VfaWQiOiI0MDY4IiwiY2VydGlmaWNhdGVfdXJsIjoiaHR0cHM6XC9cL2NlcnRpZmljYXRlcy5zaW1wbGljZG4ubmV0XC9zaGFyZVwvODAyNTU5NV84MzQyNzMxMTc0MTY2MzI1OTE1OC5wbmciLCJ1c2VybmFtZSI6IkJpYmVrIFBhdGhhayJ9&referrer=https%3A%2F%2Flms.simplilearn.com%2Fcourses%2F7062%2FIntroduction-to-Tableau%2Fcertificate%2Fdownload-skillup&%24web_only=true",
      icon: "BarChart3",
    },
    {
      id: "cfi-excel-finance",
      title: "Excel Fundamentals - Finance",
      issuer: "Corporate Finance Institute",
      year: 2024,
      category: "Finance & Analysis",
      summary: "Finance-focused Excel credential covering formulas, analysis workflows, and structured spreadsheet modeling.",
      skills: ["Excel Formulas", "Financial Modeling", "Data Analysis", "Pivot Tables"],
      image: "/certificates/excel-finance-crop.png",
      url: "https://credentials.corporatefinanceinstitute.com/88b6efc3-2491-4e1d-9e12-433819361baa",
      icon: "Table2",
    },
  ],

  achievements: [
    {
      id: "hacklions-2026",
      date: "Apr 2026",
      title: "1st Place · HackLions 2026",
      org: "SELU 1st Hackathon",
      category: "Competition",
      desc: "Won SELU's hackathon by building DollarPilot, a finance app that makes money management fun and brutal, shipped from zero in 6 hours.",
      icon: "Trophy",
      highlight: true,
      url: "https://devpost.com/software/dollarpilot",
    },
    {
      id: "honors-scholarship",
      date: "Fall 2024",
      title: "Honors Scholarship",
      org: "Southeastern Louisiana University",
      category: "Academic",
      desc: "Honors Scholarship recipient at Southeastern Louisiana University, where I'm finishing a B.S. in Information Technology in May 2028.",
      icon: "Star",
    },
    {
      id: "hackerrank-se-cert",
      date: "2025",
      title: "Software Engineer Certificate",
      org: "HackerRank",
      category: "Certification",
      desc: "Timed role certification covering problem solving, REST API design, full-stack structure, and data structures.",
      icon: "Code2",
      url: "https://www.hackerrank.com/certificates/iframe/1ec7df9efdd8",
    },
    {
      id: "hackerrank-sql-cert",
      date: "2025",
      title: "SQL (Advanced) Certificate",
      org: "HackerRank",
      category: "Certification",
      desc: "Advanced tier: window functions, complex joins, subqueries, indexing, and query performance tuning.",
      icon: "Zap",
      url: "https://www.hackerrank.com/certificates/a0f6fb1fb4af",
    },
    {
      id: "cfi-excel-cert",
      date: "2024",
      title: "Excel Fundamentals – Finance",
      org: "Corporate Finance Institute®",
      category: "Certification",
      desc: "Completed CFI's program covering financial modeling, pivot tables, Excel formulas, and data analysis for finance.",
      icon: "BookOpen",
      url: "https://credentials.corporatefinanceinstitute.com/88b6efc3-2491-4e1d-9e12-433819361baa",
    },
  ],

  stats: [
    { value: "10+", label: "Projects Shipped" },
    { value: "3.5+", label: "GPA" },
    { value: "1/1", label: "Hackathon Win Rate" },
    { value: "4", label: "Certifications" },
  ],

  site: {
    heroLine1: "Full-Stack Builder",
    heroLine2: "AI / ML Developer",
    builderLine1: "10+ shipped projects across full-stack web,",
    builderLine2: "applied AI, and computer vision.",
    email: "drbibekg2029@gmail.com",
    githubUrl: "https://github.com/RavangDai",
    linkedinUrl: "https://www.linkedin.com/in/bibek-pathak-10398a301/",
    resumeUrl: "/Bibek_Pathak_Resume_June26.pdf",
  },
};
