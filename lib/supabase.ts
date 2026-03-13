/**
 * supabase.ts — Supabase client instances
 *
 * - supabase      → anon key  (server-side reads, safe to expose via NEXT_PUBLIC_)
 * - supabaseAdmin → service_role key (server-side writes only — NEVER import in client components)
 */

import { createClient } from "@supabase/supabase-js";

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const svc  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Read-only client (anon RLS) — use in server components & API routes */
export const supabase = createClient(url, anon);

/** Write client (service_role, bypasses RLS) — use ONLY in API routes */
export const supabaseAdmin = createClient(url, svc);
