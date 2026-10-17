// Experience content (docs/visual-system.md → Experience → Data shape; copy from docs/content.md →
// Experience).

export type Role = {
  title: string; // "Multi-agent systems intern"
  org: string; // shown as "@ Org"
  start: string; // "2026" or "Jun 2026"
  end?: string; // omit for "Present"
  location: string;
  current?: boolean; // twinkling star
  bullets: string[]; // 1–3
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
      title: "Computer Science Representative Intern",
      org: "PASAE",
      start: "Sep 2023",
      end: "May 2024",
      location: "Berkeley, CA",
      bullets: [
        "Developed intern projects using C++, React.js, and Java, gaining an understanding of software engineering principles.",
        "Used Unreal Engine 5 to learn game development fundamentals, gaining hands-on experience with game mechanics and 3D environments.",
        "Led professional development workshops, such as LinkedIn and LeetCode workshops.",
      ],
      tags: ["C++", "React", "Java", "Unreal Engine 5"],
    },
    {
      title: "Events Coordinator",
      org: "KOSMOS @ Cal",
      start: "May 2024",
      end: "Dec 2024",
      location: "Berkeley, CA",
      bullets: [
        "Partnered with multiple teams in UC Berkeley's dance community to coordinate and host joint socials and events, improving inter-team connectedness.",
        "Organized and executed 2–3 monthly events, coordinating logistics, timelines, and communication across executives and board members, increasing member participation and engagement.",
      ],
      tags: ["Event Planning"],
    },
    {
      title: "Tech Team",
      org: "KOSMOS @ Cal",
      start: "Feb 2024",
      end: "Dec 2024",
      location: "Berkeley, CA",
      bullets: [
        "Edited dance covers and their thumbnails with Lightroom, Premiere Pro, and Final Cut Pro.",
        "Shadowed filmers during recordings of YouTube dance covers, which amassed 1,000+ views within 6 months.",
      ],
      tags: ["Lightroom", "Premiere Pro", "Final Cut Pro"],
    },
  ] satisfies Role[],
};
