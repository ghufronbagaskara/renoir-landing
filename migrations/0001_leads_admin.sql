-- Leads from the contact form and the "Find your first step" questionnaire, plus admin accounts.
-- Applied by Alchemy on deploy (Cloudflare.D1.Database migrations, alchemy.run.ts).

CREATE TABLE leads (
  id TEXT PRIMARY KEY,                 -- client submission id: a retried submit is stored once
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  source TEXT NOT NULL,                -- contact | quiz | service:<id>
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  channel TEXT NOT NULL,               -- email | whatsapp
  company TEXT,
  build_type TEXT NOT NULL,
  message TEXT,
  timeline TEXT,
  budget TEXT,
  quiz TEXT,                           -- JSON: answers + recommendation
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'won', 'lost')),
  notes TEXT,
  follow_up_on TEXT,                   -- YYYY-MM-DD
  user_agent TEXT
);
CREATE INDEX leads_created ON leads (created_at DESC);
CREATE INDEX leads_status ON leads (status, created_at DESC);

CREATE TABLE admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,         -- pbkdf2-sha256$<iterations>$<salt b64>$<hash b64>
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

CREATE TABLE admin_sessions (
  token_hash TEXT PRIMARY KEY,         -- SHA-256 of the cookie token; the token itself is never stored
  user_id INTEGER NOT NULL REFERENCES admin_users (id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE INDEX admin_sessions_user ON admin_sessions (user_id);

CREATE TABLE lead_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id TEXT NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES admin_users (id) ON DELETE SET NULL,
  at TEXT NOT NULL,
  kind TEXT NOT NULL,                  -- status | notes | follow_up
  detail TEXT
);
CREATE INDEX lead_events_lead ON lead_events (lead_id, at);
