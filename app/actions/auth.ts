"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(30, "Display name must be at most 30 characters"),
})

export async function login(
  _prevState: { error: string | null },
  formData: FormData
) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { error: "Invalid email or password" }
  }

  const redirectTo = formData.get("redirect") as string
  redirect(redirectTo || "/dashboard")
}

export async function register(
  _prevState: { error: string | null },
  formData: FormData
) {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    displayName: formData.get("displayName"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.displayName },
    },
  })

  if (error) {
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists" }
    }
    return { error: error.message }
  }

  redirect("/dashboard")
}
