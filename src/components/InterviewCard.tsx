import { Pencil, Trash2, MapPin, Link2, Clock, AlertTriangle } from 'lucide-react';
import type { Interview } from '../types';
import { STATUS_LABELS, STATUS_COLORS } from '../types';

interface Props {
  interview: Interview;
  hasConflict: boolean;
  onEdit: (iv: Interview) => void;
  onDelete: (id: string) => void;
}

export default function InterviewCard({ interview, hasConflict, onEdit, onDelete }: Props) {
  const status = STATUS_COLORS[interview.status];

  return (
    <div
      className="rounded-xl p-4 transition-shadow hover:shadow-md relative"
      style={{
        backgroundColor: hasConflict ? 'var(--color-rejected-bg)' : 'var(--color-surface)',
        border: hasConflict ? '1px solid #fecaca' : '1px solid var(--color-border)',
      }}
    >
      {hasConflict && (
        <div
          className="absolute top-3 right-10 flex items-center gap-1 text-xs font-medium"
          style={{ color: '#dc2626' }}
        >
          <AlertTriangle size={12} />
          时间冲突
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold truncate">{interview.company}</h3>
            <span
              className="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: status.bg, color: status.text }}
            >
              {STATUS_LABELS[interview.status]}
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {interview.role} · {interview.round}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs flex-wrap" style={{ color: 'var(--color-text-secondary)' }}>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {interview.time}
            </span>
            {interview.format === '线下' ? (
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {interview.linkOrAddress || '未填写'}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Link2 size={12} />
                {interview.linkOrAddress || '未填写'}
              </span>
            )}
          </div>
          {interview.notes && (
            <p
              className="text-xs mt-2 leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {interview.notes}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(interview)}
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
            title="编辑"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(interview.id)}
            className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-red-50 hover:text-red-500"
            style={{ color: 'var(--color-text-secondary)' }}
            title="删除"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
