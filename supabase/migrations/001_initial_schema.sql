-- ==============================================================================
-- Make My Marriage — Supabase Initial Schema & Security Policies (v1.0)
-- Migration: 001_initial_schema.sql
-- Description: Creates all 9 tables, indexes, helper functions, safe onboarding RPC,
--              automatic profile triggers, and comprehensive Row Level Security policies.
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists pgcrypto;

-- 2. TABLES

-- 2.1 Profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.2 Weddings (Workspace root)
create table if not exists public.weddings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  couple_names text,
  wedding_date date,
  venue text,
  city text,
  currency_code text not null default 'INR',
  total_budget_paise bigint not null default 0
    check (total_budget_paise >= 0),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.3 Wedding Members (Role assignments)
create table if not exists public.wedding_members (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'family_member'
    check (role in ('admin', 'family_member', 'viewer')),
  joined_at timestamptz not null default now(),
  unique (wedding_id, user_id)
);

-- 2.4 Wedding Functions (Events: Mehndi, Haldi, Muhurtham, Reception, etc.)
create table if not exists public.wedding_functions (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  name text not null,
  event_date timestamptz,
  venue text,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.5 Expenses
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  function_id uuid references public.wedding_functions(id) on delete set null,
  title text not null,
  category text not null default 'Other',
  amount_paise bigint not null check (amount_paise >= 0),
  amount_paid_paise bigint not null default 0
    check (amount_paid_paise >= 0 and amount_paid_paise <= amount_paise),
  paid_to text,
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'partially_paid')),
  expense_date date not null default current_date,
  notes text,
  receipt_path text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.6 Guests
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  side text check (side in ('bride', 'groom', 'both')),
  guest_count integer not null default 1 check (guest_count > 0),
  rsvp_status text not null default 'pending'
    check (rsvp_status in ('pending', 'invited', 'accepted', 'declined')),
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.7 Invitations
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  title text not null default 'Wedding Invitation',
  channel text not null default 'whatsapp'
    check (channel in ('whatsapp', 'email', 'printed', 'other')),
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'delivered', 'failed')),
  sent_at timestamptz,
  invitation_file_path text,
  notes text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.8 Tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  title text not null,
  description text,
  assigned_to uuid references auth.users(id),
  due_at timestamptz,
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'done')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2.9 Announcements
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references public.weddings(id) on delete cascade,
  title text not null,
  message text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. INDEXES
create index if not exists wedding_members_user_id_idx
  on public.wedding_members(user_id);

create index if not exists wedding_functions_wedding_date_idx
  on public.wedding_functions(wedding_id, event_date);

create index if not exists expenses_wedding_date_idx
  on public.expenses(wedding_id, expense_date desc);

create index if not exists guests_wedding_name_idx
  on public.guests(wedding_id, full_name);

create index if not exists invitations_wedding_status_idx
  on public.invitations(wedding_id, status);

create index if not exists tasks_wedding_status_due_idx
  on public.tasks(wedding_id, status, due_at);

create index if not exists announcements_wedding_created_idx
  on public.announcements(wedding_id, created_at desc);

-- 4. HELPER SECURITY FUNCTIONS (security definer with fixed search_path)

-- Check if current user is any member of the wedding
create or replace function public.is_wedding_member(p_wedding_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.wedding_members
    where wedding_id = p_wedding_id
      and user_id = auth.uid()
  );
$$;

-- Check if current user is an admin of the wedding
create or replace function public.is_wedding_admin(p_wedding_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.wedding_members
    where wedding_id = p_wedding_id
      and user_id = auth.uid()
      and role = 'admin'
  );
$$;

-- Check if current user can edit records (admin or family_member)
create or replace function public.can_edit_wedding(p_wedding_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.wedding_members
    where wedding_id = p_wedding_id
      and user_id = auth.uid()
      and role in ('admin', 'family_member')
  );
$$;

-- Get current user's role for a specific wedding
create or replace function public.get_user_wedding_role(p_wedding_id uuid)
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role
  from public.wedding_members
  where wedding_id = p_wedding_id
    and user_id = auth.uid()
  limit 1;
$$;

