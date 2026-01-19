import { createClient } from "@/lib/supabase/server"
import type { User } from "@supabase/supabase-js"

/**
 * Get the current authenticated user from Supabase session
 * This replaces the NextAuth auth() function
 */
export async function auth(): Promise<{ user: User | null }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { user }
}

/**
 * Get the current user session (includes user and session data)
 */
export async function getSession() {
  const supabase = await createClient()
  return await supabase.auth.getSession()
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient()
  return await supabase.auth.signOut()
}
