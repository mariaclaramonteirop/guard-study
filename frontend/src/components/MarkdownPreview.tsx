type Props = {
  content: string;
  className?: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInline(value: string): string {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="rounded bg-stone-100 px-1 py-0.5 font-mono text-[0.95em]">$1</code>')
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-guard underline">$1</a>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>');
}

function renderMarkdown(content: string): string {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: string[] = [];
  let listOpen = false;
  let quoteOpen = false;
  let codeOpen = false;
  let codeLines: string[] = [];

  const closeLists = () => {
    if (listOpen) {
      blocks.push('</ul>');
      listOpen = false;
    }
  };

  const closeQuote = () => {
    if (quoteOpen) {
      blocks.push('</blockquote>');
      quoteOpen = false;
    }
  };

  const closeCode = () => {
    if (codeOpen) {
      blocks.push(`<pre class="overflow-x-auto rounded bg-stone-950 p-3 text-sm text-stone-100"><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
      codeLines = [];
      codeOpen = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith('```')) {
      if (codeOpen) {
        closeCode();
      } else {
        closeLists();
        closeQuote();
        codeOpen = true;
      }
      continue;
    }

    if (codeOpen) {
      codeLines.push(rawLine);
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      closeLists();
      closeQuote();
      const level = heading[1].length;
      blocks.push(`<h${level} class="mt-3 mb-1 font-semibold text-ink">${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^>\s?/.test(line)) {
      closeLists();
      if (!quoteOpen) {
        blocks.push('<blockquote class="border-l-4 border-violet-300 pl-3 text-stone-700">');
        quoteOpen = true;
      }
      blocks.push(`<p class="my-1">${renderInline(line.replace(/^>\s?/, ''))}</p>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      closeQuote();
      if (!listOpen) {
        blocks.push('<ul class="my-2 list-disc space-y-1 pl-5">');
        listOpen = true;
      }
      blocks.push(`<li>${renderInline(line.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    }

    closeLists();
    closeQuote();

    if (line.trim() === '') {
      blocks.push('');
      continue;
    }

    blocks.push(`<p class="my-2">${renderInline(line)}</p>`);
  }

  closeCode();
  closeLists();
  closeQuote();

  return blocks.filter(Boolean).join('');
}

export function MarkdownPreview({ content, className = '' }: Props) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />;
}
