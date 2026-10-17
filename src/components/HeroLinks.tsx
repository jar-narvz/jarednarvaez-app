import { links } from "@/data/links";
import { FileTextIcon, GithubIcon, LinkedinIcon, MailIcon } from "@/icons/lineIcons";

// Hero link buttons (Jared, 2026-10-17, option A; Drew's hero row as the reference): GitHub,
// LinkedIn, résumé, email under the "currently" line. 44px circles in the tech stack pill material
// (plum tint at 34%, 1px ink border at 38%), 18px line icons at ~82% ink; hover turns the icon and
// border accent (200ms). Smaller and dimmer than the name, which stays the only focal point.

const HERO_LINKS = [
  { label: "GitHub", href: links.github, Icon: GithubIcon },
  { label: "LinkedIn", href: links.linkedin, Icon: LinkedinIcon },
  { label: "Résumé", href: links.resume, Icon: FileTextIcon },
  { label: "Email", href: `mailto:${links.email}`, Icon: MailIcon },
];

export default function HeroLinks() {
  return (
    <ul role="list" className="flex flex-wrap gap-3">
      {HERO_LINKS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            // Email opens a mail draft in place; the rest open in a new tab so the site stays open.
            {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            aria-label={label}
            className="flex size-11 items-center justify-center rounded-full border border-ink/38 bg-tint/34 text-ink/82 transition-colors duration-200 ease-out hover:border-accent/60 hover:text-accent motion-reduce:transition-none"
          >
            <Icon size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}
