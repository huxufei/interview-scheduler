import type { Interview } from '../types';
import { groupByDate, formatDateFull } from '../utils/helpers';
import InterviewCard from './InterviewCard';

interface Props {
  interviews: Interview[];
  conflictMap: Map<string, string[]>;
  onEdit: (iv: Interview) => void;
  onDelete: (id: string) => void;
}

export default function InterviewList({ interviews, conflictMap, onEdit, onDelete }: Props) {
  if (interviews.length === 0) {
    return (
      <div
        className="text-center py-16 rounded-xl"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          还没有面试安排
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          点击右上角「添加面试」来记录你的第一场面试
        </p>
      </div>
    );
  }

  const groups = groupByDate(interviews);

  return (
    <div className="space-y-6">
      {Array.from(groups.entries()).map(([date, items]) => (
        <div key={date}>
          <div
            className="text-sm font-medium mb-2 px-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {formatDateFull(date)}
          </div>
          <div className="space-y-2">
            {items.map((iv) => (
              <InterviewCard
                key={iv.id}
                interview={iv}
                hasConflict={conflictMap.has(iv.id)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
