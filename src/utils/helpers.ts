import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import type { Interview, StatusFilter } from '../types';

dayjs.locale('zh-cn');

export function formatDate(date: string): string {
  const d = dayjs(date);
  const today = dayjs().startOf('day');
  const tomorrow = today.add(1, 'day');

  if (d.isSame(today, 'day')) return '今天';
  if (d.isSame(tomorrow, 'day')) return '明天';
  if (d.isSame(today, 'week')) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return days[d.day()];
  }
  return d.format('M月D日');
}

export function formatDateFull(date: string): string {
  const d = dayjs(date);
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${d.format('YYYY年M月D日')} ${weekDays[d.day()]}`;
}

export function groupByDate(interviews: Interview[]): Map<string, Interview[]> {
  const groups = new Map<string, Interview[]>();
  const sorted = [...interviews].sort((a, b) => {
    const dateCmp = dayjs(a.date).unix() - dayjs(b.date).unix();
    if (dateCmp !== 0) return dateCmp;
    return a.time.localeCompare(b.time);
  });
  for (const iv of sorted) {
    const key = iv.date;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(iv);
  }
  return groups;
}

export function filterInterviews(interviews: Interview[], filter: StatusFilter): Interview[] {
  if (filter === 'all') return interviews;
  return interviews.filter((iv) => iv.status === filter);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// 返回有冲突的日期集合
export function findConflicts(interviews: Interview[]): Set<string> {
  const conflictDates = new Set<string>();
  const byDate = new Map<string, Interview[]>();

  for (const iv of interviews) {
    if (!byDate.has(iv.date)) byDate.set(iv.date, []);
    byDate.get(iv.date)!.push(iv);
  }

  for (const [date, items] of byDate) {
    if (items.length < 2) continue;
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        if (timesOverlap(items[i].time, items[j].time)) {
          conflictDates.add(date);
        }
      }
    }
  }

  return conflictDates;
}

function timesOverlap(t1: string, t2: string): boolean {
  const toMins = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const a = toMins(t1);
  const b = toMins(t2);
  return Math.abs(a - b) < 60;
}

export function getConflictsForDate(interviews: Interview[], date: string): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const items = interviews.filter((iv) => iv.date === date);
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (timesOverlap(items[i].time, items[j].time)) {
        if (!map.has(items[i].id)) map.set(items[i].id, []);
        if (!map.has(items[j].id)) map.set(items[j].id, []);
        map.get(items[i].id)!.push(items[j].id);
        map.get(items[j].id)!.push(items[i].id);
      }
    }
  }
  return map;
}
