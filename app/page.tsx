// import Link from 'next/link';
// import Container from '../components/Container';
// import SectionHeader from '../components/SectionHeader';
// import { site } from '../content/site';
// import { focusAreas } from '../content/focus';
// import { publications } from '../content/publications';
// import { principalInvestigator, team } from '../content/team';

// export default function HomePage() {
//   const featuredPubs = publications
//     .slice()
//     .sort((a, b) => b.year - a.year)
//     .slice(0, 2);

//   return (
//     <div>
//       {/* Hero */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-black py-20 text-white sm:py-28">
//         <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-secondary/30 blur-3xl" />
//         <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />

//         <Container>
//           <div className="mx-auto max-w-3xl">
//             <p className="text-sm font-semibold tracking-wide text-white/80">{site.institution}</p>
//             <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
//               {site.tagline}
//             </h1>
//             <p className="mt-6 font-serif text-lg leading-relaxed text-white/80 sm:text-xl">
//               {site.description}
//             </p>

//             <div className="mt-10 flex flex-wrap gap-4">
//               <Link
//                 href="/research"
//                 className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-secondary/90"
//               >
//                 Explore research
//               </Link>
//               <Link
//                 href="/publications"
//                 className="rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
//               >
//                 Browse publications
//               </Link>
//               <Link
//                 href="/open-positions"
//                 className="rounded-full border border-white/30 bg-transparent px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
//               >
//                 Join the lab
//               </Link>
//             </div>
//           </div>
//         </Container>
//       </section>

//       {/* Focus */}
//       <section className="bg-background py-16 sm:py-20">
//         <Container>
//           <SectionHeader
//             eyebrow="Research"
//             title="Focus areas"
//             description="A small set of hard problems where careful modeling and clean data can move the needle."
//           />

//           <div className="mt-12 grid gap-6 md:grid-cols-3">
//             {focusAreas.map((a) => (
//               <Link
//                 key={a.title}
//                 href={a.href}
//                 className="group rounded-2xl border border-black/5 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
//               >
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-semibold text-primary">{a.title}</h3>
//                   <span className="text-sm text-primary/60 transition group-hover:translate-x-0.5">→</span>
//                 </div>
//                 <p className="mt-3 font-serif text-sm leading-relaxed text-text/80">{a.description}</p>
//                 {a.tag ? (
//                   <p className="mt-4 text-xs font-semibold tracking-wide text-primary/70">{a.tag}</p>
//                 ) : null}
//               </Link>
//             ))}
//           </div>
//         </Container>
//       </section>

//       {/* Publications */}
//       <section className="py-16 sm:py-20">
//         <Container>
//           <SectionHeader
//             eyebrow="Outputs"
//             title="Selected publications"
//             description="Representative recent work. Full list is on the Publications page."
//           />

//           <div className="mt-12 grid gap-6 md:grid-cols-2">
//             {featuredPubs.map((p) => (
//               <div key={p.title} className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
//                 <div className="flex items-center justify-between">
//                   <p className="text-xs font-semibold text-primary/70">{p.year}</p>
//                   {p.venue ? <p className="text-xs text-text/60">{p.venue}</p> : null}
//                 </div>
//                 <h3 className="mt-3 text-lg font-semibold text-primary">{p.title}</h3>
//                 <p className="mt-3 font-serif text-sm text-text/80">{p.authors}</p>
//                 <div className="mt-5 flex flex-wrap gap-3">
//                   <Link
//                     href="/publications"
//                     className="text-sm font-semibold text-primary hover:underline"
//                   >
//                     View details
//                   </Link>
//                   {p.links?.[0]?.href ? (
//                     <a
//                       href={p.links[0].href}
//                       className="text-sm font-semibold text-secondary hover:underline"
//                     >
//                       {p.links[0].label}
//                     </a>
//                   ) : null}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Container>
//       </section>

//       {/* Team */}
//       <section className="bg-background py-16 sm:py-20">
//         <Container>
//           <SectionHeader
//             eyebrow="People"
//             title="Team"
//             description="We are a small group with a bias toward rigorous methods, reproducible code, and honest uncertainty."
//           />

//           <div className="mt-12 grid gap-6 md:grid-cols-2">
//             <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
//               <p className="text-xs font-semibold text-primary/70">Principal Investigator</p>
//               <h3 className="mt-2 text-xl font-semibold text-primary">{principalInvestigator.name}</h3>
//               <p className="mt-2 text-sm text-text/70">{principalInvestigator.role}</p>
//               {principalInvestigator.bio ? (
//                 <p className="mt-4 font-serif text-sm leading-relaxed text-text/80">
//                   {principalInvestigator.bio}
//                 </p>
//               ) : null}
//               <div className="mt-5 flex flex-wrap gap-3">
//                 {(principalInvestigator.links ?? []).map((l) => (
//                   <a key={l.label} href={l.href} className="text-sm font-semibold text-secondary hover:underline">
//                     {l.label}
//                   </a>
//                 ))}
//               </div>
//             </div>

//             <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
//               <p className="text-xs font-semibold text-primary/70">Lab members</p>
//               <ul className="mt-4 space-y-4">
//                 {team.slice(0, 3).map((m) => (
//                   <li key={m.name}>
//                     <div className="font-semibold text-primary">{m.name}</div>
//                     <div className="text-sm text-text/70">{m.role}</div>
//                     {m.bio ? <div className="mt-1 font-serif text-sm text-text/80">{m.bio}</div> : null}
//                   </li>
//                 ))}
//               </ul>
//               <div className="mt-6">
//                 <Link href="/team" className="text-sm font-semibold text-primary hover:underline">
//                   Meet the full team →
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </Container>
//       </section>

//       {/* Call to action */}
//       <section className="py-16 sm:py-20">
//         <Container>
//           <div className="rounded-3xl bg-primary px-6 py-12 text-white shadow-soft sm:px-10">
//             <div className="mx-auto max-w-3xl text-center">
//               <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
//                 Interested in collaborating or joining?
//               </h2>
//               <p className="mt-4 font-serif text-base text-white/80 sm:text-lg">
//                 Send a short note about your question, dataset, or idea. If it is a good fit, we will follow up.
//               </p>
//               <div className="mt-8 flex flex-wrap justify-center gap-4">
//                 <Link
//                   href="/contact"
//                   className="rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary/90"
//                 >
//                   Contact
//                 </Link>
//                 <Link
//                   href="/open-positions"
//                   className="rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
//                 >
//                   Open positions
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </Container>
//       </section>
//     </div>
//   );
// }

// app/page.tsx
import Hero from "@/components/hero";
import HomeProof from "@/components/home-proof";
import HomeMission from "@/components/home-mission";
import HomeFocus from "@/components/home-focus";
import HomeNews from "@/components/home-news";
import HomeFeatured from "@/components/home-featured";
import HomeCTA from "@/components/home-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeProof />
      <HomeMission />
      <HomeFocus />
      <HomeNews />
      <HomeFeatured />
      <HomeCTA />
    </>
  );
}
