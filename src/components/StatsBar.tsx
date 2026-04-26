import dayjs from 'dayjs';
import type { Interview } from '../types';

interface Props {
  interviews: Interview[];
}

export default function StatsBar({ interviews }: Props) {
  const now = dayjs();
  const weekStart = now.startOf('week');
  const weekEnd = now.endOf('week');

  const thisWeek = interviews.filter((iv) => {
    const d = dayjs(iv.date);
    return d.isAfter(weekStart) && d.isBefore(weekEnd);
  });

  const pending = interviews.filter((iv) => iv.status === 'pending').length;
  const passed = interviews.filter((iv) => iv.status === 'passed').length;
  const rejected = interviews.filter((iv) => iv.status === 'rejected').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <StatCard label="本周面试" value={thisWeek.length} color="var(--color-primary)" />
      <StatCard label="待面试" value={pending} color="var(--color-pending)" />
      <StatCard label="已通过" value={passed} color="var(--color-passed)" />
      <StatCard label="已拒绝" value={rejected} color="var(--color-rejected)" />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </div>
    </div>
  );
}
