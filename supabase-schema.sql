-- 在 Supabase SQL Editor 中执行此脚本建表
CREATE TABLE IF NOT EXISTS interviews (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  round TEXT NOT NULL,
  format TEXT NOT NULL,
  linkOrAddress TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  createdAt TEXT NOT NULL
);

-- 开启 RLS 并允许公开访问（共享模式）
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "允许所有人读写"
  ON interviews
  FOR ALL
  USING (true)
  WITH CHECK (true);
