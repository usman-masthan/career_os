/**
 * @typedef {{slug:string,title:string,summary:string,impact:string,tags:string[],challenge:string,approach:string,outcome:string}} Project
 * @typedef {{profile:{name:string,mark:string,role:string,location:string,summary:string,availability:string},projects:Project[],skills:{group:string,items:string[]}[],experience:{period:string,role:string,organisation:string,detail:string}[],credentials:{date:string,title:string,issuer:string}[],research:{title:string,status:string,abstract:string}[]}} CareerContent
 */

/** @type {CareerContent} */
export const content = {
  profile: {
    name: "Ahamed Usman", mark: "AU.SEC", role: "Cybersecurity Engineer · Security Researcher",
    image: "/profile.jpeg",
    location: "Sri Lanka · Open to remote", availability: "Available for selected opportunities",
    summary: "I secure modern systems by turning complex risk into clear, practical engineering decisions. This is my living record of security projects, research, credentials, and measurable outcomes."
  },
  projects: [
    { slug: "career-os", title: "CareerOS", summary: "An evidence-first career platform that turns projects, learning, and outcomes into a navigable professional record.", impact: "One source of truth for career evidence", tags: ["Next.js", "Supabase", "Product systems"], challenge: "Portfolios often become static galleries that separate claims from their evidence.", approach: "I designed a structured content model and two reading modes: an exploratory portfolio and a focused 60-second recruiter view.", outcome: "A maintainable system where projects, credentials, research, and writing build one coherent professional narrative." },
    { slug: "signal-lab", title: "Signal Lab", summary: "A research workspace for testing, comparing, and communicating machine-learning experiments.", impact: "Faster path from experiment to decision", tags: ["Python", "Machine learning", "Data visualisation"], challenge: "Experiment context and decisions are easily lost across notebooks.", approach: "I modelled repeatable runs, evaluation notes, and readable result summaries around the research workflow.", outcome: "A clearer audit trail and a more useful bridge between technical results and product decisions." },
    { slug: "access-map", title: "Access Map", summary: "A responsive, accessibility-led service discovery concept built for constrained devices and connections.", impact: "Designed for inclusive, low-friction access", tags: ["React", "Accessibility", "Service design"], challenge: "People need reliable service information even with older devices, limited bandwidth, or assistive technology.", approach: "I prioritised semantic navigation, resilient layouts, concise content, and progressive enhancement.", outcome: "A reusable interface direction centred on speed, clarity, keyboard access, and small-screen usability." }
  ],
  skills: [
    { group: "Engineering", items: ["JavaScript / TypeScript", "React & Next.js", "Node.js", "Python", "SQL & Supabase"] },
    { group: "AI & data", items: ["Applied machine learning", "Data analysis", "Experiment design", "Responsible AI"] },
    { group: "Practice", items: ["System design", "Accessible UI", "Product discovery", "Technical writing"] }
  ],
  experience: [
    { period: "Present", role: "Independent Software Engineer", organisation: "Ahamed.dev", detail: "Building human-centred web and AI systems, from product framing through reliable delivery." },
    { period: "Ongoing", role: "Research & open-source practice", organisation: "Independent", detail: "Exploring applied ML, accessible software, and better ways to communicate engineering evidence." }
  ],
  credentials: [
    { date: "2026", title: "CareerOS — continuous professional development", issuer: "Ahamed.dev" },
    { date: "2025", title: "Applied AI & responsible product practice", issuer: "Independent study" }
  ],
  research: [
    { title: "Evidence-aware professional knowledge systems", status: "Active inquiry", abstract: "How structured evidence and intentional interfaces can make professional capability easier to assess and maintain." },
    { title: "Human-readable evaluation for applied AI", status: "Working notes", abstract: "Patterns for translating model performance, limitations, and decisions into useful product communication." }
  ]
};

export const navigation = ["About", "Projects", "Experience", "Research", "Skills", "Credentials", "Achievements", "Writing", "Contact"];
