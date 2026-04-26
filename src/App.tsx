import { useState, useMemo } from 'react';
import { Plus, Download, AlertTriangle, Loader2 } from 'lucide-react';
import { useInterviews } from './hooks/useInterviews';
import type { Interview, StatusFilter } from './types';
import { filterInterviews, getConflictsForDate } from './utils/helpers';
import StatsBar from './components/StatsBar';
import CalendarPanel from './components/CalendarPanel';
import FilterTabs from './components/FilterTabs';
import InterviewList from './components/InterviewList';
import InterviewModal from './components/InterviewModal';
import ConfirmDialog from './components/ConfirmDialog';

export default function App() {
  const { interviews, loading, error, addInterview, updateInterview, deleteInterview, exportData, reload } =
    useInterviews();
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Interview | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = filterInterviews(interviews, filter);
    if (selectedDate) {
      result = result.filter((iv) => iv.date === selectedDate);
    }
    return result;
  }, [interviews, filter, selectedDate]);

  const conflictMap = useMemo(() => {
    const date = selectedDate ?? '';
    return date ? getConflictsForDate(interviews, date) : new Map<string, string[]>();
  }, [interviews, selectedDate]);

  const handleAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleEdit = (iv: Interview) => {
    setEditTarget(iv);
    setModalOpen(true);
  };

  const handleSave = async (data: Omit<Interview, 'id' | 'createdAt'>) => {
    if (editTarget) {
      await updateInterview(editTarget.id, data);
    } else {
      await addInterview(data);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId) {
      await deleteInterview(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <header
        className="sticky top-0 z-10 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(248, 250, 252, 0.9)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">面试日程</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={exportData}
              className="p-2 rounded-lg transition-colors cursor-pointer"
              style={{ color: 'var(--color-text-secondary)' }}
              title="导出备份"
            >
              <Download size={18} />
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus size={16} />
              添加面试
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {error && (
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-3 mb-4 text-sm"
            style={{ backgroundColor: 'var(--color-rejected-bg)', color: '#991b1b', border: '1px solid #fecaca' }}
          >
            <AlertTriangle size={16} />
            <span>{error}</span>
            <button
              onClick={reload}
              className="ml-auto underline cursor-pointer"
            >
              重试
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
          </div>
        ) : (
          <>
            <StatsBar interviews={interviews} />
            <CalendarPanel
              interviews={interviews}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <FilterTabs value={filter} onChange={setFilter} />
            {selectedDate && (
              <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <span>已筛选日期：{selectedDate}</span>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="underline cursor-pointer"
                >
                  清除
                </button>
              </div>
            )}
            <InterviewList
              interviews={filtered}
              conflictMap={conflictMap}
              onEdit={handleEdit}
              onDelete={setDeleteId}
            />
          </>
        )}
      </main>

      <InterviewModal
        open={modalOpen}
        interview={editTarget}
        onSave={handleSave}
        onClose={() => setModalOpen(false)}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="确认删除"
        message="确定要删除这条面试记录吗？此操作无法撤销。"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <footer className="text-center py-8">
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          数据保存在云端 · 你和朋友共享同一份数据
        </p>
      </footer>
    </div>
  );
}
