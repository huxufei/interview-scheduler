import { useState, useCallback, useEffect } from 'react';
import type { Interview } from '../types';
import * as api from '../api';

export function useInterviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await api.fetchInterviews();
      setInterviews(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addInterview = useCallback(
    async (data: Omit<Interview, 'id' | 'createdAt'>) => {
      await api.createInterview(data);
      await load();
    },
    [load]
  );

  const updateInterview = useCallback(
    async (id: string, data: Omit<Interview, 'id' | 'createdAt'>) => {
      await api.updateInterview(id, data);
      await load();
    },
    [load]
  );

  const deleteInterview = useCallback(
    async (id: string) => {
      await api.deleteInterview(id);
      await load();
    },
    [load]
  );

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(interviews, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `面试日程备份_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [interviews]);

  return { interviews, loading, error, addInterview, updateInterview, deleteInterview, exportData, reload: load };
}
