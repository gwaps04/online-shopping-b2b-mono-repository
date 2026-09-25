"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutUser() {
  const cookieStore = await cookies();
  
  // Destroy the secure session cookie
  cookieStore.delete("store_session");
  
  // Instantly redirect the user back to the login screen
  redirect("/login");
}