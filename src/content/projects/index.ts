// Project detail essays (/projects/[slug]), one MDX file per story. Explicit imports so the
// bundler sees every file; a template-literal import would pull in the whole folder.
export const STORIES: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "posting-triage": () => import("./posting-triage.mdx"),
  "route-impact": () => import("./route-impact.mdx"),
  "secure-file-sharing": () => import("./secure-file-sharing.mdx"),
  "character-gpt": () => import("./character-gpt.mdx"),
};
