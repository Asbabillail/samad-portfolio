import type { Metadata } from "next";
import {
  Activity,
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  Code2,
  FolderGit2,
  GitFork,
  Globe2,
  GraduationCap,
  Layers3,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import styles from "./github.module.css";

export const metadata: Metadata = {
  title: "A4.s03 — Abdul Samad Babillail | GitHub Engineering Portfolio",
  description:
    "A premium GitHub-powered showcase of Abdul Samad Babillail's public engineering projects, infrastructure work, automation, and AI tooling.",
  alternates: { canonical: "https://my-samad-portfolio.vercel.app/github" },
};

const USERNAME = "Asbabillail";
const GITHUB = "https://github.com/Asbabillail";
const PROFILE = `${GITHUB}`;
const PORTFOLIO = "https://my-samad-portfolio.vercel.app/";
const LINKEDIN = "https://www.linkedin.com/in/abdul-samad-babillail-3bb342249/";

type GithubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  followers: number;
  public_repos: number;
};

type GithubRepo = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  archived: boolean;
};

type GithubResult = {
  user: GithubUser | null;
  repos: GithubRepo[];
  unavailable: boolean;
};

type FeaturedProject = {
  slug: string;
  label: string;
  subtitle: string;
  category: string;
  icon: "code" | "layers" | "briefcase" | "shield";
};

const featured: FeaturedProject[] = [
  {
    slug: "apex-universal-ai",
    label: "APEX — Universal AI",
    subtitle: "An experimental, open-source collection of prompt, model, and tool-workflow skills.",
    category: "AI · WORKFLOWS",
    icon: "layers",
  },
  {
    slug: "atlas-engineering-intelligence",
    label: "ATLAS — Engineering Intelligence",
    subtitle: "Modular engineering instructions covering development, architecture, debugging, and quality.",
    category: "ENGINEERING · SKILLS",
    icon: "shield",
  },
  {
    slug: "samad-portfolio",
    label: "SAMAD-OS — Portfolio",
    subtitle: "Next.js and TypeScript portfolio with illustrative technical case studies and interfaces.",
    category: "NEXT.JS · TYPESCRIPT",
    icon: "code",
  },
  {
    slug: "apple-management-architect",
    label: "Apple Management Architect",
    subtitle: "A documentation-preview project for education-focused Apple device administration.",
    category: "MDM · DOCUMENTATION",
    icon: "briefcase",
  },
];

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function safeCount(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.trunc(value)
    : null;
}

function parseUser(payload: unknown): GithubUser | null {
  const p = asRecord(payload);
  if (!p || p.login !== USERNAME) return null;
  const followers = safeCount(p.followers);
  const publicRepos = safeCount(p.public_repos);
  if (followers === null || publicRepos === null) return null;
  return {
    login: USERNAME,
    name: typeof p.name === "string" ? p.name : null,
    avatar_url:
      typeof p.avatar_url === "string" && p.avatar_url.startsWith("https://avatars.githubusercontent.com/")
        ? p.avatar_url
        : "",
    html_url: GITHUB,
    followers,
    public_repos: publicRepos,
  };
}

function parseRepos(payload: unknown): GithubRepo[] {
  if (!Array.isArray(payload)) return [];
  return payload.flatMap((item: unknown) => {
    const p = asRecord(item);
    if (!p || typeof p.name !== "string" || !/^[a-zA-Z0-9._-]+$/.test(p.name)) return [];
    const stars = safeCount(p.stargazers_count);
    const forks = safeCount(p.forks_count);
    if (stars === null || forks === null) return [];
    return [{
      name: p.name,
      html_url: `${GITHUB}/${p.name}`,
      description: typeof p.description === "string" ? p.description : null,
      stargazers_count: stars,
      forks_count: forks,
      language: typeof p.language === "string" ? p.language : null,
      fork: p.fork === true,
      archived: p.archived === true,
    }];
  });
}

async function getGitHubJSON(url: string): Promise<unknown | null> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

async function getGithubData(): Promise<GithubResult> {
  const [userRaw, reposRaw] = await Promise.all([
    getGitHubJSON(`https://api.github.com/users/${USERNAME}`),
    getGitHubJSON(`https://api.github.com/users/${USERNAME}/repos?type=owner&sort=updated&per_page=100`),
  ]);
  return {
    user: parseUser(userRaw),
    repos: parseRepos(reposRaw),
    unavailable: userRaw === null || !Array.isArray(reposRaw),
  };
}

function prettyNumber(value: number | null): string {
  return value === null ? "—" : new Intl.NumberFormat("en-US").format(value);
}

function ProjectSymbol({ type }: { type: FeaturedProject["icon"] }) {
  switch (type) {
    case "code": return <Code2 size={23} aria-hidden="true" />;
    case "layers": return <Layers3 size={23} aria-hidden="true" />;
    case "shield": return <ShieldCheck size={23} aria-hidden="true" />;
    case "briefcase": return <BriefcaseBusiness size={23} aria-hidden="true" />;
  }
}

