import { redirect } from "next/navigation";

// Root page redirects to French (default locale for Cameroon)
export default function RootPage() {
  redirect("/fr");
}
