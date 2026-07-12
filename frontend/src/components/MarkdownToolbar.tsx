type MarkdownCommand = 'h1' | 'h2' | 'bold' | 'italic' | 'list' | 'quote' | 'code';

type Props = {
  onApply: (command: MarkdownCommand) => void;
};

const items: Array<{ command: MarkdownCommand; label: string; title: string }> = [
  { command: 'h1', label: 'H1', title: 'Título principal' },
  { command: 'h2', label: 'H2', title: 'Subtítulo' },
  { command: 'bold', label: 'B', title: 'Negrito' },
  { command: 'italic', label: 'I', title: 'Itálico' },
  { command: 'list', label: '•', title: 'Lista' },
  { command: 'quote', label: '❝', title: 'Citação' },
  { command: 'code', label: '</>', title: 'Código' },
];

export function MarkdownToolbar({ onApply }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item.command}
          type="button"
          title={item.title}
          aria-label={item.title}
          onClick={() => onApply(item.command)}
          className="rounded border border-stone-300 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
