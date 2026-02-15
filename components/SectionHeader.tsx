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
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 font-serif text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
