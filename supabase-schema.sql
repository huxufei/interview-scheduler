-- 先删旧表再重建（修复列名大小写问题）
DROP TABLE IF EXISTS interviews;

CREATE TABLE interviews (
  "id" TEXT PRIMARY KEY,
  "company" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "time" TEXT NOT NULL,
  "round" TEXT NOT NULL,
  "format" TEXT NOT NULL,
  "linkOrAddress" TEXT DEFAULT '',
  "notes" TEXT DEFAULT '',
  "status" TEXT DEFAULT 'pending',
  "createdAt" TEXT NOT NULL
);

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "允许所有人读写" ON interviews;
CREATE POLICY "允许所有人读写"
  ON interviews
  FOR ALL
  USING (true)
  WITH CHECK (true);