function ProfileSidebar({ avatar }: { avatar: string }) {
  return (
    <aside className={styles.sidebar} aria-label="Profile and contact">
      <div className={styles.profileCard}>
        <div className={styles.avatarWrap}>
          <div
            className={styles.avatar}
            style={avatar ? { backgroundImage: `url("${avatar}")` } : undefined}
            role="img"
            aria-label={avatar ? "Actual GitHub profile avatar of Abdul Samad Babillail" : "A4.s03 monogram"}
          >
            {avatar ? null : "AS"}
          </div>
          <span className={styles.status} aria-hidden="true" />
        </div>
        <h2 className={styles.fullName}>Abdul Samad Babillail</h2>
        <p className={styles.handle}>@Asbabillail · A4.s03</p>
        <div className={styles.availability}>● &nbsp; Engineering &amp; business</div>
        <p className={styles.about}>
          Infrastructure and automation practitioner working across enterprise IT,
          business requirements, and practical software and AI tooling.
        </p>
        <div className={styles.metaItem}><MapPin size={14} aria-hidden="true" /> Saudi Arabia</div>
        <div className={styles.rule} />
        <nav className={styles.quickLinks} aria-label="Professional links">
          <a className={styles.quickLink} href={PORTFOLIO} target="_blank" rel="noopener noreferrer">
            <Globe2 size={16} aria-hidden="true" /> Main portfolio <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a className={styles.quickLink} href={LINKEDIN} target="_blank" rel="noopener noreferrer">
            <BriefcaseBusiness size={16} aria-hidden="true" /> LinkedIn <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a className={styles.quickLink} href={`${PROFILE}#course-completion--certifications`} target="_blank" rel="noopener noreferrer">
            <Award size={16} aria-hidden="true" /> Certificates <ArrowUpRight size={14} aria-hidden="true" />
          </a>
          <a className={styles.quickLink} href={GITHUB} target="_blank" rel="noopener noreferrer">
            <Code2 size={16} aria-hidden="true" /> GitHub profile <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </nav>
        <p className={styles.smallBrand}>A4.s03 · ENGINEERING IDENTITY</p>
      </div>
    </aside>
  );
}

