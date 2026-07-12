type Props = {
  label: string;
  value: number;
  tone?: 'violet' | 'amber' | 'stone';
};

const tones = {
  violet: 'border-violet-300 bg-violet-50 text-violet-950',
  amber: 'border-amber/30 bg-amber-50 text-amber',
  stone: 'border-stone-200 bg-white text-ink',
};

export function StatCard({ label, value, tone = 'stone' }: Props) {
  return (
    <div className={`rounded border p-4 ${tones[tone]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <strong className="mt-2 block text-3xl">{value}</strong>
    </div>
  );
}
