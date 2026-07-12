type Props = {
  title: string;
  subtitle: string;
};

export function SectionTitle({ title, subtitle }: Props) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-stone-600">{subtitle}</p>
    </div>
  );
}
