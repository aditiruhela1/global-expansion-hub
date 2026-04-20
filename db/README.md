# GlobeNest — Supabase setup

This app talks to Supabase via the **publishable (anon) key** (safe in the browser; protected by RLS).

## 1. Run the schema

1. Open your Supabase dashboard → **SQL Editor** → **New query**.
2. Paste the contents of [`db/schema.sql`](./schema.sql) and click **Run**.
3. The script is idempotent — re-running it is safe.

This creates: `profiles`, `businesses`, `expansion_plans`, `checklist_items`,
`payment_providers`, `fulfillment_carriers`, `user_roles` + the `app_role` /
`checklist_category` enums + the `has_role()` security-definer function +
the `on_auth_user_created` trigger that auto-creates a profile and default
`user` role on signup. Every table has Row-Level Security enabled and
owner-scoped policies.

## 2. (Optional) Email confirmation

For instant signups in development, disable email confirmation:
**Supabase → Authentication → Providers → Email → "Confirm email" = OFF**.

## 3. Configure the client (optional)

The Supabase URL and publishable key are baked into `src/lib/supabase.ts` so
the app works out of the box. To override (e.g. for a different env), create
a `.env` in the project root:

```
VITE_SUPABASE_URL=https://YOUR-REF.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_xxx
```

## 4. Make yourself an admin (optional)

After signing up once, run this in the SQL Editor (replace the email):

```sql
insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'you@example.com'
on conflict do nothing;
```

## 5. Run the app

```
npm install
npm run dev
```
