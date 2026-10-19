import {
  siApple, siCisco, siFortinet, siGithub,
  siMicrosoft, siNextdotjs, siPython, siGooglecloud,
  type SimpleIcon,
} from 'simple-icons';

const ecosystem: { name: string; icon: SimpleIcon; color: string; category: string }[] = [
  { name: 'Microsoft', icon: siMicrosoft, color: '#69A9FF', category: 'Cloud & workplace' },
  { name: 'Apple', icon: siApple, color: '#EEE8F5', category: 'Device ecosystem' },
  { name: 'Cisco', icon: siCisco, color: '#4FC8F1', category: 'Networking' },
  { name: 'Fortinet', icon: siFortinet, color: '#FF776F', category: 'Network security' },
  { name: 'Google Cloud', icon: siGooglecloud, color: '#FDD36F', category: 'Cloud platforms' },
  { name: 'Python', icon: siPython, color: '#C5E75D', category: 'Automation' },
  { name: 'Next.js', icon: siNextdotjs, color: '#E1D6FD', category: 'Application development' },
  { name: 'GitHub', icon: siGithub, color: '#C4B5FD', category: 'Development workflow' },
];

export default function BrandWall() {
  return (
    <section aria-labelledby="ecosystem-heading" className="relative overflow-hidden border-y border-white/[0.09] bg-[#0c0d15] px-6 py-12 sm:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-[#bbadff]">Tech DNA / The toolkit</p>
            <h2 id="ecosystem-heading" className="text-xl font-medium tracking-tight text-white sm:text-2xl">The platforms behind the thinking.</h2>
          </div>
          <p className="max-w-xs text-xs leading-6 text-[#85869a]">Technologies across my professional background and independent software projects.</p>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4 lg:grid-cols-8">
          {ecosystem.map(({ name, icon, color, category }) => (
            <div key={name} className="group relative flex min-h-[124px] flex-col items-center justify-center gap-3 bg-[#10121c] px-3 py-5 transition-colors duration-300 hover:bg-[#1e1b31]">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-110" fill={color}>
                <path d={icon.path} />
              </svg>
              <span className="text-center text-xs font-semibold tracking-tight text-[#e9e7f1]">{name}</span>
              <span className="sr-only">{category}</span>
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-4 bottom-0 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-[#baa8ff] to-transparent transition-transform duration-500 group-hover:scale-x-100" />
            </div>
          ))}
        </div>
        <p className="mt-5 text-[10px] leading-5 text-[#6c6e81]">Brand marks identify technologies only; no affiliation or endorsement is implied.</p>
      </div>
    </section>
  );
}
