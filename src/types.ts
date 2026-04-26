export interface Interview {
  id: string;
  company: string;
  role: string;
  date: string;
  time: string;
  round: string;
  format: '线上' | '线下';
  linkOrAddress: string;
  notes: string;
  status: 'pending' | 'done' | 'passed' | 'rejected';
  createdAt: string;
}

export type StatusFilter = 'all' | 'pending' | 'done' | 'passed' | 'rejected';

export const STATUS_LABELS: Record<string, string> = {
  pending: '待面试',
  done: '已完成',
  passed: '已通过',
  rejected: '已拒绝',
};

export const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'var(--color-pending-bg)', text: '#92400e', dot: 'var(--color-pending)' },
  done: { bg: 'var(--color-done-bg)', text: '#1e40af', dot: 'var(--color-done)' },
  passed: { bg: 'var(--color-passed-bg)', text: '#065f46', dot: 'var(--color-passed)' },
  rejected: { bg: 'var(--color-rejected-bg)', text: '#991b1b', dot: 'var(--color-rejected)' },
};

export const ROUND_OPTIONS = ['初试', '复试', '终试', 'HR面', '技术面', '群面'];

export interface ConflictInfo {
  interviewId: string;
  conflictsWith: string[];
}
