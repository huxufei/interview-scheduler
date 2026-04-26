import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import type { Interview } from '../types';
import { ROUND_OPTIONS } from '../types';

interface Props {
  open: boolean;
  interview: Interview | null;
  onSave: (data: Omit<Interview, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const EMPTY_FORM: Omit<Interview, 'id' | 'createdAt'> = {
  company: '',
  role: '',
  date: dayjs().format('YYYY-MM-DD'),
  time: '10:00',
  round: '初试',
  format: '线上',
  linkOrAddress: '',
  notes: '',
  status: 'pending',
};

export default function InterviewModal({ open, interview, onSave, onClose }: Props) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (interview) {
      setForm({
        company: interview.company,
        role: interview.role,
        date: interview.date,
        time: interview.time,
        round: interview.round,
        format: interview.format,
        linkOrAddress: interview.linkOrAddress,
        notes: interview.notes,
        status: interview.status,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [interview, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    onSave(form);
    onClose();
  };

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[80vh] overflow-y-auto"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">
            {interview ? '编辑面试' : '添加面试'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg cursor-pointer"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">公司名称 *</label>
            <input
              value={form.company}
              onChange={(e) => set('company', e.target.value)}
              placeholder="例如：字节跳动"
              required
              className="w-full px-3 py-2 rounded-lg text-sm outline-hidden focus:ring-2"
              style={{
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                
}}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">职位 *</label>
            <input
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
              placeholder="例如：前端开发工程师"
              required
              className="w-full px-3 py-2 rounded-lg text-sm outline-hidden focus:ring-2"
              style={{
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
              }}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">日期</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-hidden focus:ring-2"
              style={{
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
              }}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">时间</label>
            <input
              type="time"
              value={form.time}
              onChange={(e) => set('time', e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-hidden focus:ring-2"
              style={{
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
              }}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">面试轮次</label>
            <select
              value={form.round}
              onChange={(e) => set('round', e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-hidden focus:ring-2 cursor-pointer"
              style={{
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
              }}
            >
              {ROUND_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1">面试形式</label>
            <div className="flex gap-2">
              {(['线上', '线下'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => set('format', f)}
                  className="flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  style={{
                    backgroundColor:
                      form.format === f ? 'var(--color-primary)' : 'var(--color-bg)',
                    color: form.format === f ? '#fff' : 'var(--color-text-secondary)',
                    border:
                      form.format === f ? 'none' : '1px solid var(--color-border)',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              {form.format === '线上' ? '会议链接' : '面试地址'}
            </label>
            <input
              value={form.linkOrAddress}
              onChange={(e) => set('linkOrAddress', e.target.value)}
              placeholder={form.format === '线上' ? '例如：https://meeting.tencent.com/xxx' : '例如：北京市海淀区中关村软件园'}
              className="w-full px-3 py-2 rounded-lg text-sm outline-hidden focus:ring-2"
              style={{
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
              }}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">状态</label>
            <select
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm outline-hidden focus:ring-2 cursor-pointer"
              style={{
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
              }}
            >
              <option value="pending">待面试</option>
              <option value="done">已完成</option>
              <option value="passed">已通过</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">备注</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="面试官、面试重点、准备事项等..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm outline-hidden focus:ring-2 resize-none"
              style={{
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
              }}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--color-bg)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
            }}
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
}
