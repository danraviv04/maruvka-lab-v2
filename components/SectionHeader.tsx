import Badge from './Badge';

export default function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <div className="mb-4 flex justify-center">
          <Badge>{eyebrow}</Badge>
        </div>
      ) : null}
      <h2 className="text-balance font-serif text-3xl font-bold tracking-tight text-secondary sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
