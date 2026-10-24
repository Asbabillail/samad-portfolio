import { Award, BookOpenCheck } from "lucide-react";

type Credential = {
  title: string;
  issuer: string;
  detail: string;
  kind: "Professional certification" | "Course completion" | "Training completion" | "Virtual job simulation";
};

const credentials: Credential[] = [
  {
    title: "Google Certified Educator — Level 1",
    issuer: "Google for Education",
    detail: "Issued Feb 2026 · Valid through Feb 2029",
    kind: "Professional certification",
  },
  {
    title: "Active Learning on SMART MX-V5 Display with iQ 4",
    issuer: "SMART Technologies",
    detail: "Completed Jan 2026",
    kind: "Training completion",
  },
  {
    title: "Learn CCNA 200-301 Network Fundamentals Online",
    issuer: "Simplilearn",
    detail: "Completed Sep 2023 · Networking course, not the Cisco CCNA exam",
    kind: "Course completion",
  },
  {
    title: "Data Science with Python",
    issuer: "Simplilearn",
    detail: "Completed Aug 2023",
    kind: "Course completion",
  },
  {
    title: "Introduction to Data Visualization",
    issuer: "Simplilearn",
    detail: "Completed Sep 2023",
    kind: "Course completion",
  },
  {
    title: "Microsoft Excel for Data Analysis",
    issuer: "Udemy",
    detail: "Completed Feb 2024",
    kind: "Course completion",
  },
  {
    title: "Technical Consulting Virtual Internship",
    issuer: "SAP / Forage",
    detail: "Completed Aug 2023 · Online job simulation",
    kind: "Virtual job simulation",
  },
];

export default function CertificationsSection() {
  return (
    <section id="certifications" className="relative z-20 px-6 py-16" aria-labelledby="certifications-heading">
      <div className="mx-auto max-w-6xl">
        <div className="mb-9 max-w-3xl">
          <p className="mb-2 text-xs font-mono uppercase tracking-[0.22em] text-teal-400">
            Verified Learning &amp; Credentials
          </p>
          <h2 id="certifications-heading" className="mb-3 text-3xl font-bold tracking-tight text-white">
            Certifications &amp; Professional Development
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            Selected certificates and learning records, with credential types clearly distinguished.
            The original documents are not embedded publicly.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {credentials.map((credential) => (
            <article
              key={credential.title}
              className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/70 p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-teal-800/50 bg-teal-950/40 text-teal-300">
                {credential.kind === "Professional certification" ? (
                  <Award className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-teal-300">
                  {credential.kind}
                </p>
                <h3 className="font-semibold leading-snug text-zinc-100">{credential.title}</h3>
                <p className="text-sm text-zinc-300">{credential.issuer}</p>
                <p className="text-xs leading-relaxed text-zinc-400">{credential.detail}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-5">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-white">
            <Award className="h-4 w-4 text-teal-300" aria-hidden="true" />
            Professional Recognition
          </h3>
          <p className="text-sm leading-relaxed text-zinc-400">
            SMART Education Certificate of Appreciation (Nov 2025) ·
            Yenepoya International School Certificate of Appreciation (Aug 2025).
          </p>
        </div>
      </div>
    </section>
  );
}
