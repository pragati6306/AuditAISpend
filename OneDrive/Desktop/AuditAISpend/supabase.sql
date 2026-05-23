create table audits (
  id text primary key,
  email text,
  company text,
  role text,
  tools jsonb,
  team_size int,
  use_case text,
  total_savings int,
  recommendations jsonb,
  summary text,
  created_at timestamptz default now()
);

-- Public read for shareable URLs
alter table audits enable row level security;
create policy "Public read" on audits for select using (true);
create policy "Service write" on audits for insert with check (true);