export default async function GithubDashboardPage() {
  const data = await getGithubData();
  const { user, repos } = data;
  const repoComplete = user !== null && repos.length >= user.public_repos;
  const repoByName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));
  const totalStars = repoComplete ? repos.reduce((sum, r) => sum + r.stargazers_count, 0) : null;
  const totalForks = repoComplete ? repos.reduce((sum, r) => sum + r.forks_count, 0) : null;
  const perLanguage = new Map<string, number>();
  for (const repo of repos.filter((r) => !r.fork)) {
    if (!repo.language) continue;
    perLanguage.set(repo.language, (perLanguage.get(repo.language) ?? 0) + 1);
  }
  const languageList = [...perLanguage.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const languageTotal = [...perLanguage.values()].reduce((a, b) => a + b, 0);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <ProfileSidebar avatar={user?.avatar_url ?? ""} />
        <div className={styles.main}>
          <header className={styles.hero}>
            <div className={styles.eyebrow}><Code2 size={19} aria-hidden="true" /> ABDUL SAMAD BABILLAIL · A4.s03</div>
            <h1 className={styles.heroTitle}>Infrastructure <span aria-hidden="true">·</span> Automation <span aria-hidden="true">·</span> AI</h1>
            <p className={styles.heroSub}>Business Development &nbsp;·&nbsp; Design &nbsp;·&nbsp; Build &nbsp;·&nbsp; Manage</p>
            <div className={styles.chipRow} aria-label="Professional practice areas">
              <span className={styles.chip}>Microsoft 365</span>
              <span className={styles.chip}>Apple &amp; Jamf</span>
              <span className={styles.chip}>Intune</span>
              <span className={styles.chip}>Fortinet</span>
              <span className={styles.chip}>EduTech</span>
            </div>
            <div className={styles.heroMark} aria-hidden="true"><div className={styles.heroMarkInner}><Code2 size={60} strokeWidth={1.7} /></div></div>
            <span className={styles.signature}>PERSONAL ENGINEERING WORK / 2026</span>
          </header>

          {data.unavailable && (
            <p className={styles.loadMessage} role="status">
              GitHub&apos;s public API is temporarily unavailable. Live counts are hidden rather than substituted with invented figures.
            </p>
          )}

          <section className={styles.contentSection} aria-labelledby="selected-work">
            <div className={styles.sectionHeader}>
              <h2 id="selected-work" className={styles.sectionTitle}>Selected engineering projects</h2>
              <a className={styles.smallLink} href={`${GITHUB}?tab=repositories`} target="_blank" rel="noopener noreferrer">
                Explore all <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            <div className={styles.projectGrid}>
              {featured.map((project) => {
                const repo = repoByName.get(project.slug);
                return (
                  <a key={project.slug} className={styles.projectCard} href={repo?.html_url ?? `${GITHUB}/${project.slug}`} target="_blank" rel="noopener noreferrer">
                    <div className={styles.projectTop}>
                      <div className={styles.projectIcon}><ProjectSymbol type={project.icon} /></div>
                      <div>
                        <h3 className={styles.projectName}>{project.label} <ArrowUpRight size={13} aria-hidden="true" /></h3>
                        <p className={styles.projectDescription}>{project.subtitle}</p>
                      </div>
                    </div>
                    <div className={styles.projectFooter}>
                      <span className={styles.tag}>{project.category}</span>
                      <span className={styles.repoNumbers}>
                        {repo && <span aria-label={`${repo.stargazers_count} stars`}><Star size={13} aria-hidden="true" />{prettyNumber(repo.stargazers_count)}</span>}
                        {repo && <span aria-label={`${repo.forks_count} forks`}><GitFork size={13} aria-hidden="true" />{prettyNumber(repo.forks_count)}</span>}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          <section className={styles.contentSection} aria-labelledby="github-numbers">
            <div className={styles.sectionHeader}>
              <h2 id="github-numbers" className={styles.sectionTitle}>GitHub at a glance</h2>
              <span className={styles.smallLink}>Public API · refreshes hourly</span>
            </div>
            <div className={styles.metricGrid}>
              {[
                { label: "Public repositories", value: user?.public_repos ?? null, icon: FolderGit2, note: "GitHub account" },
                { label: "Stars received", value: totalStars, icon: Star, note: "Across public repositories" },
                { label: "Repository forks", value: totalForks, icon: GitFork, note: "Across public repositories" },
                { label: "Followers", value: user?.followers ?? null, icon: Users, note: "GitHub account" },
              ].map((metric) => (
                <article className={styles.metric} key={metric.label}>
                  <div className={styles.metricLabel}><metric.icon size={15} aria-hidden="true" /> {metric.label}</div>
                  <div className={styles.metricValue}>{prettyNumber(metric.value)}</div>
                  <div className={styles.metricFoot}>{metric.note}</div>
                </article>
              ))}
            </div>
          </section>

          <div className={styles.lowerGrid}>
            <section className={styles.panel} aria-labelledby="language-title">
              <div className={styles.panelHead}><Layers3 size={19} aria-hidden="true" /><h2 id="language-title">Repository technology mix</h2></div>
              {languageList.length ? languageList.map((row) => {
                const share = Math.round(row.count / languageTotal * 100);
                return (
                  <div className={styles.languageRow} key={row.name}>
                    <div className={styles.languageTop}><span>{row.name}</span><span>{row.count} {row.count === 1 ? "repo" : "repos"} · {share}%</span></div>
                    <div className={styles.languageBar} role="meter" aria-label={`${row.name} repositories`} aria-valuenow={share} aria-valuemin={0} aria-valuemax={100}>
                      <div className={styles.languageFill} style={{ width: `${share}%` }} />
                    </div>
                  </div>
                );
              }) : <p className={styles.mutedText}>Language data will appear when GitHub&apos;s public API is accessible.</p>}
              <p className={styles.mutedText}>Percentage of public, non-fork repositories whose <em>primary</em> language is known. Not a measure of lines of code or expertise.</p>
            </section>

            <section className={styles.panel} aria-labelledby="activity-title">
              <div className={styles.panelHead}><Activity size={19} aria-hidden="true" /><h2 id="activity-title">Contribution activity</h2></div>
              <div className={styles.activityCard}>
                <Activity className={styles.activityIcon} aria-hidden="true" />
                <strong>Real contribution history</strong>
                <p>Explore verified GitHub activity and the contribution calendar on the original profile. No simulated heatmaps or made-up contribution counts.</p>
                <a className={styles.primaryLink} href={PROFILE} target="_blank" rel="noopener noreferrer">
                  View GitHub contributions <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </section>
          </div>

          <section className={styles.callout} aria-label="Credentials and projects">
            <div>
              <strong>Professional learning, documented.</strong>
              <p>Explore the full gallery of certificate images, technical learning, and appreciation records on GitHub.</p>
            </div>
            <a className={styles.primaryLink} href={`${PROFILE}#course-completion--certifications`} target="_blank" rel="noopener noreferrer">
              <GraduationCap size={16} aria-hidden="true" /> Certificates <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </section>
          <footer className={styles.footer}>
            <span>A4.s03 · Abdul Samad Babillail · An independently built personal showcase</span>
            <a href={GITHUB} target="_blank" rel="noopener noreferrer">Data: public GitHub API <ArrowUpRight size={12} aria-hidden="true" /></a>
          </footer>
        </div>
      </div>
    </main>
  );
}