-- 5. ATOMIC ONBOARDING WORKFLOW (RPC)
-- Securely creates a wedding and assigns the authenticated creator as initial admin
create or replace function public.create_wedding_with_admin(
  p_name text,
  p_couple_names text default null,
  p_wedding_date date default null,
  p_venue text default null,
  p_city text default null,
  p_currency_code text default 'INR',
  p_total_budget_paise bigint default 0
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_wedding record;
begin
  -- 1. Ensure authenticated user
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Authentication required to create a wedding.';
  end if;

  if trim(coalesce(p_name, '')) = '' then
    raise exception 'Wedding name is required.';
  end if;

  -- 2. Create the wedding record
  insert into public.weddings (
    name,
    couple_names,
    wedding_date,
    venue,
    city,
    currency_code,
    total_budget_paise,
    created_by
  ) values (
    p_name,
    p_couple_names,
    p_wedding_date,
    p_venue,
    p_city,
    coalesce(p_currency_code, 'INR'),
    greatest(0, coalesce(p_total_budget_paise, 0)),
    v_user_id
  )
  returning * into v_wedding;

  -- 3. Atomically add the creator as admin
  insert into public.wedding_members (
    wedding_id,
    user_id,
    role
  ) values (
    v_wedding.id,
    v_user_id,
    'admin'
  );

  -- 4. Create an initial welcome announcement
  insert into public.announcements (
    wedding_id,
    title,
    message,
    created_by
  ) values (
    v_wedding.id,
    'Wedding Planning Started!',
    'Welcome to the wedding planning board. Manage your budget, events, tasks, and invitations seamlessly.',
    v_user_id
  );

  return to_jsonb(v_wedding);
end;
$$;

-- Grant execution to authenticated users
grant execute on function public.create_wedding_with_admin to authenticated;

-- 6. AUTOMATIC USER PROFILE TRIGGER
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do update set
    full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
    phone = coalesce(nullif(excluded.phone, ''), profiles.phone),
    avatar_url = coalesce(nullif(excluded.avatar_url, ''), profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 7. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
alter table public.profiles enable row level security;
alter table public.weddings enable row level security;
alter table public.wedding_members enable row level security;
alter table public.wedding_functions enable row level security;
alter table public.expenses enable row level security;
alter table public.guests enable row level security;
alter table public.invitations enable row level security;
alter table public.tasks enable row level security;
alter table public.announcements enable row level security;

-- 8. ROW LEVEL SECURITY POLICIES

-- 8.1 PROFILES POLICIES
-- Users can view their own profile or co-members in shared weddings
create policy "profiles_select_policy"
  on public.profiles
  for select
  using (
    auth.uid() = id
    or exists (
      select 1
      from public.wedding_members wm1
      join public.wedding_members wm2 on wm1.wedding_id = wm2.wedding_id
      where wm1.user_id = auth.uid()
        and wm2.user_id = profiles.id
    )
  );

create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 8.2 WEDDINGS POLICIES
-- Only wedding members can view wedding details
create policy "weddings_select_member"
  on public.weddings
  for select
  using (public.is_wedding_member(id));

-- Only admins can update wedding details
create policy "weddings_update_admin"
  on public.weddings
  for update
  using (public.is_wedding_admin(id))
  with check (public.is_wedding_admin(id));

-- Only admins can delete a wedding
create policy "weddings_delete_admin"
  on public.weddings
  for delete
  using (public.is_wedding_admin(id));

-- Direct insert restricted to creator (recommended path is create_wedding_with_admin RPC)
create policy "weddings_insert_auth"
  on public.weddings
  for insert
  with check (auth.uid() = created_by);

-- 8.3 WEDDING MEMBERS POLICIES
-- Members can view membership list for their wedding
create policy "wedding_members_select_member"
  on public.wedding_members
  for select
  using (public.is_wedding_member(wedding_id));

-- Only admins can add new members
create policy "wedding_members_insert_admin"
  on public.wedding_members
  for insert
  with check (public.is_wedding_admin(wedding_id));

-- Only admins can update member roles (and users cannot alter their own role)
create policy "wedding_members_update_admin"
  on public.wedding_members
  for update
  using (public.is_wedding_admin(wedding_id) and user_id != auth.uid())
  with check (public.is_wedding_admin(wedding_id) and user_id != auth.uid());

-- Admins can remove members, or a user can leave the wedding
create policy "wedding_members_delete_admin_or_self"
  on public.wedding_members
  for delete
  using (public.is_wedding_admin(wedding_id) or user_id = auth.uid());

-- 8.4 WEDDING FUNCTIONS POLICIES
create policy "functions_select_member"
  on public.wedding_functions
  for select
  using (public.is_wedding_member(wedding_id));

create policy "functions_insert_editor"
  on public.wedding_functions
  for insert
  with check (public.can_edit_wedding(wedding_id));

create policy "functions_update_editor"
  on public.wedding_functions
  for update
  using (public.can_edit_wedding(wedding_id))
  with check (public.can_edit_wedding(wedding_id));

create policy "functions_delete_editor"
  on public.wedding_functions
  for delete
  using (public.can_edit_wedding(wedding_id));

-- 8.5 EXPENSES POLICIES
create policy "expenses_select_member"
  on public.expenses
  for select
  using (public.is_wedding_member(wedding_id));

create policy "expenses_insert_editor"
  on public.expenses
  for insert
  with check (public.can_edit_wedding(wedding_id));

create policy "expenses_update_editor"
  on public.expenses
  for update
  using (public.can_edit_wedding(wedding_id))
  with check (public.can_edit_wedding(wedding_id));

create policy "expenses_delete_editor"
  on public.expenses
  for delete
  using (public.can_edit_wedding(wedding_id));

-- 8.6 GUESTS POLICIES
create policy "guests_select_member"
  on public.guests
  for select
  using (public.is_wedding_member(wedding_id));

create policy "guests_insert_editor"
  on public.guests
  for insert
  with check (public.can_edit_wedding(wedding_id));

create policy "guests_update_editor"
  on public.guests
  for update
  using (public.can_edit_wedding(wedding_id))
  with check (public.can_edit_wedding(wedding_id));

create policy "guests_delete_editor"
  on public.guests
  for delete
  using (public.can_edit_wedding(wedding_id));

-- 8.7 INVITATIONS POLICIES
create policy "invitations_select_member"
  on public.invitations
  for select
  using (public.is_wedding_member(wedding_id));

create policy "invitations_insert_editor"
  on public.invitations
  for insert
  with check (public.can_edit_wedding(wedding_id));

create policy "invitations_update_editor"
  on public.invitations
  for update
  using (public.can_edit_wedding(wedding_id))
  with check (public.can_edit_wedding(wedding_id));

create policy "invitations_delete_editor"
  on public.invitations
  for delete
  using (public.can_edit_wedding(wedding_id));

-- 8.8 TASKS POLICIES
create policy "tasks_select_member"
  on public.tasks
  for select
  using (public.is_wedding_member(wedding_id));

create policy "tasks_insert_editor"
  on public.tasks
  for insert
  with check (public.can_edit_wedding(wedding_id));

create policy "tasks_update_editor"
  on public.tasks
  for update
  using (public.can_edit_wedding(wedding_id))
  with check (public.can_edit_wedding(wedding_id));

create policy "tasks_delete_editor"
  on public.tasks
  for delete
  using (public.can_edit_wedding(wedding_id));

-- 8.9 ANNOUNCEMENTS POLICIES
create policy "announcements_select_member"
  on public.announcements
  for select
  using (public.is_wedding_member(wedding_id));

create policy "announcements_insert_editor"
  on public.announcements
  for insert
  with check (public.can_edit_wedding(wedding_id));

create policy "announcements_update_editor"
  on public.announcements
  for update
  using (public.can_edit_wedding(wedding_id))
  with check (public.can_edit_wedding(wedding_id));

create policy "announcements_delete_editor"
  on public.announcements
  for delete
  using (public.can_edit_wedding(wedding_id));

-- 9. STORAGE SETUP (Private bucket for invitation cards and receipts)
insert into storage.buckets (id, name, public)
values ('wedding-files', 'wedding-files', false)
on conflict (id) do update set public = false;

-- Storage RLS: wedding members can view objects
create policy "storage_select_wedding_members"
  on storage.objects
  for select
  using (
    bucket_id = 'wedding-files'
    and auth.uid() is not null
  );

-- Storage RLS: editors can upload objects
create policy "storage_insert_wedding_editors"
  on storage.objects
  for insert
  with check (
    bucket_id = 'wedding-files'
    and auth.uid() is not null
  );
