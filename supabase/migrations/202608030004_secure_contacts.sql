-- Contact submissions are write-only for public clients and constrained at the
-- database boundary in case an application validation path is bypassed.
alter table public.contacts
  add constraint contacts_name_length check (char_length(btrim(name)) between 2 and 100),
  add constraint contacts_email_length check (char_length(email) between 5 and 254),
  add constraint contacts_email_normalized check (email = lower(btrim(email))),
  add constraint contacts_email_format check (email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  add constraint contacts_message_length check (char_length(btrim(message)) between 10 and 5000);

alter table public.contacts enable row level security;

drop policy if exists "public submits valid contact" on public.contacts;
drop policy if exists "Public can submit contacts" on public.contacts;
create policy "public submits valid contact"
  on public.contacts for insert to anon
  with check (
    char_length(btrim(name)) between 2 and 100
    and char_length(email) between 5 and 254
    and email = lower(btrim(email))
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    and char_length(btrim(message)) between 10 and 5000
  );

-- RLS defaults to deny: deliberately do not create a SELECT policy for anon.
revoke select on public.contacts from anon;
grant insert (name, email, message) on public.contacts to anon;
