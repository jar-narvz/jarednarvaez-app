// Experience content (docs/visual-system.md → Experience → Data shape; copy from docs/content.md →
// Experience).

export type Role = {
  title: string; // "Multi-agent systems intern"
  org: string; // shown as "@ Org"
  start: string; // "2026" or "Jun 2026"
  end?: string; // omit for "Present"
  location: string;
  current?: boolean; // twinkling star
  bullets: string[]; // 1–3 (the Berkeley entry lists its coursework instead)
  tags?: string[]; // tech tags under the bullets; omit for non-technical roles
};

export const experience = {
  label: "experience",
  heading: "what i've done",
  // Newest first. Only PhysaFlow is current, so one star twinkles; other roles with no end date
  // still read "Present".
  roles: [
    {
      title: "Multi-Agent Systems & Agentic Product Engineer Intern",
      org: "PhysaFlow",
      start: "Oct 2026",
      location: "San Francisco Bay Area (remote)",
      current: true,
      bullets: [
        "Ramping up on a startup's multi-agent product codebase, studying agent architecture, orchestration, and tool integration ahead of contributing to agentic product features.",
      ],
      tags: ["Multi-Agent Systems", "Python", "Systems Design", "Software Architecture"],
    },
    {
      title: "Data Assistant",
      org: "UC Berkeley, Visiting Scholar & Postdoc Affairs",
      start: "Jun 2026",
      location: "Berkeley, CA",
      bullets: [
        "Maintain and audit 2,000+ scholar and postdoc records across internal databases, validating incoming submissions for accuracy and completeness to keep institutional records audit-ready for quarterly compliance reviews.",
        "Built automated reporting and validation workflows, replacing manual data handling with reusable spreadsheet logic and integrity checks.",
        "Maintain the department's public-facing website, transforming institutional data for 3 scholar populations into demographic, diversity, and career-outcome visualizations and dashboards on a biannual refresh cycle.",
      ],
      tags: ["Data Validation", "Google Sheets", "Tableau"],
    },
    {
      title: "Vice President of External Relations",
      org: "PASAE",
      start: "Apr 2025",
      location: "Berkeley, CA",
      bullets: [
        "Led semester-long recruitment pipeline (tabling, info sessions, kickoffs) and co-organized UC Berkeley career fairs hosting 90+ employers and 2,000+ students; secured speakers and sponsors for flagship events.",
        "Managed and mentored a team of External Reps and interns: ran weekly standups, scoped workstreams, and created onboarding playbooks.",
        "Served as a career development resource for 60+ active members.",
      ],
    },
    {
      title: "Computer Science Representative & Webmaster",
      org: "PASAE",
      start: "May 2024",
      end: "May 2025",
      location: "Berkeley, CA",
      bullets: [
        "Academic liaison to CDSS and EECS students, providing them with academic resources and industry opportunities.",
        "Spearheaded semester-long projects with a team of 3 interns, mentoring them to build personal websites in React.js and teaching game development fundamentals in Unreal Engine 5.",
        "Managed PASAE's website, enhancing user experience and improving student access to resources and networking.",
      ],
      tags: ["React", "Java", "C++", "Unreal Engine 5", "Web Design"],
    },
    {
      title: "Computer Science Major, Data Science Minor",
      org: "University of California, Berkeley",
      start: "Aug 2023",
      end: "May 2027",
      location: "Berkeley, CA",
      // Relevant coursework from Jared's résumé, one course per bullet.
      bullets: [
        "Structure & Interpretation of Computer Programs (Python, SQL)",
        "Data Structures (Java)",
        "Great Ideas of Computer Architecture (Machine Structures)",
        "Foundations of Data Science",
        "Principles and Techniques of Data Science",
        "Computer Security",
        "Introduction to the Internet: Architecture and Protocols",
        "Introduction to Artificial Intelligence",
      ],
    },
  ] satisfies Role[],
};
