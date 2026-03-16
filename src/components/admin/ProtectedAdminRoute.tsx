import { Show, RedirectToSignIn, ClerkProvider } from "@clerk/react";
import { lazy } from "react";

const BlogAdminPage = lazy(() => import("@/pages/BlogAdminPage"));

export default function ProtectedAdminRoute() {
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!clerkPublishableKey) {
    return <div>Clerk is not configured</div>;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <Show when="signed-in">
        <BlogAdminPage />
      </Show>
      <Show when="signed-out">
        <RedirectToSignIn />
      </Show>
    </ClerkProvider>
  );
}
