import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Interview } from '../types';
import { findConflicts } from '../utils/helpers';

interface Props {
  interviews: Interview[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function CalendarPanel({ interviews, selectedDate, onSelectDate }: Props) {
  const [viewMonth, setViewMonth] = useState(dayjs());

  const conflictDates = useMemo(() => findConflicts(interviews), [interviews]);

  const interviewCountByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const iv of interviews) {
      map.set(iv.date, (map.get(iv.date) || 0) + 1);
    }
    return map;
  }, [interviews]);

  const calendarDays = useMemo(() => {
    const startOfMonth = viewMonth.startOf('month');
    const endOfMonth = viewMonth.endOf('month');
    const startDay = startOfMonth.day(); // 0=Sun
    const daysInMonth = endOfMonth.date();

    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [viewMonth]);

  const today = dayjs().format('YYYY-MM-DD');
  const monthStr = viewMonth.format('YYYY年M月');

  const prevMonth = () => setViewMonth((m) => m.subtract(1, 'month'));
  const nextMonth = () => setViewMonth((m) => m.add(1, 'month'));

  const getDateStr = (day: number) => viewMonth.date(day).format('YYYY-MM-DD');

  const handleDateClick = (day: number) => {
    const dateStr = getDateStr(day);
    onSelectDate(selectedDate === dateStr ? null : dateStr);
  };

  return (
    <div
      className="rounded-xl p-4 mb-6"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="p-1 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </button>
        <span className="text-sm font-semibold">{monthStr}</span>
        <button
          onClick={nextMonth}
          className="p-1 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center">
        {WEEK_DAYS.map((d) => (
          <div
            key={d}
            className="text-xs font-medium py-1"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {d}
          </div>
        ))}

        {calendarDays.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const dateStr = getDateStr(day);
          const count = interviewCountByDate.get(dateStr) || 0;
          const hasConflict = conflictDates.has(dateStr);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className="aspect-square flex flex-col items-center justify-center rounded-lg text-sm cursor-pointer transition-colors relative"
              style={{
                backgroundColor: isSelected
                  ? 'var(--color-primary)'
                  : hasConflict
                    ? '#fef2f2'
                    : 'transparent',
                color: isSelected ? '#fff' : isToday ? 'var(--color-primary)' : 'inherit',
                fontWeight: isToday ? 700 : 400,
              }}
            >
              {day}
              {count > 0 && (
                <span className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                    <span
                      key={i}
                      className="inline-block w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: isSelected
                          ? '#fff'
                          : hasConflict
                            ? 'var(--color-rejected)'
                            : 'var(--color-primary)',
                      }}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--color-primary)' }} />
          有面试
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: 'var(--color-rejected)' }} />
          时间冲突
        </span>
      </div>
    </div>
  );
}
