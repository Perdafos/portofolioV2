import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  ClerkProvider,
  RedirectToSignIn,
  Show,
} from "@clerk/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import LoadingScreen from "./components/Layouts/LoadingScreen.tsx";
import { ThemeProvider } from "./components/theme-provider";

const App = lazy(() => import("./pages/App.tsx"));
const BlogPage = lazy(() => import("./pages/BlogPage.tsx"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage.tsx"));
const BlogAdminPage = lazy(() => import("./pages/BlogAdminPage.tsx"));

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = Boolean(clerkPublishableKey);

const adminPathSegment =
  import.meta.env.VITE_BLOG_ADMIN_PATH?.replace(/^\/+|\/+$/g, "") ?? "";
const adminRoutePath = adminPathSegment ? `/${adminPathSegment}` : null;

function ProtectedAdminRoute() {
  return (
    <>
      <Show when="signed-in">
        <BlogAdminPage />
      </Show>
      <Show when="signed-out">
        <RedirectToSignIn />
      </Show>
    </>
  );
}

const appRoutes = (
  <ThemeProvider defaultTheme="dark" storageKey="portofolio-theme">
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          {adminRoutePath && isClerkConfigured ? (
            <Route path={adminRoutePath} element={<ProtectedAdminRoute />} />
          ) : null}
        </Routes>
      </Suspense>
    </BrowserRouter>
  </ThemeProvider>
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isClerkConfigured ? (
      <ClerkProvider publishableKey={clerkPublishableKey!}>{appRoutes}</ClerkProvider>
    ) : (
      appRoutes
    )}
  </StrictMode>
);
