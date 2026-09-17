CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  source TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  email_sent INTEGER NOT NULL DEFAULT 0,
  email_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions (created_at);
