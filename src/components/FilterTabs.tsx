import type { StatusFilter } from '../types';

interface Props {
  value: StatusFilter;
  onChange: (v: StatusFilter) => void;
}

const TABS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待面试' },
  { key: 'done', label: '已完成' },
  { key: 'passed', label: '已通过' },
  { key: 'rejected', label: '已拒绝' },
];

export default function FilterTabs({ value, onChange }: Props) {
  return (
    <div className="flex gap-1.5 flex-wrap mb-4">
      {TABS.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          style={{
            backgroundColor: value === t.key ? 'var(--color-primary)' : 'var(--color-surface)',
            color: value === t.key ? '#fff' : 'var(--color-text-secondary)',
            border: value === t.key ? 'none' : '1px solid var(--color-border)',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
