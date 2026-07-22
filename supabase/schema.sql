-- Run this once in your Supabase project's SQL Editor (Project > SQL Editor > New query).

-- Profile table holding the extra employee fields Supabase Auth doesn't store.
create table public.employees (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  employee_id text not null unique,
  roles text not null,
  created_at timestamptz not null default now()
);

alter table public.employees enable row level security;

create policy "Employees can view their own record"
  on public.employees for select
  to authenticated
  using (auth.uid() = id);

-- Auto-creates the employees row whenever a new auth user is created.
-- Runs as security definer so it bypasses RLS, and runs in the same
-- transaction as the signup, so a duplicate employee_id rolls the whole
-- signup back instead of leaving an orphaned auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.employees (id, full_name, email, phone, employee_id, roles)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'employee_id',
    new.raw_user_meta_data ->> 'roles'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
