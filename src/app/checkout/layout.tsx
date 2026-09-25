import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function CheckoutLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  
  // Woz Guard: Route-Level Identity Verification
  // If the secure store_session cookie is missing, kick the user to the register page.
  if (!cookieStore.has("store_session")) {
    redirect("/register");
  }

  return <>{children}</>;
}